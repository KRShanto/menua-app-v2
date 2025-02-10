import { useAddToCartStore } from "@/stores/useAddToCart";
import { BsCart } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

export default function MenuCart() {
  const { cart, increaseQuantity, decreaseQuantity } = useAddToCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const categoryId = location.state?.categoryId;

  const handleGoToMenu = () => {
    if (categoryId) {
      navigate(`/category/${categoryId}`);
    } else {
      navigate("/");
    }
  };

  return (
    <section className="text-foregroundColor">
      <h2 className="ml-5 flex items-center gap-2 text-lg">
        <BsCart /> Menu Cart
      </h2>

      <ul>
        {cart.map((item) => (
          <>
            <li key={item.id} className="mt-5 flex items-center gap-5 px-5">
              {/* <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-lg"
              /> */}
              <div className="flex w-full items-center justify-between">
                <div>
                  <h3>{item.name}</h3>
                  <p>SR {item.price}</p>
                </div>

                <div className="flex gap-2 rounded-full bg-yellowBackground px-2 text-sm text-black">
                  <button onClick={() => decreaseQuantity(item.id)}>
                    <FaMinus size={6} />
                  </button>
                  {/* <span>
                    {cart.find((i) => i.id === item.id)?.quantity || 0}
                  </span> */}
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>
                    <FaPlus size={8} />
                  </button>
                </div>
              </div>
            </li>

            <hr className="border-1 mx-auto mt-2 w-[90%] border-[#2b2b2b]" />
          </>
        ))}
      </ul>
      <div className="mt-28 flex justify-center">
        <div className="flex justify-end gap-3">
          <button
            className="rounded-lg bg-black px-10 py-3 text-sm text-[#F2E7D4]"
            onClick={handleGoToMenu}
          >
            Go to Menu
          </button>
          <button
            className="rounded-lg bg-[#D87E27] px-10 py-3 text-sm text-[#F2E7D4]"
            onClick={() => navigate("/orderhistory")}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </section>
  );
}
