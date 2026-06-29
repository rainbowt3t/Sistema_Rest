import React from "react";
import { GrUpdate } from "react-icons/gr";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { getOrders, updateOrderStatus } from "../../https/index";
import { formatDateAndTime } from "../../utils";

const RecentOrders = () => {
  const queryClient = useQueryClient();
  const handleStatusChange = ({orderId, orderStatus}) => {
    console.log(orderId)
    orderStatusUpdateMutation.mutate({orderId, orderStatus});
  };

  const orderStatusUpdateMutation = useMutation({
    mutationFn: ({orderId, orderStatus}) => updateOrderStatus({orderId, orderStatus}),
    onSuccess: (data) => {
      enqueueSnackbar("Order status updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["orders"]); // Refresh order list
    },
    onError: () => {
      enqueueSnackbar("Failed to update order status!", { variant: "error" });
    }
  })

  const { data: resData, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return await getOrders();
    },
    placeholderData: keepPreviousData,
  });

  if (isError) {
    enqueueSnackbar("¡Algo salió mal al cargar los pedidos recientes!", { variant: "error" });
  }

  return (
    <div className="container mx-auto bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] shadow-lg">
      <h2 className="text-[#f5f5f5] text-xl font-semibold mb-6">
        Pedidos Recientes
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[#f5f5f5] border-collapse">
          <thead className="bg-[#262626] text-[#ababab] border-b border-[#333]">
            <tr>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">ID Pedido</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Cliente</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Estado</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Fecha y Hora</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Platos</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Mesa</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Total</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-center">Método de Pago</th>
            </tr>
          </thead>
          <tbody>
            {resData?.data.data.map((order, index) => (
              <tr
                key={index}
                className="border-b border-[#2a2a2a] hover:bg-[#262626]/40 transition-colors"
              >
                <td className="p-4 text-sm font-mono">#{Math.floor(new Date(order.orderDate).getTime())}</td>
                <td className="p-4 text-sm font-semibold">{order.customerDetails.name}</td>
                <td className="p-4 text-sm">
                  <select
                    className={`bg-[#1a1a1a] border border-[#3a3a3a] p-2 rounded-lg focus:outline-none text-xs font-semibold ${
                      order.orderStatus === "Ready"
                        ? "text-green-400 border-green-500/30"
                        : order.orderStatus === "Completed"
                        ? "text-blue-400 border-blue-500/30"
                        : "text-[#b33a3a] border-[#b33a3a]/30"
                    }`}
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange({orderId: order._id, orderStatus: e.target.value})}
                  >
                    <option className="text-[#b33a3a] bg-[#1a1a1a]" value="In Progress">
                      En progreso
                    </option>
                    <option className="text-green-400 bg-[#1a1a1a]" value="Ready">
                      Listo
                    </option>
                    <option className="text-blue-400 bg-[#1a1a1a]" value="Completed">
                      Completado
                    </option>
                  </select>
                </td>
                <td className="p-4 text-sm text-[#ababab]">{formatDateAndTime(order.orderDate)}</td>
                <td className="p-4 text-sm">{order.items.length} {order.items.length === 1 ? 'plato' : 'platos'}</td>
                <td className="p-4 text-sm font-semibold">Mesa {order.table.tableNo}</td>
                <td className="p-4 text-sm font-bold text-[#f5f5f5]">S/ {order.bills.totalWithTax.toFixed(2)}</td>
                <td className="p-4 text-sm text-center">
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold ${order.paymentMethod === 'Cash' ? 'bg-[#262626] text-gray-300' : 'bg-[#1d2569] text-blue-300'}`}>
                    {order.paymentMethod === "Cash" ? "Efectivo" : "En Línea"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
