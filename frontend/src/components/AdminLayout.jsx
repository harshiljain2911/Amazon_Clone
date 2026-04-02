import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f3f3f3]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#131921] text-white flex-shrink-0">
        <div className="p-5 border-b border-[#232f3e]">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-[#232f3e] text-[#febd69] font-semibold' : 'text-gray-300 hover:bg-[#232f3e]'
              }`
            }
          >
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-[#232f3e] text-[#febd69] font-semibold' : 'text-gray-300 hover:bg-[#232f3e]'
              }`
            }
          >
            <Package size={20} />
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-[#232f3e] text-[#febd69] font-semibold' : 'text-gray-300 hover:bg-[#232f3e]'
              }`
            }
          >
            <ShoppingCart size={20} />
            Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive ? 'bg-[#232f3e] text-[#febd69] font-semibold' : 'text-gray-300 hover:bg-[#232f3e]'
              }`
            }
          >
            <Users size={20} />
            Users
          </NavLink>
        </nav>

        <div className="p-3 mt-auto border-t border-[#232f3e] absolute bottom-0 w-full md:w-64">
           <NavLink to="/" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#232f3e] rounded-md transition-colors">
              <ArrowLeft size={20} />
              Back to Shop
           </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 xl:p-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
