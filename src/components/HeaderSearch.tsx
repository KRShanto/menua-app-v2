import React from "react";

export default function HeaderSearch() {
  return (
    <div className="mx-4 max-w-md mt-6">
      <input
        type="text"
        placeholder="Search your food "
        className="w-full rounded-lg bg-backgroundColor py-4 pl-4 text-sm ring-1 ring-[#F2E7D4]"
      />
    </div>
  );
}
