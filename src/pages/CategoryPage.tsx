"use client";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdDiscount } from "react-icons/md";
import BottomDrawer from "../components/BottomDrawer";
import { MenuItem, MenuCategory } from "@/lib/firebase";
import { useAddToCartStore } from "@/stores/useAddToCart";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { useLang } from "@/lib/useLang";
import { useDataStore } from "@/stores/data";
import { CartItem } from "@/types/cart";

export default function CategoryPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [category, setCategory] = useState<MenuCategory | null>(null);
  const { categoryId } = useParams<{ categoryId: string }>();
  const { cart, selectedItem, setSelectedItem } = useAddToCartStore();
  const lang = useLang();
  const { menuCategories } = useDataStore();

  useEffect(() => {
    const selectedCategory = menuCategories.find(
      (category) => category.title.toLowerCase() === categoryId?.toLowerCase(),
    );
    setCategory(selectedCategory || null);
  }, [categoryId, menuCategories]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-2xl text-white">
          {lang(category?.title, category?.title_arab)}
        </div>
        <img
          src={category?.imageURL}
          alt={category?.title}
          className="h-64 w-full rounded-md object-cover"
        />
      </div>
      <div className="mx-auto w-full max-w-md space-y-2 p-4">
        {category?.items.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            cart={cart}
            lang={lang}
            handleItemClick={handleItemClick}
          />
        ))}
      </div>
      <BottomDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        item={selectedItem}
      />
    </div>
  );
}

interface MenuItemComponentProps {
  item: MenuItem;
  cart: CartItem[];
  lang: (en: string, ar: string) => string;
  handleItemClick: (item: MenuItem) => void;
}

function MenuItemComponent({
  item,
  cart,
  lang,
  handleItemClick,
}: MenuItemComponentProps) {
  const [imgSrc, setImgSrc] = useState(item.imageURL || "/albaharat.svg");
  const itemCart = cart.find((catItem) => catItem.id === item.id);

  return (
    <div
      className="group relative flex items-center gap-3 overflow-hidden rounded-lg bg-[#2B2A2C] p-2"
      onClick={() => handleItemClick(item)}
    >
      <div className="relative h-16 w-20 flex-shrink-0">
        <img
          src={imgSrc}
          alt={item.name}
          width={80}
          height={80}
          className="h-16 rounded-lg object-cover"
          onError={() => setImgSrc("/albaharat.svg")}
        />
        {item.discountPercentage > 0 && (
          <div className="absolute left-0 top-0 rounded-full bg-foregroundColor px-1.5 py-0.5 text-xs text-white">
            <div className="z-10 inline-flex items-center gap-1 text-black">
              <MdDiscount /> {item.discountPercentage}% {lang("OFF", "خصم")}
            </div>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-white">
          {lang(item.name, item.name_arab)}
        </h3>
        <div className="inline-flex rounded-full bg-[#2E211D] px-1.5 py-0.5 text-sm text-[#F37554]">
          {item.calories} {lang("Calories", "سعرات حرارية")}
        </div>
        <div className="mt-2 text-sm text-primaryText">
          SR {item.discountedPrice || item.price}{" "}
          {item.discountedPrice && item.discountedPrice !== item.price && (
            <span className="line-through">SR {item.price}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div>
          {!itemCart ? (
            <button
              className="flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black"
              // onClick={() => handleItemClick(item)}
            >
              {lang("Add", "إضافة")} <GoPlus size={16} />
            </button>
          ) : (
            <button
              className="flex items-center rounded-full bg-[#D87E27] px-4 py-1 text-black"
              // onClick={() => handleItemClick(item)}
            >
              <LuMinus size={14} />
              <span className="mx-2">{itemCart.quantity}</span>
              <GoPlus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
