import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const increment = () => {
    if(guestCount >= 6) return;
    setGuestCount((prev) => prev + 1);
  }
  const decrement = () => {
    if(guestCount <= 1) return;
    setGuestCount((prev) => prev - 1);
  }

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    if (!name || name.trim() === "") {
      enqueueSnackbar("Por favor, ingresa el nombre del cliente", { variant: "warning" });
      return;
    }
    if (!phone || phone.toString().length < 9) {
      enqueueSnackbar("Por favor, ingresa un número de teléfono válido (mínimo 9 dígitos)", { variant: "warning" });
      return;
    }
    if (guestCount <= 0) {
      enqueueSnackbar("El número de comensales debe ser al menos 1", { variant: "warning" });
      return;
    }

    dispatch(setCustomer({name, phone, guests: guestCount}));
    closeModal();
    navigate("/tables");
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1c1613] border-t border-[#2d2520] p-2 h-16 flex justify-around items-center shadow-lg z-40">
      <button
        onClick={() => navigate("/")}
        className={`flex items-center justify-center font-bold font-serif tracking-wide transition-all duration-200 ${
          isActive("/") ? "text-[#f4ebe1] bg-[#b9472a] shadow-md" : "text-[#a89a90] hover:bg-[#241e1b] hover:text-[#f4ebe1]"
        } flex-1 max-w-[200px] h-12 rounded-[20px]`}
      >
        <FaHome className="inline mr-2" size={18} /> <p>Inicio</p>
      </button>
      <button
        onClick={() => navigate("/orders")}
        className={`flex items-center justify-center font-bold font-serif tracking-wide transition-all duration-200 ${
          isActive("/orders") ? "text-[#f4ebe1] bg-[#b9472a] shadow-md" : "text-[#a89a90] hover:bg-[#241e1b] hover:text-[#f4ebe1]"
        } flex-1 max-w-[200px] h-12 rounded-[20px]`}
      >
        <MdOutlineReorder className="inline mr-2" size={18} /> <p>Pedidos</p>
      </button>

      {role === "Waiter" && (
        <button
          disabled={isActive("/tables") || isActive("/menu")}
          onClick={openModal}
          className="bg-[#c59b27] hover:bg-[#b0881f] text-[#1c1613] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_4px_16px_rgba(197,155,39,0.4)] transition-all duration-300 w-12 h-12 -mt-4 shrink-0 mx-2"
          title="Crear Pedido Rápido"
        >
          <BiSolidDish size={24} />
        </button>
      )}

      <button
        onClick={() => navigate("/tables")}
        className={`flex items-center justify-center font-bold font-serif tracking-wide transition-all duration-200 ${
          isActive("/tables") ? "text-[#f4ebe1] bg-[#b9472a] shadow-md" : "text-[#a89a90] hover:bg-[#241e1b] hover:text-[#f4ebe1]"
        } flex-1 max-w-[200px] h-12 rounded-[20px]`}
      >
        <MdTableBar className="inline mr-2" size={18} /> <p>Mesas</p>
      </button>
      {role === "Admin" && (
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center justify-center font-bold font-serif tracking-wide transition-all duration-200 ${
            isActive("/dashboard") ? "text-[#f4ebe1] bg-[#b9472a] shadow-md" : "text-[#a89a90] hover:bg-[#241e1b] hover:text-[#f4ebe1]"
          } flex-1 max-w-[200px] h-12 rounded-[20px]`}
        >
          <BiSolidDish className="inline mr-2" size={18} /> <p>Panel</p>
        </button>
      )}
 
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Crear Pedido">
        <div className="space-y-4 text-[#f4ebe1]">
          <div>
            <label className="block text-[#a89a90] mb-2 text-xs font-semibold uppercase tracking-wider">Nombre del cliente</label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] transition-all">
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" name="" placeholder="Ingresa el nombre" id="" className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600"  />
            </div>
          </div>
          <div>
            <label className="block text-[#a89a90] mb-2 text-xs font-semibold uppercase tracking-wider">Teléfono del cliente</label>
            <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] transition-all">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} type="number" name="" placeholder="999999999" id="" className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600"  />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-[#a89a90]">Comensales</label>
            <div className="flex items-center justify-between bg-[#241e1b] border border-[#362e2a] px-4 py-3 rounded-lg">
              <button onClick={decrement} className="text-[#b9472a] hover:text-[#a63d22] text-2xl font-bold transition-colors">&minus;</button>
              <span className="text-[#f4ebe1] font-semibold text-sm">{guestCount} persona(s)</span>
              <button onClick={increment} className="text-[#b9472a] hover:text-[#a63d22] text-2xl font-bold transition-colors">&#43;</button>
            </div>
          </div>
          <button onClick={handleCreateOrder} className="w-full bg-[#b9472a] text-[#f4ebe1] hover:bg-[#a63d22] rounded-lg py-3 mt-8 font-serif font-bold tracking-wider shadow-md hover:shadow-[0_4px_20px_rgba(185,71,42,0.35)] transition-all duration-300">
            Crear pedido
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BottomNav;
