import React from "react";
import { Radio, Space } from "antd";
import { langType, viewType } from "../types/menu";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { AnyObject } from "antd/es/_util/type";

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
  const [position, setPosition] = React.useState<langType | viewType | string>(
    defaultPosition
  );
  const handleChange = (e: AnyObject) => {
    setPosition(e.target.value);
    if (onViewChange) {
      onViewChange(e.target.value === "menu" ? "menu" : "combo");
    }
  };
  return (
    <Space>
      <Radio.Group
        value={position}
        onChange={handleChange}
        size={buttonSize}
        className={groupClassName}
      >
        <Radio.Button
          value={buttonTextOne.toLowerCase()}
          style={{
            backgroundColor: position === "arabic"|| position === "menu" ? "#F2E7D4" : "transparent",
            color: position === "arabic"|| position === "menu" ? "black" : "#F2E7D4",
            borderTopLeftRadius: borderRadius,
            borderBottomLeftRadius: borderRadius,
            outline: "none",
            borderColor: "#F2E7D4",
            boxShadow: "none",
            padding: padding,
            width: widthOne,
            textAlign: "center",
          }}
        >
          {buttonTextOne === "arabic" ? "عربي" : buttonTextOne}
        </Radio.Button>
        <Radio.Button
          value={buttonTextTwo.toLowerCase()}
          style={{
            backgroundColor: position === "eng" || position === "combo" ? "#F2E7D4" : "transparent",
            color: position === "eng" || position === "combo" ? "black" : "#F2E7D4 ",
            borderTopRightRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            outline: "none",
            borderColor: "#F2E7D4",
            boxShadow: "none",
            padding: padding,
            width: widthTwo,
            textAlign: "center",
          }}
        >
          {buttonTextTwo}
        </Radio.Button>
      </Radio.Group>
    </Space>
  );
}
