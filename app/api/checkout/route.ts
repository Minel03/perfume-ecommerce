import { NextResponse } from 'next/server';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const { items, orderId } = await request.json();

    const subtotal = items.reduce((acc: number, item: OrderItem) => acc + (item.price * item.quantity), 0);
    const shippingAmount = subtotal >= 3000 ? 0 : 150;
    const taxAmount = subtotal * 0.12;

    const lineItems = items.map((item: OrderItem) => ({
      amount: Math.round(item.price * 100),
      currency: 'PHP',
      name: item.name,
      quantity: item.quantity
    }));

    if (shippingAmount > 0) {
      lineItems.push({
        amount: Math.round(shippingAmount * 100),
        currency: 'PHP',
        name: 'Priority Shipping & Insurance',
        quantity: 1
      });
    }

    if (taxAmount > 0) {
      lineItems.push({
        amount: Math.round(taxAmount * 100),
        currency: 'PHP',
        name: 'Value Added Tax (12%)',
        quantity: 1
      });
    }

    // 1. Prepare PayMongo Checkout Session
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')}`
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
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/order?success=true&orderId=${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout`
          }
        }
      })
    };

    const response = await fetch('https://api.paymongo.com/v1/checkout_sessions', options);
    const session = await response.json();

    if (session.errors) {
      console.error('PayMongo Error:', session.errors);
      return NextResponse.json({ error: session.errors[0].detail }, { status: 400 });
    }

    return NextResponse.json({ checkoutUrl: session.data.attributes.checkout_url });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
