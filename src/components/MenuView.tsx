import MenuCard from "./MenuCard";
import MenuCardSkeleton from "./MenuCardSkeleton";
import { useNavigate } from "react-router-dom";
import type { MenuCategory } from "@/lib/firebase";
import { useDataStore } from "@/stores/data";
import { useEffect } from "react";

export default function MenuView() {
  const navigate = useNavigate();
  const { menuCategories, fetching } = useDataStore();

  // Restore scroll position when component mounts
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("menuScrollPosition");
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10));
    }
  }, []);

  const handleCategorySelect = (category: MenuCategory) => {
    // Save current scroll position before navigating
    sessionStorage.setItem("menuScrollPosition", window.scrollY.toString());
    navigate(`/category/${category.title}`);
  };

  const filteredCategories = menuCategories.filter(
    (category) => !category.title.toLowerCase().includes("combo"),
  );

  return (
    <div className="relative mt-4 bg-[#343436]">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {fetching
            ? Array.from({ length: 3 }).map((_, index) => (
                <MenuCardSkeleton key={index} />
              ))
            : filteredCategories.map((category) => (
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
