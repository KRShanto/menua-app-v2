import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
// import { getDownloadURL, getStorage, ref } from "firebase/storage";
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

export const fetchMenuData = async (): Promise<MenuCategory[]> => {
  const menuCollection = collection(db, MENU_COLLECTION);
  const discountCollection = collection(db, DISCOUNT_COLLECTION);

  const [menuSnapshot, discountSnapshot] = await Promise.all([
    getDocs(menuCollection),
    getDocs(discountCollection),
  ]);

  const menuItems: MenuItem[] = menuSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MenuItem[];

  const discounts = discountSnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));

  const discountMap = discounts.reduce(
    (acc, discount) => {
      acc[discount.itemId] = discount;
      return acc;
    },
    {} as { [key: string]: Discount },
  );

  for (const item of menuItems) {
    const discount = discountMap[item.id];

    if (discount) {
      item.discountPercentage = discount.rate;
      item.discountedPrice = item.price - (item.price * discount.rate) / 100;
    }
  }

  const menuCategories: { [key: string]: MenuCategory } = {};

  menuItems.forEach((item) => {
    if (!menuCategories[item.category]) {
      menuCategories[item.category] = {
        title: item.category,
        title_arab: item.category_arab,
        items: [],
        imageURL: item.imageURL, // Use the first item's image as the category image
      };
    }
    menuCategories[item.category].items.push(item);
  });

  // Get the indexe collect // Get the indexe collection data. this collection has only one document.
  const indexCollection = collection(db, INDEX_COLLECTION);
  const indexSnapshot = await getDocs(indexCollection);
  const indexData = indexSnapshot.docs[0].data();

  // Convert the index data into a lookup object
  // the format of the index is: [{"category_name": index_number}]
  const categoryIndexMap: { [key: string]: number } = {};
  Object.entries(indexData).forEach(([catName, indexNumber]) => {
    categoryIndexMap[catName] = indexNumber as number;
  });

  // Turn the menuCategories object into an array
  const categories = Object.values(menuCategories);

  // Sort the categories based on the index lookup
  categories.sort((a, b) => {
    const indexA = categoryIndexMap[a.title] ?? Infinity;
    const indexB = categoryIndexMap[b.title] ?? Infinity;
    return indexA - indexB;
  });

  return categories;
};
