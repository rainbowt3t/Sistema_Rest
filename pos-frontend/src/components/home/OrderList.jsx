import React from "react";
import { FaCheckDouble, FaLongArrowAltRight } from "react-icons/fa";
import { FaCircle } from "react-icons/fa";
import { getAvatarName } from "../../utils/index";

const getStatusLabel = (status) => {
  const labels = {
    "In Progress": "En progreso",
    "Ready": "Listo",
    "Completed": "Completado"
  };
  return labels[status] || status;
};

const OrderList = ({ key, order }) => {
  return (
    <div key={key} className="flex items-center justify-between gap-5 mb-4 p-2.5 rounded-lg bg-[#1f1f1f]/50 border border-[#2a2a2a]/30 hover:border-[#b33a3a]/20 transition-all">
      <div className="flex items-center gap-3">
        <button className="bg-[#7a1f1f] text-white p-3 text-lg font-bold rounded-lg min-w-[45px]">
          {getAvatarName(order.customerDetails.name)}
        </button>
        <div className="flex flex-col items-start">
          <h1 className="text-[#f5f5f5] text-sm font-semibold tracking-wide truncate max-w-[120px]">
            {order.customerDetails.name}
          </h1>
          <p className="text-[#ababab] text-xs mt-0.5">{order.items.length} {order.items.length === 1 ? 'Plato' : 'Platos'}</p>
        </div>
      </div>

      <h1 className="text-[#b33a3a] font-semibold border border-[#b33a3a]/30 rounded-lg px-2.5 py-1 text-xs flex items-center bg-[#b33a3a]/5">
        Mesa <FaLongArrowAltRight className="text-[#ababab] mx-1.5 inline" />{" "}
        {order.table.tableNo}
      </h1>

      <div className="flex flex-col items-end">
        {order.orderStatus === "Ready" ? (
          <p className="text-green-500 bg-[#2e4a40] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center">
            <FaCheckDouble className="inline mr-1" /> Listo
          </p>
        ) : order.orderStatus === "Completed" ? (
          <p className="text-blue-400 bg-[#1d2569] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center">
            <FaCheckDouble className="inline mr-1" /> Entregado
          </p>
        ) : (
          <p className="text-[#b33a3a] bg-[#421d1d] px-2 py-0.5 rounded text-[11px] font-semibold flex items-center">
            <FaCircle className="inline mr-1 text-[8px]" /> {getStatusLabel(order.orderStatus)}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderList;
