import MenuCard from "./MenuCard";
import MenuCardSkeleton from "./MenuCardSkeleton";
import { useNavigate } from "react-router-dom";
import type { MenuCategory } from "@/lib/firebase";
import { useDataStore } from "@/stores/data";

export default function MenuView() {
  const navigate = useNavigate();
  const { menuCategories, fetching } = useDataStore();

  const handleCategorySelect = (category: MenuCategory) => {
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
