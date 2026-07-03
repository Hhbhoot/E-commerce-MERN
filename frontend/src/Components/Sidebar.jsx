import React from 'react';
import { useAuth } from '../Context/Auth';
import { Link } from 'react-router';

const Sidebar = () => {
  const { role } = useAuth();

  const sidebarMenu = {
    Seller: [
      { title: 'Dashboard', link: '/' },
      { title: 'Products', link: '/products' },
      { title: 'Create Products', link: '/products/create' },
    ],

    Customer: [
      { title: 'Dashboard', link: '/customer/dashboard' },
      { title: 'Products', link: '/customer/products' },
      { title: 'Cart', link: '/customer/cart' },
    ],
  };

  return (
    <div className="w-96 h-screen bg-slate-300 flex flex-col items-start px-10 py-5">
      <div className="flex flex-col gap-2">
        {' '}
        {sidebarMenu[role].map((menu) => {
          return (
            <Link
              to={menu.link}
              key={menu.title}
              itemLayout="horizontal"
              className="w-full rounded-md text-2xl cursor-pointer  mb-1"
            >
              {menu.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
