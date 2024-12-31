import MenuCard from "./MenuCard";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db, DISCOUNT_COLLECTION, storage } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { MENU_COLLECTION } from "@/lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  calories: string;
  price: number;
  discountedPrice: number;
  discountPercentage: number;
  likes: string;
  imageURL: string;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
  imageURL: string;
}

interface Discount {
  itemId: string;
  discountPercentage: number;
}

const fetchMenuData = async (): Promise<MenuCategory[]> => {
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

  const discounts: Discount[] = discountSnapshot.docs.map((doc) => ({
    itemId: doc.id,
    ...doc.data(),
  })) as Discount[];

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
      item.discountPercentage = discount.discountPercentage;
      item.discountedPrice =
        item.price - (item.price * discount.discountPercentage) / 100;
    }

    // Fetch the download URL for the image
    const imageRef = ref(storage, item.imageURL);
    item.imageURL = await getDownloadURL(imageRef);
  }

  const menuCategories: { [key: string]: MenuCategory } = {};

  menuItems.forEach((item) => {
    if (!menuCategories[item.category]) {
      menuCategories[item.category] = {
        title: item.category,
        items: [],
        imageURL: item.imageURL, // Use the first item's image as the category image
      };
    }
    menuCategories[item.category].items.push(item);
  });

  return Object.values(menuCategories);
};

export default function MenuView() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);

  useEffect(() => {
    fetchMenuData().then((data) => setMenuData(data));
  }, []);

  const handleCategorySelect = (category: MenuCategory) => {
    navigate(`/category/${category.title}`);
  };

  return (
    <div className="relative mt-4 h-screen overflow-y-auto">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {menuData.map((category) => (
            <MenuCard
              key={category.title}
              {...category}
              itemCount={category.items.length}
              onClick={() => handleCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
