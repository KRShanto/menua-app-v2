import AlBaharatIcon from "../assets/icons/albaharat.svg?react";
import GroupButton from "./GroupButton";
import Navbar from "./Navbar";

export default function HeaderLogo() {
  return (
    <div className="relative mb-8 flex h-14 items-center justify-between bg-[#1F1F20] px-4">
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
        <Navbar />
      </div>
    </div>
  );
}
