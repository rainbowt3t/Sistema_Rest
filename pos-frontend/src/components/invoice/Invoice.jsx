import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";

const Invoice = ({ orderInfo, setShowInvoice }) => {
  const invoiceRef = useRef(null);
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
            <html>
              <head>
                <title>Boleta de Venta - Legacy_Pe</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                  .receipt-container { width: 300px; border: 1px solid #ddd; padding: 10px; }
                  h2 { text-align: center; margin-bottom: 5px; }
                  p { margin: 5px 0; }
                  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                  th, td { text-align: left; padding: 4px 0; }
                </style>
              </head>
              <body>
                ${printContent}
              </body>
            </html>
          `);

    WinPrint.document.close();
    WinPrint.focus();
    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-[400px]">
        {/* Receipt Content for Printing */}

        <div ref={invoiceRef} className="p-4 text-gray-800">
          {/* Receipt Header */}
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="w-12 h-12 border-8 border-green-500 rounded-full flex items-center justify-center shadow-lg bg-green-500"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="text-2xl"
              >
                <FaCheck className="text-white" />
              </motion.span>
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-center mb-1 text-gray-900">Legacy_Pe</h2>
          <h3 className="text-md font-semibold text-center mb-2 text-gray-700">Boleta de Venta</h3>
          <p className="text-gray-500 text-center text-xs">¡Gracias por su preferencia!</p>

          {/* Order Details */}

          <div className="mt-4 border-t pt-4 text-xs text-gray-700 space-y-1">
            <p>
              <strong>ID del Pedido:</strong>{" "}
              {Math.floor(new Date(orderInfo.orderDate).getTime())}
            </p>
            <p>
              <strong>Cliente:</strong> {orderInfo.customerDetails.name}
            </p>
            <p>
              <strong>Teléfono:</strong> {orderInfo.customerDetails.phone}
            </p>
            <p>
              <strong>Comensales:</strong> {orderInfo.customerDetails.guests}
            </p>
          </div>

          {/* Items Summary */}

          <div className="mt-4 border-t pt-4">
            <h3 className="text-xs font-semibold text-gray-900 mb-2">Detalle del Pedido</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              {orderInfo.items.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>S/ {item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bills Summary */}

          <div className="mt-4 border-t pt-4 text-xs space-y-1">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>S/ {orderInfo.bills.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Impuesto (5.25%):</span>
              <span>S/ {orderInfo.bills.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-gray-900 border-t pt-1 mt-1">
              <span>Total General:</span>
              <span>S/ {orderInfo.bills.totalWithTax.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}

          <div className="mb-2 mt-4 text-[10px] text-gray-500 border-t pt-2 space-y-0.5">
            {orderInfo.paymentMethod === "Cash" ? (
              <p>
                <strong>Método de Pago:</strong> Efectivo
              </p>
            ) : (
              <>
                <p>
                  <strong>Método de Pago:</strong> Pago en Línea (Simulado)
                </p>
                <p>
                  <strong>ID Orden Banco:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_order_id}
                </p>
                <p>
                  <strong>ID Transacción Banco:</strong>{" "}
                  {orderInfo.paymentData?.razorpay_payment_id}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-4 border-t pt-2">
          <button
            onClick={handlePrint}
            className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-4 py-2"
          >
            Imprimir boleta
          </button>
          <button
            onClick={() => setShowInvoice(false)}
            className="text-red-600 hover:text-red-800 text-xs font-semibold px-4 py-2"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
