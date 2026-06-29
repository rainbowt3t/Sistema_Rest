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
    <div className="container mx-auto p-6 text-white">
      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a]">
          <h3 className="text-xl font-semibold mb-4">Platos registrados</h3>
          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {data?.data?.data?.map((item) => (
              <div key={item._id} className="flex justify-between items-center bg-[#262626] rounded-lg p-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[#ababab]">{item.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#f5b4b4] font-semibold">S/ {item.price}</span>
                  <button onClick={() => startEdit(item)} className="px-3 py-1 rounded bg-[#7a1f1f]">Editar</button>
                  <button onClick={() => deleteMutation.mutate(item._id)} className="px-3 py-1 rounded bg-[#3f3f3f]">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-xl p-5 border border-[#2a2a2a] space-y-4">
          <h3 className="text-xl font-semibold">{editId ? "Editar plato" : "Agregar plato"}</h3>
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Nombre del plato" className="w-full rounded-lg bg-[#262626] p-3" />
          <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="Precio" className="w-full rounded-lg bg-[#262626] p-3" />
          <input name="category" value={form.category} onChange={handleChange} required placeholder="Categoría" className="w-full rounded-lg bg-[#262626] p-3" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descripción" className="w-full rounded-lg bg-[#262626] p-3 min-h-[100px]" />
          <button type="submit" className="w-full rounded-lg bg-[#7a1f1f] py-3 font-semibold">{editId ? "Guardar cambios" : "Agregar plato"}</button>
        </form>
      </div>
    </div>
  );
};

export default MenuAdminPanel;
