import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  verifyPaymentRazorpay,
} from "../../https/index";
import { enqueueSnackbar } from "notistack";
import { useMutation } from "@tanstack/react-query";
import { removeAllItems } from "../../redux/slices/cartSlice";
import { removeCustomer } from "../../redux/slices/customerSlice";
import Invoice from "../invoice/Invoice";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const Bill = () => {
  const dispatch = useDispatch();

  const customerData = useSelector((state) => state.customer);
  const cartData = useSelector((state) => state.cart);
  const total = useSelector(getTotalPrice);
  const taxRate = 5.25;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState();
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockPaymentLoading, setMockPaymentLoading] = useState(false);
  const [paymentMethodDetail, setPaymentMethodDetail] = useState("card"); // card, yape, plin

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "warning",
      });

      return;
    }

    if (paymentMethod === "Online") {
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKey || razorpayKey === "undefined" || razorpayKey === "") {
        console.log("💳 No Razorpay Key found. Opening mock payment simulation.");
        setShowMockModal(true);
        return;
      }

      try {
        const reqData = {
          amount: totalPriceWithTax.toFixed(2),
        };

        const { data } = await createOrderRazorpay(reqData);

        if (data.isMock) {
          console.log("💳 Backend returned mock flag. Opening mock payment simulation.");
          setShowMockModal(true);
          return;
        }

        // Load Razorpay script
        const res = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
          enqueueSnackbar("Razorpay SDK failed to load. Using simulated payment.", {
            variant: "info",
          });
          setShowMockModal(true);
          return;
        }

        const options = {
          key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
          amount: data.order.amount,
          currency: data.order.currency,
          name: "RESTRO",
          description: "Secure Payment for Your Meal",
          order_id: data.order.id,
          handler: async function (response) {
            const verification = await verifyPaymentRazorpay(response);
            console.log(verification);
            enqueueSnackbar(verification.data.message, { variant: "success" });

            // Place the order
            const orderData = {
              customerDetails: {
                name: customerData.customerName,
                phone: customerData.customerPhone,
                guests: customerData.guests,
              },
              orderStatus: "In Progress",
              bills: {
                total: total,
                tax: tax,
                totalWithTax: totalPriceWithTax,
              },
              items: cartData,
              table: customerData.table.tableId,
              paymentMethod: paymentMethod,
              paymentData: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
              },
            };

            setTimeout(() => {
              orderMutation.mutate(orderData);
            }, 1500);
          },
          prefill: {
            name: customerData.name,
            email: "",
            contact: customerData.phone,
          },
          theme: { color: "#025cca" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.log(error);
        enqueueSnackbar("Razorpay failed. Using simulated payment instead.", {
          variant: "info",
        });
        setShowMockModal(true);
      }
    } else {
      // Place the order
      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: {
          total: total,
          tax: tax,
          totalWithTax: totalPriceWithTax,
        },
        items: cartData,
        table: customerData.table.tableId,
        paymentMethod: paymentMethod,
      };
      orderMutation.mutate(orderData);
    }
  };

  const handleConfirmMockPayment = () => {
    setMockPaymentLoading(true);
    
    // Simulate 2 seconds processing
    setTimeout(() => {
      setMockPaymentLoading(false);
      setShowMockModal(false);
      
      enqueueSnackbar("¡Pago simulado verificado con éxito!", { variant: "success" });
      
      // Place the order
      const orderData = {
        customerDetails: {
          name: customerData.customerName,
          phone: customerData.customerPhone,
          guests: customerData.guests,
        },
        orderStatus: "In Progress",
        bills: {
          total: total,
          tax: tax,
          totalWithTax: totalPriceWithTax,
        },
        items: cartData,
        table: customerData.table.tableId,
        paymentMethod: `Online (Simulado - ${paymentMethodDetail === 'card' ? 'Tarjeta' : paymentMethodDetail === 'yape' ? 'Yape' : 'Plin'})`,
        paymentData: {
          razorpay_order_id: `mock_order_${Date.now()}`,
          razorpay_payment_id: `mock_pay_${Math.random().toString(36).substring(2, 11)}`,
        },
      };
      
      orderMutation.mutate(orderData);
    }, 2000);
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      console.log(data);

      setOrderInfo(data);

      // Update Table
      const tableData = {
        status: "Booked",
        orderId: data._id,
        tableId: data.table,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar("Order Placed!", {
        variant: "success",
      });
      setShowInvoice(true);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const tableUpdateMutation = useMutation({
    mutationFn: (reqData) => updateTable(reqData),
    onSuccess: (resData) => {
      console.log(resData);
      dispatch(removeCustomer());
      dispatch(removeAllItems());
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Platos ({cartData.length})
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          S/ {total.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">Impuesto (5.25%)</p>
        <h1 className="text-[#f5f5f5] text-md font-bold">S/ {tax.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#ababab] font-medium mt-2">
          Total con Impuesto
        </p>
        <h1 className="text-[#f5f5f5] text-md font-bold">
          S/ {totalPriceWithTax.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center gap-3 px-5 mt-4">
        <button
          onClick={() => setPaymentMethod("Cash")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold transition-all ${
            paymentMethod === "Cash" ? "bg-[#7a1f1f] text-white border border-[#b33a3a]" : "border border-transparent hover:bg-[#262626]"
          }`}
        >
          Efectivo
        </button>
        <button
          onClick={() => setPaymentMethod("Online")}
          className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-semibold transition-all ${
            paymentMethod === "Online" ? "bg-[#7a1f1f] text-white border border-[#b33a3a]" : "border border-transparent hover:bg-[#262626]"
          }`}
        >
          Tarjeta / QR
        </button>
      </div>

      <div className="flex items-center gap-3 px-5 mt-4">
        <button className="bg-[#3f3f3f] hover:bg-[#4f4f4f] px-4 py-3 w-full rounded-lg text-[#f5f5f5] font-semibold text-base transition-all duration-300">
          Imprimir boleta
        </button>
        <button
          onClick={handlePlaceOrder}
          className="bg-[#b33a3a] hover:bg-[#922e2e] px-4 py-3 w-full rounded-lg text-white font-semibold text-base transition-all duration-300 shadow-md"
        >
          Confirmar pedido
        </button>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}

      {showMockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg max-w-md w-full p-6 text-white relative">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center justify-between">
              <span>🇵🇪 Simulación de Pago Seguro (Perú)</span>
              <button onClick={() => setShowMockModal(false)} className="text-[#ababab] hover:text-white text-2xl">&times;</button>
            </h2>
            
            {mockPaymentLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mb-4"></div>
                <p className="text-sm font-medium text-gray-300">Procesando pago simulado...</p>
                <p className="text-xs text-gray-500 mt-2">Conectando con la pasarela ficticia...</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#ababab] mb-4">
                  Este es un entorno de simulación. Puedes ingresar cualquier dato de prueba. No se realizará ningún cargo real.
                </p>
                
                <div className="bg-[#262626] p-3 rounded-lg mb-4 flex justify-between items-center border border-[#333]">
                  <span className="text-sm font-semibold">Total a pagar:</span>
                  <span className="text-lg font-bold text-[#b33a3a]">S/ {totalPriceWithTax.toFixed(2)}</span>
                </div>

                <div className="flex gap-1 mb-4 bg-[#262626] p-1 rounded">
                  <button
                    onClick={() => setPaymentMethodDetail("card")}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold transition ${paymentMethodDetail === "card" ? "bg-[#b33a3a] text-white" : "bg-transparent text-gray-400 hover:text-white"}`}
                  >
                    💳 Tarjeta
                  </button>
                  <button
                    onClick={() => setPaymentMethodDetail("yape")}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold transition ${paymentMethodDetail === "yape" ? "bg-[#7d1d7b] text-white" : "bg-transparent text-gray-400 hover:text-white"}`}
                  >
                    📱 Yape
                  </button>
                  <button
                    onClick={() => setPaymentMethodDetail("plin")}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-semibold transition ${paymentMethodDetail === "plin" ? "bg-[#14ccd8] text-black" : "bg-transparent text-gray-400 hover:text-white"}`}
                  >
                    🔵 Plin
                  </button>
                </div>

                {paymentMethodDetail === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Número de Tarjeta (Falso)</label>
                      <input 
                        type="text" 
                        placeholder="4557 1234 5678 9012" 
                        maxLength={19}
                        className="w-full bg-[#262626] border border-[#3a3a3a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b33a3a]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">Vencimiento</label>
                        <input 
                          type="text" 
                          placeholder="MM/AA" 
                          maxLength={5}
                          className="w-full bg-[#262626] border border-[#3a3a3a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b33a3a]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">CVV / CVC</label>
                        <input 
                          type="password" 
                          placeholder="***" 
                          maxLength={4}
                          className="w-full bg-[#262626] border border-[#3a3a3a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b33a3a]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Nombre del Titular</label>
                      <input 
                        type="text" 
                        placeholder="Juan Pérez" 
                        className="w-full bg-[#262626] border border-[#3a3a3a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b33a3a]"
                      />
                    </div>
                  </div>
                )}

                {(paymentMethodDetail === "yape" || paymentMethodDetail === "plin") && (
                  <div className="flex flex-col items-center py-2 space-y-3 text-center">
                    <div className="bg-white p-3 rounded-lg border border-[#333] shadow-md flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-200 border-2 border-black flex flex-wrap items-center justify-center p-1 rounded">
                        <span className="font-mono text-[8px] font-bold text-black tracking-tighter">QR {paymentMethodDetail.toUpperCase()} LEGACY_PE</span>
                      </div>
                      <span className="text-[10px] mt-1 font-bold text-gray-700">Yapear/Plinear a Legacy_Pe</span>
                    </div>
                    <p className="text-xs text-gray-400">Escanea el código QR ficticio e ingresa un número de teléfono y el código de operación ficticio.</p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <input 
                        type="text" 
                        placeholder="Celular (ej. 987654321)" 
                        className="w-full bg-[#262626] border border-[#3a3a3a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b33a3a]"
                      />
                      <input 
                        type="text" 
                        placeholder="Cód. Operación" 
                        className="w-full bg-[#262626] border border-[#3a3a3a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#b33a3a]"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setShowMockModal(false)}
                    className="flex-1 py-2.5 px-3 rounded bg-transparent border border-[#3a3a3a] hover:bg-[#262626] text-xs font-semibold transition text-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmMockPayment}
                    className="flex-1 py-2.5 px-3 rounded bg-[#b33a3a] hover:bg-[#922e2e] text-white text-xs font-semibold transition"
                  >
                    Confirmar Pago Falso
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Bill;
