// src/stores/useScrollStore.ts
import { create } from "zustand";

interface ScrollStore {
  menuScrollPosition: number;
  setMenuScrollPosition: (position: number) => void;
  clearScrollPosition: () => void;
}

export const useScrollStore = create<ScrollStore>((set) => ({
  menuScrollPosition: 0,
  setMenuScrollPosition: (position) => set({ menuScrollPosition: position }),
  clearScrollPosition: () => set({ menuScrollPosition: 0 }),
}));
