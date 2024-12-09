import { BsCart } from "react-icons/bs";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

const cart: CartItem[] = [
  {
    id: "234235",
    name: "Chicken of Cream Soup",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "d00s;z",
    name: "Thai Soup",
    price: 25,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "100111",
    name: "Chinese popcorn",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "1010dd",
    name: "Alu vaji",
    price: 8,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function MenuCart() {
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

                <div>
                  <button>+</button>
                  <span>1</span>
                  <button>-</button>
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
