import { useNavigate } from "react-router-dom";
import MenuCard from "./MenuCard";
interface ComboItem {
  title: string;
  itemCount?: number;
  likes?: number;
  imageURL: string;
}
const MENU_CATEGORIES: ComboItem[] = [
  {
    title: "Combo1",
    itemCount: 6,
    likes: 10,
    imageURL:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80",
  },
  {
    title: "Combo2",
    itemCount: 12,
    likes: 24,
    imageURL:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
  },
  {
    title: "Combo3",
    itemCount: 8,
    likes: 15,
    imageURL:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80",
  },
  {
    title: "Combo4",
    itemCount: 10,
    likes: 18,
    imageURL:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80",
  },
];
export default function ComboView() {
  const navigate = useNavigate();
  const handleCategorySelect = (category: ComboItem) => {
    navigate(`/category/${category.title}`);
  };

  return (
    <div className="relative mt-4 h-screen overflow-y-auto">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {MENU_CATEGORIES.map((category) => (
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
