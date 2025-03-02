import React, { useEffect, useState } from "react";
import { Drawer, FloatButton } from "antd";
import { MenuItem } from "@/lib/firebase";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { useAddToCartStore } from "@/stores/useAddToCart";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/lib/useLang";

interface BottomDrawerProps {
  item?: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ item, open, onClose }) => {
  const [itemQuantity, setItemQuantity] = useState(0);
  const [cartActivated, setCartActivated] = useState(false);
  const [showGoToCartButton, setShowGoToCartButton] = useState(false);
  const lang = useLang();

  const { cart, addToCart, setShowToSlide } = useAddToCartStore();

  const itemInCart = cart.find((cartItem) => cartItem.id === item?.id);
  const navigatetoCart = useNavigate();

  useEffect(() => {
    setCartActivated(itemQuantity > 0);
  }, [itemQuantity]);

  useEffect(() => {
    if (item && itemInCart) {
      setItemQuantity(itemInCart.quantity);
    } else {
      setItemQuantity(0);
    }
  }, [item, itemInCart]);

  useEffect(() => {
    const hasItemsInCart = cart.some((cartItem) => cartItem.quantity > 0);
    setShowGoToCartButton(hasItemsInCart);
  }, [cart]);

  const handleIncrement = () => setItemQuantity((prev) => prev + 1);
  const handleDecrement = () =>
    setItemQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  const handleAddToCart = () => {
    if (itemQuantity > 0 && item) {
      addToCart({
        id: item.id,
        name: item.name,
        name_arab: item.name_arab,
        price: item.price,
        image: item.imageURL,
        quantity: itemQuantity,
        discountedPrice: item.discountedPrice,
      });
      setShowToSlide();
      setShowGoToCartButton(true);
    }

    onClose();
  };

  const handleCloseDrawer = () => {
    onClose();
    setItemQuantity(0);
  };
  return (
    <>
      <Drawer
        placement="bottom"
        closable={false}
        open={open}
        className="rounded-t-2xl p-0"
        height="60%"
        style={{ backgroundColor: "#F2E7D4", border: "none" }}
      >
        <FloatButton
          type="default"
          onClick={handleCloseDrawer}
          icon={<RxCross2 color="black" />}
          className="absolute -top-12 right-4 text-[#F2E7D4]"
        >
          {lang("Close", "إغلاق")}
        </FloatButton>
        <div className="w-full">
          {item ? (
            <div className="flex h-fit flex-col rounded-sm p-0">
              <div>
                <img
                  src={item.imageURL}
                  alt={item.name}
                  width="400"
                  height="400"
                  className="h-[180px] rounded-xl object-cover"
                />
              </div>
              <div className="mt-2 flex flex-col text-black">
                <div className="flex flex-col gap-2 px-2 font-cairo">
                  <div className="flex items-center justify-between">
                    <p className="font-cairo text-xl font-bold">
                      {lang(item.name, item.name_arab)}
                    </p>
                  </div>
                  <div className="flex w-[100px] items-center justify-center rounded-xl bg-[#F2C5AE] py-1 text-sm text-[#F37554]">
                    <p>
                      {item.calories} {lang("Calories", "سعرات حرارية")}
                    </p>
                  </div>
                  <p className="text-sm">
                    {lang(item.description, item.description_arab)}
                  </p>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="relative flex items-center justify-center gap-1">
                      {item.discountPercentage ? (
                        <>
                          <span className="text-sm font-semibold">
                            SR{" "}
                            {(
                              item.price *
                              (1 - item.discountPercentage / 100)
                            ).toFixed(2)}
                          </span>
                          <span className="text-sm line-through">
                            SR {item.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-center text-sm font-semibold">
                          SR {item.price}
                        </span>
                      )}
                    </div>
                    <div className="rounded-xl px-2">
                      {itemQuantity === 0 ? (
                        <button
                          className="flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black"
                          onClick={handleIncrement}
                        >
                          {lang("Add", "إضافة")} <GoPlus size={16} />
                        </button>
                      ) : (
                        <div className="flex items-center rounded-full bg-[#D87E27] px-4 py-1 text-black">
                          <button onClick={handleDecrement}>
                            <LuMinus size={18} />
                          </button>
                          <span className="mx-2">{itemQuantity}</span>
                          <button onClick={handleIncrement}>
                            <GoPlus size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center px-4">
                <button
                  className={`flex items-center justify-center rounded-lg ${
                    cartActivated ? "bg-[#D87E27]" : "bg-[#F2C5AE]"
                  } w-full max-w-[350px] py-2 text-sm text-[#F2E7D4]`}
                  onClick={handleAddToCart}
                >
                  <span>{lang("Add to Cart", "إضافة إلى السلة")}</span>
                </button>
              </div>
            </div>
          ) : (
            <p>{lang("No item selected", "لم يتم تحديد عنصر")}</p>
          )}
        </div>
      </Drawer>
      {showGoToCartButton && (
        <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-center p-4">
          <button
            className="flex w-[340px] items-center justify-center rounded-lg bg-[#D87E27] py-3 text-sm text-[#F2E7D4]"
            onClick={() => {
              navigatetoCart("/cart", {
                state: { categoryId: item?.category },
              });
            }}
          >
            <span>{lang("Go to Cart", "الذهاب إلى السلة")}</span>
          </button>
        </div>
      )}
    </>
  );
};

export default BottomDrawer;
