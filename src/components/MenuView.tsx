import MenuCard from "./MenuCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMenuData, MenuCategory } from "@/lib/firebase";

export default function MenuView() {
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);

  useEffect(() => {
    fetchMenuData().then((data) => {
      const filteredData = data.filter(
        (category) => !category.title.toLowerCase().includes("combo"),
      );
      setMenuData(filteredData);
    });
  }, []);

  const handleCategorySelect = (category: MenuCategory) => {
    navigate(`/category/${category.title}`);
  };

  return (
    <div className="relative mt-4">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {menuData.map((category) => (
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
