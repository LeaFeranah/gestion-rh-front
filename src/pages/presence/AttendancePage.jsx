
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/presence/';

// const AttendancePage = () => {
//   const [presences, setPresences] = useState([]);
//   const [periode, setPeriode] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [dates, setDates] = useState([]);

//   // Charger les présences et dates du mois
//   const fetchPresences = async (annee, mois) => {
//     try {
//       setLoading(true);
      
//       // Générer les dates d'abord
//       await axios.get(`${API_URL}generer-dates/`, {
//         params: { annee, mois }
//       });
      
//       // Récupérer les dates avec codes
//       const datesResponse = await axios.get(`${API_URL}dates/`, {
//         params: { annee, mois }
//       });
//       setDates(datesResponse.data);
      
//       // Récupérer les présences
//       const presencesResponse = await axios.get(`${API_URL}mois/`, {
//         params: { annee, mois, inclure_hors_periode: true }
//       });
      
//       setPeriode(presencesResponse.data.periode);
//       setPresences(presencesResponse.data.presences);
//     } catch (err) {
//       console.error('Erreur:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPresences(currentYear, currentMonth);
//   }, [currentYear, currentMonth]);

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

//   // Obtenir les données de pointage pour un jour
//   const getAttendanceData = (employee, dateStr) => {
//     return employee.presences[dateStr] || null;
//   };

//   // Grouper les dates par semaine
//   const groupDatesByWeek = () => {
//     const weeks = {};
//     dates.forEach(date => {
//       const semaine = date.code_date[0]; // Premier chiffre = numéro de semaine
//       if (!weeks[semaine]) {
//         weeks[semaine] = [];
//       }
//       weeks[semaine].push(date);
//     });
//     return weeks;
//   };

//   const employees = getEmployeeData();
//   const weeks = groupDatesByWeek();
//   const weekNumbers = Object.keys(weeks).sort();

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
//       {/* En-tête */}
//       <div className="bg-white border-2 border-gray-800 mb-4 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <div className="bg-gray-800 text-white px-6 py-3 font-bold text-lg">
//               AKANJO
//             </div>
//             <h1 className="text-2xl font-bold uppercase">FICHE DE PRESENCE:</h1>
//           </div>
//           <div className="text-right">
//             <h2 className="text-xl font-bold mb-3">
//               {periode?.mois} {periode?.annee}
//             </h2>
//             <div className="flex gap-3">
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">Mois</label>
//                 <select
//                   value={currentMonth}
//                   onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
//                   className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value={1}>Janvier</option>
//                   <option value={2}>Février</option>
//                   <option value={3}>Mars</option>
//                   <option value={4}>Avril</option>
//                   <option value={5}>Mai</option>
//                   <option value={6}>Juin</option>
//                   <option value={7}>Juillet</option>
//                   <option value={8}>Août</option>
//                   <option value={9}>Septembre</option>
//                   <option value={10}>Octobre</option>
//                   <option value={11}>Novembre</option>
//                   <option value={12}>Décembre</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">Année</label>
//                 <select
//                   value={currentYear}
//                   onChange={(e) => setCurrentYear(parseInt(e.target.value))}
//                   className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                 >
//                   {[...Array(11)].map((_, i) => {
//                     const year = 2020 + i;
//                     return <option key={year} value={year}>{year}</option>;
//                   })}
//                 </select>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
//           <div>
//             <span className="font-bold italic">SECTION:</span>
//             <span className="ml-4 font-semibold">BRODERIE MAIN DEV</span>
//           </div>
//           <div>
//             <span className="font-bold italic">Période du:</span>
//             <span className="ml-2">{periode?.du}</span>
//             <span className="mx-2 font-bold">au:</span>
//             <span>{periode?.au}</span>
//           </div>
//         </div>
//       </div>

//       {/* Tableau calendrier avec semaines */}
//       <div className="bg-white border-2 border-gray-800 overflow-x-auto">
//         <table className="w-full border-collapse text-xs">
//           {/* En-tête avec codes de date */}
//           <thead>
//             {/* Ligne des numéros de semaine */}
//             <tr className="bg-gray-100">
//               <th className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10" rowSpan="3">
//                 <div className="font-bold text-sm w-32">N° / NOM</div>
//               </th>
//               {weekNumbers.map((weekNum) => (
//                 <th 
//                   key={weekNum} 
//                   colSpan={weeks[weekNum].length}
//                   className="border border-gray-600 p-1 font-bold"
//                 >
//                   Semaine {weekNum}
//                 </th>
//               ))}
//             </tr>
            
//             {/* Ligne des codes de date */}
//             <tr className="bg-gray-100">
//               {dates.map((date, idx) => (
//                 <th key={idx} className="border border-gray-600 p-1 min-w-16">
//                   <div className="font-bold">{date.code_affichage}</div>
//                 </th>
//               ))}
//             </tr>
            
//             {/* Ligne des jours de la semaine */}
//             <tr className="bg-gray-100">
//               {dates.map((date, idx) => (
//                 <th key={idx} className="border border-gray-600 p-1">
//                   <div className="text-xs">
//                     {new Date(date.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
//                   </div>
//                   <div className="text-xs text-gray-600">
//                     {new Date(date.date).getDate()}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           {/* Corps avec les employés */}
//           <tbody>
//             {employees.map((employee, empIdx) => (
//               <React.Fragment key={empIdx}>
//                 {/* Ligne principale avec données */}
//                 <tr className="border-b-2 border-gray-800">
//                   <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
//                     <div className="flex items-baseline gap-2">
//                       <span className="font-bold text-sm">{employee.badgenumber}</span>
//                       <span className="italic text-sm">{employee.name}</span>
//                     </div>
//                   </td>
//                   {dates.map((date, dayIdx) => {
//                     const attendance = getAttendanceData(employee, date.date);
//                     return (
//                       <td key={dayIdx} className="border border-gray-600 p-0 text-center">
//                         <div className="flex flex-col h-full">
//                           {/* Ligne 1: Heure d'entrée */}
//                           <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-medium">
//                             {attendance?.heure_entree || ''}
//                           </div>
                          
//                           {/* Ligne 2: Événement */}
//                           <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-bold text-red-600">
//                             {attendance?.evenement || ''}
//                           </div>
                          
//                           {/* Ligne 3: Heure de sortie */}
//                           <div className="px-1 py-0.5 min-h-[20px] text-xs font-medium">
//                             {attendance?.heure_sortie || ''}
//                           </div>
//                         </div>
//                       </td>
//                     );
//                   })}
//                 </tr>

//                 {/* Ligne vide pour annotations */}
//                 <tr className="border-b border-gray-400">
//                   <td className="border-r-2 border-gray-800 p-1 sticky left-0 bg-gray-50 z-10"></td>
//                   {dates.map((date, dayIdx) => (
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
//             <span>X = Pointage</span>
//             <span>CP = Congé Payé</span>
//             <span>RM = Retard Matin</span>
//             <span>PM = Permission</span>
//             <span>F = Hors période</span>
//           </div>
//           <div className="text-gray-500 italic">
//             Page {employees.length} employés - {dates.length} jours
//           </div>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="mt-4 grid grid-cols-4 gap-4">
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <div className="text-sm text-gray-600">Total Employés</div>
//           <div className="text-2xl font-bold">{employees.length}</div>
//         </div>
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <div className="text-sm text-gray-600">Jours de la période</div>
//           <div className="text-2xl font-bold">{dates.filter(d => !d.hors_periode).length}</div>
//         </div>
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <div className="text-sm text-gray-600">Pointages total</div>
//           <div className="text-2xl font-bold">{presences.length}</div>
//         </div>
//         <div className="bg-white border border-gray-300 p-4 rounded">
//           <button
//             onClick={() => fetchPresences(currentYear, currentMonth)}
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



// AttendancePage.js
import React, { useState, useEffect } from 'react';
import presenceService from '../../services/presenceService';

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
      await presenceService.genererDates(annee, mois);
      
      // Récupérer les dates avec codes
      const datesData = await presenceService.getDates(annee, mois);
      setDates(datesData);
      
      // Récupérer les présences
      //const presencesData = await presenceService.getPresencesMois(annee, mois, true);
      // ✅ APRÈS
      const presencesData = await presenceService.getPresencesMois(annee, mois, false);
      
      setPeriode(presencesData.periode);
      setPresences(presencesData.presences);
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