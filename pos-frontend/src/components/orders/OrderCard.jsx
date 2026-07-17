import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus, updateTable } from "../../https/index";
import { enqueueSnackbar } from "notistack";

const getStatusLabel = (status) => {
  const labels = {
    "In Progress": "En progreso",
    "Ready": "Listo",
    "Completed": "Completado"
  };
  return labels[status] || status;
};

const OrderCard = ({ order }) => {
  console.log(order);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newStatus) => {
      await updateOrderStatus(order._id, { orderStatus: newStatus });
      if (newStatus === "Completed" && order.table?._id) {
        await updateTable({
          status: "Available",
          orderId: null,
          tableId: order.table._id
        });
      }
    },
    onSuccess: (_, newStatus) => {
      enqueueSnackbar(
        newStatus === "Completed" 
          ? "¡Pedido completado y mesa liberada!" 
          : "¡Pedido marcado como listo!", 
        { variant: "success" }
      );
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("No se pudo actualizar el estado del pedido.", { variant: "error" });
    }
  });

  const handleUpdateStatus = (status) => {
    mutation.mutate(status);
  };

  return (
    <div className="w-full bg-[#1c1613] p-4 rounded-xl mb-4 border border-[#2d2520] hover:border-[#c59b27]/30 transition-all duration-300">
      <div className="flex items-center gap-5">
        <button className="bg-[#b9472a] text-[#f4ebe1] p-3 text-xl font-bold font-serif rounded-lg min-w-[50px]">
          {getAvatarName(order.customerDetails?.name || "CL")}
        </button>
        <div className="flex items-center justify-between w-[100%]">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f4ebe1] text-lg font-bold font-serif tracking-wide">
              {order.customerDetails?.name || "Cliente"}
            </h1>
            <p className="text-[#a89a90] text-xs">#{Math.floor(new Date(order.orderDate).getTime())} / Salón</p>
            <p className="text-[#a89a90] text-xs flex items-center">
              Mesa <FaLongArrowAltRight className="text-[#a89a90] mx-2 inline" /> {order.table?.tableNo || "N/A"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-[#c59b27] bg-[#241e1b] border border-[#c59b27]/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <FaCheckDouble className="inline mr-1.5" /> {getStatusLabel(order.orderStatus)}
                </p>
                <p className="text-[#a89a90] text-xs">
                  <FaCircle className="inline mr-1.5 text-[#c59b27] text-[10px]" /> Listo para servir
                </p>
              </>
            ) : order.orderStatus === "Completed" ? (
              <>
                <p className="text-emerald-400 bg-[#162a21] border border-emerald-400/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <FaCheckDouble className="inline mr-1.5" /> Entregado
                </p>
                <p className="text-[#a89a90] text-xs">
                  <FaCircle className="inline mr-1.5 text-emerald-400 text-[10px]" /> Pedido completado
                </p>
              </>
            ) : (
              <>
                <p className="text-[#b9472a] bg-[#3a201b] border border-[#b9472a]/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <FaCircle className="inline mr-1.5 text-[9px]" /> {getStatusLabel(order.orderStatus)}
                </p>
                <p className="text-[#a89a90] text-xs">
                  <FaCircle className="inline mr-1.5 text-[#b9472a] text-[10px]" /> Preparando el pedido
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 text-[#a89a90] text-xs">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} {order.items.length === 1 ? 'Plato' : 'Platos'}</p>
      </div>
      <hr className="w-full mt-4 border-t border-[#2d2520]" />
      
      {order.orderStatus === "In Progress" && (
        <button
          onClick={() => handleUpdateStatus("Ready")}
          className="w-full mt-3 bg-[#c59b27] hover:bg-[#b0881f] text-[#1c1613] rounded-lg py-2 font-serif font-bold text-xs tracking-wider transition-all duration-300 shadow-md"
        >
          Marcar como Listo
        </button>
      )}
      {order.orderStatus === "Ready" && (
        <button
          onClick={() => handleUpdateStatus("Completed")}
          className="w-full mt-3 bg-[#b9472a] hover:bg-[#a63d22] text-[#f4ebe1] rounded-lg py-2 font-serif font-bold text-xs tracking-wider transition-all duration-300 shadow-md"
        >
          Marcar como Entregado / Completado
        </button>
      )}

      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f4ebe1] text-lg font-bold font-serif">Total</h1>
        <p className="text-[#c59b27] text-lg font-bold font-serif">S/ {order.bills.totalWithTax.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderCard;
