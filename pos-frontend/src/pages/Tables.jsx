import React, { useState, useEffect } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";

const Tables = () => {
  const [status, setStatus] = useState("all");

    useEffect(() => {
      document.title = "Legacy_Pe | Mesas"
    }, [])

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if(isError) {
    enqueueSnackbar("¡Algo salió mal al cargar las mesas!", { variant: "error" })
  }

  console.log(resData);

  const tablesList = resData?.data.data || [];
  const filteredTables = tablesList.filter((table) => {
    if (status === "all") return true;
    if (status === "booked") return table.status === "Booked";
    return true;
  });

  return (
    <section className="bg-transparent h-[calc(100vh-5rem)] overflow-hidden pb-20">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#c59b27] text-2xl font-bold font-serif tracking-widest uppercase">
            Mesas del Salón
          </h1>
        </div>
        <div className="flex items-center justify-around gap-3">
          <button
            onClick={() => setStatus("all")}
            className={`text-sm rounded-lg px-5 py-2 font-bold transition-all border ${
              status === "all" 
                ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" 
                : "bg-[#241e1b] border-[#362e2a] text-[#a89a90] hover:bg-[#322824] hover:text-[#f4ebe1]"
            }`}
          >
            Todas ({tablesList.length})
          </button>
          <button
            onClick={() => setStatus("booked")}
            className={`text-sm rounded-lg px-5 py-2 font-bold transition-all border ${
              status === "booked" 
                ? "bg-[#b9472a] text-[#f4ebe1] border-[#b9472a] shadow-sm" 
                : "bg-[#241e1b] border-[#362e2a] text-[#a89a90] hover:bg-[#322824] hover:text-[#f4ebe1]"
            }`}
          >
            Ocupadas ({tablesList.filter(t => t.status === "Booked").length})
          </button>
        </div>
      </div>
 
      <div className="grid grid-cols-5 gap-4 px-16 py-4 h-full overflow-y-auto scrollbar-hide pb-12">
        {filteredTables.map((table) => {
          return (
            <TableCard
              key={table._id}
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails?.name}
              seats={table.seats}
              currentOrder={table.currentOrder}
            />
          );
        })}
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;
