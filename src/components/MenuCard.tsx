import { MdOutlineArrowOutward } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { useLang } from "@/lib/useLang";

interface MenuCardProps {
  title: string;
  title_arab: string;
  itemCount?: number;
  likes?: number;
  imageURL: string;
  className?: string;
  onClick?: () => void;
}

export default function MenuCard({
  title,
  title_arab,
  imageURL,
  itemCount,
  likes,
  onClick,
}: MenuCardProps) {
  const lang = useLang();

  return (
    <div>
      <div
        className="flex flex-col rounded-sm border-b border-gray-800 shadow-md"
        onClick={onClick}
      >
        <div>
          <img
            src={imageURL}
            alt={title}
            width="400"
            height="400"
            className="h-[200px] rounded-xl object-cover"
          />
        </div>
        <div className="flex flex-col rounded-b-xl py-4 text-primaryText">
          <div className="flex flex-col gap-2 px-2">
            <p className="text-lg">{lang(title, title_arab)}</p>
            <p className="text-sm">{itemCount} Items</p>
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex items-center justify-center gap-1">
                <FaHeart size={16} color="#F37554" className="relative pt-1" />{" "}
                <span className="text-center text-sm">{likes}</span>
              </div>
              <div className="flex items-center justify-end gap-2 px-4">
                <span>See Details</span>
                <MdOutlineArrowOutward size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
