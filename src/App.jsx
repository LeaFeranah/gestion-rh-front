

// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// import Navbar from './components/layout/Navbar';
// import Sidebar from './components/layout/Sidebar';

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import DashboardPage from './pages/Dashboard/DashboardPage';
// import SocietePage from './components/societe/SocietePage';
// import EmployePage from './pages/employee/EmployePage';
// import AttendancePage from './pages/presence/AttendancePage';

// function LayoutWithSidebar() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeMenu, setActiveMenu] = useState("dashboard");

//   const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
//   const handleMenuChange = (menuId) => setActiveMenu(menuId);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

//       <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

//       <Sidebar isOpen={sidebarOpen} activeMenu={activeMenu} onMenuChange={handleMenuChange} />

//       <main className={`pt-16 transition-all duration-500 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
//         {activeMenu === "dashboard" && <DashboardPage />}
//         {activeMenu === "employees" && <EmployePage />}
//         {activeMenu === "company" && <SocietePage />}
//         {activeMenu === "recruitment" && <div className="p-6">Page du recrutement</div>}
//         {activeMenu === "attendance" && <AttendancePage />}
//         {activeMenu === "payroll" && <div className="p-6">Page paie</div>}
//         {activeMenu === "performance" && <div className="p-6">Page performance</div>}
//         {activeMenu === "leave" && <div className="p-6">Page des congés</div>}
//         {activeMenu === "documents" && <div className="p-6">Documents</div>}
//         {activeMenu === "awards" && <div className="p-6">Récompenses</div>}
//         {activeMenu === "settings" && <div className="p-6">Paramètres</div>}
//       </main>

//     </div>
//   );
// }

// function AppWrapper() {
//   const location = useLocation();

//   const isAuthPage =
//     location.pathname === "/" ||
//     location.pathname === "/login" ||
//     location.pathname === "/register";

//   return (
//     <>
//       {isAuthPage ? (
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//         </Routes>
//       ) : (
//         <LayoutWithSidebar />
//       )}
//     </>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <AppWrapper />
//     </Router>
//   );
// }



import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from './pages/Dashboard/DashboardPage';
import SocietePage from './components/societe/SocietePage';
import EmployePage from './pages/employee/EmployePage';
import AttendancePage from './pages/presence/AttendancePage';
import AnomaliesPage from './pages/presence/AnomaliesPage'; // IMPORTANT: Ajoutez cette importation

function LayoutWithSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Déterminer le menu actif basé sur l'URL
  const getActiveMenuFromPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/employees')) return 'employees';
    if (path.includes('/company')) return 'company';
    if (path.includes('/attendance')) return 'attendance';
    if (path.includes('/anomalies')) return 'attendance'; // On garde "attendance" comme menu actif
    return 'dashboard';
  };

  const [activeMenu, setActiveMenu] = useState(getActiveMenuFromPath());

  const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
    // Navigation basée sur le menu
    const routes = {
      'dashboard': '/dashboard',
      'employees': '/employees',
      'company': '/company',
      'attendance': '/attendance',
      'anomalies': '/anomalies',
    };
    if (routes[menuId]) {
      window.location.href = routes[menuId];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
      <Sidebar 
        isOpen={sidebarOpen} 
        activeMenu={activeMenu} 
        onMenuChange={handleMenuChange}
      />
      
      <main className={`pt-16 transition-all duration-500 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employees" element={<EmployePage />} />
          <Route path="/company" element={<SocietePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/anomalies" element={<AnomaliesPage />} /> {/* AJOUTEZ CETTE ROUTE */}
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <LayoutWithSidebar />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}