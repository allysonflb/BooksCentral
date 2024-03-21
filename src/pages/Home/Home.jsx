import React from 'react'
import Header from '../../components/Header/Header';
import { Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react'; 

const Home = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Analytics />
      <SpeedInsights />
    </main>
  )
}

export default Home
