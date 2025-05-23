import React, { useState } from "react";
import { Drawer, FloatButton } from "antd";
import { RxCross2 } from "react-icons/rx";
import { addDoc, collection } from "firebase/firestore";
import { db, FEEDBACK_COLLECTION } from "@/lib/firebase";
import { useLang } from "@/lib/useLang";

interface BottomDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FormDrawer: React.FC<BottomDrawerProps> = ({ open, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [feedback, setFeedback] = useState("");
  const lang = useLang();

  const handleSubmitForm = async () => {
    if (!phoneNumber || !feedback) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      await addDoc(collection(db, FEEDBACK_COLLECTION), {
        phoneNumber,
        feedback,
        createdAt: new Date(),
      });

      setPhoneNumber("");
      setFeedback("");

      onClose();
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  return (
    <Drawer
      placement="bottom"
      closable={false}
      open={open}
      className="rounded-t-2xl p-0"
      style={{ backgroundColor: "#F2E7D4", border: "none" }}
    >
      <FloatButton
        type="default"
        onClick={onClose}
        icon={<RxCross2 color="black" />}
        className="absolute -top-12 right-4 text-[#F2E7D4]"
      >
        {lang("Close", "إغلاق")}
      </FloatButton>
      <div className="-mt-2 mb-4 w-full">
        <div className="flex h-fit flex-col rounded-sm p-4">
          <div className="relative mt-5">
            <label
              htmlFor="phoneNumber"
              className="absolute -top-3 left-2 z-20 text-nowrap bg-primaryText px-2 text-sm text-foreground/70"
            >
              {lang("Phone Number", "رقم الهاتف")}
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder={lang("Enter your phone number", "أدخل رقم هاتفك")}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-md border border-foreground/70 bg-transparent p-2 px-3 placeholder-foreground/70 outline-none"
            />
          </div>
          <div className="relative mt-5">
            <label
              htmlFor="feedback"
              className="absolute -top-3 left-2 z-20 text-nowrap bg-primaryText px-2 text-sm text-foreground/70"
            >
              {lang("Feedback", "ردود الفعل")}
            </label>
            <textarea
              id="feedback"
              placeholder={lang(
                "Enter your feedback",
                "أدخل ردود الفعل الخاصة بك",
              )}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-foreground/70 bg-transparent p-2 px-3 placeholder-foreground/70 outline-none"
            />
          </div>
          <button
            className="mt-20 h-10 w-full rounded-lg border-none bg-[#D87E27] text-[#F2E7D4]"
            onClick={handleSubmitForm}
          >
            {lang("Submit", "إرسال")}
          </button>
        </div>
      </div>
    </Drawer>
  );
};

export default FormDrawer;
