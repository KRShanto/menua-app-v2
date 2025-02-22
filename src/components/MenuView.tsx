import MenuCard from "./MenuCard";
import { useNavigate } from "react-router-dom";
import { MenuCategory } from "@/lib/firebase";
import { useDataStore } from "@/stores/data";

export default function MenuView() {
  const navigate = useNavigate();
  const { menuCategories } = useDataStore();

  const handleCategorySelect = (category: MenuCategory) => {
    navigate(`/category/${category.title}`);
  };

  return (
    <div className="relative mt-4">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {menuCategories
            .filter(
              (category) => !category.title.toLowerCase().includes("combo"),
            )
            .map((category) => (
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
