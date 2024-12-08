import { CiMenuFries } from "react-icons/ci";
import AlBaharatIcon from "../assets/icons/albaharat.svg?react";
import GroupButton from "./GroupButton";

export default function HeaderLogo() {
  return (
    <div className="bg-[#1F1F20] h-14  mb-8 flex justify-between items-center px-4 relative">
      <GroupButton
        padding="0 8px"
        buttonTextOne="arabic"
        buttonTextTwo="ENG"
        borderRadius="20px"
        defaultPosition="arabic"
      />
      <div className="relative -left-5">
        <AlBaharatIcon className="size-10" />
      </div>
      <div>
        <CiMenuFries className="text-foregroundColor size-6" />
      </div>
    </div>
  );
}
