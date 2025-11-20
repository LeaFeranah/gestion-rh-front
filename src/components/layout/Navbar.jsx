// import React from 'react';
// import { Menu, X, Search, Bell, User, Briefcase } from 'lucide-react';
// import { USER_INFO } from '../../data/userInfo';


// const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
//   return (
//     <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-lg z-50">
//       <div className="h-full px-4 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={onToggleSidebar}
//             className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
//           >
//             {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//           </button>
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
//               <Briefcase className="w-6 h-6 text-white" />
//             </div>
//             <div className="hidden sm:block">
//               <h1 className="text-xl font-bold text-gray-800">RH Manager</h1>
//               <p className="text-xs text-gray-500">Gestion des Ressources Humaines</p>
//             </div>
//           </div>
//         </div>
//         <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
//           <div className="relative w-full">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Rechercher..."
//               className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-300">
//             <Bell className="w-5 h-5 text-gray-600" />
//             <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//           </button>
//           <div className="hidden sm:flex items-center gap-3 ml-2 pl-2 border-l border-gray-200">
//             <div className="text-right">
//               <p className="text-sm font-semibold text-gray-800">{USER_INFO.name}</p>
//               <p className="text-xs text-gray-500">{USER_INFO.role}</p>
//             </div>
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg cursor-pointer">
//               <User className="w-5 h-5 text-white" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, User, Briefcase, LogOut } from 'lucide-react';

const Navbar = ({ sidebarOpen, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: ''
  });
  const [showDropdown, setShowDropdown] = useState(false);

  // Récupérer les informations de l'utilisateur au chargement
  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    
    if (username && email) {
      setUserInfo({ username, email });
    } else {
      // Si pas de données utilisateur, rediriger vers login
      navigate('/login');
    }
  }, [navigate]);

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer toutes les données de l'utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    
    console.log('✅ Déconnexion réussie');
    
    // Rediriger vers la page de login
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-lg z-50">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800">RH Manager</h1>
              <p className="text-xs text-gray-500">Gestion des Ressources Humaines</p>
            </div>
          </div>
        </div>
        
        {/* <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300"
            />
          </div>
        </div> */}
        
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-300">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="relative hidden sm:flex items-center gap-3 ml-2 pl-2 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{userInfo.username}</p>
              <p className="text-xs text-gray-500">{userInfo.email}</p>
            </div>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg cursor-pointer hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-12 right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{userInfo.username}</p>
                  <p className="text-xs text-gray-500">{userInfo.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;