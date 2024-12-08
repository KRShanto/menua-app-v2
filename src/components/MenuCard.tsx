import { MdOutlineArrowOutward } from "react-icons/md";

interface MenuCardProps {
  title: string;
  itemCount?: number;
  likes?: number;
  imageUrl: string;
  className?: string;
}

export default function MenuCard({
  title,
  imageUrl,
  itemCount,
}: MenuCardProps) {
  return (
    <div>
      <div className="flex flex-col rounded-sm  border-b border-gray-800 shadow-md">
        <div>
          <img
            src={imageUrl}
            alt={title}
            width="400"
            height="400"
            className="rounded-xl h-[200px] object-cover"
          />
        </div>
        <div className="flex flex-col rounded-b-xl py-4 text-primaryText">
          <div className="flex flex-col gap-2 px-2">
            <p className="text-xl">{title}</p>
            <p className=" text-sm">{itemCount}</p>
          </div>
          <div className="flex  justify-end items-center gap-2 px-4">
            <span>See Details</span>
            <MdOutlineArrowOutward size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
