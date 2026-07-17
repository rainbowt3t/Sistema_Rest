import React from "react";
import { popularDishes } from "../../constants";

const PopularDishes = () => {
  return (
    <div className="mt-6 pr-6">
      <div className="bg-[#1c1613] w-full rounded-xl border border-[#2d2520] pb-4 shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f4ebe1] text-base font-bold font-serif tracking-wide">
            Platos Populares
          </h1>
          <a href="" className="text-[#c59b27] text-xs font-bold hover:text-[#b0881f] hover:underline transition-colors">
            Ver todo
          </a>
        </div>

        <div className="overflow-y-scroll h-[650px] scrollbar-hide">
          {popularDishes.map((dish) => {
            return (
              <div
                key={dish.id}
                className="flex items-center gap-4 bg-[#241e1b] border border-[#362e2a] rounded-[15px] px-5 py-3 mt-3 mx-6 hover:border-[#c59b27]/30 transition-all duration-300"
              >
                <h1 className="text-[#c59b27] font-serif font-black text-lg mr-2">{dish.id < 10 ? `0${dish.id}` : dish.id}</h1>
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-[48px] h-[48px] rounded-full object-cover border border-[#2d2520] p-0.5 bg-[#1c1613]"
                />
                <div>
                  <h1 className="text-[#f4ebe1] font-bold text-sm font-serif">{dish.name}</h1>
                  <p className="text-[#a89a90] text-xs mt-0.5">
                    Pedidos: <span className="text-[#f4ebe1] font-bold">{dish.numberOfOrders}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
