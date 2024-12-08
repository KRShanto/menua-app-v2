import AlBaharat from "../assets/icons/albaharat.svg?react";
const SplashScreen = () => {
  return (
    <div className="splash-screen relative">
      <div className="absolute inset-0 bg-[#343436]/90"> </div>
      <div className="relative -top-16 z-50 flex flex-col items-center justify-center">
        <AlBaharat />
        <h1 className="text-center text-4xl font-bold text-primaryText">
          Welcome to Lamsat Al Bharat Restaurant
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
