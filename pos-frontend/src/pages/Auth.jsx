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
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80')" }}
    >
      {/* Dark Blur Overlay */}
      <div className="absolute inset-0 bg-[#0c0908]/90 backdrop-blur-[5px]"></div>

      {/* Floating Glowing Aura */}
      <div className="absolute w-[450px] h-[450px] bg-[#b9472a]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-md bg-[#1c1613]/95 border border-[#c59b27]/30 rounded-2xl px-8 py-12 shadow-[0_12px_40px_0_rgba(197,155,39,0.15)] flex flex-col justify-center transition-all duration-300">
        <div className="flex flex-col items-center gap-1.5 mb-6">
          <img src={logo} alt="Legacy_Pe Logo" className="h-16 w-16 border-2 border-[#c59b27] rounded-full p-1 bg-[#1c1613] shadow-md" />
          <h1 className="text-3xl font-extrabold text-[#c59b27] tracking-widest mt-2 font-serif text-center">LEGACY_PE</h1>
          <p className="text-[10px] text-[#a89a90] font-semibold uppercase tracking-widest">Bistró & Taberna Peruana</p>
        </div>

        <h2 className="text-xl text-center font-bold text-[#f4ebe1] mb-6 tracking-wide font-serif border-b border-[#2d2520] pb-3">
          {isRegister ? "Registro de Empleado" : "Iniciar Sesión"}
        </h2>

        {/* Forms */}  
        <div className="w-full">
          {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}
        </div>

        <div className="flex justify-center mt-6 border-t border-[#2d2520] pt-4">
          <p className="text-sm text-[#a89a90]">
            {isRegister ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
            <span 
              onClick={() => setIsRegister(!isRegister)} 
              className="text-[#c59b27] font-bold hover:text-[#f4ebe1] hover:underline cursor-pointer transition-all duration-200"
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
