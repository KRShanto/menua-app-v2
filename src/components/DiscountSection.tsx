import { FaFire, FaTags } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import BottomDrawer from "./BottomDrawer";
import { useState } from "react";
import { ItemTemplate } from "@/types/menu";
import { useAddToCartStore } from "@/stores/useAddToCart";

const discountData = [
  {
    name: "This Week's Special",
    discountRate: 25,
    items: [
      {
        name: "Chicken of Cream Soup",
        price: 100,
        demoPrice: 120,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A delicious soup made with chicken and cream.",
        calories: "500",
        likes: "15",
      },
      {
        name: "Beef of Cream Soup",
        price: 150,
        demoPrice: 200,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "A delicious soup made with beef and cream.",
        calories: "600",
        likes: "8",
      },
      {
        name: "Chicken nuggets",
        price: 120,
        demoPrice: 150,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Delicious chicken nuggets.",
        calories: "700",
        likes: "10",
      },
      {
        name: "Beef nuggets",
        price: 130,
        demoPrice: 160,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Delicious beef nuggets.",
        calories: "800",
        likes: "12",
      },
      {
        name: "French fries",
        price: 100,
        demoPrice: 120,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        description: "Delicious french fries.",
        calories: "900",
        likes: "10",
      },
    ],
  },
];

export default function DiscountSection() {
  const [selectedItem, setSelectedItem] = useState<ItemTemplate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { itemQuantity, increment, decrement,showToSlide } = useAddToCartStore();

  const handleItemClick = (item: ItemTemplate) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      {discountData.map((discount, index) => (
        <div key={index} className="p-4">
          {/* Discount Title */}
          <h2 className="flex items-center gap-2 text-xl text-foregroundColor">
            <FaFire />
            {discount.name}
          </h2>

          {/* Item List */}
          <ul className="mt-2 flex gap-3 overflow-x-scroll">
            {discount.items.map((item) => (
              <li
                key={item.name}
                className="relative min-w-[16rem]"
                onClick={() => handleItemClick(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-1/2 w-full rounded-tl-xl rounded-tr-xl"
                />
                <div className="h-1/2 rounded-bl-xl rounded-br-xl bg-[#1F1F20] p-4">
                  <h3 className="text-lg text-foregroundColor">{item.name}</h3>
                  <p className="-mb-16 mt-5 text-foregroundColor">
                    SR {item.price}
                    <span className="ml-3 text-sm line-through opacity-60">
                      SR {item.price * (1 - discount.discountRate / 100)}
                    </span>
                  </p>
                </div>

                {/* Discount Tag */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-foregroundColor px-2 py-1 text-black">
                  <FaTags />
                  {discount.discountRate}% Off
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
                    <button onClick={decrement}>-</button>
                    <span>{itemQuantity}</span>
                    <button onClick={increment}>+</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <BottomDrawer
        item={selectedItem}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
