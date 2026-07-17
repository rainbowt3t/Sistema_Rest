import React from "react";
import { FaSearch } from "react-icons/fa";
import OrderList from "./OrderList";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders } from "../../https/index";

const RecentOrders = () => {
  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("¡Algo salió mal al cargar los pedidos!", { variant: "error" });
  }

  return (
    <div className="px-8 mt-6">
      <div className="bg-[#1c1613] w-full h-[450px] rounded-xl border border-[#2d2520] shadow-sm">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f4ebe1] text-base font-bold font-serif tracking-wide">
            Pedidos Recientes
          </h1>
          <a href="" className="text-[#c59b27] text-xs font-bold hover:text-[#b0881f] hover:underline transition-colors">
            Ver todos
          </a>
        </div>

        <div className="flex items-center gap-3 bg-[#241e1b] rounded-[15px] px-4 py-2.5 mx-6 border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
          <FaSearch className="text-[#a89a90] text-sm" />
          <input
            type="text"
            placeholder="Buscar pedidos recientes..."
            className="bg-transparent outline-none text-[#f4ebe1] w-full placeholder-gray-600 text-sm"
          />
        </div>

        {/* Order list */}
        <div className="mt-4 px-6 overflow-y-scroll h-[300px] scrollbar-hide">
          {resData?.data.data.length > 0 ? (
            resData.data.data.map((order) => {
              return <OrderList key={order._id} order={order} />;
            })
          ) : (
            <p className="col-span-3 text-[#a89a90] text-center py-10 text-xs">No hay pedidos registrados</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
