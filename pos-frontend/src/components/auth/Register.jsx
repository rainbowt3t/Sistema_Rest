import React, { useState } from "react";
import { register } from "../../https";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

const Register = ({setIsRegister}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelection = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const registerMutation = useMutation({
    mutationFn: (reqData) => register(reqData),
    onSuccess: (res) => {
      const { data } = res;
      enqueueSnackbar(data.message, { variant: "success" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
      });
      
      setTimeout(() => {
        setIsRegister(false);
      }, 1500);
    },
    onError: (error) => {
      const { response } = error;
      const message = response.data.message;
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[#a89a90] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Nombre del empleado
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ingresa el nombre"
              className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[#a89a90] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Correo del empleado
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa el correo"
              className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[#a89a90] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Teléfono del empleado
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ingresa el teléfono"
              className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[#a89a90] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Contraseña
          </label>
          <div className="flex items-center rounded-lg p-3 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa la contraseña"
              className="bg-transparent flex-1 text-[#f4ebe1] focus:outline-none text-sm placeholder-gray-600"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[#a89a90] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Elige un rol
          </label>

          <div className="flex items-center gap-3 mt-3">
            {["Waiter", "Cashier", "Admin"].map((role) => {
              const roleLabels = { Waiter: "Mesero", Cashier: "Cajero", Admin: "Administrador" };
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelection(role)}
                  className={`border px-4 py-3 w-full rounded-lg text-sm font-semibold transition-all ${
                    formData.role === role 
                      ? "bg-[#c59b27] text-[#1c1613] border-[#c59b27] shadow-inner" 
                      : "bg-[#241e1b] border-[#362e2a] text-[#a89a90] hover:bg-[#322824] hover:text-[#f4ebe1]"
                  }`}
                >
                  {roleLabels[role]}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-[#b9472a] text-[#f4ebe1] hover:bg-[#a63d22] font-bold font-serif tracking-wider shadow-md hover:shadow-[0_4px_20px_rgba(185,71,42,0.35)] transition-all duration-300"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
