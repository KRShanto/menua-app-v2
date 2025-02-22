import { useLang } from "@/lib/useLang";
import { useAddToCartStore } from "@/stores/useAddToCart";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderHistory() {
  const { cart, clearCart } = useAddToCartStore();
  const navigate = useNavigate();
  const handleClose = () => {
    clearCart();
    navigate("/");
  };
  const lang = useLang();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-[#F2E7D4] md:hidden">
      <div className="relative border-[#e8d9c9] p-6">
        <button
          className="absolute right-4 top-4 text-orange-600 hover:text-orange-700"
          aria-label="Close"
        >
          <X className="h-7 w-7" onClick={handleClose} />
        </button>
        <div className="mt-10 space-y-1.5 text-center">
          <p className="text-sm">
            {lang("To complete your order", "لإتمام طلبك")}
          </p>
          <p className="text-2xl font-semibold text-orange-500">
            {lang("Kindly Call a Waiter", "يرجى استدعاء النادل")}
          </p>
          <p className="text-sm">
            {lang(
              "They will confirm everything for you!",
              "سيقومون بتأكيد كل شيء لك!",
            )}
          </p>
        </div>
      </div>

      <hr className="border border-dashed border-orange-400" />

      <div className="mt-8">
        <div className="mx-auto w-[90%]">
          <div className="flex justify-between text-left">
            <span className="py-4 text-xs font-bold">
              {lang("Item Name", "اسم العنصر")}
            </span>
            <span className="py-4 text-right text-xs font-bold">
              {lang("Quantity", "كمية")}
            </span>
          </div>
          {cart.map((item) => (
            <div
              key={item.name}
              className="flex justify-between border-b border-[#c3bdb7]"
            >
              <span className="py-4">{lang(item.name, item.name_arab)}</span>
              <span className="py-4 text-right">
                {item.quantity.toString().padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
