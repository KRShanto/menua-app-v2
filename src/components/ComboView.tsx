import { useNavigate } from "react-router-dom";
import MenuCard from "./MenuCard";
import { useDataStore } from "@/stores/data";
import { MenuCategory } from "@/lib/firebase";

export default function ComboView() {
  const navigate = useNavigate();
  const { menuCategories } = useDataStore();

  const handleCategorySelect = (category: MenuCategory) => {
    navigate(`/category/${category.title}`);
  };

  return (
    <div className="relative mt-4 h-screen overflow-y-auto">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {menuCategories
            .filter((category) =>
              category.title.toLowerCase().includes("combo"),
            )
            .map((category) => (
              <MenuCard
                key={category.title}
                {...category}
                onClick={() => handleCategorySelect(category)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
