import { useDataStore } from "@/stores/data";
import ComboCard from "@/components/ComboCard";

export default function ComboView() {
  const { menuItems } = useDataStore();

  return (
    <div className="relative mt-4">
      <div className="container">
        <div className="flex flex-col gap-4 pb-4 pt-4">
          {menuItems
            .filter((item) => item.category.toLowerCase().includes("combo"))
            .map((item, index) => (
              <ComboCard key={index} item={item} />
            ))}
        </div>
      </div>
    </div>
  );
}
