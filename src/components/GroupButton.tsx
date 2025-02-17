import { useState } from "react";
import { Radio, Space } from "antd";
import { LangType, ViewType } from "../types/menu";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { CSSProperties } from "react";
import { useLanguageStore } from "@/stores/language";
import { useLang } from "@/lib/useLang";

// Define the props for the GroupButton component
interface GroupButtonProps {
  padding: string;
  buttonTextOne: string;
  buttonTextTwo: string;
  buttonSize?: SizeType;
  groupClassName?: string;
  widthOne?: string;
  widthTwo?: string;
  borderRadius?: string;
  onViewChange?: (view: "menu" | "combo") => void;
  defaultPosition: string;
}

// Define default styles for the radio buttons to avoid repetition
const defaultButtonStyle: CSSProperties = {
  outline: "none",
  borderColor: "#F2E7D4",
  boxShadow: "none",
  textAlign: "center",
};

// GroupButton component definition
export default function GroupButton({
  padding,
  buttonTextOne,
  buttonTextTwo,
  buttonSize,
  groupClassName,
  widthOne,
  widthTwo,
  borderRadius,
  onViewChange,
  defaultPosition,
}: GroupButtonProps) {
  // Use React's useState hook to manage the selected position (default is defaultPosition)
  const [position, setPosition] = useState<LangType | ViewType | string>(
    defaultPosition,
  );
  const { setLanguage } = useLanguageStore();
  const lang = useLang();

  console.log("Text one: ", buttonTextOne);
  console.log("Text two: ", buttonTextTwo);

  // Determine if the first button is active based on the current position
  const isFirstButtonActive =
    position === "arabic" ||
    position === "menu" ||
    position === buttonTextOne.toLowerCase();
  // Determine if the second button is active based on the current position
  const isSecondButtonActive =
    position === "eng" ||
    position === "combo" ||
    position === buttonTextTwo.toLowerCase();

  // Handle the change event when a radio button is selected
  const handleChange = (e: any) => {
    const newValue = e.target.value; // Get the new value from the event
    setPosition(newValue); // Update the position state with the new value

    // If an onViewChange callback is provided, call it with the appropriate view value
    if (onViewChange) {
      onViewChange(newValue === "menu" ? "menu" : "combo");
    }

    if (newValue === "arabic" || newValue === "eng") {
      setLanguage(newValue);
    }
  };

  // Render the component
  return (
    <Space>
      {/* Radio button group */}
      <Radio.Group
        value={position}
        onChange={handleChange}
        size={buttonSize}
        className={groupClassName}
      >
        {/* First radio button */}
        <Radio.Button
          value={buttonTextOne.toLowerCase()}
          style={{
            ...defaultButtonStyle,
            backgroundColor: isFirstButtonActive ? "#F2E7D4" : "transparent",
            color: isFirstButtonActive ? "black" : "#F2E7D4",
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            padding: padding,
            width: widthOne,
          }}
        >
          {buttonTextOne === "arabic"
            ? "عربي"
            : buttonTextOne === "Menu"
              ? lang("Menu", "مينو")
              : buttonTextOne}
        </Radio.Button>

        {/* Second radio button */}
        <Radio.Button
          value={buttonTextTwo.toLowerCase()} // Set the value for the second button
          style={{
            ...defaultButtonStyle,
            backgroundColor: isSecondButtonActive ? "#F2E7D4" : "transparent",
            color: isSecondButtonActive ? "black" : "#F2E7D4",
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            padding: padding,
            width: widthTwo,
          }}
        >
          {/* Display the button text */}
          {buttonTextTwo === "Combo"
            ? lang("Combo", "وجبات عائلية")
            : buttonTextTwo}
        </Radio.Button>
      </Radio.Group>
    </Space>
  );
}
