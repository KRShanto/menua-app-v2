import React, { useState } from "react";
import { Radio, Space } from "antd";
import { CiMenuFries } from "react-icons/ci";
import AlBaharatIcon from "../assets/icons/albaharat.svg?react";
export default function HeaderLogo() {
  const [position, setPosition] = useState<"start" | "end">("end");
  return (
    <div className="bg-[#1F1F20] h-14  mb-8 flex justify-between items-center px-4">
      <Space >
        <Radio.Group
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        >
          <Radio.Button
            value="arabic"
            style={{
              backgroundColor: "#F2E7D4",
              color: "black",
              borderTopLeftRadius: "10px",
              borderBottomLeftRadius: "10px",
            }}
          >
            Arabic
          </Radio.Button>
          <Radio.Button
            value="eng"
            style={{
              backgroundColor: "black",
              color: "white",
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
            }}
          >
            ENG
          </Radio.Button>
        </Radio.Group>
      </Space>
      <div>
        <AlBaharatIcon className="size-8" />
      </div>
      <div>
        <CiMenuFries className="text-foregroundColor size-6" />
      </div>
    </div>
  );
}
