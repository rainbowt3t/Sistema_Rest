import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { createMenuItem, deleteMenuItem, getMenuItems, updateMenuItem } from "../../https";

const emptyForm = { name: "", price: "", category: "", description: "" };

const MenuAdminPanel = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const { data } = useQuery({ queryKey: ["menu-items"], queryFn: getMenuItems });

  useEffect(() => {
    if (!data?.data?.data) return;
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      enqueueSnackbar("Plato agregado correctamente.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setForm(emptyForm);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "No se pudo guardar el plato.", { variant: "error" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateMenuItem(id, payload),
    onSuccess: () => {
      enqueueSnackbar("Plato actualizado correctamente.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      setForm(emptyForm);
      setEditId(null);
    },
    onError: (error) => {
      enqueueSnackbar(error?.response?.data?.message || "No se pudo actualizar el plato.", { variant: "error" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      enqueueSnackbar("Plato eliminado correctamente.", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
    onError: () => {
      enqueueSnackbar("No se pudo eliminar el plato.", { variant: "error" });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      description: form.description,
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
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description || "",
    });
  };

  return (
    <div className="container mx-auto p-6 text-[#f4ebe1]">
      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-[#1c1613] rounded-xl p-5 border border-[#2d2520]">
          <h3 className="text-xl font-bold font-serif mb-4 text-[#f4ebe1]">Platos registrados</h3>
          <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-hide">
            {data?.data?.data?.map((item) => (
              <div key={item._id} className="flex justify-between items-center bg-[#241e1b] rounded-lg p-3 border border-[#362e2a]">
                <div>
                  <p className="font-bold text-base text-[#f4ebe1] font-serif">{item.name}</p>
                  <p className="text-xs text-[#a89a90] mt-0.5">{item.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c59b27] font-bold font-serif text-sm mr-2">S/ {item.price}</span>
                  <button onClick={() => startEdit(item)} className="px-3.5 py-1.5 text-xs font-bold rounded bg-[#b9472a] hover:bg-[#a63d22] text-[#f4ebe1] font-serif transition-all">Editar</button>
                  <button onClick={() => deleteMutation.mutate(item._id)} className="px-3.5 py-1.5 text-xs font-bold rounded bg-[#241e1b] border border-[#362e2a] hover:bg-[#322824] text-[#a89a90] hover:text-[#f4ebe1] transition-all">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1c1613] rounded-xl p-5 border border-[#2d2520] space-y-4">
          <h3 className="text-xl font-bold font-serif text-[#c59b27] border-b border-[#2d2520] pb-2">{editId ? "Editar Plato" : "Agregar Plato"}</h3>
          <div>
            <label className="block text-xs text-[#a89a90] mb-1.5 font-semibold uppercase tracking-wider">Nombre del Plato</label>
            <input id="dish-name-input" name="name" value={form.name} onChange={handleChange} required placeholder="Nombre del plato" className="w-full rounded-lg bg-[#241e1b] p-3 border border-[#362e2a] focus:outline-none focus:border-[#c59b27] text-sm text-[#f4ebe1] placeholder-gray-700" />
          </div>
          <div>
            <label className="block text-xs text-[#a89a90] mb-1.5 font-semibold uppercase tracking-wider">Precio (S/)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="Precio" className="w-full rounded-lg bg-[#241e1b] p-3 border border-[#362e2a] focus:outline-none focus:border-[#c59b27] text-sm text-[#f4ebe1] placeholder-gray-700" />
          </div>
          <div>
            <label className="block text-xs text-[#a89a90] mb-1.5 font-semibold uppercase tracking-wider">Categoría</label>
            <input id="category-input" name="category" value={form.category} onChange={handleChange} required placeholder="Categoría" className="w-full rounded-lg bg-[#241e1b] p-3 border border-[#362e2a] focus:outline-none focus:border-[#c59b27] text-sm text-[#f4ebe1] placeholder-gray-700" />
          </div>
          <div>
            <label className="block text-xs text-[#a89a90] mb-1.5 font-semibold uppercase tracking-wider">Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="w-full rounded-lg bg-[#241e1b] p-3 min-h-[90px] border border-[#362e2a] focus:outline-none focus:border-[#c59b27] text-sm text-[#f4ebe1] placeholder-gray-700" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-[#b9472a] hover:bg-[#a63d22] py-3 font-bold font-serif text-[#f4ebe1] text-sm shadow-md hover:shadow-[0_4px_16px_rgba(185,71,42,0.3)] transition-all duration-300">{editId ? "Guardar" : "Agregar"}</button>
        </form>
      </div>
    </div>
  );
};

export default MenuAdminPanel;
