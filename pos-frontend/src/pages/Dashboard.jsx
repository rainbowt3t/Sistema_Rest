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
    <div className="bg-[#1f1f1f] min-h-[calc(100vh-5rem)]">
      <div className="container mx-auto flex items-center justify-between py-14 px-6 md:px-4">
        <div className="flex items-center gap-3">
          {buttons.map(({ label, icon, action }) => {
            return (
              <button
                key={action}
                onClick={() => handleOpenModal(action)}
                className="bg-[#1a1a1a] hover:bg-[#262626] px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 border border-[#2a2a2a] hover:border-[#b33a3a] transition-all"
              >
                {label} {icon}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {tabs.map((tab) => {
            return (
              <button
                key={tab}
                className={`
                px-8 py-3 rounded-lg text-[#f5f5f5] font-semibold text-md flex items-center gap-2 border border-[#2a2a2a] transition-all ${
                  activeTab === tab
                    ? "bg-[#7a1f1f] border-[#b33a3a] text-white"
                    : "bg-[#1a1a1a] hover:bg-[#262626]"
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
        <div className="text-white p-6 container mx-auto">
          <TableAdminPanel />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
