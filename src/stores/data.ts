import { create } from "zustand";
import { fetchData, MenuCategory, MenuItem } from "@/lib/firebase";

interface DataStore {
  menuCategories: MenuCategory[];
  discountItems: MenuItem[];
  menuItems: MenuItem[];
  fetching: boolean;
  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set) => ({
  menuCategories: [],
  discountItems: [],
  menuItems: [],
  fetching: false,
  fetchData: async () => {
    try {
      set({ fetching: true });
      const { menuItems, categories, discountedItems } = await fetchData();
      set({
        menuCategories: categories,
        discountItems: discountedItems,
        menuItems,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      set({ fetching: false });
    }
  },
}));
