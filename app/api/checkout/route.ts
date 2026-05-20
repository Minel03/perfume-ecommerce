import { NextResponse } from 'next/server';
import { ratelimit } from '@/lib/rate-limit';
import { supabase } from '@/lib/supabase';
import * as z from 'zod';

const itemSchema = z.object({
  _id: z.string().uuid('Invalid product ID format'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
});

const checkoutSchema = z.object({
  items: z.array(itemSchema).nonempty('Cart must contain at least one item'),
  orderId: z.string().uuid('Invalid order ID format'),
});

export async function POST(request: Request) {
  try {
    // 1. Identify client IP address
    const ipHeader = request.headers.get('x-forwarded-for') ?? 
                     request.headers.get('x-real-ip') ?? 
                     '127.0.0.1';
    const ip = ipHeader.split(',')[0].trim();

    // 2. Perform rate limit check (sliding window, max 5 requests per 60 seconds)
    const { success, limit, reset, remaining } = await ratelimit.limit(
      `ratelimit_checkout_${ip}`
    );

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          },
        }
      );
    }

    // 3. Validate request payload using Zod
    const body = await request.json();
    const parsedBody = checkoutSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0].message },
        { status: 400 }
      );
    }

    const { items, orderId } = parsedBody.data;

    // 4. Fetch canonical product prices and names from Supabase database
    const productIds = items.map((item) => item._id);
    const { data: dbProducts, error: dbError } = await supabase
      .from('products')
      .select('id, name, price')
      .in('id', productIds);

    if (dbError || !dbProducts || dbProducts.length === 0) {
      console.error('Database query error or no products found:', dbError);
      return NextResponse.json(
        { error: 'Failed to retrieve products from database.' },
        { status: 400 }
      );
    }

    const productPriceMap = new Map<string, { price: number; name: string }>();
    dbProducts.forEach((product) => {
      productPriceMap.set(product.id, {
        price: product.price,
        name: product.name,
      });
    });

    // 5. Calculate totals and map line items on the server using database prices
    let subtotal = 0;
    const lineItems = [];

    for (const item of items) {
      const dbProduct = productPriceMap.get(item._id);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product with ID ${item._id} not found.` },
          { status: 400 }
        );
      }

      const itemPrice = dbProduct.price;
      const itemQuantity = item.quantity;
      subtotal += itemPrice * itemQuantity;

      lineItems.push({
        amount: Math.round(itemPrice * 100),
        currency: 'PHP',
        name: dbProduct.name,
        quantity: itemQuantity,
      });
    }

    const shippingAmount = subtotal >= 3000 ? 0 : 150;
    const taxAmount = subtotal * 0.12;

    if (shippingAmount > 0) {
      lineItems.push({
        amount: Math.round(shippingAmount * 100),
        currency: 'PHP',
        name: 'Priority Shipping & Insurance',
        quantity: 1,
      });
    }

    if (taxAmount > 0) {
      lineItems.push({
        amount: Math.round(taxAmount * 100),
        currency: 'PHP',
        name: 'Value Added Tax (12%)',
        quantity: 1,
      });
    }

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/$/, '');

    // 1. Prepare PayMongo Checkout Session
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            description: 'Sillage Lab Boutique Purchase',
            line_items: lineItems,
            payment_method_types: ['card', 'gcash', 'paymaya', 'grab_pay'],
            success_url: `${baseUrl}/order?success=true&orderId=${orderId}`,
            cancel_url: `${baseUrl}/checkout`,
          },
        },
      }),
    };

    const response = await fetch(
      'https://api.paymongo.com/v1/checkout_sessions',
      options,
    );
    const session = await response.json();

    if (session.errors) {
      console.error('PayMongo Error:', session.errors);
      return NextResponse.json(
        { error: session.errors[0].detail },
        { status: 400 },
      );
    }

    return NextResponse.json({
      checkoutUrl: session.data.attributes.checkout_url,
    });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
