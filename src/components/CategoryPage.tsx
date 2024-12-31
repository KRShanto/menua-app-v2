"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdDiscount } from "react-icons/md";
import BottomDrawer from "./BottomDrawer";
import { fetchMenuData, MenuItem } from "@/lib/firebase"; // Import the fetchMenuData function
import { MenuCategory } from "@/lib/firebase";

export default function CategoryPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [category, setCategory] = useState<MenuCategory | null>(null);
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      const menuData = await fetchMenuData();
      const categoryData = menuData.find(
        (category) => category.title == categoryId,
      );
      console.log("One menu data: ", menuData);

      setCategory(categoryData || null);
    };

    fetchData();
  }, [categoryId]);

  if (!category) {
    return <div className="container p-4">Category not found.</div>;
  }

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <div className="relative">
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-2xl text-white">
          {category.title}
        </div>
        <img
          src={category.imageURL}
          alt={category.title}
          className="h-64 w-full rounded-md object-cover"
        />
      </div>
      <div className="mx-auto w-full max-w-md space-y-2 p-4">
        {category.items.map((item) => (
          <div
            key={item.id}
            className="group relative flex items-center gap-3 overflow-hidden rounded-lg bg-[#2B2A2C] p-2"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative h-16 w-20 flex-shrink-0">
              <img
                src={item.imageURL}
                alt={item.name}
                width={80}
                height={80}
                className="h-16 rounded-lg object-cover"
              />
              {item.discountPercentage && (
                <div className="absolute left-0 top-0 rounded-full bg-foregroundColor px-1.5 py-0.5 text-xs text-white">
                  <div className="z-10 inline-flex items-center gap-1 text-black">
                    <MdDiscount /> {item.discountPercentage}% OFF
                  </div>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-white">{item.name}</h3>
              <div className="inline-flex rounded-full bg-[#2E211D] px-1.5 py-0.5 text-sm text-[#F37554]">
                {item.calories} Calories
              </div>
              <div className="mt-2 text-sm text-primaryText">
                SR {item.discountedPrice || item.price}{" "}
                {item.discountedPrice && (
                  <span className="line-through">SR {item.price}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <Button
                variant="ghost"
                className="h-6 rounded-full bg-[#D87E27] px-3 text-black hover:bg-orange-400 hover:text-black"
              >
                Add +
              </Button>
            </div>
          </div>
        ))}
      </div>
      <BottomDrawer
        item={selectedItem}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
