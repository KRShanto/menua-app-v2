import { useLang } from "@/lib/useLang";
import { MenuItem } from "@/lib/firebase";
import BottomDrawer from "./BottomDrawer";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { useAddToCartStore } from "@/stores/useAddToCart";
import { useState } from "react";

export default function ComboCard({ item }: { item: MenuItem }) {
  const lang = useLang();
  const { cart, selectedItem, setSelectedItem } = useAddToCartStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const itemCart = cart.find((catItem) => catItem.id === item.id);

  return (
    <div>
      <div className="flex flex-col rounded-sm border-b border-gray-800 shadow-md">
        <div>
          <img
            src={item.imageURL || "/placeholder.svg"}
            alt={item.name}
            width="400"
            height="400"
            className="h-[200px] rounded-xl object-cover"
          />
        </div>
        <div className="flex flex-col rounded-b-xl bg-[#2a2a2c] py-4 text-primaryText">
          <div className="flex flex-col gap-2 px-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-medium">
                {lang(item.name, item.name_arab)}
              </h3>
              <div className="-ml-1 inline-flex rounded-full bg-[#2E211D] px-1.5 py-0.5 text-sm text-[#F37554]">
                {item.calories} {lang("Calories", "سعرات حرارية")}
              </div>
              <div className="mt-2 flex gap-2 text-base text-primaryText">
                <p>SR</p> {item.discountedPrice || item.price}{" "}
                {item.discountedPrice && (
                  <span className="line-through">SR {item.price}</span>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-6">
              <div>
                {!itemCart ? (
                  <button
                    className="flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black"
                    onClick={() => handleItemClick(item)}
                  >
                    {lang("Add", "إضافة")} <GoPlus size={16} />
                  </button>
                ) : (
                  <button
                    className="inline-flex items-center rounded-full bg-[#D87E27] px-4 py-1 text-black"
                    onClick={() => handleItemClick(item)}
                  >
                    <LuMinus size={14} />
                    <span className="mx-2">{itemCart.quantity}</span>
                    <GoPlus size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        item={selectedItem}
      />
    </div>
  );
}
