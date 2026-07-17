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
          <label className="block text-[#a89a90] mb-1.5 text-xs font-semibold uppercase tracking-wider">
            Correo del empleado
          </label>
          <div className="flex items-center rounded-lg p-3.5 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
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
            Contraseña
          </label>
          <div className="flex items-center rounded-lg p-3.5 px-4 bg-[#241e1b] border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
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

        <button
          type="submit"
          className="w-full rounded-lg mt-6 py-3 text-lg bg-[#b9472a] text-[#f4ebe1] hover:bg-[#a63d22] font-bold font-serif tracking-wider shadow-md hover:shadow-[0_4px_20px_rgba(185,71,42,0.35)] transition-all duration-300"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
