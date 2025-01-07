"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CiMenuFries } from "react-icons/ci";
import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  FaClock,
  FaHome,
  FaInstagram,
  FaPhoneAlt,
  FaSnapchatGhost,
  FaTiktok,
  FaWhatsapp,
  FaShoppingCart,
} from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { RiFeedbackFill } from "react-icons/ri";
import FormDrawer from "./FormDrawer";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: FaHome, label: "Home Page", path: "/" },
  { icon: FaShoppingCart, label: "Menu Cart", path: "/cart" },
  { icon: RiFeedbackFill, label: "Feedback", onClick: () => {} },
];

const collapsibleItemsData = [
  {
    id: "opening-hours",
    icon: FaClock,
    label: "Opening Hours",
    content: (
      <>
        <div className="flex items-start gap-2">
          <FaClock className="mt-1 text-lg" />
          <div className="flex-col">
            <div>Sunday - Wednesday</div>
            <div className="font-bold">1:00 PM - 1:00 AM</div>
          </div>
        </div>
        <br />
        <div className="flex items-start gap-2">
          <FaClock className="mt-1 text-lg" />
          <div className="flex-col">
            <div>Thursday - Saturday</div>
            <div className="font-bold">1:00 PM - 2:00 AM</div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "contact-us",
    icon: FaPhoneAlt,
    label: "Contact Us",
    content: <p>+966 55094 2073</p>,
  },
  {
    id: "location",
    icon: FaLocationDot,
    label: "Location",
    content: (
      <div className="space-y-2 pl-4">
        <p>123 Restaurant Street</p>
        <p>City, Country</p>
      </div>
    ),
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsibleItems, setCollapsibleItems] = useState<string | null>(null);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpenFormDrawer = () => {
    setIsFormDrawerOpen(true);
    setIsOpen(false);
  };

  const handleCloseFormDrawer = () => {
    setIsFormDrawerOpen(false);
  };
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <CiMenuFries className="size-6 text-foregroundColor" />
      </button>

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[250px] transform rounded-l-xl bg-foregroundColor py-6 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="ml-5 text-orange-500"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="mt-8 space-y-6">
          {menuItems.map((item) =>
            item.path ? (
              <div
                key={item.label}
                className="flex cursor-pointer items-center gap-3 px-5 text-zinc-900"
                onClick={() => handleNavigation(item.path)}
              >
                <span className="flex items-center gap-2 text-xl">
                  <item.icon />
                  {item.label}
                </span>
              </div>
            ) : (
              <div
                key={item.label}
                className="flex cursor-pointer items-center gap-3 px-5 text-zinc-900"
                onClick={
                  item.label === "Feedback" ? handleOpenFormDrawer : undefined
                }
              >
                <span className="flex items-center gap-2 text-xl">
                  <item.icon />
                  {item.label}
                </span>
              </div>
            ),
          )}

          {collapsibleItemsData.map((item) => (
            <Collapsible key={item.id} open={collapsibleItems === item.id}>
              <CollapsibleTrigger
                className="flex w-full items-center justify-between px-5 text-zinc-900"
                onClick={() =>
                  setCollapsibleItems(
                    collapsibleItems === item.id ? null : item.id,
                  )
                }
              >
                <span
                  className={cn(
                    "flex items-center gap-2 text-xl",
                    collapsibleItems === item.id && "text-orange-500",
                  )}
                >
                  <item.icon />
                  {item.label}
                </span>
                {collapsibleItems === item.id ? (
                  <IoIosArrowUp className="text-zinc-900" />
                ) : (
                  <IoIosArrowDown className="text-zinc-900" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent
                className={cn(
                  "px-5 py-2",
                  collapsibleItems === item.id && "bg-black/10",
                )}
              >
                {collapsibleItems === item.id && item.content}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
          {[FaWhatsapp, FaInstagram, FaTiktok, FaSnapchatGhost].map(
            (Icon, index) => (
              <a
                key={index}
                href="#"
                className="rounded-full bg-orange-500 p-1 text-white"
              >
                <Icon className="size-6" />
              </a>
            ),
          )}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <p className="text-center text-sm text-zinc-900">
            Developed by{" "}
            <a
              href="https://levantitsolution.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-500"
            >
              Levant IT Solution
            </a>
          </p>
        </div>
      </div>

      {isFormDrawerOpen && (
        <FormDrawer open={isFormDrawerOpen} onClose={handleCloseFormDrawer} />
      )}
    </>
  );
}
