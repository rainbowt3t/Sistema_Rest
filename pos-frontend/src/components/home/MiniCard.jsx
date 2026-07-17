import React from 'react'

const MiniCard = ({title, icon, number, footerNum}) => {
  const isRevenue = title === "Ganancias Totales";
  return (
    <div className='bg-[#1c1613] py-5 px-6 rounded-xl w-[50%] border border-[#2d2520] hover:border-[#c59b27]/30 transition-all duration-300 shadow-sm'>
        <div className='flex items-center justify-between'>
            <h1 className='text-[#f4ebe1] text-sm font-bold font-serif tracking-wide'>{title}</h1>
            <div className={`p-2.5 rounded-lg text-lg ${
              isRevenue 
                ? "bg-[#c59b27]/10 text-[#c59b27] border border-[#c59b27]/20" 
                : "bg-[#b9472a]/10 text-[#b9472a] border border-[#b9472a]/20"
            }`}>
              {icon}
            </div>
        </div>
        <div>
            <h1 className={`text-3xl font-extrabold mt-4 font-serif ${isRevenue ? "text-[#c59b27]" : "text-[#f4ebe1]"}`}>
              {isRevenue ? `S/ ${number}` : number}
            </h1>
            <p className='text-[#a89a90] text-xs mt-2'>
              <span className='text-[#c59b27] font-bold'>{footerNum}%</span> más que ayer
            </p>
        </div>
    </div>
  )
}

export default MiniCard