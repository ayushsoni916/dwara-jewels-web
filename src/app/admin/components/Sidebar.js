"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Users, Ticket, Layers, 
  Receipt, PlusCircle, Box, UserCog, Settings, ChevronLeft, Menu 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { 
    group: "MAIN MENU", 
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
      { name: "Order Management", icon: ShoppingCart, path: "/admin/orders" },
      { name: "Customers", icon: Users, path: "/admin/customers" },
      { name: "Coupon Code", icon: Ticket, path: "/admin/coupons" },
      { name: "Categories", icon: Layers, path: "/admin/category" },
      { name: "Collections", icon: Box, path: "/admin/collection" },
      { name: "Transaction", icon: Receipt, path: "/admin/transactions" },
    ]
  },
  { 
    group: "PRODUCTS", 
    items: [
      { name: "Add Products", icon: PlusCircle, path: "/admin/add-product" },
      { name: "Product List", icon: Box, path: "/admin/product" },
    ]
  },
  { 
    group: "ADMIN", 
    items: [
      { name: "Manage Admins", icon: UserCog, path: "/admin/manage" },
      { name: "Admin Roles", icon: Settings, path: "/admin/roles" },
    ]
  }
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const logo = "/images/Logo.svg"

  return (
    <aside className={`min-h-screen bg-white border-r border-gray-100 transition-all duration-300 sticky top-0 flex flex-col ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* Header / Logo Section */}
      <div className="p-6 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-8" /> {/* Replace with your gold icon */}
            <span className="font-serif text-lg font-semibold text-black whitespace-nowrap">Dwara Jewels</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"
        >
          {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8">
        {menuItems.map((group, idx) => (
          <div key={idx}>
            {!isCollapsed && (
              <p className="text-[10px] font-bold text-gray-400 tracking-widest mb-4 px-2">
                {group.group}
              </p>
            )}
            
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all group
                      ${isActive ? 'bg-[#F2EBE3] text-[#B58E58]' : 'text-gray-500 hover:bg-gray-50'}
                      ${item.special && !isActive ? 'bg-gray-50 text-black' : ''}
                    `}
                  >
                    <Icon 
                      size={22} 
                      className={isActive || item.special ? 'text-[#B58E58]' : 'text-gray-400 group-hover:text-[#B58E58]'} 
                    />
                    {!isCollapsed && (
                      <span className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}>
                        {item.name}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;