import { FaFire, FaTags } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import BottomDrawer from "./BottomDrawer";
import { useState, useEffect } from "react";
import { useAddToCartStore } from "@/stores/useAddToCart";
import {
  db,
  DISCOUNT_COLLECTION,
  MENU_COLLECTION,
  storage,
  MenuItem,
} from "@/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

interface EnhancedMenuItem extends MenuItem {
  image: string;
  discountRate: number;
}

export default function DiscountSection() {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cart, increaseQuantity, decreaseQuantity, showToSlide } =
    useAddToCartStore();
  const [discountData, setDiscountData] = useState<EnhancedMenuItem[]>([]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      const discountSnapshot = await getDocs(
        collection(db, DISCOUNT_COLLECTION),
      );
      const discounts = discountSnapshot.docs.map((doc) => doc.data());

      console.log("Discounts: ", discounts);

      // Fetch all related menu items with discounts
      const items = await Promise.all(
        discounts.map(async (discount) => {
          const itemSnapshot = await getDoc(
            doc(db, MENU_COLLECTION, discount.itemId),
          );
          const menuItems = itemSnapshot?.data() as MenuItem;

          console.log("Menu items: ", menuItems);

          // download image
          const storageRef = ref(storage, menuItems.imageURL);
          const imageUrl = await getDownloadURL(storageRef);
          menuItems.imageURL = imageUrl;

          // add discount rate
          const enhancedItem: EnhancedMenuItem = {
            ...menuItems,
            image: imageUrl,
            discountRate: discount.rate,
          };

          return enhancedItem;
        }),
      );

      // Flatten the items array
      setDiscountData(items);
    };

    fetchDiscounts();
  }, []);

  console.log("Discount data: ", discountData);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };
  const getItemQuantity = (itemId: string) => {
    const itemInCart = cart.find((cartItem) => cartItem.id === itemId);
    return itemInCart ? itemInCart.quantity : 0;
  };
  return (
    <div>
      <div className="p-4">
        {/* Discount Title */}
        <h2 className="flex items-center gap-2 text-xl text-foregroundColor">
          <FaFire />
          This Week's Special
        </h2>

        {/* Item List */}
        <ul className="mt-2 flex gap-3 overflow-x-scroll">
          {discountData.map((item: any) => {
            const itemQuantity = getItemQuantity(item.id);
            return (
              <li
                key={item.name}
                className="relative min-w-[16rem]"
                onClick={() => handleItemClick(item)}
              >
                <img
                  src={item.imageURL}
                  alt={item.name}
                  className="h-1/2 w-full rounded-tl-xl rounded-tr-xl"
                />
                <div className="h-1/2 rounded-bl-xl rounded-br-xl bg-[#1F1F20] p-4">
                  <h3 className="text-lg text-foregroundColor">{item.name}</h3>
                  <p className="-mb-16 mt-5 text-foregroundColor">
                    SR {item.price * (1 - item.discountRate / 100)}
                    <span className="ml-3 text-sm line-through opacity-60">
                      SR {item.price}
                    </span>
                  </p>
                </div>

                {/* Discount Tag */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-foregroundColor px-2 py-1 text-black">
                  <FaTags />
                  {item.discountRate}% Off
                </div>

                {/* Add button */}
                {itemQuantity === 0 || !showToSlide ? (
                  <button
                    className="absolute right-3 top-[40%] flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black"
                    // onClick={add}
                  >
                    Add <GoPlus />
                  </button>
                ) : (
                  <div className="absolute right-3 top-[40%] flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseQuantity(item.id);
                      }}
                    >
                      -
                    </button>
                    <span>{itemQuantity}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseQuantity(item.id);
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <BottomDrawer
        item={selectedItem}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
