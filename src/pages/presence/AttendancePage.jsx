// import React, { useState, useEffect } from 'react';
// import PresenceService from '../../services/presenceService';

// const AttendancePage = () => {
//   const [presences, setPresences] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [dateFilter, setDateFilter] = useState('');

//   // Charger les présences
//   const fetchPresences = async () => {
//     try {
//       setLoading(true);
//       const response = await PresenceService.getAllPresences();
//       setPresences(response.data);
//     } catch (err) {
//       console.error('Erreur:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPresences();
//   }, []);

//   // Filtrer les présences
//   const filteredPresences = presences.filter(presence => {
//     const matchesSearch = 
//       presence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       presence.badgenumber.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesDate = dateFilter ? presence.date === dateFilter : true;
    
//     return matchesSearch && matchesDate;
//   });

//   // Formater la date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('fr-FR', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   // Déterminer le statut et sa couleur
//   const getStatusInfo = (presence) => {
//     if (!presence.heure_entree && !presence.heure_sortie) {
//       return { status: 'Absent', color: 'bg-red-100 text-red-800' };
//     } else if (presence.heure_entree && !presence.heure_sortie) {
//       return { status: 'En cours', color: 'bg-yellow-100 text-yellow-800' };
//     } else if (presence.heure_entree && presence.heure_entree > '09:00:00') {
//       return { status: 'Retard', color: 'bg-orange-100 text-orange-800' };
//     } else {
//       return { status: 'Présent', color: 'bg-green-100 text-green-800' };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Chargement des présences...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       {/* En-tête */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Présences</h1>
//         <p className="text-gray-600">Suivi des pointages des employés</p>
//       </div>

//       {/* Filtres */}
//       <div className="bg-white rounded-xl shadow p-6 mb-6">
//         <div className="flex flex-col md:flex-row md:items-center gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Rechercher par nom ou numéro de badge..."
//                 className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                 </svg>
//               </div>
//               <input
//                 type="date"
//                 className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={dateFilter}
//                 onChange={(e) => setDateFilter(e.target.value)}
//               />
//             </div>

//             <button
//               onClick={fetchPresences}
//               className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//             >
//               <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
//               </svg>
//               Actualiser
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a5.5 5.5 0 01-5.5 5.5"></path>
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-500">Employés total</p>
//               <p className="text-2xl font-bold">
//                 {[...new Set(presences.map(p => p.userid))].length}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-500">Présents aujourd'hui</p>
//               <p className="text-2xl font-bold">
//                 {presences.filter(p => p.date === new Date().toISOString().split('T')[0]).length}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-red-100 rounded-lg">
//               <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-500">Retards</p>
//               <p className="text-2xl font-bold">
//                 {presences.filter(p => p.heure_entree && p.heure_entree > '09:00:00').length}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow p-6">
//           <div className="flex items-center">
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//               </svg>
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-500">Pointages total</p>
//               <p className="text-2xl font-bold">{presences.length}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tableau des présences */}
//       <div className="bg-white rounded-xl shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employé
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Entrée
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Sortie
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Événement
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Statut
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredPresences.length > 0 ? (
//                 filteredPresences.map((presence, index) => {
//                   const statusInfo = getStatusInfo(presence);
                  
//                   return (
//                     <tr key={index} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
//                             <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                             </svg>
//                           </div>
//                           <div className="ml-4">
//                             <div className="font-medium text-gray-900">
//                               {presence.name}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               Badge: {presence.badgenumber}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-gray-900">{formatDate(presence.date)}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">
//                           {presence.heure_entree || '--:--'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">
//                           {presence.heure_sortie || '--:--'}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="px-3 py-1 inline-flex text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {presence.evenement}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${statusInfo.color}`}>
//                           {statusInfo.status}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center">
//                     <div className="text-gray-400 mb-4">
//                       <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                       </svg>
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune présence trouvée</h3>
//                     <p className="text-gray-500">Aucun pointage ne correspond à vos critères de recherche</p>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {filteredPresences.length > 0 && (
//           <div className="px-6 py-4 border-t border-gray-200">
//             <div className="text-sm text-gray-500">
//               {filteredPresences.length} pointage(s) trouvé(s)
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Vue synthétique par employé */}
//       {filteredPresences.length > 0 && (
//         <div className="mt-8">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Synthèse par employé</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {(() => {
//               const employees = {};
//               filteredPresences.forEach(presence => {
//                 if (!employees[presence.userid]) {
//                   employees[presence.userid] = {
//                     employee: {
//                       userid: presence.userid,
//                       badgenumber: presence.badgenumber,
//                       name: presence.name
//                     },
//                     presences: []
//                   };
//                 }
//                 employees[presence.userid].presences.push(presence);
//               });

//               return Object.values(employees).slice(0, 6).map((group, index) => (
//                 <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
//                   <div className="flex items-center mb-4">
//                     <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
//                       <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
//                       </svg>
//                     </div>
//                     <div className="ml-4">
//                       <h4 className="font-medium text-gray-900">{group.employee.name}</h4>
//                       <p className="text-sm text-gray-500">Badge: {group.employee.badgenumber}</p>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Pointages total:</span>
//                       <span className="font-medium">{group.presences.length}</span>
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-600">Dernier pointage:</span>
//                       <span className="font-medium">
//                         {group.presences.length > 0 
//                           ? new Date(group.presences[group.presences.length - 1].date).toLocaleDateString('fr-FR')
//                           : 'Aucun'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ));
//             })()}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendancePage;


// import React, { useState, useEffect } from 'react';
// import PresenceService from '../../services/presenceService';

// const AttendancePage = () => {
//   const [presences, setPresences] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedSection, setSelectedSection] = useState('BRODERIE MAIN DEV');

//   // Charger les présences
//   const fetchPresences = async () => {
//     try {
//       setLoading(true);
//       const response = await PresenceService.getAllPresences();
//       setPresences(response.data);
//     } catch (err) {
//       console.error('Erreur:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPresences();
//   }, []);

//   // Obtenir les jours du mois
//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const days = [];

//     for (let d = 1; d <= lastDay.getDate(); d++) {
//       days.push(new Date(year, month, d));
//     }
//     return days;
//   };

//   // Grouper les présences par employé
//   const getEmployeeData = () => {
//     const employees = {};
//     presences.forEach(presence => {
//       if (!employees[presence.userid]) {
//         employees[presence.userid] = {
//           userid: presence.userid,
//           badgenumber: presence.badgenumber,
//           name: presence.name,
//           presences: {}
//         };
//       }
//       employees[presence.userid].presences[presence.date] = presence;
//     });
//     return Object.values(employees);
//   };

//   // Formater le mois
//   const formatMonth = (date) => {
//     return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
//   };

//   // Obtenir les données de pointage pour un jour
//   const getAttendanceData = (employee, date) => {
//     const dateStr = date.toISOString().split('T')[0];
//     const presence = employee.presences[dateStr];
    
//     if (!presence) return null;
    
//     return {
//       entree: presence.heure_entree,
//       sortie: presence.heure_sortie,
//       evenement: presence.evenement
//     };
//   };

//   // Changer de mois
//   const changeMonth = (direction) => {
//     const newDate = new Date(currentMonth);
//     newDate.setMonth(newDate.getMonth() + direction);
//     setCurrentMonth(newDate);
//   };

//   const days = getDaysInMonth(currentMonth);
//   const employees = getEmployeeData();
//   const startDate = days[0];
//   const endDate = days[days.length - 1];

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Chargement des présences...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {/* En-tête avec logo et titre */}
//       <div className="bg-white border-2 border-gray-800 mb-4 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <div className="bg-gray-800 text-white px-6 py-3 font-bold text-lg">
//               AKANJO
//             </div>
//             <h1 className="text-2xl font-bold uppercase">FICHE DE PRESENCE:</h1>
//           </div>
//           <div className="text-right">
//             <h2 className="text-xl font-bold">{formatMonth(currentMonth)}</h2>
//             <div className="flex gap-2 mt-2">
//               <button
//                 onClick={() => changeMonth(-1)}
//                 className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
//               >
//                 ← Mois précédent
//               </button>
//               <button
//                 onClick={() => changeMonth(1)}
//                 className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
//               >
//                 Mois suivant →
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
//           <div>
//             <span className="font-bold italic">SECTION:</span>
//             <span className="ml-4 font-semibold">{selectedSection}</span>
//           </div>
//           <div>
//             <span className="font-bold italic">Période du:</span>
//             <span className="ml-2">{startDate.toLocaleDateString('fr-FR')}</span>
//             <span className="mx-2 font-bold">au:</span>
//             <span>{endDate.toLocaleDateString('fr-FR')}</span>
//           </div>
//         </div>
//       </div>

//       {/* Tableau calendrier */}
//       <div className="bg-white border-2 border-gray-800 overflow-x-auto">
//         <table className="w-full border-collapse">
//           {/* En-tête avec les jours */}
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10" rowSpan="2">
//                 <div className="font-bold text-sm w-32">N° / NOM</div>
//               </th>
//               {days.map((day, idx) => (
//                 <th key={idx} className="border border-gray-600 p-1 min-w-16">
//                   <div className="text-xs font-bold">{day.getDate()}</div>
//                 </th>
//               ))}
//             </tr>
//             <tr className="bg-gray-100">
//               {days.map((day, idx) => (
//                 <th key={idx} className="border border-gray-600 p-1 text-xs">
//                   {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           {/* Corps avec les employés */}
//           <tbody>
//             {employees.map((employee, empIdx) => (
//               <React.Fragment key={empIdx}>
//                 {/* Ligne avec numéro et nom */}
//                 <tr className="border-b-2 border-gray-800">
//                   <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
//                     <div className="flex items-baseline gap-2">
//                       <span className="font-bold text-sm">{employee.badgenumber}</span>
//                       <span className="italic text-sm">{employee.name}</span>
//                     </div>
//                   </td>
//                   {days.map((day, dayIdx) => {
//                     const attendance = getAttendanceData(employee, day);
//                     return (
//                       <td key={dayIdx} className="border border-gray-600 p-0.5 text-center align-top">
//                         {attendance && (
//                           <div className="text-xs leading-tight">
//                             {attendance.entree && (
//                               <div className="font-medium">
//                                 {attendance.entree.substring(0, 5)}
//                               </div>
//                             )}
//                             {attendance.sortie && (
//                               <div className="font-medium">
//                                 {attendance.sortie.substring(0, 5)}
//                               </div>
//                             )}
//                             {attendance.evenement && (
//                               <div className="text-blue-600 font-bold text-xs">
//                                 {attendance.evenement === 'Congé' ? 'CP' : 
//                                  attendance.evenement === 'Absent' ? 'X' : 
//                                  attendance.evenement.substring(0, 2).toUpperCase()}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </td>
//                     );
//                   })}
//                 </tr>

//                 {/* Ligne vide pour annotations */}
//                 <tr className="border-b border-gray-400">
//                   <td className="border-r-2 border-gray-800 p-1 sticky left-0 bg-gray-50 z-10"></td>
//                   {days.map((day, dayIdx) => (
//                     <td key={dayIdx} className="border border-gray-300 p-1 h-8 bg-gray-50"></td>
//                   ))}
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pied de page */}
//       <div className="bg-white border-2 border-t-0 border-gray-800 p-4">
//         <div className="flex justify-between items-center text-sm">
//           <div className="flex gap-6">
//             <span><strong>Légende:</strong></span>
//             <span>CP = Congé Payé</span>
//             <span>X = Absent</span>
//             <span>RM = Retard Matin</span>
//             <span>PM = Permission</span>
//           </div>
//           <div className="text-gray-500 italic">
//             Page {employees.length} employés
//           </div>
//         </div>
//       </div>

//       {/* Statistiques rapides */}
//       <div className="mt-4 grid grid-cols-4 gap-4">
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <div className="text-sm text-gray-600">Total Employés</div>
//           <div className="text-2xl font-bold">{employees.length}</div>
//         </div>
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <div className="text-sm text-gray-600">Jours du mois</div>
//           <div className="text-2xl font-bold">{days.length}</div>
//         </div>
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <div className="text-sm text-gray-600">Pointages total</div>
//           <div className="text-2xl font-bold">{presences.length}</div>
//         </div>
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <button
//             onClick={fetchPresences}
//             className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           >
//             Actualiser
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendancePage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/presence/';

const AttendancePage = () => {
  const [presences, setPresences] = useState([]);
  const [periode, setPeriode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dates, setDates] = useState([]);

  // Charger les présences et dates du mois
  const fetchPresences = async (annee, mois) => {
    try {
      setLoading(true);
      
      // Générer les dates d'abord
      await axios.get(`${API_URL}generer-dates/`, {
        params: { annee, mois }
      });
      
      // Récupérer les dates avec codes
      const datesResponse = await axios.get(`${API_URL}dates/`, {
        params: { annee, mois }
      });
      setDates(datesResponse.data);
      
      // Récupérer les présences
      const presencesResponse = await axios.get(`${API_URL}mois/`, {
        params: { annee, mois, inclure_hors_periode: true }
      });
      
      setPeriode(presencesResponse.data.periode);
      setPresences(presencesResponse.data.presences);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresences(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Grouper les présences par employé
  const getEmployeeData = () => {
    const employees = {};
    presences.forEach(presence => {
      if (!employees[presence.userid]) {
        employees[presence.userid] = {
          userid: presence.userid,
          badgenumber: presence.badgenumber,
          name: presence.name,
          presences: {}
        };
      }
      employees[presence.userid].presences[presence.date] = presence;
    });
    return Object.values(employees);
  };

  // Obtenir les données de pointage pour un jour
  const getAttendanceData = (employee, dateStr) => {
    return employee.presences[dateStr] || null;
  };

  // Grouper les dates par semaine
  const groupDatesByWeek = () => {
    const weeks = {};
    dates.forEach(date => {
      const semaine = date.code_date[0]; // Premier chiffre = numéro de semaine
      if (!weeks[semaine]) {
        weeks[semaine] = [];
      }
      weeks[semaine].push(date);
    });
    return weeks;
  };

  const employees = getEmployeeData();
  const weeks = groupDatesByWeek();
  const weekNumbers = Object.keys(weeks).sort();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des présences...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-white border-2 border-gray-800 mb-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 text-white px-6 py-3 font-bold text-lg">
              AKANJO
            </div>
            <h1 className="text-2xl font-bold uppercase">FICHE DE PRESENCE:</h1>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold mb-3">
              {periode?.mois} {periode?.annee}
            </h2>
            <div className="flex gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mois</label>
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Janvier</option>
                  <option value={2}>Février</option>
                  <option value={3}>Mars</option>
                  <option value={4}>Avril</option>
                  <option value={5}>Mai</option>
                  <option value={6}>Juin</option>
                  <option value={7}>Juillet</option>
                  <option value={8}>Août</option>
                  <option value={9}>Septembre</option>
                  <option value={10}>Octobre</option>
                  <option value={11}>Novembre</option>
                  <option value={12}>Décembre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Année</label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(11)].map((_, i) => {
                    const year = 2020 + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
          <div>
            <span className="font-bold italic">SECTION:</span>
            <span className="ml-4 font-semibold">BRODERIE MAIN DEV</span>
          </div>
          <div>
            <span className="font-bold italic">Période du:</span>
            <span className="ml-2">{periode?.du}</span>
            <span className="mx-2 font-bold">au:</span>
            <span>{periode?.au}</span>
          </div>
        </div>
      </div>

      {/* Tableau calendrier avec semaines */}
      <div className="bg-white border-2 border-gray-800 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          {/* En-tête avec codes de date */}
          <thead>
            {/* Ligne des numéros de semaine */}
            <tr className="bg-gray-100">
              <th className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10" rowSpan="3">
                <div className="font-bold text-sm w-32">N° / NOM</div>
              </th>
              {weekNumbers.map((weekNum) => (
                <th 
                  key={weekNum} 
                  colSpan={weeks[weekNum].length}
                  className="border border-gray-600 p-1 font-bold"
                >
                  Semaine {weekNum}
                </th>
              ))}
            </tr>
            
            {/* Ligne des codes de date */}
            <tr className="bg-gray-100">
              {dates.map((date, idx) => (
                <th key={idx} className="border border-gray-600 p-1 min-w-16">
                  <div className="font-bold">{date.code_affichage}</div>
                </th>
              ))}
            </tr>
            
            {/* Ligne des jours de la semaine */}
            <tr className="bg-gray-100">
              {dates.map((date, idx) => (
                <th key={idx} className="border border-gray-600 p-1">
                  <div className="text-xs">
                    {new Date(date.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(date.date).getDate()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Corps avec les employés */}
          <tbody>
            {employees.map((employee, empIdx) => (
              <React.Fragment key={empIdx}>
                {/* Ligne principale avec données */}
                <tr className="border-b-2 border-gray-800">
                  <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-sm">{employee.badgenumber}</span>
                      <span className="italic text-sm">{employee.name}</span>
                    </div>
                  </td>
                  {dates.map((date, dayIdx) => {
                    const attendance = getAttendanceData(employee, date.date);
                    return (
                      <td key={dayIdx} className="border border-gray-600 p-0 text-center">
                        <div className="flex flex-col h-full">
                          {/* Ligne 1: Heure d'entrée */}
                          <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-medium">
                            {attendance?.heure_entree || ''}
                          </div>
                          
                          {/* Ligne 2: Événement */}
                          <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-bold text-red-600">
                            {attendance?.evenement || ''}
                          </div>
                          
                          {/* Ligne 3: Heure de sortie */}
                          <div className="px-1 py-0.5 min-h-[20px] text-xs font-medium">
                            {attendance?.heure_sortie || ''}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Ligne vide pour annotations */}
                <tr className="border-b border-gray-400">
                  <td className="border-r-2 border-gray-800 p-1 sticky left-0 bg-gray-50 z-10"></td>
                  {dates.map((date, dayIdx) => (
                    <td key={dayIdx} className="border border-gray-300 p-1 h-8 bg-gray-50"></td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pied de page */}
      <div className="bg-white border-2 border-t-0 border-gray-800 p-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <span><strong>Légende:</strong></span>
            <span>X = Pointage</span>
            <span>CP = Congé Payé</span>
            <span>RM = Retard Matin</span>
            <span>PM = Permission</span>
            <span>F = Hors période</span>
          </div>
          <div className="text-gray-500 italic">
            Page {employees.length} employés - {dates.length} jours
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 p-4 rounded">
          <div className="text-sm text-gray-600">Total Employés</div>
          <div className="text-2xl font-bold">{employees.length}</div>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded">
          <div className="text-sm text-gray-600">Jours de la période</div>
          <div className="text-2xl font-bold">{dates.filter(d => !d.hors_periode).length}</div>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded">
          <div className="text-sm text-gray-600">Pointages total</div>
          <div className="text-2xl font-bold">{presences.length}</div>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded">
          <button
            onClick={() => fetchPresences(currentYear, currentMonth)}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Actualiser
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;