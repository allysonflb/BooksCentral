import React from 'react'
import Header from '../../components/Header/Header';
import { Outlet } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

const Home = () => {
  return (
    <main>
      <Header />
      <Outlet />
      <Analytics />
    </main>
  )
}

export default Home
