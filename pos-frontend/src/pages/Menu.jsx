import React, { useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";

const Menu = () => {

    useEffect(() => {
      document.title = "Legacy_Pe | Menú"
    }, [])

  const customerData = useSelector((state) => state.customer);

  return (
    <section className="bg-transparent h-[calc(100vh-5rem)] overflow-hidden flex gap-3 pb-20">
      {/* Left Div */}
      <div className="flex-[3]">
        <div className="flex items-center justify-between px-10 py-4">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-[#f4ebe1] text-2xl font-bold tracking-wider font-serif">
              Menú
            </h1>
          </div>
          <div className="flex items-center justify-around gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <MdRestaurantMenu className="text-[#f4ebe1] text-4xl" />
              <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f4ebe1] font-semibold tracking-wide font-serif">
                  {customerData.customerName || "Nombre del cliente"}
                </h1>
                <p className="text-xs text-[#a89a90] font-medium">
                  Mesa : {customerData.table?.tableNo || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <MenuContainer />
      </div>
      {/* Right Div */}
      <div className="flex-[1] bg-[#1c1613] border border-[#2d2520] mt-4 mr-3 h-full rounded-xl pt-2 flex flex-col justify-between">
        {/* Customer Info */}
        <CustomerInfo />
        <hr className="border-[#2d2520] border-t" />
        {/* Cart Items */}
        <CartInfo />
        <hr className="border-[#2d2520] border-t" />
        {/* Bills */}
        <Bill />
      </div>

      <BottomNav />
    </section>
  );
};

export default Menu;
