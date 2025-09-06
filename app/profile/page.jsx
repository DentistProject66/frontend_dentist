// "use client";
// import React, { useState, useEffect } from 'react';
// import { Eye, EyeOff } from 'lucide-react';
// import Layout from '../layout/layout';
// import ProtectedRoute from "../../lib/ProtectedRoutes"; 

// const AccountSettings = () => {
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [activeTab, setActiveTab] = useState("profile");
  
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phoneNumber: '',
//     role: '',
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (token) {
//       fetch('https://backenddentist-production-12fe.up.railway.app/api/auth/profile', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then(response => response.json())
//         .then(data => {
//           if (data.success) {
//             const user = data.data;
//             setFormData({
//               fullName: `${user.first_name} ${user.last_name}`,
//               email: user.email,
//               phoneNumber: user.phone || '',
//               role: user.role,
//               currentPassword: '',
//               newPassword: '',
//               confirmPassword: ''
//             });
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching profile:', error);
//           // Fallback to localStorage if API fails
//           const user = JSON.parse(localStorage.getItem('user') || '{}');
//           if (user) {
//             setFormData({
//               fullName: `${user.first_name || ''} ${user.last_name || ''}`,
//               email: user.email || '',
//               phoneNumber: user.phone || '',
//               role: user.role || '',
//               currentPassword: '',
//               newPassword: '',
//               confirmPassword: ''
//             });
//           }
//         });
//     } else {
//       // Fallback to localStorage if no token
//       const user = JSON.parse(localStorage.getItem('user') || '{}');
//       if (user) {
//         setFormData({
//           fullName: `${user.first_name || ''} ${user.last_name || ''}`,
//           email: user.email || '',
//           phoneNumber: user.phone || '',
//           role: user.role || '',
//           currentPassword: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
//       }
//     }
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   return (
//     <Layout>
//       <div className="bg-gray-50 p-8 min-h-screen">
//         <div className="max-w-4xl mx-auto overflow-hidden">
//           {/* Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-semibold text-gray-900 mb-1">Informations de Profile</h1>
//           </div>

//           {/* Tabs */}
//           <div className="bg-white rounded-lg border border-gray-200 mb-6">
//             <div className="flex space-x-1 p-1 bg-gray-100 rounded-t-lg">
//               <TabButton
//                 id="profile"
//                 label="Profile"
//                 isActive={activeTab === "profile"}
//                 onClick={setActiveTab}
//               />
//               <TabButton
//                 id="password"
//                 label="Password"
//                 isActive={activeTab === "password"}
//                 onClick={setActiveTab}
//                 className="hidden"
//               />
//             </div>
//             <div className="p-6">
//               {activeTab === "profile" && (
//                 <div>
//                   {/* Profile Photo Section */}
//                   <div className="flex flex-col items-center mb-6">
//                     <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 overflow-hidden">
//                       <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
//                         <span className="text-white text-2xl font-semibold">EP</span>
//                       </div>
//                     </div>
//                     <div className="flex space-x-4">
//                       <button className="text-blue-600 text-sm hover:text-blue-800">
//                         Change Photo
//                       </button>
//                       <button className="text-red-600 text-sm hover:text-red-800">
//                         Remove Photo
//                       </button>
//                     </div>
//                   </div>

//                   {/* Personal Information Section */}
//                   <div>
//                     <h2 className="text-lg font-medium text-gray-900 mb-6">Personal Information</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Full Name
//                         </label>
//                         <input
//                           type="text"
//                           name="fullName"
//                           value={formData.fullName}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Email Address
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Phone Number
//                         </label>
//                         <input
//                           type="tel"
//                           name="phoneNumber"
//                           value={formData.phoneNumber}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Role
//                         </label>
//                         <input
//                           type="text"
//                           name="role"
//                           value={formData.role}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               {activeTab === "password" && (
//                 <div className="space-y-6 hidden ">
//                   <h2 className="text-lg font-medium text-gray-900 mb-6">Password Management</h2>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Current Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showCurrentPassword ? "text" : "password"}
//                         name="currentPassword"
//                         value={formData.currentPassword}
//                         onChange={handleInputChange}
//                         className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                       >
//                         {showCurrentPassword ? (
//                           <EyeOff className="h-4 w-4 text-gray-400" />
//                         ) : (
//                           <Eye className="h-4 w-4 text-gray-400" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         New Password
//                       </label>
//                       <div className="relative">
//                         <input
//                           type={showNewPassword ? "text" : "password"}
//                           name="newPassword"
//                           value={formData.newPassword}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowNewPassword(!showNewPassword)}
//                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                         >
//                           {showNewPassword ? (
//                             <EyeOff className="h-4 w-4 text-gray-400" />
//                           ) : (
//                             <Eye className="h-4 w-4 text-gray-400" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Confirm New Password
//                       </label>
//                       <div className="relative">
//                         <input
//                           type={showConfirmPassword ? "text" : "password"}
//                           name="confirmPassword"
//                           value={formData.confirmPassword}
//                           onChange={handleInputChange}
//                           className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                           className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                         >
//                           {showConfirmPassword ? (
//                             <EyeOff className="h-4 w-4 text-gray-400" />
//                           ) : (
//                             <Eye className="h-4 w-4 text-gray-400" />
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="mt-6 flex justify-end">
//             <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// // TabButton Component
// const TabButton = ({ id, label, isActive, onClick }) => (
//   <button
//     onClick={() => onClick(id)}
//     className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
//       isActive
//         ? "bg-white text-blue-700 shadow-sm"
//         : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
//     }`}
//   >
//     {label}
//   </button>
// );

// export default ProtectedRoute(AccountSettings, ["dentist", "assistant"]);





"use client";
import React, { useState, useEffect } from 'react';
import Layout from '../layout/layout';
import ProtectedRoute from "../../lib/ProtectedRoutes"; 

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('https://backenddentist-production-12fe.up.railway.app/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const user = data.data;
            setFormData({
              fullName: `${user.first_name} ${user.last_name}`,
              email: user.email,
              phoneNumber: user.phone || '',
              role: user.role
            });
          }
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
          // Fallback localStorage
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user) {
            setFormData({
              fullName: `${user.first_name || ''} ${user.last_name || ''}`,
              email: user.email || '',
              phoneNumber: user.phone || '',
              role: user.role || ''
            });
          }
        });
    } else {
      // Fallback localStorage si pas de token
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user) {
        setFormData({
          fullName: `${user.first_name || ''} ${user.last_name || ''}`,
          email: user.email || '',
          phoneNumber: user.phone || '',
          role: user.role || ''
        });
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Layout>
      <div className="bg-gray-50 p-8 min-h-screen">
        <div className="max-w-4xl mx-auto overflow-hidden">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Informations de Profil</h1>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="flex space-x-1 p-1 bg-gray-100 rounded-t-lg">
              <TabButton
                id="profile"
                label="Profil"
                isActive={activeTab === "profile"}
                onClick={setActiveTab}
              />
            </div>
            <div className="p-6">
              {activeTab === "profile" && (
                <div>
                  {/* Avatar seulement, pas de boutons */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">EP</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations personnelles */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-6">Informations Personnelles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rôle
                        </label>
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// TabButton Component
const TabButton = ({ id, label, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-white text-blue-700 shadow-sm"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

export default ProtectedRoute(AccountSettings, ["dentist", "assistant"]);
