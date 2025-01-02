import { CartItem } from "@/types/cart";
import { MenuItem } from "@/types/menu";
import { create } from "zustand";

interface StoreState {
  cart: CartItem[];

  showToSlide?: boolean;
  selectedItem: MenuItem | null;
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  setShowToSlide: () => void;
  // reset: () => void;
  setSelectedItem: (item: MenuItem | null) => void;
}

export const useAddToCartStore = create<StoreState>((set) => ({
  cart: [],

  showToSlide: false,
  selectedItem: null,
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: item.quantity } // set new quantity
              : i,
          ),
        };
      } else {
        return {
          // Use whatever quantity item already has
          cart: [...state.cart, { ...item, quantity: item.quantity }],
        };
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

  setShowToSlide: () => set({ showToSlide: true }),

  setSelectedItem: (item) => set({ selectedItem: item }),
}));
