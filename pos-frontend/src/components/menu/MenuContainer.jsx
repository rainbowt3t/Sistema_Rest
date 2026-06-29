import React, { useState } from "react";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";
import { useQuery } from "@tanstack/react-query";
import { getMenuItems } from "../../https";

const categories = [
  { id: 1, name: "Entradas", icon: "🍲", bgColor: "#7a1f1f" },
  { id: 2, name: "Segundos", icon: "🍛", bgColor: "#5c1e1e" },
  { id: 3, name: "Bebidas", icon: "🍹", bgColor: "#9c2a2a" },
  { id: 4, name: "Postres", icon: "🍰", bgColor: "#4a1212" },
];

const MenuContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState("Entradas");
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const dispatch = useDispatch();

  const { data: resData, isLoading, isError } = useQuery({
    queryKey: ["menu-items"],
    queryFn: getMenuItems,
  });

  const allDishes = resData?.data?.data || [];

  // Group dishes by category dynamically
  const getDishesByCategory = (catName) => {
    return allDishes.filter(
      (dish) => dish.category.toLowerCase() === catName.toLowerCase()
    );
  };

  const menus = categories.map((cat) => ({
    ...cat,
    items: getDishesByCategory(cat.name),
  }));

  const activeMenu = menus.find((m) => m.name === selectedCategory) || menus[0];
  const activeItems = activeMenu ? activeMenu.items : [];

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 10) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if (itemCount === 0) return;

    const { name, price } = item;
    const newObj = {
      id: item._id, // Keep the DB _id as cart item id
      name,
      pricePerQuantity: price,
      quantity: itemCount,
      price: price * itemCount,
    };

    dispatch(addItems(newObj));
    setItemCount(0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#b33a3a]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error al cargar el menú. Por favor, intente de nuevo.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {menus.map((menu) => {
          return (
            <div
              key={menu.id}
              className="flex flex-col items-start justify-between p-4 rounded-lg h-[100px] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ backgroundColor: menu.bgColor }}
              onClick={() => {
                setSelectedCategory(menu.name);
                setItemId(0);
                setItemCount(0);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-[#f5f5f5] text-lg font-semibold">
                  {menu.icon} {menu.name}
                </h1>
                {selectedCategory === menu.name && (
                  <GrRadialSelected className="text-white animate-pulse" size={20} />
                )}
              </div>
              <p className="text-[#ababab] text-sm font-semibold">
                {menu.items.length} {menu.items.length === 1 ? 'plato' : 'platos'}
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-[#2a2a2a] border-t-2 mt-4" />

      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%] max-h-[500px] overflow-y-auto scrollbar-hide">
        {activeItems.length > 0 ? (
          activeItems.map((item) => {
            return (
              <div
                key={item._id}
                className="flex flex-col items-start justify-between p-4 rounded-lg h-[150px] cursor-pointer hover:bg-[#2e1d1d] bg-[#1a1a1a] border border-[#2a2a2a] transition-all duration-300"
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="overflow-hidden">
                    <h1 className="text-[#f5f5f5] text-sm font-semibold truncate" title={item.name}>
                      {item.name}
                    </h1>
                    <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#3e1f1f] text-[#f5b4b4] p-2 rounded-lg hover:bg-[#b33a3a] hover:text-white transition-all shrink-0"
                  >
                    <FaShoppingCart size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between w-full">
                  <p className="text-[#f5f5f5] text-lg font-bold">
                    S/ {item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between bg-[#1f1f1f] px-3 py-2 rounded-lg gap-4 w-[55%]">
                    <button
                      onClick={() => decrement(item._id)}
                      className="text-red-500 hover:text-red-400 text-xl font-bold"
                    >
                      &minus;
                    </button>
                    <span className="text-white text-sm font-semibold">
                      {itemId === item._id ? itemCount : "0"}
                    </span>
                    <button
                      onClick={() => increment(item._id)}
                      className="text-red-500 hover:text-red-400 text-xl font-bold"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-4 text-gray-500 text-center py-10">No hay platos registrados en esta categoría.</p>
        )}
      </div>
    </>
  );
};

export default MenuContainer;
