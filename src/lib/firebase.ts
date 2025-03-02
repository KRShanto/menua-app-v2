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

export const MENU_COLLECTION = "production__menu";
export const DISCOUNT_COLLECTION = "production__discount";
export const MANAGER_COLLECTION = "production__manager";
export const MANAGER_DEFAULT_IMAGE = "/user-image.png";
export const FEEDBACK_COLLECTION = "production__feedback";
export const INDEX_CATEGORY_COLLECTION = "production__index";
export const INDEX_DISCOUNT_COLLECTION = "production__discount_index";
export const CATEGORY_IMAGE_COLLECTION = "production__category_images";

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
  discountId: string;
  likes: string;
  imageURL: string;
  index?: number;
}

export interface MenuCategory {
  title: string;
  title_arab: string;
  items: MenuItem[];
  imageURL: string;
}

export interface Discount {
  id: string;
  itemId: string;
  rate: number;
}

export interface FetchDataResult {
  categories: MenuCategory[];
  discountedItems: MenuItem[];
  menuItems: MenuItem[];
}

export const fetchCategoryImages = async (): Promise<
  Record<string, string>
> => {
  try {
    const categoryImageSnapshot = await getDocs(
      collection(db, CATEGORY_IMAGE_COLLECTION),
    );
    const categoryImagesDoc = categoryImageSnapshot.docs[0];
    const categoryImages: Record<string, string> = categoryImagesDoc.data();
    return categoryImages;
  } catch (error) {
    console.error("Error fetching category images:", error);
    throw error;
  }
};

export const fetchData = async (): Promise<FetchDataResult> => {
  try {
    // Fetch menu and discount documents in parallel
    const [menuSnapshot, discountSnapshot] = await Promise.all([
      getDocs(collection(db, MENU_COLLECTION)),
      getDocs(collection(db, DISCOUNT_COLLECTION)),
    ]);

    // Convert menu docs into an array of MenuItem
    const menuItems: MenuItem[] = menuSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];

    // Convert discount docs into an array of Discount
    const discounts: Discount[] = discountSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Discount[];

    // Build a map (key: itemId) => { rate }
    const discountMap: Record<string, Discount> = {};
    discounts.forEach((d) => {
      discountMap[d.itemId] = d;
    });

    // Merge discount info into the menu items
    menuItems.forEach((item) => {
      const discountObj = discountMap[item.id];
      item.discountId = discountObj?.id;
      if (discountObj) {
        item.discountPercentage = discountObj.rate;
        item.discountedPrice =
          item.price - (item.price * discountObj.rate) / 100;
      } else {
        item.discountPercentage = 0;
        item.discountedPrice = item.price;
      }
    });

    // Fetch category images
    const categoryImages = await fetchCategoryImages();

    // Create a dictionary of categories
    const menuCategories: Record<string, MenuCategory> = {};
    menuItems.forEach((item) => {
      if (!menuCategories[item.category]) {
        menuCategories[item.category] = {
          title: item.category,
          title_arab: item.category_arab,
          items: [],
          imageURL: categoryImages[item.category] || item.imageURL,
        };
      }
      menuCategories[item.category].items.push(item);
    });

    // Fetch the category and discount index docs
    const [indexSnapshot, discountIndexSnapshot] = await Promise.all([
      getDocs(collection(db, INDEX_CATEGORY_COLLECTION)),
      getDocs(collection(db, INDEX_DISCOUNT_COLLECTION)),
    ]);

    const indexData = indexSnapshot.docs[0]?.data() || {};
    const discountIndexData = discountIndexSnapshot.docs[0]?.data() || {};

    // Convert the index data into lookup objects
    const categoryIndexMap: Record<string, number> = {};
    Object.entries(indexData).forEach(([catName, idx]) => {
      categoryIndexMap[catName] = idx as number;
    });

    const discountIndexMap: Record<string, number> = {};
    Object.entries(discountIndexData).forEach(([itemId, idx]) => {
      discountIndexMap[itemId] = idx as number;
    });

    // Turn the menuCategories dictionary into an array
    const categories = Object.values(menuCategories);

    // Sort the categories array by the index map
    categories.sort((a, b) => {
      const idxA = categoryIndexMap[a.title] ?? Infinity;
      const idxB = categoryIndexMap[b.title] ?? Infinity;
      return idxA - idxB;
    });

    // Sort the items within each category by the optional index field
    categories.forEach((category) => {
      category.items.sort((a, b) => {
        const idxA = a.index ?? Infinity;
        const idxB = b.index ?? Infinity;
        return idxA - idxB;
      });
    });

    // Build a separate array of discounted items only
    const discountedItems = menuItems.filter(
      (item) => item.discountPercentage > 0,
    );

    // Sort the discounted items by the discount index map
    discountedItems.sort((a, b) => {
      const idxA = discountIndexMap[a.discountId] ?? Infinity;
      const idxB = discountIndexMap[b.discountId] ?? Infinity;
      return idxA - idxB;
    });

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
