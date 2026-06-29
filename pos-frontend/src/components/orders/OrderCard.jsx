import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { formatDateAndTime, getAvatarName } from "../../utils/index";

const getStatusLabel = (status) => {
  const labels = {
    "In Progress": "En progreso",
    "Ready": "Listo",
    "Completed": "Completado"
  };
  return labels[status] || status;
};

const OrderCard = ({ key, order }) => {
  console.log(order);
  return (
    <div key={key} className="w-[500px] bg-[#262626] p-4 rounded-lg mb-4 border border-[#2a2a2a]">
      <div className="flex items-center gap-5">
        <button className="bg-[#7a1f1f] text-white p-3 text-xl font-bold rounded-lg min-w-[50px]">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex items-center justify-between w-[100%]">
          <div className="flex flex-col items-start gap-1">
            <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">
              {order.customerDetails.name}
            </h1>
            <p className="text-[#ababab] text-sm">#{Math.floor(new Date(order.orderDate).getTime())} / Salón</p>
            <p className="text-[#ababab] text-sm flex items-center">Mesa <FaLongArrowAltRight className="text-[#ababab] mx-2 inline" /> {order.table.tableNo}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {order.orderStatus === "Ready" ? (
              <>
                <p className="text-green-500 bg-[#2e4a40] px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <FaCheckDouble className="inline mr-1.5" /> {getStatusLabel(order.orderStatus)}
                </p>
                <p className="text-[#ababab] text-xs">
                  <FaCircle className="inline mr-1.5 text-green-500 text-[10px]" /> Listo para servir
                </p>
              </>
            ) : order.orderStatus === "Completed" ? (
              <>
                <p className="text-blue-400 bg-[#1d2569] px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <FaCheckDouble className="inline mr-1.5" /> Entregado
                </p>
                <p className="text-[#ababab] text-xs">
                  <FaCircle className="inline mr-1.5 text-blue-400 text-[10px]" /> Pedido completado
                </p>
              </>
            ) : (
              <>
                <p className="text-[#b33a3a] bg-[#421d1d] px-2.5 py-1 rounded-lg text-xs font-semibold">
                  <FaCircle className="inline mr-1.5 text-[9px]" /> {getStatusLabel(order.orderStatus)}
                </p>
                <p className="text-[#ababab] text-xs">
                  <FaCircle className="inline mr-1.5 text-[#b33a3a] text-[10px]" /> Preparando el pedido
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 text-[#ababab] text-xs">
        <p>{formatDateAndTime(order.orderDate)}</p>
        <p>{order.items.length} {order.items.length === 1 ? 'Plato' : 'Platos'}</p>
      </div>
      <hr className="w-full mt-4 border-t border-[#3a3a3a]" />
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-[#f5f5f5] text-lg font-semibold">Total</h1>
        <p className="text-[#f5f5f5] text-lg font-semibold">S/ {order.bills.totalWithTax.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrderCard;
