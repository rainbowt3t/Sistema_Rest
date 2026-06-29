import React, { useEffect, useState } from "react";
import restaurant from "../assets/images/restaurant-img.jpg"
import logo from "../assets/images/logo.png"
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";

const Auth = () => {

  useEffect(() => {
    document.title = "Legacy_Pe | Autenticación"
  }, [])

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section */}
      <div className="w-1/2 relative flex items-center justify-center bg-cover">
        {/* BG Image */}
        <img className="w-full h-full object-cover" src={restaurant} alt="Restaurant Image" />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>

        {/* Quote at bottom */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-2xl italic text-white">
          "Sirve a tus clientes con la mejor comida, atención cálida y un ambiente que los invite a volver."
          <br />
          <span className="block mt-4 text-[#f5b4b4]">- Fundador de Legacy_Pe</span>
        </blockquote>
      </div>

      {/* Right Section */}
      <div className="w-1/2 min-h-screen bg-[#1a1a1a] p-10">
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="Restro Logo" className="h-14 w-14 border-2 rounded-full p-1 border-[#b33a3a]" />
          <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-wide">Legacy_Pe</h1>
        </div>

        <h2 className="text-4xl text-center mt-10 font-semibold text-[#f5b4b4] mb-10">
          {isRegister ? "Registro de empleado" : "Inicio de sesión"}
        </h2>

        {/* Components */}  
        {isRegister ? <Register setIsRegister={setIsRegister} /> : <Login />}


        <div className="flex justify-center mt-6">
          <p className="text-sm text-[#ababab]">
            {isRegister ? "¿Ya tienes una cuenta? " : "¿No tienes una cuenta? "}
            <a onClick={() => setIsRegister(!isRegister)} className="text-[#b33a3a] font-semibold hover:text-[#e55353] hover:underline" href="#">
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </a>
          </p>
        </div>


      </div>
    </div>
  );
};

export default Auth;
