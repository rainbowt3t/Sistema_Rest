import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { IoLogOut } from "react-icons/io5";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https";
import { removeUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";

const getRoleLabel = (role) => {
  if (!role) return "Rol";
  const labels = { Admin: "Administrador", Waiter: "Mesero", Cashier: "Cajero" };
  return labels[role] || role;
};

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data) => {
      console.log(data);
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-[#1c1613] border-b border-[#2d2520] shadow-md">
      <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer">
        <img src={logo} className="h-9 w-9 rounded-full border border-[#c59b27] p-0.5 bg-[#1c1613]" alt="Legacy_Pe logo" />
        <h1 className="text-xl font-extrabold text-[#c59b27] tracking-widest font-serif uppercase">
          Legacy_Pe
        </h1>
      </div>

      <div className="flex items-center gap-3 bg-[#241e1b] rounded-[15px] px-5 py-2.5 w-[500px] border border-[#362e2a] focus-within:border-[#c59b27] focus-within:ring-1 focus-within:ring-[#c59b27]/20 transition-all duration-200">
        <FaSearch className="text-[#a89a90] text-sm" />
        <input
          type="text"
          placeholder="Buscar platos o bebidas..."
          className="bg-transparent outline-none text-[#f4ebe1] text-sm w-full placeholder-gray-600"
        />
      </div>

      <div className="flex items-center gap-4">
        {userData.role === "Admin" && (
          <div onClick={() => navigate("/dashboard")} className="bg-[#241e1b] rounded-[15px] p-3 cursor-pointer border border-[#362e2a] hover:border-[#c59b27] hover:bg-[#322824] transition-all">
            <MdDashboard className="text-[#f4ebe1] text-xl" />
          </div>
        )}
        <div className="flex items-center gap-3 cursor-pointer">
          <FaUserCircle className="text-[#c59b27] text-4xl" />
          <div className="flex flex-col items-start">
            <h1 className="text-sm text-[#f4ebe1] font-bold tracking-wide">
              {userData.name || "Usuario"}
            </h1>
            <p className="text-[10px] text-[#a89a90] font-semibold uppercase tracking-wider">
              {getRoleLabel(userData.role)}
            </p>
          </div>
          <IoLogOut
            onClick={handleLogout}
            className="text-[#a89a90] hover:text-[#b9472a] ml-3 transition-colors duration-200"
            size={36}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
