import { create } from "zustand";
import { fetchData, MenuCategory, MenuItem } from "@/lib/firebase";

interface DataStore {
  menuCategories: MenuCategory[];
  discountItems: MenuItem[];
  fetching: boolean;
  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  menuCategories: [],
  discountItems: [],
  fetching: false,
  fetchData: async () => {
    try {
      set({ fetching: true });
      const { categories, discountedItems } = await fetchData();
      set({
        menuCategories: categories,
        discountItems: discountedItems,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      set({ fetching: false });
    }
  },
}));
