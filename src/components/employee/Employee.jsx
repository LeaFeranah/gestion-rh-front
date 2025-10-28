// import React, { useState, useMemo } from "react";
// import { User, Mail, Phone, MapPin, Briefcase, Heart, Star, Sparkles, ChevronDown, ChevronUp, Search, X } from "lucide-react";

// // --- Définition des données et types (pour clarté) ---

// const initialEmployees = [
//   { id: 1, name: "Rabe", position: "Développeur Senior", email: "rabe@mail.com", phone: "034 00 111 11", address: "Antananarivo", color: "from-violet-500 to-purple-600", bio: "Maîtrise de React et de l'architecture backend." },
//   { id: 2, name: "Hery", position: "Lead Designer UX/UI", email: "hery@mail.com", phone: "034 00 222 22", address: "Antsirabe", color: "from-pink-500 to-rose-600", bio: "Expertise en design centré sur l'utilisateur et prototypage." },
//   { id: 3, name: "Miora", position: "Responsable RH", email: "miora@mail.com", phone: "034 00 333 33", address: "Toamasina", color: "from-cyan-500 to-blue-600", bio: "Gère le recrutement et le bien-être des employés." },
//   { id: 4, name: "Nivo", position: "Chef de Projet Marketing", email: "nivo@mail.com", phone: "034 00 444 44", address: "Fianarantsoa", color: "from-amber-500 to-orange-600", bio: "Dirige les campagnes numériques et les stratégies de marque." },
//   { id: 5, name: "Soa", position: "Comptable Principal", email: "soa@mail.com", phone: "034 00 555 55", address: "Mahajanga", color: "from-emerald-500 to-teal-600", bio: "Assure la gestion financière et la conformité." },
// ];

// // --- Composant Carte de Détails de l'Employé (pour un effet pro/attrayant) ---

// const EmployeeDetailsCard = ({ employee, onClose }) => {
//   if (!employee) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4 animate-fadeIn">
//       <div className={`bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-500 scale-100 border-4 ${employee.color.replace('from-', 'border-').replace('to-', 'border-')}`}>
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors">
//           <X className="w-6 h-6" />
//         </button>
        
//         <div className="flex flex-col items-center text-center">
//           <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${employee.color} flex items-center justify-center text-white font-bold text-4xl shadow-xl mb-4 transform hover:scale-105 transition-transform`}>
//             {employee.name[0]}
//           </div>
//           <h2 className={`text-3xl font-bold font-display bg-gradient-to-r ${employee.color} bg-clip-text text-transparent mb-1`}>{employee.name}</h2>
//           <p className="text-xl text-gray-700 flex items-center gap-2 mb-4">
//             <Briefcase className="w-5 h-5 text-purple-600" /> {employee.position}
//           </p>
          
//           <div className="space-y-3 w-full text-left">
//             <p className="flex items-center gap-3 text-gray-600"><Mail className="w-5 h-5 text-purple-500" /> {employee.email}</p>
//             <p className="flex items-center gap-3 text-gray-600"><Phone className="w-5 h-5 text-pink-500" /> {employee.phone}</p>
//             <p className="flex items-center gap-3 text-gray-600"><MapPin className="w-5 h-5 text-cyan-500" /> {employee.address}</p>
//           </div>
          
//           <div className="mt-6 p-4 bg-gray-50 rounded-xl w-full">
//             <p className="italic text-gray-800">"{employee.bio}"</p>
//           </div>

//           <p className="mt-4 text-sm text-gray-500">ID: {employee.id} | Cliquez à l'extérieur pour fermer</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Composant principal de la page ---

// const EmployeesPage = () => {
//   const [employees] = useState(initialEmployees);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [hoveredRow, setHoveredRow] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

//   // Logique de recherche et de tri
//   const sortedAndFilteredEmployees = useMemo(() => {
//     let data = [...employees];
    
//     // 1. Filtrage par recherche
//     if (searchTerm) {
//       const lowerCaseSearch = searchTerm.toLowerCase();
//       data = data.filter(emp => 
//         Object.values(emp).some(value => 
//           String(value).toLowerCase().includes(lowerCaseSearch)
//         )
//       );
//     }

//     // 2. Tri
//     data.sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === 'ascending' ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === 'ascending' ? 1 : -1;
//       }
//       return 0;
//     });

//     return data;
//   }, [employees, searchTerm, sortConfig]);

//   const requestSort = (key) => {
//     let direction = 'ascending';
//     if (sortConfig.key === key && sortConfig.direction === 'ascending') {
//       direction = 'descending';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) {
//       return <ChevronDown className="w-4 h-4 text-white opacity-50" />;
//     }
//     if (sortConfig.direction === 'ascending') {
//       return <ChevronUp className="w-4 h-4" />;
//     }
//     return <ChevronDown className="w-4 h-4" />;
//   };

//   // Les en-têtes de colonnes pour le tri
//   const headers = [
//     { key: 'id', label: 'ID', icon: Star },
//     { key: 'name', label: 'Nom Complet', icon: User },
//     { key: 'position', label: 'Poste', icon: Briefcase },
//     { key: 'email', label: 'Email', icon: Mail },
//     { key: 'phone', label: 'Téléphone', icon: Phone },
//     { key: 'address', label: 'Adresse', icon: MapPin },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-12">
      
//       {/* Header Spectaculaire */}
//       <div className="max-w-7xl mx-auto mb-10 text-center">
//         <div className="inline-flex items-center gap-4 mb-4">
//           <Sparkles className="w-10 h-10 text-purple-500 animate-pulse" />
//           <h1 className="text-5xl sm:text-6xl font-bold font-display bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//             Notre Équipe d'Excellence
//           </h1>
//           <Sparkles className="w-10 h-10 text-pink-500 animate-pulse" />
//         </div>
//         <p className="text-xl text-gray-700 flex items-center justify-center gap-2 italic">
//           <Heart className="w-6 h-6 text-rose-500 animate-bounce" />
//           Des talents extraordinaires qui inspirent le monde
//           <Heart className="w-6 h-6 text-rose-500 animate-bounce" />
//         </p>
//       </div>

//       <div className="max-w-7xl mx-auto">
        
//         {/* Barre de recherche */}
//         <div className="mb-6 flex items-center p-3 bg-white rounded-xl shadow-lg border-2 border-purple-200 focus-within:ring-4 focus-within:ring-pink-300 transition-all duration-300">
//           <Search className="w-6 h-6 text-purple-500 mr-3" />
//           <input
//             type="text"
//             placeholder="Rechercher par nom, poste, ville..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full text-lg p-1 focus:outline-none font-display text-gray-700"
//           />
//         </div>

//         {/* Tableur Magnifique */}
//         <div className="relative">
          
//           {/* Effet de brillance en arrière-plan */}
//           <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-3xl blur-2xl opacity-20 animate-pulse-slow" />
          
//           <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-300">
            
//             <div className="bg-white bg-opacity-95 backdrop-blur-sm">
//               <div className="overflow-x-auto">
//                 <table className="w-full border-collapse">
                  
//                   {/* Tête de tableau (avec tri) */}
//                   <thead>
//                     <tr className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white shadow-xl">
//                       {headers.map((header) => (
//                         <th 
//                           key={header.key}
//                           className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 hover:bg-purple-700"
//                           onClick={() => requestSort(header.key)}
//                         >
//                           <div className="flex items-center gap-2">
//                             <header.icon className="w-5 h-5" />
//                             {header.label}
//                             {getSortIcon(header.key)}
//                           </div>
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
                  
//                   {/* Corps de tableau */}
//                   <tbody className="divide-y divide-purple-100">
//                     {sortedAndFilteredEmployees.map((emp, index) => (
//                       <tr
//                         key={emp.id}
//                         onClick={() => setSelectedEmployee(emp)}
//                         onMouseEnter={() => setHoveredRow(emp.id)}
//                         onMouseLeave={() => setHoveredRow(null)}
//                         className={`
//                           cursor-pointer transition-all duration-300 transform group
//                           ${selectedEmployee?.id === emp.id 
//                             ? `bg-gradient-to-r from-purple-100 to-pink-100 scale-102 shadow-2xl border-l-8 border-purple-500` 
//                             : hoveredRow === emp.id
//                             ? 'bg-gradient-to-r from-purple-50 to-pink-50 scale-101'
//                             : index % 2 === 0 
//                             ? 'bg-white hover:bg-purple-50' 
//                             : 'bg-gray-50 hover:bg-purple-50'
//                           }
//                           animate-fadeIn
//                         `}
//                         style={{ animationDelay: `${index * 100}ms` }}
//                       >
//                         {/* ID (Col. 1) */}
//                         <td className="px-6 py-4">
//                           <div className={`
//                             w-8 h-8 rounded-full bg-gradient-to-r ${emp.color} 
//                             flex items-center justify-center text-white font-bold text-sm
//                             shadow-md transform transition-all duration-300 
//                             group-hover:scale-110 group-hover:rotate-12
//                           `}>
//                             {emp.id}
//                           </div>
//                         </td>
                        
//                         {/* Nom Complet (Col. 2) */}
//                         <td className="px-6 py-4 font-display">
//                           <div className="flex items-center gap-3">
//                             <div className={`
//                               w-10 h-10 rounded-full bg-gradient-to-r ${emp.color}
//                               flex items-center justify-center text-white font-bold text-xl
//                               shadow-lg transform transition-all duration-500
//                               group-hover:rotate-360 group-hover:shadow-2xl
//                             `}>
//                               {emp.name[0]}
//                             </div>
//                             <span className={`
//                               font-bold text-lg transition-all duration-300
//                               ${selectedEmployee?.id === emp.id 
//                                 ? `bg-gradient-to-r ${emp.color} bg-clip-text text-transparent text-xl` 
//                                 : 'text-gray-800'
//                               }
//                             `}>
//                               {emp.name}
//                             </span>
//                             {selectedEmployee?.id === emp.id && <Heart className="w-5 h-5 text-rose-500 animate-bounce-small" />}
//                           </div>
//                         </td>
                        
//                         {/* Poste (Col. 3) */}
//                         <td className="px-6 py-4">
//                           <span className={`
//                             inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm
//                             transition-all duration-300 transform
//                             ${selectedEmployee?.id === emp.id 
//                               ? `bg-gradient-to-r ${emp.color} text-white shadow-xl scale-110` 
//                               : 'bg-purple-100 text-purple-700 group-hover:bg-purple-200'
//                             }
//                           `}>
//                             <Briefcase className="w-4 h-4" />
//                             {emp.position}
//                           </span>
//                         </td>
                        
//                         {/* Email (Col. 4) */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2 text-gray-700">
//                             <Mail className={`w-5 h-5 ${selectedEmployee?.id === emp.id ? 'text-purple-600' : 'text-gray-400'}`} />
//                             <span className={selectedEmployee?.id === emp.id ? 'font-semibold' : ''}>
//                               {emp.email}
//                             </span>
//                           </div>
//                         </td>
                        
//                         {/* Téléphone (Col. 5) */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2 text-gray-700">
//                             <Phone className={`w-5 h-5 ${selectedEmployee?.id === emp.id ? 'text-purple-600' : 'text-gray-400'}`} />
//                             <span className={selectedEmployee?.id === emp.id ? 'font-semibold' : ''}>
//                               {emp.phone}
//                             </span>
//                           </div>
//                         </td>
                        
//                         {/* Adresse (Col. 6) */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2 text-gray-700">
//                             <MapPin className={`w-5 h-5 ${selectedEmployee?.id === emp.id ? 'text-purple-600' : 'text-gray-400'}`} />
//                             <span className={selectedEmployee?.id === emp.id ? 'font-semibold' : ''}>
//                               {emp.address}
//                             </span>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                     {sortedAndFilteredEmployees.length === 0 && (
//                       <tr>
//                         <td colSpan={6} className="text-center py-10 text-xl text-gray-500 italic">
//                           😢 Aucun résultat trouvé pour la recherche.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Footer Inspirant */}
//             {/* <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 p-6 text-center border-t-4 border-purple-200">
//               <div className="flex items-center justify-center gap-3 text-gray-700">
//                 <Sparkles className="w-6 h-6 text-purple-500" />
//                 <p className="text-lg font-bold italic font-display">
//                   {selectedEmployee 
//                     ? `🎉 Focus sur ${selectedEmployee.name} - ${selectedEmployee.position} !` 
//                     : `💖 ${employees.length} Membres - Ensemble, nous créons des merveilles !`
//                   }
//                 </p>
//                 <Sparkles className="w-6 h-6 text-pink-500" />
//               </div>
//             </div> */}
//           </div>
//         </div>

//         {/* Détails de l'employé (carte modale) */}
//         <EmployeeDetailsCard 
//           employee={selectedEmployee} 
//           onClose={() => setSelectedEmployee(null)} 
//         />
        
//         {/* Message final */}
//         <div className="mt-12 text-center">
//           <p className="text-3xl font-extrabold font-display bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
//             "Le talent fait la différence, l'équipe fait la force."
//           </p>
//         </div>
//       </div>

//       {/* Styles CSS personnalisés pour les animations */}
//       <style jsx>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out forwards;
//         }
        
//         /* Applique l'animation de slideIn avec un délai pour chaque ligne */
//         tbody tr {
//           opacity: 0; /* Caché par défaut */
//         }
        
//         tbody tr[style*="animation-delay"] {
//           animation-name: fadeIn;
//           animation-duration: 0.6s;
//           animation-timing-function: ease-out;
//           animation-fill-mode: forwards;
//         }

//         @keyframes pulse-slow {
//           0%, 100% { opacity: 0.2; }
//           50% { opacity: 0.35; }
//         }
//         .animate-pulse-slow {
//           animation: pulse-slow 6s infinite ease-in-out;
//         }

//         @keyframes bounce-small {
//           0%, 100% {
//             transform: translateY(-5%);
//             animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
//           }
//           50% {
//             transform: translateY(0);
//             animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
//           }
//         }
//         .animate-bounce-small {
//           animation: bounce-small 1.5s infinite;
//         }
        
//         .rotate-360 {
//             transform: rotate(360deg);
//         }

//         .scale-101 {
//             transform: scale(1.01);
//         }
//         .scale-102 {
//             transform: scale(1.02);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EmployeesPage;