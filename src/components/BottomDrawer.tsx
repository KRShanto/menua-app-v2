import React from "react";
import { Drawer } from "antd";
import { ItemTemplate } from "@/types/menu";
import { FloatButton } from "antd";
import { RxCross2 } from "react-icons/rx";
interface BottomDrawerProps {
  item: ItemTemplate | null;
  open: boolean;
  onClose: () => void;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ item, open, onClose }) => {
  return (
    <Drawer
      title="Item Details"
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={open}
      className="rounded-2xl "
    >
      <FloatButton
        type="default"
        onClick={onClose}
        icon={<RxCross2 color="black" />}
        className="absolute -top-12 right-4 text-[#F2E7D4]"
      >
        Close
      </FloatButton>
      {item ? (
        <>
          <p>{item.name}</p>
          <p>SR {item.price}</p>
          <p>{item.image}</p>
        </>
      ) : (
        <p>No item selected</p>
      )}
    </Drawer>
  );
};

export default BottomDrawer;
