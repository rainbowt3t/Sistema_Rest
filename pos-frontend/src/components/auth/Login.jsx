import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { login } from "../../https/index"
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
 
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const[formData, setFormData] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setFormData({...formData, [e.target.name]: e.target.value});
    }

  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginMutation.mutate(formData);
    }

    const loginMutation = useMutation({
      mutationFn: (reqData) => login(reqData),
      onSuccess: (res) => {
          const { data } = res;
          console.log(data);
          const { _id, name, email, phone, role } = data.data;
          dispatch(setUser({ _id, name, email, phone, role }));
          navigate("/");
      },
      onError: (error) => {
        const { response } = error;
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    })

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[#ababab] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Correo del empleado
          </label>
          <div className="flex items-center rounded-lg p-3.5 px-4 bg-[#1a1a1a] border border-[#2a2a2a] focus-within:border-[#b33a3a] focus-within:ring-1 focus-within:ring-[#b33a3a]/20 transition-all duration-200">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingresa el correo"
              className="bg-transparent flex-1 text-white focus:outline-none text-sm placeholder-gray-600"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[#ababab] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Contraseña
          </label>
          <div className="flex items-center rounded-lg p-3.5 px-4 bg-[#1a1a1a] border border-[#2a2a2a] focus-within:border-[#b33a3a] focus-within:ring-1 focus-within:ring-[#b33a3a]/20 transition-all duration-200">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa la contraseña"
              className="bg-transparent flex-1 text-white focus:outline-none text-sm placeholder-gray-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-[#b33a3a] text-white hover:bg-[#922e2e] font-bold transition-all duration-300"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
