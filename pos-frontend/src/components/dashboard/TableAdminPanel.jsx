import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { addTable, deleteTable, getTables, updateTableDetails } from "../../https";

const emptyForm = { tableNo: "", seats: "" };

const TableAdminPanel = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: getTables,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createMutation = useMutation({
    mutationFn: addTable,
    onSuccess: (res) => {
      enqueueSnackbar(res?.data?.message || "Mesa agregada correctamente.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      setForm(emptyForm);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "No se pudo agregar la mesa.", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateTableDetails(id, payload),
    onSuccess: (res) => {
      enqueueSnackbar(res?.data?.message || "Mesa actualizada correctamente.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      setForm(emptyForm);
      setEditId(null);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "No se pudo actualizar la mesa.", { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTable,
    onSuccess: (res) => {
      enqueueSnackbar(res?.data?.message || "Mesa eliminada correctamente.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "No se pudo eliminar la mesa.", { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      tableNo: Number(form.tableNo),
      seats: Number(form.seats),
    };

    if (editId) {
      updateMutation.mutate({ id: editId, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const startEdit = (item) => {
    setEditId(item._id);
    setForm({
      tableNo: item.tableNo,
      seats: item.seats,
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c59b27]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-[#f4ebe1]">
      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-[#1c1613] rounded-xl p-5 border border-[#2d2520]">
          <h3 className="text-xl font-bold font-serif mb-4 text-[#f4ebe1]">Mesas registradas</h3>
          <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-hide">
            {data?.data?.data?.length > 0 ? (
              data.data.data.map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-[#241e1b] rounded-lg p-3 border border-[#362e2a]">
                  <div>
                    <p className="font-bold text-base text-[#f4ebe1] font-serif">Mesa {item.tableNo}</p>
                    <p className="text-xs text-[#a89a90] mt-0.5">{item.seats} Asientos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Available' 
                        ? 'bg-[#241e1b] border border-[#c59b27]/30 text-[#c59b27]' 
                        : 'text-[#b9472a] bg-[#3a201b] border border-[#b9472a]/20'
                    }`}>
                      {item.status === 'Available' ? 'Disponible' : 'Ocupada'}
                    </span>
                    <button onClick={() => startEdit(item)} className="px-3.5 py-1.5 text-xs font-bold rounded bg-[#b9472a] hover:bg-[#a63d22] text-[#f4ebe1] font-serif transition-all">Editar</button>
                    <button onClick={() => {
                      if (window.confirm(`¿Estás seguro de eliminar la Mesa ${item.tableNo}?`)) {
                        deleteMutation.mutate(item._id);
                      }
                    }} className="px-3.5 py-1.5 text-xs font-bold rounded bg-[#241e1b] border border-[#362e2a] hover:bg-[#322824] text-[#a89a90] hover:text-[#f4ebe1] transition-all">Eliminar</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#a89a90] py-10 text-center text-sm">No hay mesas registradas.</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1c1613] rounded-xl p-5 border border-[#2d2520] space-y-4 h-fit">
          <h3 className="text-xl font-bold font-serif text-[#c59b27] border-b border-[#2d2520] pb-2">{editId ? "Editar Mesa" : "Agregar Mesa"}</h3>
          <div>
            <label className="block text-xs text-[#a89a90] mb-1.5 font-semibold uppercase tracking-wider">Número de Mesa</label>
            <input name="tableNo" type="number" value={form.tableNo} onChange={handleChange} required placeholder="Ej. 1" className="w-full rounded-lg bg-[#241e1b] p-3 border border-[#362e2a] focus:outline-none focus:border-[#c59b27] text-sm text-[#f4ebe1] placeholder-gray-700" />
          </div>
          <div>
            <label className="block text-xs text-[#a89a90] mb-1.5 font-semibold uppercase tracking-wider">Cantidad de Asientos</label>
            <input name="seats" type="number" value={form.seats} onChange={handleChange} required placeholder="Ej. 4" className="w-full rounded-lg bg-[#241e1b] p-3 border border-[#362e2a] focus:outline-none focus:border-[#c59b27] text-sm text-[#f4ebe1] placeholder-gray-700" />
          </div>
          <div className="flex gap-2 pt-2">
            {editId && (
              <button type="button" onClick={handleCancelEdit} className="flex-1 rounded-lg bg-[#241e1b] border border-[#362e2a] hover:bg-[#322824] py-3 font-bold font-serif text-sm text-[#a89a90] hover:text-[#f4ebe1] transition-all">Cancelar</button>
            )}
            <button type="submit" className="flex-1 rounded-lg bg-[#b9472a] hover:bg-[#a63d22] py-3 font-bold font-serif text-[#f4ebe1] text-sm shadow-md hover:shadow-[0_4px_16px_rgba(185,71,42,0.3)] transition-all">{editId ? "Guardar" : "Agregar"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableAdminPanel;
