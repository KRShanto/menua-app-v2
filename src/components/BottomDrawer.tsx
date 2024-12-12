import React, { useEffect, useState } from "react";
import { Drawer, FloatButton } from "antd";
import { MenuItem } from "@/types/menu";
import { RxCross2 } from "react-icons/rx";
import { FaHeart } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { useAddToCartStore } from "@/stores/useAddToCart";
import { useNavigate } from "react-router-dom";

interface BottomDrawerProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ item, open, onClose }) => {
  const [cartActivated, setCartActivated] = useState(false);

  const [showGoToCartButton, setShowGoToCartButton] = useState(false);
  const { itemQuantity, add, increment, decrement, setShowToSlide, addItem } =
    useAddToCartStore();
  const navigatetoCart = useNavigate();
  useEffect(() => {
    if (itemQuantity > 0) {
      setCartActivated(true);
    } else {
      setCartActivated(false);
    }
  }, [itemQuantity]);

  const handleAddToCart = () => {
    if (itemQuantity > 0) {
      addItem(itemQuantity);
    }
    setShowToSlide();
    setShowGoToCartButton(true);
    onClose();
  };
  const handleCloseDrawer = () => {
    onClose();
  };
  return (
    <>
      <Drawer
        placement="bottom"
        closable={false}
        open={open}
        className="rounded-t-2xl p-0"
        style={{ backgroundColor: "#F2E7D4", border: "none" }}
      >
        <FloatButton
          type="default"
          onClick={handleCloseDrawer}
          icon={<RxCross2 color="black" />}
          className="absolute -top-12 right-4 text-[#F2E7D4]"
        >
          Close
        </FloatButton>
        <div className="-mt-2 mb-4 w-full">
          {item ? (
            <div className="flex h-fit flex-col rounded-sm p-0">
              <div>
                <img
                  src={item.image}
                  alt={item.name}
                  width="400"
                  height="400"
                  className="h-[180px] rounded-xl object-cover"
                />
              </div>
              <div className="mt-2 flex flex-col text-black">
                <div className="flex flex-col gap-2 px-2 font-cairo">
                  <div className="flex items-center justify-between">
                    <p className="font-cairo text-xl font-bold">{item.name}</p>
                    <div className="flex gap-1 text-[#F37554]">
                      <FaHeart
                        size={18}
                        color="#F37554"
                        className="relative pt-1"
                      />
                      <span className="text-sm">{item.likes}</span>
                    </div>
                  </div>
                  <div className="flex w-[100px] items-center justify-center rounded-xl bg-[#F2C5AE] py-1 text-sm text-[#F37554]">
                    <span>{item.calories} calories</span>
                  </div>
                  <p className="text-sm">{item.description}</p>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="relative flex items-center justify-center gap-1">
                      <span className="text-center text-sm font-semibold">
                        SR {item.price}{" "}
                      </span>
                      <span className="text-sm line-through">
                        SR {item.demoPrice}
                      </span>
                    </div>
                    <div className="rounded-xl px-2">
                      <div>
                        {itemQuantity === 0 ? (
                          <button
                            className="flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black"
                            onClick={add}
                          >
                            Add <GoPlus size={16} />
                          </button>
                        ) : (
                          <div className="flex items-center rounded-full bg-[#D87E27] px-4 py-1 text-black">
                            <button className="" onClick={decrement}>
                              <LuMinus size={14} />
                            </button>
                            <span className="mx-2">{itemQuantity}</span>
                            <button onClick={increment}>
                              <GoPlus size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container flex justify-center">
                <button
                  className={`flex items-center justify-center rounded-lg ${
                    cartActivated ? "bg-[#D87E27]" : "bg-[#F2C5AE]"
                  } mx-auto w-[340px] py-2 text-sm text-[#F2E7D4]`}
                  onClick={handleAddToCart}
                >
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ) : (
            <p>No item selected</p>
          )}
        </div>
      </Drawer>
      {showGoToCartButton && (
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center p-4">
          <button
            className="flex w-[340px] items-center justify-center rounded-lg bg-[#D87E27] py-3 text-sm text-[#F2E7D4]"
            onClick={() => {
              navigatetoCart("/cart");
            }}
          >
            <span>Go to Cart</span>
          </button>
        </div>
      )}
    </>
  );
};

export default BottomDrawer;
