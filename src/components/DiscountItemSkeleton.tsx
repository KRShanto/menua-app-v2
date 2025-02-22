import type React from "react";

const DiscountItemSkeleton: React.FC = () => {
  return (
    <li className="relative h-[20rem] min-w-[16rem] animate-pulse">
      <div className="h-[200px] rounded-t-xl bg-[#3f3f42]" />
      <div className="h-[7rem] rounded-bl-xl rounded-br-xl bg-[#2a2a2c] p-4">
        <div className="h-6 w-3/4 rounded bg-[#3f3f42]" />
        <div className="mt-5 h-4 w-1/2 rounded bg-[#3f3f42]" />
      </div>
      <div className="absolute left-4 top-4 h-6 w-16 rounded-full bg-[#3f3f42]" />
      <div className="absolute right-3 top-[60%] h-8 w-20 rounded-full bg-[#3f3f42]" />
    </li>
  );
};

export default DiscountItemSkeleton;
