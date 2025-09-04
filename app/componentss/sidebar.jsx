// "use client";
// import React, { useState, useEffect } from "react";
// import { Stethoscope, User, CalendarDays, DollarSign, Archive, UserCircle, ChevronRight } from "lucide-react";
// import { useRouter } from "next/navigation";

// const Sidebar = () => {
//   const [activeItem, setActiveItem] = useState(null);
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   const data = [
//     { name: "Consultations", id: 1, link: "/consultations", icon: <Stethoscope size={20} /> },
//     { name: "Patients", id: 2, link: "/Patients", icon: <User size={20} /> },
//     { name: "Rendez-vous", id: 3, link: "/appointments", icon: <CalendarDays size={20} /> },
//     { name: "Gestion de Payment", id: 4, link: "/payment", icon: <DollarSign size={20} /> },
//     { name: "Archives", id: 5, link: "/archives", icon: <Archive size={20} /> },
//     { name: "Profil", id: 6, link: "/profile", icon: <UserCircle size={20} /> },
//   ];

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//     } catch (error) {
//       console.error("Error parsing user from localStorage:", error);
//     }
//   }, []);

//   const handleItemClick = (id, link) => {
//     setActiveItem(id);
//     try {
//       router.push(link);
//     } catch (error) {
//       console.error("Navigation error:", error);
//       alert("Failed to navigate to the selected page. Please check if the route exists.");
//     }
//   };

//   return (
//     <div className="w-64 bg-white h-screen border-r border-gray-200 shadow-sm flex flex-col">
//       {/* Logo Section */}
//       <div className="p-6 border-b border-gray-100">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
//             <Stethoscope size={24} className="text-white" />
//           </div>
//           <div>
//             <h1 className="text-lg font-bold text-gray-800">DentalCare</h1>
//             <p className="text-xs text-gray-500">Cabinet Dentaire</p>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Items */}
//       <nav className="flex-1 p-4 space-y-2">
//         {data.map((item) => (
//           <div key={item.id}>
//             <button
//               onClick={() => handleItemClick(item.id, item.link)}
//               className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
//                 activeItem === item.id
//                   ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <div
//                   className={`p-1 rounded-lg ${
//                     activeItem === item.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
//                   }`}
//                 >
//                   {item.icon}
//                 </div>
//                 <span className="font-medium text-sm">{item.name}</span>
//               </div>
//               <ChevronRight
//                 size={16}
//                 className={`transition-transform duration-200 ${
//                   activeItem === item.id
//                     ? "text-blue-600 transform rotate-90"
//                     : "text-gray-300 group-hover:text-gray-400"
//                 }`}
//               />
//             </button>
//           </div>
//         ))}
//       </nav>

//       {/* User Profile Section */}
//       <div className="p-4 border-t border-gray-100">
//         {user ? (
//           <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
//             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-semibold text-sm">
//                 {user.first_name?.[0]}
//                 {user.last_name?.[0]}
//               </span>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-semibold text-gray-800 truncate">
//                 {user.role === "dentist" ? "Dr. " : ""}
//                 {user.first_name} {user.last_name}
//               </p>
//               <p className="text-xs text-gray-500 truncate">{user.role}</p>
//             </div>
//           </div>
//         ) : (
//           <p className="text-sm text-gray-500">No user info</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;





"use client";
import React, { useState, useEffect } from "react";
import { Stethoscope, User, CalendarDays, DollarSign, Archive, UserCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const data = [
    { name: "Consultations", id: 1, link: "/consultations", icon: <Stethoscope size={20} /> },
    { name: "Patients", id: 2, link: "/Patients", icon: <User size={20} /> },
    { name: "Rendez-vous", id: 3, link: "/appointments", icon: <CalendarDays size={20} /> },
    { name: "Gestion de Payment", id: 4, link: "/payment", icon: <DollarSign size={20} /> },
    { name: "Archives", id: 5, link: "/archives", icon: <Archive size={20} /> },
    { name: "Profil", id: 6, link: "/profile", icon: <UserCircle size={20} /> },
  ];

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const handleItemClick = (id, link) => {
    setActiveItem(id);
    try {
      router.push(link);
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Failed to navigate to the selected page. Please check if the route exists.");
    }
  };

  // Filter navigation items based on user role
  const filteredData = user?.role === "assistant"
    ? data.filter(item => item.id !== 4) // Exclude "Gestion de Payment" for assistants
    : data;

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 shadow-sm flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Stethoscope size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">DentalCare</h1>
            <p className="text-xs text-gray-500">Cabinet Dentaire</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredData.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleItemClick(item.id, item.link)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
                activeItem === item.id
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-1 rounded-lg ${
                    activeItem === item.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              <ChevronRight
                size={16}
                className={`transition-transform duration-200 ${
                  activeItem === item.id
                    ? "text-blue-600 transform rotate-90"
                    : "text-gray-300 group-hover:text-gray-400"
                }`}
              />
            </button>
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100">
        {user ? (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.role === "dentist" ? "Dr. " : ""}
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No user info</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;