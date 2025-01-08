import React, { useEffect, useState } from "react";
import { Drawer, FloatButton } from "antd";
import { MenuItem } from "@/lib/firebase";
import { RxCross2 } from "react-icons/rx";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { useAddToCartStore } from "@/stores/useAddToCart";
import { useNavigate } from "react-router-dom";

interface BottomDrawerProps {
  item?: MenuItem | null;
  open: boolean;
  onClose: () => void;
}

const BottomDrawer: React.FC<BottomDrawerProps> = ({ item, open, onClose }) => {
  const [itemQuantity, setItemQuantity] = useState(0);
  const [cartActivated, setCartActivated] = useState(false);
  const [showGoToCartButton, setShowGoToCartButton] = useState(false);

  const {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    setShowToSlide,
  } = useAddToCartStore();

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
        price: item.price,
        image: item.imageURL,
        quantity: itemQuantity,
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
                    <p className="font-cairo text-xl font-bold">{item.name}</p>
                  </div>
                  <div className="flex w-[100px] items-center justify-center rounded-xl bg-[#F2C5AE] py-1 text-sm text-[#F37554]">
                    <span>{item.calories} calories</span>
                  </div>
                  <p className="text-sm">{item.description}</p>
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
                      {itemInCart ? (
                        <div className="flex items-center rounded-full bg-[#D87E27] px-4 py-1 text-black">
                          <button onClick={() => decreaseQuantity(item.id)}>
                            <LuMinus size={14} />
                          </button>
                          <span className="mx-2">{itemInCart.quantity}</span>
                          <button onClick={() => increaseQuantity(item.id)}>
                            <GoPlus size={16} />
                          </button>
                        </div>
                      ) : itemQuantity === 0 ? (
                        <button
                          className="flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black"
                          onClick={handleIncrement}
                        >
                          Add <GoPlus size={16} />
                        </button>
                      ) : (
                        <div className="flex items-center rounded-full bg-[#D87E27] px-4 py-1 text-black">
                          <button className="" onClick={handleDecrement}>
                            <LuMinus size={14} />
                          </button>
                          <span className="mx-2">{itemQuantity}</span>
                          <button onClick={handleIncrement}>
                            <GoPlus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center px-4">
                <button
                  className={`flex items-center justify-center rounded-lg ${
                    cartActivated ? "bg-[#D87E27]" : "bg-[#F2C5AE]"
                  } w-full max-w-[350px] py-2 text-sm text-[#F2E7D4]`}
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
              navigatetoCart("/cart", {
                state: { categoryId: item?.category },
              });
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
