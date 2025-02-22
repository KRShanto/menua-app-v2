import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth();

export const STORAGE_BASE = import.meta.env.PROD ? "production" : "development";

// export const MENU_COLLECTION = import.meta.env.PROD
//   ? "production__menu"
//   : "development__menu";
export const MENU_COLLECTION = "production__menu";
export const MENU_IMAGES = `${STORAGE_BASE}/menu-images`;

// export const DISCOUNT_COLLECTION = import.meta.env.PROD
//   ? "production__discount"
//   : "development__discount";
export const DISCOUNT_COLLECTION = "production__discount";

// export const MANAGER_COLLECTION = import.meta.env.PROD
//   ? "production__manager"
//   : "development__manager";
export const MANAGER_COLLECTION = "production__manager";
export const MANAGER_DEFAULT_IMAGE = "/user-image.png";

// export const FEEDBACK_COLLECTION = import.meta.env.PROD
//   ? "production__feedback"
//   : "development__feedback";
export const FEEDBACK_COLLECTION = "production__feedback";

// export const INDEX_COLLECTION = import.meta.env.PROD
//   ? "production__index"
//   : "development__index";
export const INDEX_COLLECTION = "production__index";

export interface MenuItem {
  id: string;
  name: string;
  name_arab: string;
  category: string;
  category_arab: string;
  calories: string;
  price: number;
  description: string;
  description_arab: string;
  discountedPrice: number;
  discountPercentage: number;
  likes: string;
  imageURL: string;
}

export interface MenuCategory {
  title: string;
  title_arab: string;
  items: MenuItem[];
  imageURL: string;
}

export interface Discount {
  itemId: string;
  discountPercentage: number;
}

export interface Discount {
  itemId: string;
  rate: number; // You called it "discount.rate" in your old code
}

/** Structure for the combined fetch function’s return value */
export interface FetchDataResult {
  categories: MenuCategory[]; // Full categories with items (including discount info)
  discountedItems: MenuItem[]; // Just the discounted items
  menuItems: MenuItem[]; // All menu items (including discount info)
}

/**
 * Fetches all menu items, merges in discount data, sorts categories by your index document,
 * and returns both the sorted categories and the discounted items in one shot.
 */
export const fetchData = async (): Promise<FetchDataResult> => {
  try {
    console.log("Fetching data...");

    // 1) Fetch menu documents and discount documents in parallel
    const [menuSnapshot, discountSnapshot] = await Promise.all([
      getDocs(collection(db, MENU_COLLECTION)),
      getDocs(collection(db, DISCOUNT_COLLECTION)),
    ]);

    // 2) Convert menu docs into an array of MenuItem
    const menuItems: MenuItem[] = menuSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];

    // 3) Convert discount docs into an array of Discount
    const discounts: Discount[] = discountSnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as Discount[];

    // 4) Build a map (key: itemId) => { rate }
    const discountMap: Record<string, Discount> = {};
    for (const d of discounts) {
      discountMap[d.itemId] = d;
    }

    // 5) Merge discount info into the menu items
    for (const item of menuItems) {
      const discountObj = discountMap[item.id];
      if (discountObj) {
        item.discountPercentage = discountObj.rate;
        item.discountedPrice =
          item.price - (item.price * discountObj.rate) / 100;
      } else {
        // Make sure these fields are set even if no discount
        item.discountPercentage = 0;
        item.discountedPrice = item.price;
      }
    }

    // 6) Create a dictionary of categories => { title, title_arab, items[], imageURL }
    const menuCategories: Record<string, MenuCategory> = {};
    for (const item of menuItems) {
      if (!menuCategories[item.category]) {
        menuCategories[item.category] = {
          title: item.category,
          title_arab: item.category_arab,
          items: [],
          // Just using the first item’s image as the category image
          imageURL: item.imageURL,
        };
      }
      menuCategories[item.category].items.push(item);
    }

    // 7) Fetch the category index doc to sort categories
    //    (assuming you have only one doc in the INDEX_COLLECTION)
    const indexSnapshot = await getDocs(collection(db, INDEX_COLLECTION));
    const indexData = indexSnapshot.docs[0]?.data() || {};

    // Convert the index data into a lookup object
    // e.g. { "Burgers": 1, "Pizzas": 2, "Desserts": 3, ... }
    const categoryIndexMap: Record<string, number> = {};
    for (const [catName, idx] of Object.entries(indexData)) {
      categoryIndexMap[catName] = idx as number;
    }

    // 8) Turn the menuCategories dictionary into an array
    const categories = Object.values(menuCategories);

    // 9) Sort the array by your index map, pushing unknown categories to the end
    categories.sort((a, b) => {
      const idxA = categoryIndexMap[a.title] ?? Infinity;
      const idxB = categoryIndexMap[b.title] ?? Infinity;
      return idxA - idxB;
    });

    // 10) Build a separate array of discounted items only
    const discountedItems = menuItems.filter(
      (item) => item.discountPercentage > 0,
    );

    console.log("Data fetched successfully!");

    return {
      categories,
      discountedItems,
      menuItems,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
