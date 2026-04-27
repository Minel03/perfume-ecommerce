import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StaticImageData } from 'next/image';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: (string | StaticImageData)[];
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((i) => i._id === product._id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i._id !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((i) =>
            i._id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        }),
      setItems: (items) => set({ items }),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: 'sillage-cart' }
  )
);
