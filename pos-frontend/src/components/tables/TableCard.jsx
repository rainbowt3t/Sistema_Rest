import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvatarName } from "../../utils"
import { useDispatch, useSelector } from "react-redux";
import { updateTable, setCustomer, loadActiveOrder } from "../../redux/slices/customerSlice";
import { loadCart } from "../../redux/slices/cartSlice";
import { FaLongArrowAltRight } from "react-icons/fa";
import Modal from "../shared/Modal";
import { enqueueSnackbar } from "notistack";

const TableCard = ({id, name, status, initials, seats, currentOrder}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const customerData = useSelector(state => state.customer);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerNameInput, setCustomerNameInput] = useState("");
  const [customerPhoneInput, setCustomerPhoneInput] = useState("");
  const [guestCount, setGuestCount] = useState(1);

  const increment = () => {
    if(guestCount >= seats) {
      enqueueSnackbar(`La capacidad máxima de la Mesa ${name} es de ${seats} personas.`, { variant: "info" });
      return;
    }
    setGuestCount((prev) => prev + 1);
  }
  const decrement = () => {
    if(guestCount <= 1) return;
    setGuestCount((prev) => prev - 1);
  }

  const handleClick = () => {
    if (status === "Booked") {
      if (!currentOrder) {
        enqueueSnackbar("Error: No se encontró la comanda activa de esta mesa.", { variant: "error" });
        return;
      }
      
      // Load active order details into Redux
      const { customerDetails, items, _id } = currentOrder;
      dispatch(loadActiveOrder({
        orderId: _id,
        name: customerDetails.name,
        phone: customerDetails.phone,
        guests: customerDetails.guests,
        table: { tableId: id, tableNo: name }
      }));

      // Load cart items
      const cartItems = items.map(item => ({
        id: item.id || item._id,
        name: item.name,
        pricePerQuantity: item.pricePerQuantity,
        quantity: item.quantity,
        price: item.price
      }));
      dispatch(loadCart(cartItems));

      navigate(`/menu`);
      return;
    }

    // If table is free:
    if (customerData.customerName && customerData.customerName.trim() !== "") {
      const table = { tableId: id, tableNo: name }
      dispatch(updateTable({table}));
      navigate(`/menu`);
    } else {
      setGuestCount(Math.min(2, seats));
      setIsModalOpen(true);
    }
  };

  const handleRegisterCustomer = () => {
    if (!customerNameInput || customerNameInput.trim() === "") {
      enqueueSnackbar("Por favor, ingresa el nombre del cliente", { variant: "warning" });
      return;
    }
    if (!customerPhoneInput || customerPhoneInput.toString().length < 9) {
      enqueueSnackbar("Por favor, ingresa un teléfono válido (mínimo 9 dígitos)", { variant: "warning" });
      return;
    }

    dispatch(setCustomer({
      name: customerNameInput,
      phone: customerPhoneInput,
      guests: guestCount
    }));

    const table = { tableId: id, tableNo: name }
    dispatch(updateTable({table}));

    setIsModalOpen(false);
    navigate(`/menu`);
  };

  return (
    <>
      <div 
        onClick={handleClick} 
        className={`w-full bg-[#1c1613] border border-[#2d2520] hover:border-[#c59b27] hover:shadow-[0_4px_16px_rgba(197,155,39,0.08)] p-5 rounded-xl cursor-pointer transition-all duration-300 flex flex-col justify-between h-[180px] ${
          status === "Booked" ? "hover:border-[#c59b27]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-[#f4ebe1] text-base font-bold font-serif flex items-center gap-1.5">
            Mesa <FaLongArrowAltRight className="text-[#a89a90] text-xs inline" /> <span className="text-[#c59b27]">{name}</span>
          </h1>
          <p className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            status === "Booked" 
              ? "text-[#b9472a] bg-[#3a201b] border border-[#b9472a]/20" 
              : "bg-[#241e1b] border border-[#c59b27]/30 text-[#c59b27]"
          }`}>
            {status === "Booked" ? "Ocupada" : "Libre"}
          </p>
        </div>
        
        <div className="flex items-center justify-center my-2">
          <div 
            className="text-[#f4ebe1] rounded-full w-12 h-12 flex items-center justify-center text-sm font-bold font-serif shadow-inner border border-[#362e2a]"
            style={{ backgroundColor: initials ? "#b9472a" : "#241e1b" }}
          >
            {getAvatarName(initials) || "—"}
          </div>
        </div>
        
        <div className="border-t border-[#2d2520]/60 pt-2 flex items-center justify-between">
          <p className="text-[#a89a90] text-[10px] uppercase font-bold tracking-wider">Asientos</p>
          <span className="text-[#f4ebe1] text-xs font-bold font-serif bg-[#241e1b] px-2 py-0.5 rounded border border-[#362e2a]">{seats}</span>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Abrir Mesa ${name}`}>
        <div className="space-y-4 text-[#f4ebe1]">
          <div>
            <label className="block text-[#a89a90] mb-2 text-xs font-semibold uppercase tracking-wider">Nombre del cliente</label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] transition-all">
              <input value={customerNameInput} onChange={(e) => setCustomerNameInput(e.target.value)} type="text" placeholder="Ingresa el nombre" className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600" />
            </div>
          </div>
          <div>
            <label className="block text-[#a89a90] mb-2 text-xs font-semibold uppercase tracking-wider">Teléfono del cliente</label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] transition-all">
              <input value={customerPhoneInput} onChange={(e) => setCustomerPhoneInput(e.target.value)} type="number" placeholder="999999999" className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600" />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#a89a90]">Comensales (Límite: {seats})</label>
            <div className="flex items-center justify-between bg-[#241e1b] border border-[#362e2a] px-4 py-3 rounded-lg">
              <button onClick={decrement} className="text-[#b9472a] hover:text-[#a63d22] text-2xl font-bold transition-colors">&minus;</button>
              <span className="text-[#f4ebe1] font-semibold text-sm">{guestCount} persona(s)</span>
              <button onClick={increment} className="text-[#b9472a] hover:text-[#a63d22] text-2xl font-bold transition-colors">&#43;</button>
            </div>
          </div>
          <button onClick={handleRegisterCustomer} className="w-full bg-[#b9472a] text-[#f4ebe1] hover:bg-[#a63d22] rounded-lg py-3 mt-8 font-serif font-bold tracking-wider shadow-md hover:shadow-[0_4px_20px_rgba(185,71,42,0.35)] transition-all duration-300">
            Abrir Mesa e Ir al Menú
          </button>
        </div>
      </Modal>
    </>
  );
};

export default TableCard;
