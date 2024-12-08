import React from "react";
import MenuCard from "./MenuCard";

const MENU_CATEGORIES = [
  {
    title: "Soup",
    itemCount: 6,
    likes: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80",
  },
  {
    title: "Main Course",
    itemCount: 12,
    likes: 24,
    imageUrl:
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80",
  },
  {
    title: "Desserts",
    itemCount: 8,
    likes: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80",
  },
  {
    title: "Beverages",
    itemCount: 10,
    likes: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&q=80",
  },
];
export default function MenuView() {
  return (
    <div className="relative h-screen overflow-y-auto mt-4">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {MENU_CATEGORIES.map((category) => (
            <MenuCard key={category.title} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
}
