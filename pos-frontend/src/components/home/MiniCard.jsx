import React from 'react'

const MiniCard = ({title, icon, number, footerNum}) => {
  return (
    <div className='bg-[#1a1a1a] py-5 px-5 rounded-lg w-[50%] border border-[#2a2a2a]'>
        <div className='flex items-start justify-between'>
            <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>{title}</h1>
            <button className={`${title === "Ganancias Totales" ? "bg-green-600" : "bg-[#b33a3a]"} p-3 rounded-lg text-[#f5f5f5] text-2xl`}>{icon}</button>
        </div>
        <div>
            <h1 className='text-[#f5f5f5] text-4xl font-bold mt-5'>{
              title === "Ganancias Totales" ? `S/ ${number}` : number}</h1>
            <h1 className='text-[#ababab] text-sm mt-3'><span className='text-green-500 font-bold'>{footerNum}%</span> más que ayer</h1>
        </div>
    </div>
  )
}

export default MiniCard