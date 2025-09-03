import React from 'react'
import Sidebar from '../../componentss/adminsidebar'

 const  Layout = ({children}) => {
  return (  <div className='flex h-screen w-screen flex-raw '>
    <div className='w-[15%]'>
<Sidebar/>
</div>
<div className='w-[85%]'>
{children}
</div>
  </div>
  )
}
export default Layout;