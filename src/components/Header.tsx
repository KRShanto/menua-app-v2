import HeaderLogo from "./HeaderLogo";

export default function Header() {
  return (
    <div className="mb-8 flex w-full flex-col">
      <HeaderLogo />
      <div className="mx-4 max-w-md">
        <input
          type="text"
          placeholder="Search your food "
          className="w-full rounded-lg bg-backgroundColor py-4 pl-4 text-sm ring-1 ring-[#F2E7D4]"
        />
      </div>
    </div>
  );
}
