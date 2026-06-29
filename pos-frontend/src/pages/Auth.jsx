import React, { useEffect, useState } from "react";
import logo from "../assets/images/logo.png"
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {

  useEffect(() => {
    document.title = "Legacy_Pe | Autenticación"
  }, [])

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div 
      className="min-h-screen w-full relative flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')" }}
    >
      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-[#0e0708]/85 backdrop-blur-[4px]"></div>

      {/* Floating Glowing Aura */}
      <div className="absolute w-[350px] h-[350px] bg-[#7a1f1f]/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-[#161616]/90 border border-[#b33a3a]/25 rounded-2xl px-8 py-10 shadow-[0_8px_32px_0_rgba(122,31,31,0.2)] flex flex-col justify-center transition-all duration-300">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src={logo} alt="Legacy_Pe Logo" className="h-16 w-16 border-2 border-[#b33a3a] rounded-full p-1 bg-[#1a1a1a] shadow-inner" />
          <h1 className="text-2xl font-bold text-[#f5f5f5] tracking-widest mt-1">LEGACY_PE</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Sistema POS para Restaurante</p>
        </div>

        <h2 className="text-2xl text-center font-bold text-[#f5b4b4] mb-6 tracking-wide">
          {isRegister ? "Registro de Empleado" : "Iniciar Sesión"}
        </h2>

        {/* Forms */}  
        <div className="w-full">
          {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}
        </div>

        <div className="flex justify-center mt-6 border-t border-[#333]/60 pt-4">
          <p className="text-sm text-[#ababab]">
            {isRegister ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
            <span 
              onClick={() => setIsRegister(!isRegister)} 
              className="text-[#b33a3a] font-bold hover:text-[#e55353] hover:underline cursor-pointer transition-all duration-200"
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
