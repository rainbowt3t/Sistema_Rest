import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import OrderCard from "../components/orders/OrderCard";
import BackButton from "../components/shared/BackButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "../https/index";
import { enqueueSnackbar } from "notistack"

const Orders = () => {

  const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "Legacy_Pe | Pedidos"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData
  })

  if(isError) {
    enqueueSnackbar("Something went wrong!", {variant: "error"})
  }

  const filteredOrders = resData?.data.data.filter((order) => {
    if (status === "all") return true;
    if (status === "progress") return order.orderStatus === "In Progress";
    if (status === "ready") return order.orderStatus === "Ready";
    if (status === "completed") return order.orderStatus === "Completed";
    return true;
  }) || [];

  return (
    <section className="bg-transparent h-[calc(100vh-5rem)] overflow-hidden">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f4ebe1] text-2xl font-bold tracking-wider font-serif">
            Pedidos
          </h1>
        </div>
        <div className="flex items-center justify-around gap-4">
          <button onClick={() => setStatus("all")} className={`text-sm rounded-lg px-5 py-2 font-semibold font-serif transition-all duration-200 border ${status === "all" ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" : "text-[#a89a90] border-[#362e2a] hover:bg-[#241e1b] hover:text-[#f4ebe1]"}`}>
            Todos
          </button>
          <button onClick={() => setStatus("progress")} className={`text-sm rounded-lg px-5 py-2 font-semibold font-serif transition-all duration-200 border ${status === "progress" ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" : "text-[#a89a90] border-[#362e2a] hover:bg-[#241e1b] hover:text-[#f4ebe1]"}`}>
            En progreso ({resData?.data.data.filter(o => o.orderStatus === "In Progress").length || 0})
          </button>
          <button onClick={() => setStatus("ready")} className={`text-sm rounded-lg px-5 py-2 font-semibold font-serif transition-all duration-200 border ${status === "ready" ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" : "text-[#a89a90] border-[#362e2a] hover:bg-[#241e1b] hover:text-[#f4ebe1]"}`}>
            Listos ({resData?.data.data.filter(o => o.orderStatus === "Ready").length || 0})
          </button>
          <button onClick={() => setStatus("completed")} className={`text-sm rounded-lg px-5 py-2 font-semibold font-serif transition-all duration-200 border ${status === "completed" ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" : "text-[#a89a90] border-[#362e2a] hover:bg-[#241e1b] hover:text-[#f4ebe1]"}`}>
            Completados ({resData?.data.data.filter(o => o.orderStatus === "Completed").length || 0})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 px-16 py-4 h-[calc(100vh-12rem)] overflow-y-auto pb-24 scrollbar-hide">
        {
          filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              return <OrderCard key={order._id} order={order} />
            })
          ) : <p className="col-span-3 text-[#a89a90] text-center py-10 font-serif">No hay pedidos disponibles en este estado</p>
        }
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
