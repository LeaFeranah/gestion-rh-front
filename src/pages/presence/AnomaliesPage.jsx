// import React, { useState, useEffect, useCallback } from "react";
// import { AlertCircle, CheckCircle, Edit2, Save, X, RefreshCw } from "lucide-react";
// import anomalieService from "../../services/anomalieService";

// const getEtatColor = (etat) => {
//   const colors = {
//     absence_entree: "bg-red-100 text-red-700 border-red-300",
//     absence_sortie: "bg-orange-100 text-orange-700 border-orange-300",
//     entree_non_conforme: "bg-yellow-100 text-yellow-700 border-yellow-300",
//     sortie_non_conforme: "bg-yellow-100 text-yellow-700 border-yellow-300",
//     ok: "bg-green-100 text-green-700 border-green-300",
//   };
//   return colors[etat] || "bg-gray-100 text-gray-700 border-gray-300";
// };

// const AnomalieRow = ({ anomalie, onUpdate }) => {
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     heure_reelle_entree: anomalie.heure_reelle_entree || "",
//     heure_reelle_sortie: anomalie.heure_reelle_sortie || "",
//     commentaire: anomalie.commentaire || "",
//   });
//   const [saving, setSaving] = useState(false);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       await anomalieService.updateAnomalie(anomalie.id, formData);
//       await onUpdate();
//       setEditing(false);
//     } catch (err) {
//       console.error("Erreur:", err);
//       alert("Erreur lors de la sauvegarde");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <tr className="border-b-2 border-gray-300 hover:bg-gray-50">
//       <td className="border-2 border-gray-300 p-2 font-semibold">
//         {anomalie.section}
//       </td>
//       <td className="border-2 border-gray-300 p-2 text-center">
//         {anomalie.badgenumber}
//       </td>
//       <td className="border-2 border-gray-300 p-2">{anomalie.user_name}</td>
//       <td className="border-2 border-gray-300 p-2 text-center text-xs">
//         {anomalie.checktype || "-"}
//       </td>

//       {/* Code date RÉEL */}
//       <td className="border-2 border-gray-300 p-2 text-center">
//         <div className="space-y-1">
//           {editing ? (
//             <>
//               <input
//                 type="time"
//                 value={formData.heure_reelle_entree}
//                 onChange={(e) =>
//                   setFormData({ ...formData, heure_reelle_entree: e.target.value })
//                 }
//                 className="w-full px-2 py-1 border rounded text-sm"
//               />
//               <input
//                 type="time"
//                 value={formData.heure_reelle_sortie}
//                 onChange={(e) =>
//                   setFormData({ ...formData, heure_reelle_sortie: e.target.value })
//                 }
//                 className="w-full px-2 py-1 border rounded text-sm"
//               />
//             </>
//           ) : (
//             <>
//               <div className="text-sm">
//                 {anomalie.heure_reelle_entree
//                   ? anomalie.heure_reelle_entree.slice(0, 5)
//                   : "-"}
//               </div>
//               <div className="text-sm">
//                 {anomalie.heure_reelle_sortie
//                   ? anomalie.heure_reelle_sortie.slice(0, 5)
//                   : "-"}
//               </div>
//             </>
//           )}
//         </div>
//       </td>

//       {/* Code date P (comptabilisées) */}
//       <td className="border-2 border-gray-300 p-2 text-center bg-blue-50">
//         <div className="space-y-1">
//           <div className="text-sm">
//             {anomalie.heure_comptabilisee_entree
//               ? anomalie.heure_comptabilisee_entree.slice(0, 5)
//               : "-"}
//           </div>
//           <div className="text-sm">
//             {anomalie.heure_comptabilisee_sortie
//               ? anomalie.heure_comptabilisee_sortie.slice(0, 5)
//               : "-"}
//           </div>
//         </div>
//       </td>

//       {/* Code date B (brutes - NON MODIFIABLE) */}
//       <td className="border-2 border-gray-300 p-2 text-center bg-gray-100">
//         <div className="space-y-1">
//           <div className="text-sm">
//             {anomalie.heure_brute_entree
//               ? anomalie.heure_brute_entree.slice(0, 5)
//               : "-"}
//           </div>
//           <div className="text-sm">
//             {anomalie.heure_brute_sortie
//               ? anomalie.heure_brute_sortie.slice(0, 5)
//               : "-"}
//           </div>
//         </div>
//       </td>

//       {/* État */}
//       <td className="border-2 border-gray-300 p-2">
//         <div className="flex items-center justify-between gap-2">
//           <span
//             className={`px-2 py-1 rounded text-xs font-medium border-2 ${getEtatColor(
//               anomalie.etat
//             )}`}
//           >
//             {anomalie.etat_display}
//           </span>
//           {editing ? (
//             <div className="flex gap-1">
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="p-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
//               >
//                 <Save className="w-4 h-4" />
//               </button>
//               <button
//                 onClick={() => setEditing(false)}
//                 className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setEditing(true)}
//               className="p-1 border-2 border-gray-800 rounded hover:bg-gray-100"
//             >
//               <Edit2 className="w-4 h-4" />
//             </button>
//           )}
//         </div>
//       </td>
//     </tr>
//   );
// };

// const AnomaliesPage = () => {
//   const [sectionsData, setSectionsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [selectedSection, setSelectedSection] = useState("all");
//   const [selectedDate, setSelectedDate] = useState("all");
//   const [detecting, setDetecting] = useState(false);
//   const [stats, setStats] = useState(null);

//   const fetchAnomalies = useCallback(async () => {
//     try {
//       setLoading(true);
//       const data = await anomalieService.getAnomaliesParSection(
//         currentYear,
//         currentMonth
//       );
//       setSectionsData(data.sections || []);

//       // Récupérer aussi les statistiques globales
//       const statsData = await anomalieService.getAnomalies(
//         currentYear,
//         currentMonth
//       );
//       setStats(statsData.statistiques);
//     } catch (err) {
//       console.error("Erreur:", err);
//       alert("Erreur lors du chargement des anomalies");
//     } finally {
//       setLoading(false);
//     }
//   }, [currentYear, currentMonth]);

//   const handleDetect = async () => {
//     if (
//       !window.confirm(
//         "Voulez-vous détecter les anomalies pour ce mois ?\n\nCela peut prendre quelques instants."
//       )
//     ) {
//       return;
//     }

//     setDetecting(true);
//     try {
//       const result = await anomalieService.detecterAnomalies(
//         currentYear,
//         currentMonth
//       );
//       alert(result.message);
//       await fetchAnomalies();
//     } catch (err) {
//       console.error("Erreur:", err);
//       alert("Erreur lors de la détection des anomalies");
//     } finally {
//       setDetecting(false);
//     }
//   };

//   useEffect(() => {
//     fetchAnomalies();
//   }, [fetchAnomalies]);

//   // Filtrer les données
//   const filteredData = React.useMemo(() => {
//     let result = sectionsData;

//     if (selectedSection !== "all") {
//       result = result.filter((s) => s.section === selectedSection);
//     }

//     if (selectedDate !== "all") {
//       result = result.map((section) => ({
//         ...section,
//         par_date: {
//           [selectedDate]: section.par_date[selectedDate] || [],
//         },
//       }));
//     }

//     return result;
//   }, [sectionsData, selectedSection, selectedDate]);

//   // Liste des dates uniques
//   const allDates = React.useMemo(() => {
//     const dates = new Set();
//     sectionsData.forEach((section) => {
//       Object.keys(section.par_date).forEach((date) => dates.add(date));
//     });
//     return Array.from(dates).sort();
//   }, [sectionsData]);

//   // Liste des sections uniques
//   const allSections = React.useMemo(() => {
//     return sectionsData.map((s) => s.section).sort();
//   }, [sectionsData]);

//   if (loading && sectionsData.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
//         <p className="text-gray-600">Chargement des anomalies...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {/* En-tête */}
//       <div className="bg-white border-2 border-gray-800 mb-4 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <div className="bg-red-600 text-white px-6 py-3 font-bold text-lg flex items-center gap-2">
//               <AlertCircle className="w-6 h-6" />
//               ANOMALIES
//             </div>
//             <h1 className="text-2xl font-bold uppercase">
//               Gestion des Anomalies de Pointage
//             </h1>
//           </div>

//           <div className="text-right">
//             <div className="flex gap-3 mb-3">
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">Mois</label>
//                 <select
//                   value={currentMonth}
//                   onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
//                   className="px-3 py-2 border border-gray-300 rounded"
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
//                   className="px-3 py-2 border border-gray-300 rounded"
//                 >
//                   {[...Array(11)].map((_, i) => {
//                     const year = 2020 + i;
//                     return (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//             </div>
//             <button
//               onClick={handleDetect}
//               disabled={detecting}
//               className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
//             >
//               {detecting ? (
//                 <>
//                   <RefreshCw className="w-4 h-4 animate-spin" />
//                   Détection...
//                 </>
//               ) : (
//                 <>
//                   <RefreshCw className="w-4 h-4" />
//                   Détecter les anomalies
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Statistiques */}
//         {stats && (
//           <div className="grid grid-cols-4 gap-4 border-t-2 border-gray-800 pt-4">
//             <div className="bg-gray-100 p-3 rounded">
//               <div className="text-2xl font-bold">{stats.total}</div>
//               <div className="text-sm text-gray-600">Total anomalies</div>
//             </div>
//             <div className="bg-red-100 p-3 rounded">
//               <div className="text-2xl font-bold text-red-700">
//                 {stats.non_corrigees}
//               </div>
//               <div className="text-sm text-red-700">Non corrigées</div>
//             </div>
//             <div className="bg-green-100 p-3 rounded">
//               <div className="text-2xl font-bold text-green-700">
//                 {stats.corrigees}
//               </div>
//               <div className="text-sm text-green-700">Corrigées</div>
//             </div>
//             <div className="bg-blue-100 p-3 rounded">
//               <div className="text-2xl font-bold text-blue-700">
//                 {Math.round((stats.corrigees / stats.total) * 100) || 0}%
//               </div>
//               <div className="text-sm text-blue-700">Taux de correction</div>
//             </div>
//           </div>
//         )}

//         {/* Filtres */}
//         <div className="flex gap-4 mt-4 border-t-2 border-gray-800 pt-4">
//           <div className="flex-1">
//             <label className="block text-xs text-gray-600 mb-1">
//               Filtrer par section
//             </label>
//             <select
//               value={selectedSection}
//               onChange={(e) => setSelectedSection(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//             >
//               <option value="all">Toutes les sections</option>
//               {allSections.map((section) => (
//                 <option key={section} value={section}>
//                   {section}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="flex-1">
//             <label className="block text-xs text-gray-600 mb-1">
//               Filtrer par date
//             </label>
//             <select
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//             >
//               <option value="all">Toutes les dates</option>
//               {allDates.map((date) => (
//                 <option key={date} value={date}>
//                   {new Date(date).toLocaleDateString("fr-FR")}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Légende */}
//         <div className="mt-4 border-t-2 border-gray-800 pt-4">
//           <div className="text-sm font-bold mb-2">Légende des colonnes:</div>
//           <div className="grid grid-cols-3 gap-4 text-xs">
//             <div>
//               <span className="font-bold">Code date RÉEL:</span> Heures réelles
//               (modifiable)
//             </div>
//             <div>
//               <span className="font-bold">Code date P:</span> Heures comptabilisées
//               (identiques aux réelles)
//             </div>
//             <div>
//               <span className="font-bold">Code date B:</span> Heures brutes (non
//               modifiable)
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tableau des anomalies par section */}
//       {filteredData.length === 0 ? (
//         <div className="bg-white border-2 border-gray-800 p-8 text-center">
//           <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
//           <p className="text-xl font-bold text-gray-700">
//             Aucune anomalie détectée !
//           </p>
//           <p className="text-gray-600 mt-2">
//             Utilisez le bouton "Détecter les anomalies" pour lancer une analyse.
//           </p>
//         </div>
//       ) : (
//         filteredData.map((section) => (
//           <div key={section.section} className="mb-6">
//             <div className="bg-gray-800 text-white px-4 py-3 font-bold flex items-center justify-between">
//               <span>{section.section}</span>
//               <span className="text-sm">
//                 {section.total} anomalie(s) - {section.corrigees} corrigée(s)
//               </span>
//             </div>

//             {Object.entries(section.par_date).map(([dateStr, anomalies]) => (
//               <div key={dateStr} className="bg-white border-2 border-gray-800 mb-2">
//                 <div className="bg-gray-100 px-4 py-2 font-semibold border-b-2 border-gray-800">
//                   {new Date(dateStr).toLocaleDateString("fr-FR", {
//                     weekday: "long",
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                   <span className="ml-4 text-sm text-gray-600">
//                     ({anomalies.length} anomalie(s))
//                   </span>
//                 </div>

//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse text-sm">
//                     <thead>
//                       <tr className="bg-gray-200">
//                         <th className="border-2 border-gray-300 p-2">Section</th>
//                         <th className="border-2 border-gray-300 p-2">Badge</th>
//                         <th className="border-2 border-gray-300 p-2">Nom</th>
//                         <th className="border-2 border-gray-300 p-2">Type</th>
//                         <th className="border-2 border-gray-300 p-2">
//                           Code date RÉEL
//                         </th>
//                         <th className="border-2 border-gray-300 p-2 bg-blue-50">
//                           Code date P
//                         </th>
//                         <th className="border-2 border-gray-300 p-2 bg-gray-100">
//                           Code date B
//                         </th>
//                         <th className="border-2 border-gray-300 p-2">État</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {anomalies.map((anomalie) => (
//                         <AnomalieRow
//                           key={anomalie.id}
//                           anomalie={anomalie}
//                           onUpdate={fetchAnomalies}
//                         />
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AnomaliesPage;



import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, CheckCircle, Edit2, Save, X, RefreshCw } from "lucide-react";
import anomalieService from "../../services/anomalieService";
import presenceService from "../../services/presenceService";

// Utilitaire pour convertir décimal vers HH:MM
const decimalToTime = (decimal) => {
  if (!decimal && decimal !== 0) return "00:00";
  
  const decimalNum = parseFloat(decimal);
  const hours = Math.floor(decimalNum);
  const minutes = Math.round((decimalNum - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const getEtatColor = (etat) => {
  const colors = {
    absence_entree: "bg-red-100 text-red-700 border-red-300",
    absence_sortie: "bg-orange-100 text-orange-700 border-orange-300",
    entree_non_conforme: "bg-yellow-100 text-yellow-700 border-yellow-300",
    sortie_non_conforme: "bg-yellow-100 text-yellow-700 border-yellow-300",
    ok: "bg-green-100 text-green-700 border-green-300",
  };
  return colors[etat] || "bg-gray-100 text-gray-700 border-gray-300";
};

const AnomalieRow = ({ anomalie, onUpdate, horairesDict }) => {
  const [editing, setEditing] = useState(false);
  
  // Récupérer l'horaire de la section avec useMemo pour éviter les re-rendus
  const horaireSection = React.useMemo(() => {
    return horairesDict[anomalie.section] || horairesDict["ADMINISTRATION"] || {};
  }, [horairesDict, anomalie.section]);
  
  // Déterminer les heures prévues selon le type de jour avec useMemo
  const heuresPrevues = React.useMemo(() => {
    const date = new Date(anomalie.date);
    const estSamedi = date.getDay() === 6;
    
    // Pour l'instant, on utilise les heures normales
    // TODO: Vérifier si c'est un jour de paiement pour utiliser sortie_vendredi_paiement ou sortie_samedi_paiement
    const heureEntree = decimalToTime(horaireSection.heure_entree || 7.50);
    let heureSortie;
    
    if (estSamedi) {
      heureSortie = decimalToTime(horaireSection.sortie_samedi || 15.50);
    } else {
      heureSortie = decimalToTime(horaireSection.heure_sortie || 17.50);
    }
    
    return { heureEntree, heureSortie };
  }, [horaireSection, anomalie.date]);
  
  const [formData, setFormData] = useState({
    heure_reelle_entree: anomalie.heure_reelle_entree || heuresPrevues.heureEntree,
    heure_reelle_sortie: anomalie.heure_reelle_sortie || heuresPrevues.heureSortie,
    commentaire: anomalie.commentaire || "",
  });
  const [saving, setSaving] = useState(false);

  // Mettre à jour formData quand les horaires changent
  useEffect(() => {
    if (!editing && !anomalie.heure_reelle_entree) {
      setFormData(prev => ({
        ...prev,
        heure_reelle_entree: heuresPrevues.heureEntree,
        heure_reelle_sortie: heuresPrevues.heureSortie,
      }));
    }
  }, [heuresPrevues, editing, anomalie.heure_reelle_entree]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await anomalieService.updateAnomalie(anomalie.id, formData);
      await onUpdate();
      setEditing(false);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr className="border-b-2 border-gray-300 hover:bg-gray-50">
      <td className="border-2 border-gray-300 p-2 font-semibold">
        {anomalie.section}
      </td>
      <td className="border-2 border-gray-300 p-2 text-center">
        {anomalie.badgenumber}
      </td>
      <td className="border-2 border-gray-300 p-2">{anomalie.user_name}</td>
      <td className="border-2 border-gray-300 p-2 text-center text-xs">
        {anomalie.checktype || "-"}
      </td>

      {/* Code date RÉEL - TOUJOURS affiche les heures prévues par section (modifiable) */}
      <td className="border-2 border-gray-300 p-2 text-center bg-yellow-50">
        <div className="space-y-1">
          {editing ? (
            <>
              <input
                type="time"
                value={formData.heure_reelle_entree}
                onChange={(e) =>
                  setFormData({ ...formData, heure_reelle_entree: e.target.value })
                }
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder={heuresPrevues.heureEntree}
              />
              <input
                type="time"
                value={formData.heure_reelle_sortie}
                onChange={(e) =>
                  setFormData({ ...formData, heure_reelle_sortie: e.target.value })
                }
                className="w-full px-2 py-1 border rounded text-sm"
                placeholder={heuresPrevues.heureSortie}
              />
            </>
          ) : (
            <>
              <div className="text-sm font-semibold text-yellow-700">
                E: {heuresPrevues.heureEntree}
              </div>
              <div className="text-sm font-semibold text-yellow-700">
                S: {heuresPrevues.heureSortie}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Code date P (comptabilisées) */}
      <td className="border-2 border-gray-300 p-2 text-center bg-blue-50">
        <div className="space-y-1">
          <div className="text-sm">
            {anomalie.heure_comptabilisee_entree
              ? anomalie.heure_comptabilisee_entree.slice(0, 5)
              : "-"}
          </div>
          <div className="text-sm">
            {anomalie.heure_comptabilisee_sortie
              ? anomalie.heure_comptabilisee_sortie.slice(0, 5)
              : "-"}
          </div>
        </div>
      </td>

      {/* Code date B (brutes - NON MODIFIABLE) */}
      <td className="border-2 border-gray-300 p-2 text-center bg-gray-100">
        <div className="space-y-1">
          <div className="text-sm">
            {anomalie.heure_brute_entree
              ? anomalie.heure_brute_entree.slice(0, 5)
              : "-"}
          </div>
          <div className="text-sm">
            {anomalie.heure_brute_sortie
              ? anomalie.heure_brute_sortie.slice(0, 5)
              : "-"}
          </div>
        </div>
      </td>

      {/* État */}
      <td className="border-2 border-gray-300 p-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium border-2 ${getEtatColor(
              anomalie.etat
            )}`}
          >
            {anomalie.etat_display}
          </span>
          {editing ? (
            <div className="flex gap-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditing(false)}
                className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="p-1 border-2 border-gray-800 rounded hover:bg-gray-100"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const AnomaliesPage = () => {
  const [sectionsData, setSectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [detecting, setDetecting] = useState(false);
  const [stats, setStats] = useState(null);
  const [horaires, setHoraires] = useState([]);

  // Dictionnaire des horaires par section
  const horairesDict = React.useMemo(() => {
    const dict = {};
    horaires.forEach(h => {
      dict[h.section] = h;
    });
    return dict;
  }, [horaires]);

  const fetchHoraires = useCallback(async () => {
    try {
      const horairesData = await presenceService.getHorairesSection();
      setHoraires(horairesData.horaires || []);
    } catch (err) {
      console.error("Erreur chargement horaires:", err);
    }
  }, []);

  const fetchAnomalies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await anomalieService.getAnomaliesParSection(
        currentYear,
        currentMonth
      );
      setSectionsData(data.sections || []);

      // Récupérer aussi les statistiques globales
      const statsData = await anomalieService.getAnomalies(
        currentYear,
        currentMonth
      );
      setStats(statsData.statistiques);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors du chargement des anomalies");
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  const handleDetect = async () => {
    if (
      !window.confirm(
        "Voulez-vous détecter les anomalies pour ce mois ?\n\nCela peut prendre quelques instants."
      )
    ) {
      return;
    }

    setDetecting(true);
    try {
      const result = await anomalieService.detecterAnomalies(
        currentYear,
        currentMonth
      );
      alert(result.message);
      await fetchAnomalies();
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la détection des anomalies");
    } finally {
      setDetecting(false);
    }
  };

  useEffect(() => {
    fetchHoraires();
    fetchAnomalies();
  }, [fetchHoraires, fetchAnomalies]);

  const getDateRangeForMonth = (year, month) => {
    // mois JavaScript 0-indexé : janvier = 0
    const start = new Date(year, month - 1, 22); // 21 du mois précédent
    start.setMonth(start.getMonth() - 1); // 21 du mois précédent
    const end = new Date(year, month - 1, 21); // 20 du mois sélectionné
    const format = (d) => d.toISOString().split("T")[0]; // format YYYY-MM-DD
    return { minDate: format(start), maxDate: format(end) };
  };

  const { minDate, maxDate } = getDateRangeForMonth(currentYear, currentMonth);

  // Filtrer les données
  const filteredData = React.useMemo(() => {
      let result = sectionsData;
  
      if (selectedSection !== "all") {
        result = result.filter((s) => s.section === selectedSection);
      }
  
      if (selectedDate !== "all") {
        result = result.map((section) => ({
          ...section,
          par_date: {
            [selectedDate]: section.par_date[selectedDate] || [],
          },
        }));
      }
  
      return result;
    }, [sectionsData, selectedSection, selectedDate]);

  // Liste des dates uniques
  const allDates = React.useMemo(() => {
    const dates = new Set();
    sectionsData.forEach((section) => {
      Object.keys(section.par_date).forEach((date) => dates.add(date));
    });
    return Array.from(dates).sort();
  }, [sectionsData]);

  // Liste des sections uniques
  const allSections = React.useMemo(() => {
    return sectionsData.map((s) => s.section).sort();
  }, [sectionsData]);

  if (loading && sectionsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des anomalies...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-white border-2 border-gray-800 mb-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-red-600 text-white px-6 py-3 font-bold text-lg flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              ANOMALIES
            </div>
            <h1 className="text-2xl font-bold uppercase">
              Gestion des Anomalies de Pointage
            </h1>
          </div>

          <div className="text-right">
            <div className="flex gap-3 mb-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mois</label>
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded"
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
                  className="px-3 py-2 border border-gray-300 rounded"
                >
                  {[...Array(11)].map((_, i) => {
                    const year = 2020 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {detecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Détection...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Détecter les anomalies
                </>
              )}
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-4 gap-4 border-t-2 border-gray-800 pt-4">
            <div className="bg-gray-100 p-3 rounded">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total anomalies</div>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <div className="text-2xl font-bold text-red-700">
                {stats.non_corrigees}
              </div>
              <div className="text-sm text-red-700">Non corrigées</div>
            </div>
            <div className="bg-green-100 p-3 rounded">
              <div className="text-2xl font-bold text-green-700">
                {stats.corrigees}
              </div>
              <div className="text-sm text-green-700">Corrigées</div>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round((stats.corrigees / stats.total) * 100) || 0}%
              </div>
              <div className="text-sm text-blue-700">Taux de correction</div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex gap-4 mt-4 border-t-2 border-gray-800 pt-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">
              Filtrer par section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="all">Toutes les sections</option>
              {allSections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">
              Filtrer par date
            </label>
            <input
              type="date"
              value={selectedDate === "all" ? "" : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || "all")}
              min={minDate}
              max={maxDate}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* Légende */}
        <div className="mt-4 border-t-2 border-gray-800 pt-4">
          <div className="text-sm font-bold mb-2">Légende des colonnes:</div>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-yellow-50 p-2 rounded border-2 border-yellow-200">
              <span className="font-bold">Code date RÉEL:</span> Heures prévues par section (modifiable)
            </div>
            <div className="bg-blue-50 p-2 rounded border-2 border-blue-200">
              <span className="font-bold">Code date P:</span> Heures comptabilisées (identiques aux réelles)
            </div>
            <div className="bg-gray-100 p-2 rounded border-2 border-gray-300">
              <span className="font-bold">Code date B:</span> Heures brutes du pointage (non modifiable)
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des anomalies par section */}
      {filteredData.length === 0 ? (
        <div className="bg-white border-2 border-gray-800 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-700">
            Aucune anomalie détectée !
          </p>
          <p className="text-gray-600 mt-2">
            Utilisez le bouton "Détecter les anomalies" pour lancer une analyse.
          </p>
        </div>
      ) : (
        filteredData.map((section) => (
          <div key={section.section} className="mb-6">
            <div className="bg-gray-800 text-white px-4 py-3 font-bold flex items-center justify-between">
              <span>{section.section}</span>
              <span className="text-sm">
                {section.total} anomalie(s) - {section.corrigees} corrigée(s)
              </span>
            </div>

            {Object.entries(section.par_date).map(([dateStr, anomalies]) => (
              <div key={dateStr} className="bg-white border-2 border-gray-800 mb-2">
                <div className="bg-gray-100 px-4 py-2 font-semibold border-b-2 border-gray-800">
                  {new Date(dateStr).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  <span className="ml-4 text-sm text-gray-600">
                    ({anomalies.length} anomalie(s))
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border-2 border-gray-300 p-2">Section</th>
                        <th className="border-2 border-gray-300 p-2">Badge</th>
                        <th className="border-2 border-gray-300 p-2">Nom</th>
                        <th className="border-2 border-gray-300 p-2">Type</th>
                        <th className="border-2 border-gray-300 p-2 bg-yellow-50">
                          {anomalies[0].code_date}R
                        </th>
                        <th className="border-2 border-gray-300 p-2 bg-blue-50">
                          {anomalies[0].code_date}P
                        </th>
                        <th className="border-2 border-gray-300 p-2 bg-gray-100">
                          {anomalies[0].code_date}B
                        </th>
                        <th className="border-2 border-gray-300 p-2">État</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anomalies.map((anomalie) => (
                        <AnomalieRow
                          key={anomalie.id}
                          anomalie={anomalie}
                          onUpdate={fetchAnomalies}
                          horairesDict={horairesDict}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AnomaliesPage;