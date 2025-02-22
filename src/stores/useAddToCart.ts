import { CartItem } from "@/types/cart";
import { MenuItem } from "@/lib/firebase";
import { create } from "zustand";

interface StoreState {
  cart: CartItem[];
  showToSlide?: boolean;
  selectedItem: MenuItem | null;
  addToCart: (item: CartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  setShowToSlide: () => void;
  setSelectedItem: (item: MenuItem | null) => void;
  clearCart: () => void;
}

const saveCartToLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const loadCartFromLocalStorage = (): CartItem[] => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const useAddToCartStore = create<StoreState>((set) => ({
  cart: loadCartFromLocalStorage(),
  showToSlide: false,
  selectedItem: null,
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      let updatedCart;
      if (existingItem) {
        updatedCart = state.cart.map((i) =>
          i.id === item.id ? { ...i, quantity: item.quantity } : i,
        );
      } else {
        updatedCart = [...state.cart, { ...item, quantity: item.quantity }];
      }
      saveCartToLocalStorage(updatedCart);
      return { cart: updatedCart };
    }),
  increaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      );
      saveCartToLocalStorage(updatedCart);
      return { cart: updatedCart };
    }),
  decreaseQuantity: (id) =>
    set((state) => {
      const updatedCart = state.cart
        .map((item) => {
          if (item.id === id) {
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return null; // Mark for removal
            }
          }
          return item;
        })
        .filter((item) => item !== null); // Remove items marked for removal
      saveCartToLocalStorage(updatedCart);
      return { cart: updatedCart };
    }),
  setShowToSlide: () => set({ showToSlide: true }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  clearCart: () =>
    set(() => {
      localStorage.removeItem("cart");
      return { cart: [] };
    }),
}));
