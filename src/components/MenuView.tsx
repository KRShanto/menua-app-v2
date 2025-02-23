import MenuCard from "./MenuCard";
import MenuCardSkeleton from "./MenuCardSkeleton";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { MenuCategory } from "@/lib/firebase";
import { useDataStore } from "@/stores/data";
import { useScrollStore } from "@/stores/scrollStore";

export default function MenuView() {
  const navigate = useNavigate();
  const { menuCategories, fetching } = useDataStore();
  const { menuScrollPosition, setMenuScrollPosition, clearScrollPosition } =
    useScrollStore();

  const handleCategorySelect = (category: MenuCategory) => {
    // Save current scroll position before navigating
    setMenuScrollPosition(window.scrollY);
    navigate(`/category/${category.title}`);
  };

  const filteredCategories = menuCategories.filter(
    (category) => !category.title.toLowerCase().includes("combo"),
  );

  // Restore scroll position after rendering the component
  useEffect(() => {
    if (menuScrollPosition > 0) {
      setTimeout(() => {
        window.scrollTo(0, menuScrollPosition);
      }, 100);
    }

    // Clear the scroll position if user manually scrolls to the top
    const handleScroll = () => {
      if (window.scrollY === 0) {
        clearScrollPosition();
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [menuCategories, fetching, menuScrollPosition, clearScrollPosition]);

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
