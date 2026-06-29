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
      <div className="bg-[#1a1a1a] w-full h-[450px] rounded-lg border border-[#2a2a2a]">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
            Pedidos Recientes
          </h1>
          <a href="" className="text-[#b33a3a] text-sm font-semibold hover:underline">
            Ver todos
          </a>
        </div>

        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[15px] px-6 py-4 mx-6 border border-[#2a2a2a]">
          <FaSearch className="text-[#ababab]" />
          <input
            type="text"
            placeholder="Buscar pedidos recientes"
            className="bg-[#1f1f1f] outline-none text-[#f5f5f5] w-full placeholder-gray-500"
          />
        </div>

        {/* Order list */}
        <div className="mt-4 px-6 overflow-y-scroll h-[300px] scrollbar-hide">
          {resData?.data.data.length > 0 ? (
            resData.data.data.map((order) => {
              return <OrderList key={order._id} order={order} />;
            })
          ) : (
            <p className="col-span-3 text-gray-500 text-center py-10">No hay pedidos registrados</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
