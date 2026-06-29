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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#b33a3a]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a]">
          <h3 className="text-xl font-semibold mb-4">Mesas registradas</h3>
          <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-hide">
            {data?.data?.data?.length > 0 ? (
              data.data.data.map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-[#262626] rounded-lg p-3 border border-[#333]">
                  <div>
                    <p className="font-semibold text-lg text-[#f5f5f5]">Mesa {item.tableNo}</p>
                    <p className="text-sm text-[#ababab]">{item.seats} Asientos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${item.status === 'Available' ? 'bg-[#2e4a40] text-green-400' : 'bg-[#421d1d] text-[#f5b4b4]'}`}>
                      {item.status === 'Available' ? 'Disponible' : 'Ocupada'}
                    </span>
                    <button onClick={() => startEdit(item)} className="px-3.5 py-1.5 text-xs font-semibold rounded bg-[#7a1f1f] hover:bg-[#b33a3a] transition-all">Editar</button>
                    <button onClick={() => {
                      if (window.confirm(`¿Estás seguro de eliminar la Mesa ${item.tableNo}?`)) {
                        deleteMutation.mutate(item._id);
                      }
                    }} className="px-3.5 py-1.5 text-xs font-semibold rounded bg-[#3f3f3f] hover:bg-[#5a5a5a] transition-all">Eliminar</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 py-10 text-center">No hay mesas registradas.</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] space-y-4 h-fit">
          <h3 className="text-xl font-semibold text-[#b33a3a]">{editId ? "Editar mesa" : "Agregar mesa"}</h3>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Número de Mesa</label>
            <input name="tableNo" type="number" value={form.tableNo} onChange={handleChange} required placeholder="Ej. 1" className="w-full rounded-lg bg-[#262626] p-3 border border-[#3a3a3a] focus:outline-none focus:border-[#b33a3a] text-white" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Cantidad de Asientos</label>
            <input name="seats" type="number" value={form.seats} onChange={handleChange} required placeholder="Ej. 4" className="w-full rounded-lg bg-[#262626] p-3 border border-[#3a3a3a] focus:outline-none focus:border-[#b33a3a] text-white" />
          </div>
          <div className="flex gap-2 pt-2">
            {editId && (
              <button type="button" onClick={handleCancelEdit} className="flex-1 rounded-lg bg-[#3f3f3f] hover:bg-[#5f5f5f] py-3 font-semibold text-white transition-all">Cancelar</button>
            )}
            <button type="submit" className="flex-1 rounded-lg bg-[#b33a3a] hover:bg-[#922e2e] py-3 font-semibold text-white transition-all">{editId ? "Guardar cambios" : "Agregar mesa"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableAdminPanel;
