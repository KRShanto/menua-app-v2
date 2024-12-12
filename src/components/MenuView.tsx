import { MENU_DATA } from "@/lib/menuData";
import MenuCard from "./MenuCard";
import { useNavigate } from "react-router-dom";
import { Category } from "@/types/menu";

export default function MenuView() {
  const navigate = useNavigate();

  const handleCategorySelect = (category: Category) => {
    navigate(`/category/${category.id}`);
  };
  return (
    <div className="relative mt-4 h-screen overflow-y-auto">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {MENU_DATA.map((category) => (
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
