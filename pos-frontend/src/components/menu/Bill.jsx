import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTotalPrice } from "../../redux/slices/cartSlice";
import {
  addOrder,
  createOrderRazorpay,
  updateTable,
  verifyPaymentRazorpay,
  updateOrderStatus,
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
  const userData = useSelector((state) => state.user);
  const total = useSelector(getTotalPrice);
  const taxRate = 18;
  const tax = (total * taxRate) / 100;
  const totalPriceWithTax = total + tax;

  const [paymentMethod, setPaymentMethod] = useState();
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderInfo, setOrderInfo] = useState();
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockPaymentLoading, setMockPaymentLoading] = useState(false);
  const [paymentMethodDetail, setPaymentMethodDetail] = useState("card"); // card, yape, plin

  const isExistingOrder = customerData.orderId && customerData.orderId.length === 24 && /^[0-9a-fA-F]{24}$/.test(customerData.orderId);
  const isWaiter = userData.role === "Waiter";

  const handlePlaceOrder = async () => {
    // Waiter flow: Register order as "Pendiente" without requiring a payment method selection.
    if (isWaiter) {
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
        paymentMethod: "Pendiente",
      };

      if (isExistingOrder) {
        updateOrderMutation.mutate({
          orderId: customerData.orderId,
          payload: { items: cartData, bills: orderData.bills }
        });
      } else {
        orderMutation.mutate(orderData);
      }
      return;
    }

    // Cashier or Admin flow: Require selecting a payment method
    if (!paymentMethod) {
      enqueueSnackbar("¡Por favor, selecciona un método de pago!", {
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

            if (isExistingOrder) {
              updateOrderMutation.mutate({
                orderId: customerData.orderId,
                payload: {
                  orderStatus: "Completed",
                  paymentMethod: "Tarjeta (Razorpay)",
                  paymentData: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                  },
                  bills: { total, tax, totalWithTax: totalPriceWithTax },
                  items: cartData
                }
              });
            } else {
              const orderData = {
                customerDetails: {
                  name: customerData.customerName,
                  phone: customerData.customerPhone,
                  guests: customerData.guests,
                },
                orderStatus: "Completed",
                bills: {
                  total: total,
                  tax: tax,
                  totalWithTax: totalPriceWithTax,
                },
                items: cartData,
                table: customerData.table.tableId,
                paymentMethod: "Tarjeta (Razorpay)",
                paymentData: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                },
              };

              setTimeout(() => {
                orderMutation.mutate(orderData);
              }, 1500);
            }
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
      // Cash payment
      if (isExistingOrder) {
        updateOrderMutation.mutate({
          orderId: customerData.orderId,
          payload: {
            orderStatus: "Completed",
            paymentMethod: "Efectivo",
            bills: { total, tax, totalWithTax: totalPriceWithTax },
            items: cartData
          }
        });
      } else {
        const orderData = {
          customerDetails: {
            name: customerData.customerName,
            phone: customerData.customerPhone,
            guests: customerData.guests,
          },
          orderStatus: "Completed",
          bills: {
            total: total,
            tax: tax,
            totalWithTax: totalPriceWithTax,
          },
          items: cartData,
          table: customerData.table.tableId,
          paymentMethod: "Efectivo",
        };
        orderMutation.mutate(orderData);
      }
    }
  };

  const handleConfirmMockPayment = () => {
    setMockPaymentLoading(true);
    
    // Simulate 2 seconds processing
    setTimeout(() => {
      setMockPaymentLoading(false);
      setShowMockModal(false);
      
      enqueueSnackbar("¡Pago verificado con éxito!", { variant: "success" });
      
      const paymentDetail = `Online (Simulado - ${paymentMethodDetail === 'card' ? 'Tarjeta' : paymentMethodDetail === 'yape' ? 'Yape' : 'Plin'})`;
      const paymentDataPayload = {
        razorpay_order_id: `mock_order_${Date.now()}`,
        razorpay_payment_id: `mock_pay_${Math.random().toString(36).substring(2, 11)}`,
      };

      if (isExistingOrder) {
        updateOrderMutation.mutate({
          orderId: customerData.orderId,
          payload: {
            orderStatus: "Completed",
            paymentMethod: paymentDetail,
            paymentData: paymentDataPayload,
            bills: { total, tax, totalWithTax: totalPriceWithTax },
            items: cartData
          }
        });
      } else {
        const orderData = {
          customerDetails: {
            name: customerData.customerName,
            phone: customerData.customerPhone,
            guests: customerData.guests,
          },
          orderStatus: "Completed",
          bills: {
            total: total,
            tax: tax,
            totalWithTax: totalPriceWithTax,
          },
          items: cartData,
          table: customerData.table.tableId,
          paymentMethod: paymentDetail,
          paymentData: paymentDataPayload
        };
        
        orderMutation.mutate(orderData);
      }
    }, 2000);
  };

  const orderMutation = useMutation({
    mutationFn: (reqData) => addOrder(reqData),
    onSuccess: (resData) => {
      const { data } = resData.data;
      console.log(data);

      setOrderInfo(data);

      // Waiters book the table; cashiers/admins complete it right away, keeping it available!
      const tableData = {
        status: isWaiter ? "Booked" : "Available",
        orderId: isWaiter ? data._id : null,
        tableId: data.table,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar(isWaiter ? "¡Comanda registrada en cocina!" : "¡Venta realizada con éxito!", {
        variant: "success",
      });
      setShowInvoice(true);
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Error al procesar la comanda.", { variant: "error" });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, payload }) => updateOrderStatus(orderId, payload),
    onSuccess: (resData) => {
      const { data } = resData.data;
      console.log(data);

      setOrderInfo(data);

      // Update Table to Available since order is now Completed!
      const tableData = {
        status: isWaiter ? "Booked" : "Available",
        orderId: isWaiter ? data._id : null,
        tableId: data.table,
      };

      setTimeout(() => {
        tableUpdateMutation.mutate(tableData);
      }, 1500);

      enqueueSnackbar(isWaiter ? "¡Comanda actualizada!" : "¡Cobranza completada y mesa liberada!", {
        variant: "success",
      });
      setShowInvoice(true);
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Error al actualizar la comanda.", { variant: "error" });
    }
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
        <p className="text-xs text-[#a89a90] font-semibold mt-2">
          Platos ({cartData.length})
        </p>
        <h1 className="text-[#f4ebe1] text-md font-bold font-serif">
          S/ {total.toFixed(2)}
        </h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2">
        <p className="text-xs text-[#a89a90] font-semibold mt-2">Impuesto (5.25%)</p>
        <h1 className="text-[#f4ebe1] text-md font-bold font-serif">S/ {tax.toFixed(2)}</h1>
      </div>
      <div className="flex items-center justify-between px-5 mt-2 border-t border-[#2d2520] pt-2">
        <p className="text-xs text-[#a89a90] font-semibold">
          Total con Impuesto
        </p>
        <h1 className="text-[#c59b27] text-lg font-extrabold font-serif">
          S/ {totalPriceWithTax.toFixed(2)}
        </h1>
      </div>
      {!isWaiter && (
        <div className="flex items-center gap-3 px-5 mt-4">
          <button
            onClick={() => setPaymentMethod("Cash")}
            className={`bg-[#241e1b] px-4 py-3 w-full rounded-lg text-[#a89a90] font-semibold border border-[#362e2a] hover:bg-[#322824] transition-all ${
              paymentMethod === "Cash" ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" : ""
            }`}
          >
            Efectivo
          </button>
          <button
            onClick={() => setPaymentMethod("Online")}
            className={`bg-[#241e1b] px-4 py-3 w-full rounded-lg text-[#a89a90] font-semibold border border-[#362e2a] hover:bg-[#322824] transition-all ${
              paymentMethod === "Online" ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" : ""
            }`}
          >
            Tarjeta / QR
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 px-5 mt-4">
        <button className="bg-[#241e1b] border border-[#362e2a] hover:bg-[#322824] px-4 py-3 w-full rounded-lg text-[#f4ebe1] font-bold text-sm transition-all duration-300 font-serif tracking-wider">
          Imprimir boleta
        </button>
        <button
          onClick={handlePlaceOrder}
          className="bg-[#b9472a] hover:bg-[#a63d22] px-4 py-3 w-full rounded-lg text-[#f4ebe1] font-bold text-sm transition-all duration-300 shadow-md hover:shadow-[0_4px_16px_rgba(185,71,42,0.35)] font-serif tracking-wider"
        >
          {isWaiter ? "Registrar Comanda" : isExistingOrder ? "Completar Cobranza" : "Confirmar Pago"}
        </button>
      </div>

      {showInvoice && (
        <Invoice orderInfo={orderInfo} setShowInvoice={setShowInvoice} />
      )}

      {showMockModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-[3px] flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#1c1613] border border-[#c59b27]/30 rounded-2xl max-w-md w-full p-6 text-[#f4ebe1] relative shadow-[0_8px_32px_0_rgba(197,155,39,0.2)]">
            <h2 className="text-lg font-bold text-[#c59b27] mb-4 flex items-center justify-between border-b border-[#2d2520] pb-2 font-serif tracking-wide">
              <span>🇵🇪 Pago Seguro (Legacy_Pe)</span>
              <button onClick={() => setShowMockModal(false)} className="text-[#a89a90] hover:text-[#f4ebe1] text-2xl leading-none">&times;</button>
            </h2>
            
            {mockPaymentLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c59b27] mb-4"></div>
                <p className="text-sm font-medium text-[#f4ebe1]/80">Procesando pago...</p>
                <p className="text-xs text-[#a89a90] mt-2">Conectando con la pasarela...</p>
              </div>
            ) : (
              <>
                <p className="text-[11px] text-[#a89a90] mb-4 leading-relaxed">
                  Entorno de simulación de cobro. Elige el medio de pago ficticio para completar el pedido.
                </p>
                
                <div className="bg-[#241e1b] p-3 rounded-lg mb-4 flex justify-between items-center border border-[#362e2a]">
                  <span className="text-sm font-bold text-[#a89a90]">Total a pagar:</span>
                  <span className="text-lg font-bold text-[#c59b27] font-serif">S/ {totalPriceWithTax.toFixed(2)}</span>
                </div>

                <div className="flex gap-1 mb-4 bg-[#241e1b] border border-[#362e2a] p-1 rounded-lg">
                  <button
                    onClick={() => setPaymentMethodDetail("card")}
                    className={`flex-1 py-2 px-2 rounded-md text-xs font-bold transition-all ${paymentMethodDetail === "card" ? "bg-[#b9472a] text-[#f4ebe1] shadow-sm" : "bg-transparent text-[#a89a90] hover:text-[#f4ebe1]"}`}
                  >
                    💳 Tarjeta
                  </button>
                  <button
                    onClick={() => setPaymentMethodDetail("yape")}
                    className={`flex-1 py-2 px-2 rounded-md text-xs font-bold transition-all ${paymentMethodDetail === "yape" ? "bg-[#7d1d7b] text-[#f4ebe1] shadow-sm" : "bg-transparent text-[#a89a90] hover:text-[#f4ebe1]"}`}
                  >
                    📱 Yape
                  </button>
                  <button
                    onClick={() => setPaymentMethodDetail("plin")}
                    className={`flex-1 py-2 px-2 rounded-md text-xs font-bold transition-all ${paymentMethodDetail === "plin" ? "bg-[#0bafba] text-[#1c1613]" : "bg-transparent text-[#a89a90] hover:text-[#f4ebe1]"}`}
                  >
                    🔵 Plin
                  </button>
                </div>

                {paymentMethodDetail === "card" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-[#a89a90] mb-1">Número de Tarjeta (Falso)</label>
                      <input 
                        type="text" 
                        placeholder="4557 1234 5678 9012" 
                        maxLength={19}
                        className="w-full bg-[#241e1b] border border-[#362e2a] rounded px-3 py-2 text-sm text-[#f4ebe1] focus:outline-none focus:border-[#c59b27] placeholder-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-[#a89a90] mb-1">Vencimiento</label>
                        <input 
                          type="text" 
                          placeholder="MM/AA" 
                          maxLength={5}
                          className="w-full bg-[#241e1b] border border-[#362e2a] rounded px-3 py-2 text-sm text-[#f4ebe1] focus:outline-none focus:border-[#c59b27] placeholder-gray-700"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#a89a90] mb-1">CVV / CVC</label>
                        <input 
                          type="password" 
                          placeholder="***" 
                          maxLength={4}
                          className="w-full bg-[#241e1b] border border-[#362e2a] rounded px-3 py-2 text-sm text-[#f4ebe1] focus:outline-none focus:border-[#c59b27] placeholder-gray-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#a89a90] mb-1">Nombre del Titular</label>
                      <input 
                        type="text" 
                        placeholder="Juan Pérez" 
                        className="w-full bg-[#241e1b] border border-[#362e2a] rounded px-3 py-2 text-sm text-[#f4ebe1] focus:outline-none focus:border-[#c59b27] placeholder-gray-700"
                      />
                    </div>
                  </div>
                )}

                {(paymentMethodDetail === "yape" || paymentMethodDetail === "plin") && (
                  <div className="flex flex-col items-center py-2 space-y-3 text-center">
                    <div className="bg-[#f4ebe1] p-3 rounded-xl border border-[#2d2520] shadow-md flex flex-col items-center">
                      <div className="w-24 h-24 bg-gray-200 border-2 border-black flex flex-wrap items-center justify-center p-1 rounded">
                        <span className="font-mono text-[8px] font-bold text-black tracking-tighter">QR {paymentMethodDetail.toUpperCase()} LEGACY_PE</span>
                      </div>
                      <span className="text-[10px] mt-1 font-bold text-gray-700">Yapear/Plinear a Legacy_Pe</span>
                    </div>
                    <p className="text-[11px] text-[#a89a90] leading-relaxed">Escanea el código QR ficticio e ingresa un número de teléfono y el código de operación ficticio.</p>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <input 
                        type="text" 
                        placeholder="Celular (ej. 987654321)" 
                        className="w-full bg-[#241e1b] border border-[#362e2a] rounded px-3 py-2 text-sm text-[#f4ebe1] focus:outline-none focus:border-[#c59b27] placeholder-gray-700"
                      />
                      <input 
                        type="text" 
                        placeholder="Cód. Operación" 
                        className="w-full bg-[#241e1b] border border-[#362e2a] rounded px-3 py-2 text-sm text-[#f4ebe1] focus:outline-none focus:border-[#c59b27] placeholder-gray-700"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setShowMockModal(false)}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-transparent border border-[#362e2a] hover:bg-[#241e1b] text-xs font-bold transition-all text-[#a89a90] hover:text-[#f4ebe1]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmMockPayment}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-[#b9472a] hover:bg-[#a63d22] text-[#f4ebe1] text-xs font-bold font-serif tracking-wide shadow-md hover:shadow-[0_4px_16px_rgba(185,71,42,0.3)] transition-all duration-300"
                  >
                    Confirmar Pago
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
