import { BsCart } from "react-icons/bs";
import { useCartStore } from "../stores/cart";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function MenuCart() {
  const { cart, increaseQuantity, decreaseQuantity } = useCartStore();

  return (
    <section className="text-foregroundColor">
      <h2 className="ml-5 flex items-center gap-2 text-lg">
        <BsCart /> Menu Cart
      </h2>

      <ul>
        {cart.map((item) => (
          <>
            <li key={item.id} className="mt-5 flex items-center gap-5 px-5">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 w-16 rounded-lg"
              />
              <div className="flex w-full items-center justify-between">
                <div>
                  <h3>{item.name}</h3>
                  <p>SR {item.price}</p>
                </div>

                <div className="bg-yellowBackground flex gap-2 rounded-full px-2 text-sm text-black">
                  <button onClick={() => decreaseQuantity(item.id)}>
                    <FaMinus size={6} />
                  </button>
                  <span>
                    {cart.find((i) => i.id === item.id)?.quantity || 0}
                  </span>
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
    </section>
  );
}
