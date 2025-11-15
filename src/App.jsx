// import React, { useState } from 'react';
// import Navbar from './components/layout/Navbar';
// import Sidebar from './components/layout/Sidebar';
// import DashboardPage from './pages/Dashboard/DashboardPage';

// const HRManagementApp = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeMenu, setActiveMenu] = useState('dashboard');

//   const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
//   const handleMenuChange = (menuId) => setActiveMenu(menuId);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
//       <Sidebar isOpen={sidebarOpen} activeMenu={activeMenu} onMenuChange={handleMenuChange} />
//       <main className={`pt-16 transition-all duration-500 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         <DashboardPage />
//       </main>
//     </div>
//   );
// };

// export default HRManagementApp;



// import React, { useState } from 'react';
// import Navbar from './components/layout/Navbar';
// import Sidebar from './components/layout/Sidebar';
// import DashboardPage from './pages/Dashboard/DashboardPage';
// //import EmployeesPage from './components/employee/Employee';
// import SocietePage from './components/societe/SocietePage';
// import EmployePage from './pages/employee/EmployePage';
// //import EmployeeManagementSystem from './pages/employee/EmployeeManagementSystem';


// // import EmployeesPage from './pages/Employees/EmployeesPage';
// // import RecruitmentPage from './pages/Recruitment/RecruitmentPage';

// const HRManagementApp = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeMenu, setActiveMenu] = useState('dashboard');

//   const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
//   const handleMenuChange = (menuId) => setActiveMenu(menuId);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Navbar */}
//       <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         activeMenu={activeMenu}
//         onMenuChange={handleMenuChange}
//       />

//       {/* Contenu principal */}
//       <main className={`pt-16 transition-all duration-500 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {/* Affichage conditionnel selon le menu cliqué */}
//         {activeMenu === 'dashboard' && <DashboardPage />}
//         {/* {activeMenu === 'employees' && <EmployeesPage/>} */}
//         {activeMenu === 'employees' && <EmployePage/>}
//         {/* {activeMenu === 'employees' && <EmployeeManagementSystem/>} */}
//         {/* {activeMenu === 'employees' && <div className="p-6 text-gray-800">Page des employés</div>} */}
//         {/* {activeMenu === 'employees' && <EmployeesPage/>} */}
//         {activeMenu === 'recruitment' && <div className="p-6 text-gray-800">Page du recrutement</div>}
//         {activeMenu === 'company' && <SocietePage/>}
//         {activeMenu === 'attendance' && <div className="p-6 text-gray-800">Page de la présence</div>}
//         {activeMenu === 'payroll' && <div className="p-6 text-gray-800">Page de la paie</div>}
//         {activeMenu === 'performance' && <div className="p-6 text-gray-800">Page de la performance</div>}
//         {activeMenu === 'leave' && <div className="p-6 text-gray-800">Page des congés</div>}
//         {activeMenu === 'documents' && <div className="p-6 text-gray-800">Page des documents</div>}
//         {activeMenu === 'awards' && <div className="p-6 text-gray-800">Page des récompenses</div>}
//         {activeMenu === 'settings' && <div className="p-6 text-gray-800">Page des paramètres</div>}
//       </main>
//     </div>
//   );
// };

// export default HRManagementApp;




import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from './pages/Dashboard/DashboardPage';
import SocietePage from './components/societe/SocietePage';
import EmployePage from './pages/employee/EmployePage';

function LayoutWithSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const handleToggleSidebar = () => setSidebarOpen(prev => !prev);
  const handleMenuChange = (menuId) => setActiveMenu(menuId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      <Navbar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />

      <Sidebar isOpen={sidebarOpen} activeMenu={activeMenu} onMenuChange={handleMenuChange} />

      <main className={`pt-16 transition-all duration-500 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
        {activeMenu === "dashboard" && <DashboardPage />}
        {activeMenu === "employees" && <EmployePage />}
        {activeMenu === "company" && <SocietePage />}
        {activeMenu === "recruitment" && <div className="p-6">Page du recrutement</div>}
        {activeMenu === "attendance" && <div className="p-6">Page présence</div>}
        {activeMenu === "payroll" && <div className="p-6">Page paie</div>}
        {activeMenu === "performance" && <div className="p-6">Page performance</div>}
        {activeMenu === "leave" && <div className="p-6">Page des congés</div>}
        {activeMenu === "documents" && <div className="p-6">Documents</div>}
        {activeMenu === "awards" && <div className="p-6">Récompenses</div>}
        {activeMenu === "settings" && <div className="p-6">Paramètres</div>}
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
