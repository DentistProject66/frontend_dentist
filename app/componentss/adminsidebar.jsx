import Link from 'next/link'
import React from 'react'
import { Stethoscope, User, CalendarDays, DollarSign, Archive, UserCircle } from 'lucide-react'
import Logo from './logo'
const sidebar = () => {
  const data = [
    { name: "Dashboard", id: 1, link: "/", icon: <Stethoscope size={18} /> },
    { name: "Approval", id: 2, link: "/", icon: <User size={18} /> },
    
  ]

  return (
    <div  
      className='w-full items-start text-sm font-bold text-gray-500 flex h-screen border-r-2 shadow shadow-gray-100'
    >


      <ul className='w-[100%] flex p-3 flex-col '>
        <div  className='mb-4'><Logo/></div>
        {data.map((items, _) => (
          <div 
            className='w-[100%] rounded-[10px] hover:bg-gray-100 h-[1.2cm] px-4 flex items-center gap-3 rounded-4' 
            key={items.id}
          >
            {items.icon}
            <li>
              <Link href={items.link}>
                {items.name}
              </Link>
            </li>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default sidebar
