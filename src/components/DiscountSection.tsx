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
        <div key={index} className="p-4">
          {/* Discount Title */}
          <h2 className="flex items-center gap-2 text-xl text-foregroundColor">
            <FaFire />
            {discount.name}
          </h2>

          {/* Item List */}
          <ul className="mt-2 flex gap-3 overflow-x-scroll">
            {discount.items.map((item, index) => (
              <li key={index} className="relative min-w-[16rem]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-1/2 w-full rounded-tl-xl rounded-tr-xl"
                />
                <div className="h-1/2 rounded-bl-xl rounded-br-xl bg-[#1F1F20] p-4">
                  <h3 className="text-lg text-foregroundColor">{item.name}</h3>
                  <p className="-mb-16 mt-5 text-foregroundColor">
                    SR {item.price}
                    <span className="ml-3 text-sm line-through opacity-60">
                      SR {item.price * (1 - discount.discountRate / 100)}
                    </span>
                  </p>
                </div>

                {/* Discount Tag */}
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-foregroundColor px-2 py-1 text-black">
                  <FaTags />
                  {discount.discountRate}% Off
                </div>

                {/* Add button */}
                <button className="absolute right-3 top-[40%] flex items-center gap-1 rounded-full bg-[#D87E27] px-4 py-1 text-black">
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
