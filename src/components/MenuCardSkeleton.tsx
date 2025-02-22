import type React from "react";

const MenuCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col rounded-sm border-b border-gray-800 shadow-md">
        <div className="h-[200px] rounded-xl bg-[#3f3f42]" />
        <div className="flex flex-col rounded-b-xl py-4">
          <div className="flex flex-col gap-2 px-2">
            <div className="h-6 w-3/4 rounded bg-[#3f3f42]" />
            <div className="h-4 w-1/4 rounded bg-[#3f3f42]" />
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 w-12 rounded bg-[#3f3f42]" />
              <div className="h-4 w-24 rounded bg-[#3f3f42]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuCardSkeleton;
