import React from "react";
import AlBaharat from "../assets/icons/albaharat.svg?react";
const SplashScreen = () => {
  return (
    <div className="splash-screen relative">
      <div className="absolute inset-0 bg-[#343436]/90"> </div>
      <div className="flex flex-col justify-center items-center z-50">
        <AlBaharat />
        <h1 className="text-primaryText text-4xl text-center font-bold">
          Welcome to Lamsat Al Bharat Restaurant
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
