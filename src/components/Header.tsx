import HeaderLogo from "./HeaderLogo";

export default function Header() {
  return (
    <div className="flex flex-col w-full mb-8">
      <HeaderLogo />
      <div className="max-w-md mx-4 ">
        <input
          type="text"
          placeholder="Search your food "
          className="w-full rounded-lg pl-4 text-sm ring-1 ring-[#F2E7D4] bg-backgroundColor py-4"
        />
      </div>
    </div>
  );
}
