import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  ShoppingBag,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Add Product",
      path: "/add",
      icon: PlusCircle,
    },
    {
      name: "List Products",
      path: "/list",
      icon: ListOrdered,
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ShoppingBag,
    },
  ];

  return (
    <aside className="h-screen w-[78px] shrink-0 border-r border-gray-200 bg-white shadow-sm sm:w-[240px]">
      <div className="flex h-full flex-col px-3 py-6">
        {/* Logo / Title */}
        <div className="mb-8 hidden px-3 sm:block">
          <h2 className="text-xl font-bold text-gray-900">Admin</h2>
          <p className="text-xs text-gray-500">Shop dashboard</p>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  }`
                }
              >
                <Icon size={21} className="shrink-0" />

                <span className="hidden sm:block">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;



// import { NavLink } from "react-router-dom";
// import { assets } from "../assets/assets";

// const Sidebar = () => {
//   return (
//     <aside className='w-[18%] min-h-screen border-r-2'>
//       <div className='flex flex-col items-start gap-4 pt-6 pl-[20%] w-full text-sm'>
//         <NavLink
//           to='/add'
//           className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
//         >
//           <img className='w-5 h-5' src={assets.add_icon} alt='add icon' />
//           <p className='hidden md:block'>Add Product</p>
//         </NavLink>

//         <NavLink
//           to='/list'
//           className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
//         >
//           <img className='w-5 h-5' src={assets.add_icon} alt='add icon' />
//           <p className='hidden sm:block'>List Products</p>
//         </NavLink>

//         <NavLink
//           to='/orders'
//           className='flex items-center w-full gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l'
//         >
//           <img className='w-5 h-5' src={assets.order_icon} alt='add icon' />
//           <p className='hidden sm:block'>Orders</p>
//         </NavLink>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
