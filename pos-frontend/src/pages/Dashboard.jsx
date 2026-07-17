import React, { useState, useEffect } from "react";
import { MdTableBar, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useSelector } from "react-redux";
import Metrics from "../components/dashboard/Metrics";
import RecentOrders from "../components/dashboard/RecentOrders";
import MenuAdminPanel from "../components/dashboard/MenuAdminPanel";
import TableAdminPanel from "../components/dashboard/TableAdminPanel";
import { enqueueSnackbar } from "notistack";

const buttons = [
  { label: "Agregar mesa", icon: <MdTableBar />, action: "table" },
  { label: "Agregar categoría", icon: <MdCategory />, action: "category" },
  { label: "Agregar plato", icon: <BiSolidDish />, action: "dishes" },
];

const tabs = ["Métricas", "Pedidos", "Menú", "Mesas"];

const Dashboard = () => {

  useEffect(() => {
    document.title = "Legacy_Pe | Panel de Control"
  }, [])

  const userData = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("Métricas");

  useEffect(() => {
    if (userData.role !== "Admin") {
      enqueueSnackbar("Solo los administradores pueden acceder al panel.", { variant: "warning" });
    }
  }, [userData.role]);

  const handleOpenModal = (action) => {
    if (userData.role !== "Admin") {
      enqueueSnackbar("No tienes permisos para realizar esta acción.", { variant: "warning" });
      return;
    }

    if (action === "table") {
      setActiveTab("Mesas");
    } else if (action === "dishes") {
      setActiveTab("Menú");
      setTimeout(() => {
        const input = document.getElementById("dish-name-input");
        if (input) input.focus();
      }, 150);
    } else if (action === "category") {
      setActiveTab("Menú");
      setTimeout(() => {
        const input = document.getElementById("category-input");
        if (input) input.focus();
      }, 150);
    }
  };

  return (
    <div className="bg-transparent min-h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => {
            return (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className="bg-[#241e1b] hover:bg-[#322824] px-6 py-2.5 rounded-lg text-[#f4ebe1] font-bold text-sm flex items-center gap-2 border border-[#362e2a] hover:border-[#c59b27] hover:shadow-[0_4px_12px_rgba(197,155,39,0.15)] transition-all font-serif tracking-wide"
              >
                {label} {icon}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 border transition-all duration-200 ${
                  isActive
                    ? "bg-[#b9472a] border-[#b9472a] text-[#f4ebe1] shadow-md"
                    : "bg-[#241e1b] border-[#362e2a] text-[#a89a90] hover:bg-[#322824] hover:text-[#f4ebe1]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "Métricas" && <Metrics />}
      {activeTab === "Pedidos" && <RecentOrders />}
      {activeTab === "Menú" && (
        <div className="text-white p-6 container mx-auto">
          <MenuAdminPanel />
        </div>
      )}
      {activeTab === "Mesas" && (
        <div className="text-[#f4ebe1] p-6 container mx-auto">
          <TableAdminPanel />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
