import { create } from "zustand";

interface StoreState {
  itemQuantity: number;
  showToSlide?: boolean;
  add: () => void;
  addItem: (item: number) => void;
  increment: () => void;
  decrement: () => void;
  setShowToSlide: () => void;
  reset: () => void;
}

export const useAddToCartStore = create<StoreState>((set) => ({
  itemQuantity: 0,
  showToSlide: false,
  add: () => set({ itemQuantity: 1 }),
  addItem: (item) => set({ itemQuantity: item }),
  increment: () => set((state) => ({ itemQuantity: state.itemQuantity + 1 })),
  decrement: () => set((state) => ({ itemQuantity: state.itemQuantity - 1 })),
  setShowToSlide: () => set({ showToSlide: true }),
  reset: () => set({ itemQuantity: 0 }),
}));
