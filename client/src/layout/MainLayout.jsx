import NavBar from '@/pages/NavBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

export const MainLayout = () => {
  return (
    <div>
    <NavBar/>
    <div className="pt-16">
      <Outlet/>
    </div>
    </div>
  )
}
