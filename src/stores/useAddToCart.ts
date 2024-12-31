import { CartItem } from "@/types/cart";
import { MenuItem } from "@/types/menu";
import { create } from "zustand";

interface StoreState {
  cart: CartItem[];
  itemQuantity: number;
  showToSlide?: boolean;
  selectedItem: MenuItem | null;
  addToCart: (item: CartItem) => void;
  add: () => void;
  addItem: (item: number) => void;
  increment: () => void;
  decrement: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  setShowToSlide: () => void;
  reset: () => void;
  setSelectedItem: (item: MenuItem | null) => void;
}

export const useAddToCartStore = create<StoreState>((set) => ({
  cart: [],
  itemQuantity: 0,
  showToSlide: false,
  selectedItem: null,
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      } else {
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
      }
    }),
  increaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),
  decreaseQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    })),
  add: () => set({ itemQuantity: 1 }),
  addItem: (item) => set({ itemQuantity: item }),
  increment: () => set((state) => ({ itemQuantity: state.itemQuantity + 1 })),
  decrement: () => set((state) => ({ itemQuantity: state.itemQuantity - 1 })),
  setShowToSlide: () => set({ showToSlide: true }),
  reset: () => set({ itemQuantity: 0 }),
  setSelectedItem: (item) => set({ selectedItem: item }),
}));
