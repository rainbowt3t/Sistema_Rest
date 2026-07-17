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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c59b27]"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-[#b9472a]">
        Error al cargar el menú. Por favor, intente de nuevo.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%]">
        {menus.map((menu) => {
          const isSelected = selectedCategory === menu.name;
          return (
            <div
              key={menu.id}
              className={`flex flex-col items-start justify-between p-4 rounded-xl h-[100px] cursor-pointer transition-all duration-300 hover:scale-[1.02] border ${
                isSelected 
                  ? "border-transparent text-[#f4ebe1] shadow-md" 
                  : "bg-[#1c1613] border-[#2d2520] text-[#a89a90] hover:border-[#362e2a] hover:text-[#f4ebe1]"
              }`}
              style={{ backgroundColor: isSelected ? menu.bgColor : "" }}
              onClick={() => {
                setSelectedCategory(menu.name);
                setItemId(0);
                setItemCount(0);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className="text-md font-bold font-serif">
                  {menu.icon} {menu.name}
                </h1>
                {isSelected && (
                  <GrRadialSelected className="text-[#f4ebe1] animate-pulse" size={18} />
                )}
              </div>
              <p className={`text-xs font-semibold ${isSelected ? "text-[#f4ebe1]/80" : "text-[#a89a90]"}`}>
                {menu.items.length} {menu.items.length === 1 ? 'plato' : 'platos'}
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-[#2d2520] border-t mt-4" />

      <div className="grid grid-cols-4 gap-4 px-10 py-4 w-[100%] max-h-[500px] overflow-y-auto scrollbar-hide">
        {activeItems.length > 0 ? (
          activeItems.map((item) => {
            return (
              <div
                key={item._id}
                className="flex flex-col items-start justify-between p-4 rounded-xl h-[160px] cursor-pointer bg-[#1c1613] border border-[#2d2520] hover:border-[#c59b27] hover:shadow-[0_4px_20px_rgba(197,155,39,0.08)] transition-all duration-300"
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="overflow-hidden">
                    <h1 className="text-[#f4ebe1] text-sm font-bold truncate font-serif" title={item.name}>
                      {item.name}
                    </h1>
                    <p className="text-[10px] text-[#a89a90] line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#241e1b] border border-[#362e2a] text-[#c59b27] p-2.5 rounded-lg hover:bg-[#b9472a] hover:text-[#f4ebe1] hover:border-[#b9472a] transition-all shrink-0 shadow-sm"
                  >
                    <FaShoppingCart size={15} />
                  </button>
                </div>
                <div className="flex items-center justify-between w-full border-t border-[#2d2520]/60 pt-3">
                  <p className="text-[#c59b27] text-md font-bold font-serif">
                    S/ {item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between bg-[#241e1b] border border-[#362e2a] px-3 py-1 rounded-lg gap-4 w-[55%]">
                    <button
                      onClick={() => decrement(item._id)}
                      className="text-[#b9472a] hover:text-[#a63d22] text-lg font-black transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="text-[#f4ebe1] text-xs font-bold">
                      {itemId === item._id ? itemCount : "0"}
                    </span>
                    <button
                      onClick={() => increment(item._id)}
                      className="text-[#b9472a] hover:text-[#a63d22] text-lg font-black transition-colors"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-4 text-[#a89a90] text-center py-10 text-sm">No hay platos registrados en esta categoría.</p>
        )}
      </div>
    </>
  );
};

export default MenuContainer;
