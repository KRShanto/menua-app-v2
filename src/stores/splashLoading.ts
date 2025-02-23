import { create } from "zustand";

interface SplashLoadingState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}
// NOTE: The point of using this store, instead of a useState, is to only show the splash screen once every reload.
export const useSplashLoadingStore = create<SplashLoadingState>((set) => ({
  isLoading: true,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
