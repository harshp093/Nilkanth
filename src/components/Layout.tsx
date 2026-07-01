import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import FloatingButtons from './layout/FloatingButtons';
import ScrollToTop from './ScrollToTop';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Layout;
