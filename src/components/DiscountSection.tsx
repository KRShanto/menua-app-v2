import { FaFire, FaTags } from "react-icons/fa";
import { GoPlus } from "react-icons/go";

const discountData = [
  {
    name: "This Week's Special",
    discountRate: 25,
    items: [
      {
        name: "Chicken of Cream Soup",
        price: 100,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Beef of Cream Soup",
        price: 150,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Chicken nuggets",
        price: 120,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "Beef nuggets",
        price: 130,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        name: "French fries",
        price: 100,
        image:
          "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  // {
  //   name: "Last Week's Special",
  //   discountRate: 10,
  //   items: [
  //     {
  //       name: "Beef of Cream Soup",
  //       price: 150,
  //       image:
  //         "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       name: "Chicken nuggets",
  //       price: 120,
  //       image:
  //         "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       name: "Beef nuggets",
  //       price: 130,
  //       image:
  //         "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //     {
  //       name: "French fries",
  //       price: 100,
  //       image:
  //         "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     },
  //   ],
  // },
];

export default function DiscountSection() {
  return (
    <div>
      {discountData.map((discount, index) => (
        <div key={index} className="p-4 ">
          {/* Discount Title */}
          <h2 className="text-xl  text-foregroundColor flex items-center gap-2">
            <FaFire />
            {discount.name}
          </h2>

          {/* Item List */}
          <ul className="flex gap-3 overflow-x-scroll mt-2">
            {discount.items.map((item, index) => (
              <li key={index} className="relative min-w-[16rem]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-1/2 rounded-tl-xl rounded-tr-xl"
                />
                <div className=" bg-[#1F1F20] h-1/2 p-4 rounded-bl-xl rounded-br-xl ">
                  <h3 className="text-lg  text-foregroundColor">{item.name}</h3>
                  <p className="mt-5 -mb-16 text-foregroundColor">
                    SR {item.price}
                    <span className="text-sm line-through opacity-60 ml-3">
                      SR {item.price * (1 - discount.discountRate / 100)}
                    </span>
                  </p>
                </div>

                {/* Discount Tag */}
                <div className="absolute top-4 left-4 text-black bg-foregroundColor font-semibold px-2 py-1 rounded-full flex items-center gap-2">
                  <FaTags />
                  {discount.discountRate}% Off
                </div>

                {/* Add button */}
                <button className="absolute top-[40%] right-3 bg-[#D87E27] flex items-center gap-1 text-black px-4 py-1 rounded-full ">
                  Add <GoPlus />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
