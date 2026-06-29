import React, { useState } from "react";
import { itemsData, metricsData } from "../../constants";

const Metrics = () => {
  const [period, setPeriod] = useState("Último Mes");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getFilteredMetrics = () => {
    switch (period) {
      case "Hoy":
        return [
          { title: "Ingresos de Hoy", value: "S/ 1,640.20", percentage: "4%", color: "#7a1f1f", isIncrease: true },
          { title: "Platos Vendidos", value: "342", percentage: "5%", color: "#285430", isIncrease: true },
          { title: "Clientes Totales", value: "620", percentage: "2%", color: "#1d2569", isIncrease: true },
          { title: "Reservas", value: "5", percentage: "10%", color: "#7f167f", isIncrease: false },
        ];
      case "Últimos 7 días":
        return [
          { title: "Ingresos Semanales", value: "S/ 11,480.50", percentage: "8%", color: "#7a1f1f", isIncrease: true },
          { title: "Platos Vendidos", value: "2,394", percentage: "11%", color: "#285430", isIncrease: true },
          { title: "Clientes Totales", value: "4,340", percentage: "6%", color: "#1d2569", isIncrease: true },
          { title: "Reservas", value: "35", percentage: "10%", color: "#7f167f", isIncrease: false },
        ];
      case "Este Año":
        return [
          { title: "Ingresos Anuales", value: "S/ 610,162.80", percentage: "24%", color: "#7a1f1f", isIncrease: true },
          { title: "Platos Vendidos", value: "124,104", percentage: "22%", color: "#285430", isIncrease: true },
          { title: "Clientes Totales", value: "236,640", percentage: "18%", color: "#1d2569", isIncrease: true },
          { title: "Reservas", value: "2,400", percentage: "10%", color: "#7f167f", isIncrease: false },
        ];
      case "Último Mes":
      default:
        return metricsData;
    }
  };

  const handlePeriodChange = (selected) => {
    setPeriod(selected);
    setDropdownOpen(false);
  };

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center relative">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Desempeño General
          </h2>
          <p className="text-sm text-[#ababab] mt-1">
            Métricas de ingresos, platos vendidos, total de clientes y reservas.
          </p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-4 py-2 rounded-md text-[#f5f5f5] bg-[#1a1a1a] border border-[#2a2a2a] text-sm hover:border-[#b33a3a] transition-all"
          >
            {period}
            <svg
              className={`w-3 h-3 ml-1 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1a1a1a] border border-[#2a2a2a] z-50 overflow-hidden">
              <div className="py-1">
                {["Hoy", "Últimos 7 días", "Último Mes", "Este Año"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handlePeriodChange(opt)}
                    className="block w-full text-left px-4 py-2 text-sm text-[#ababab] hover:bg-[#2a2a2a] hover:text-[#f5f5f5] transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {getFilteredMetrics().map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4 border border-[#2a2a2a]"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-[#f5f5f5]">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-[#f5f5f5] text-xl">
            Detalle del Negocio
          </h2>
          <p className="text-sm text-[#ababab] mt-1">
            Resumen del inventario y estado operativo de las mesas y platos.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">

            {
                itemsData.map((item, index) => {
                    return (
                        <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-xs text-[#f5f5f5]">{item.title}</p>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none">
                              <path d="M5 15l7-7 7 7" />
                            </svg>
                            <p className="font-medium text-xs text-[#f5f5f5]">{item.percentage}</p>
                          </div>
                        </div>
                        <p className="mt-1 font-semibold text-2xl text-[#f5f5f5]">{item.value}</p>
                      </div>
                    )
                })
            }

        </div>
      </div>
    </div>
  );
};

export default Metrics;
