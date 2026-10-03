import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import Footer from '../components/common/Footer.jsx';

export const AppLayout = ({ showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
