// import React, { useState, useEffect, useCallback } from "react";
// import { AlertCircle, CheckCircle, Edit2, Save, X, RefreshCw, ArrowLeftRight } from "lucide-react";
// import anomalieService from "../../services/anomalieService";

// const getEtatColor = (etat) => {
//   const colors = {
//     pas_entree: "bg-red-100 text-red-700 border-red-300",
//     pas_sortie: "bg-orange-100 text-orange-700 border-orange-300",
//     entree_sortie_non_conformes: "bg-yellow-100 text-yellow-700 border-yellow-300",
//     ok: "bg-green-100 text-green-700 border-green-300",
//   };
//   return colors[etat] || "bg-gray-100 text-gray-700 border-gray-300";
// };

// const AnomalieRow = ({ anomalie, onUpdate }) => {
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     heure_reelle_entree: anomalie.heure_reelle_entree || "",
//     heure_reelle_sortie: anomalie.heure_reelle_sortie || "",
//     heure_rectifiee_entree: anomalie.heure_rectifiee_entree || "",
//     heure_rectifiee_sortie: anomalie.heure_rectifiee_sortie || "",
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

//   const handleInverser = () => {
//     setFormData({
//       ...formData,
//       heure_rectifiee_entree: formData.heure_rectifiee_sortie,
//       heure_rectifiee_sortie: formData.heure_rectifiee_entree,
//     });
//   };

//   const handleCopierBrut = () => {
//     setFormData({
//       ...formData,
//       heure_rectifiee_entree: anomalie.heure_brute_entree || "",
//       heure_rectifiee_sortie: anomalie.heure_brute_sortie || "",
//     });
//   };

//   const handleCopierReel = () => {
//     setFormData({
//       ...formData,
//       heure_rectifiee_entree: formData.heure_reelle_entree,
//       heure_rectifiee_sortie: formData.heure_reelle_sortie,
//     });
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

//       {/* Code date RÉEL (modifiable) */}
//       <td className="border-2 border-gray-300 p-2 text-center bg-blue-50">
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
//               <div className="text-sm font-medium">
//                 {anomalie.heure_reelle_entree
//                   ? anomalie.heure_reelle_entree.slice(0, 5)
//                   : "-"}
//               </div>
//               <div className="text-sm font-medium">
//                 {anomalie.heure_reelle_sortie
//                   ? anomalie.heure_reelle_sortie.slice(0, 5)
//                   : "-"}
//               </div>
//             </>
//           )}
//         </div>
//       </td>

//       {/* Code date RECTIFIE (modifiable) */}
//       <td className="border-2 border-gray-300 p-2 text-center bg-green-50">
//         <div className="space-y-1">
//           {editing ? (
//             <>
//               <input
//                 type="time"
//                 value={formData.heure_rectifiee_entree}
//                 onChange={(e) =>
//                   setFormData({ ...formData, heure_rectifiee_entree: e.target.value })
//                 }
//                 className="w-full px-2 py-1 border rounded text-sm"
//               />
//               <input
//                 type="time"
//                 value={formData.heure_rectifiee_sortie}
//                 onChange={(e) =>
//                   setFormData({ ...formData, heure_rectifiee_sortie: e.target.value })
//                 }
//                 className="w-full px-2 py-1 border rounded text-sm"
//               />
//               <div className="flex gap-1 mt-2">
//                 <button
//                   onClick={handleInverser}
//                   className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
//                   title="Inverser entrée et sortie"
//                 >
//                   <ArrowLeftRight className="w-3 h-3" />
//                 </button>
//                 <button
//                   onClick={handleCopierBrut}
//                   className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
//                   title="Copier depuis brut"
//                 >
//                   B
//                 </button>
//                 <button
//                   onClick={handleCopierReel}
//                   className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
//                   title="Copier depuis réel"
//                 >
//                   R
//                 </button>
//               </div>
//             </>
//           ) : (
//             <>
//               <div className="text-sm font-medium">
//                 {anomalie.heure_rectifiee_entree
//                   ? anomalie.heure_rectifiee_entree.slice(0, 5)
//                   : "-"}
//               </div>
//               <div className="text-sm font-medium">
//                 {anomalie.heure_rectifiee_sortie
//                   ? anomalie.heure_rectifiee_sortie.slice(0, 5)
//                   : "-"}
//               </div>
//             </>
//           )}
//         </div>
//       </td>

//       {/* Code date BRUT (non modifiable) */}
//       <td className="border-2 border-gray-300 p-2 text-center bg-gray-100">
//         <div className="space-y-1">
//           <div className="text-sm text-gray-600">
//             {anomalie.heure_brute_entree
//               ? anomalie.heure_brute_entree.slice(0, 5)
//               : "-"}
//           </div>
//           <div className="text-sm text-gray-600">
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

//       const statsData = await anomalieService.getAnomalies(
//         currentYear,
//         currentMonth
//       );
//       setStats(statsData.statistiques);
//     } catch (err) {
//       console.error("Erreur:", err);
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
//                   {[...Array(12)].map((_, i) => (
//                     <option key={i + 1} value={i + 1}>
//                       {new Date(2000, i).toLocaleDateString('fr-FR', { month: 'long' })}
//                     </option>
//                   ))}
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

//         {/* Légende */}
//         <div className="mt-4 border-t-2 border-gray-800 pt-4">
//           <div className="text-sm font-bold mb-2">Règles de gestion:</div>
//           <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded">
//             <div>
//               <div className="font-bold text-blue-700 mb-1">Code date RÉEL (R):</div>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Heures prévues par section</li>
//                 <li>MODIFIABLE manuellement</li>
//                 <li>Objectif: Réel = Rectifié → État OK</li>
//               </ul>
//             </div>
//             <div>
//               <div className="font-bold text-green-700 mb-1">Code date RECTIFIE (P):</div>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Heures corrigées</li>
//                 <li>MODIFIABLE manuellement</li>
//                 <li>Si absent: mettre NULL pour OK</li>
//               </ul>
//             </div>
//             <div className="col-span-2">
//               <div className="font-bold text-gray-700 mb-1">Code date BRUT (B):</div>
//               <ul className="list-disc list-inside space-y-1">
//                 <li>Heures de pointage brutes</li>
//                 <li>NON MODIFIABLE</li>
//                 <li>Source: table CheckInOut (O=entrée, I=sortie)</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Tableau des anomalies */}
//       {sectionsData.length === 0 ? (
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
//         sectionsData.map((section) => (
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
//                         <th className="border-2 border-gray-300 p-2 bg-blue-50">
//                           Code date RÉEL (R)
//                         </th>
//                         <th className="border-2 border-gray-300 p-2 bg-green-50">
//                           Code date RECTIFIE (P)
//                         </th>
//                         <th className="border-2 border-gray-300 p-2 bg-gray-100">
//                           Code date BRUT (B)
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
import { AlertCircle, CheckCircle, Edit2, Save, X, RefreshCw, ArrowLeftRight, ArrowLeft } from "lucide-react";
import anomalieService from "../../services/anomalieService";
import "/src/styles/custom.css";
import { useNavigate } from "react-router-dom";

const getEtatColor = (etat) => {
  const colors = {
    pas_entree: "bg-red-100 text-red-700 border-red-300",
    pas_sortie: "bg-orange-100 text-orange-700 border-orange-300",
    entree_sortie_non_conformes: "bg-yellow-100 text-yellow-700 border-yellow-300",
    ok: "bg-green-100 text-green-700 border-green-300",
  };
  return colors[etat] || "bg-gray-100 text-gray-700 border-gray-300";
};

const AnomalieRow = ({ anomalie, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    heure_reelle_entree: anomalie.heure_reelle_entree || "",
    heure_reelle_sortie: anomalie.heure_reelle_sortie || "",
    heure_rectifiee_entree: anomalie.heure_rectifiee_entree || "",
    heure_rectifiee_sortie: anomalie.heure_rectifiee_sortie || "",
    commentaire: anomalie.commentaire || "",
  });
  const [saving, setSaving] = useState(false);

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

  const handleInverser = () => {
    setFormData({
      ...formData,
      heure_rectifiee_entree: formData.heure_rectifiee_sortie,
      heure_rectifiee_sortie: formData.heure_rectifiee_entree,
    });
  };

  const handleCopierBrut = () => {
    setFormData({
      ...formData,
      heure_rectifiee_entree: anomalie.heure_brute_entree || "",
      heure_rectifiee_sortie: anomalie.heure_brute_sortie || "",
    });
  };

  const handleCopierReel = () => {
    setFormData({
      ...formData,
      heure_rectifiee_entree: formData.heure_reelle_entree,
      heure_rectifiee_sortie: formData.heure_reelle_sortie,
    });
  };

  // NOUVELLE FONCTION: Égaliser Réel = Rectifié
  const handleEgaliserReelRectifie = () => {
    setFormData({
      ...formData,
      heure_reelle_entree: formData.heure_rectifiee_entree,
      heure_reelle_sortie: formData.heure_rectifiee_sortie,
    });
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
      <td className="border-2 border-gray-300 p-2 text-center">
        <div className="space-y-1">
          <div className="text-sm text-gray-600">
            {anomalie.heure_brute_entree
              ? "O"
              : "-"}
          </div>
          <div className="text-sm text-gray-600">
            {anomalie.heure_brute_sortie
              ? "I"
              : "-"}
          </div>
        </div>
      </td>
      {/* Code date RÉEL (modifiable) */}
      <td className="border-2 border-gray-300 p-2 text-center">
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
              />
              <input
                type="time"
                value={formData.heure_reelle_sortie}
                onChange={(e) =>
                  setFormData({ ...formData, heure_reelle_sortie: e.target.value })
                }
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </>
          ) : (
            <>
              <div className="text-sm font-medium">
                {anomalie.heure_reelle_entree
                  ? anomalie.heure_reelle_entree.slice(0, 5)
                  : "-"}
              </div>
              <div className="text-sm font-medium">
                {anomalie.heure_reelle_sortie
                  ? anomalie.heure_reelle_sortie.slice(0, 5)
                  : "-"}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Code date RECTIFIE (modifiable) */}
      <td className="border-2 border-gray-300 p-2 text-center">
        <div className="space-y-1">
          {editing ? (
            <>
              <input
                type="time"
                value={formData.heure_rectifiee_entree}
                onChange={(e) =>
                  setFormData({ ...formData, heure_rectifiee_entree: e.target.value })
                }
                className="w-full px-2 py-1 border rounded text-sm"
              />
              <input
                type="time"
                value={formData.heure_rectifiee_sortie}
                onChange={(e) =>
                  setFormData({ ...formData, heure_rectifiee_sortie: e.target.value })
                }
                className="w-full px-2 py-1 border rounded text-sm"
              />
              <div className="flex gap-1 mt-2">
                <button
                  onClick={handleInverser}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  title="Inverser entrée et sortie"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCopierBrut}
                  className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                  title="Copier depuis brut"
                >
                  B
                </button>
                <button
                  onClick={handleCopierReel}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  title="Copier depuis réel"
                >
                  R
                </button>
              </div>
              <div className="mt-2">
                <button
                  onClick={handleEgaliserReelRectifie}
                  className="w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                  title="Égaliser Réel = Rectifié (État OK)"
                >
                  Réel = Rectifié ✓
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium">
                {anomalie.heure_rectifiee_entree
                  ? anomalie.heure_rectifiee_entree.slice(0, 5)
                  : "-"}
              </div>
              <div className="text-sm font-medium">
                {anomalie.heure_rectifiee_sortie
                  ? anomalie.heure_rectifiee_sortie.slice(0, 5)
                  : "-"}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Code date BRUT (non modifiable) */}
      <td className="border-2 border-gray-300 p-2 text-center">
        <div className="space-y-1">
          <div className="text-sm text-gray-600">
            {anomalie.heure_brute_entree
              ? anomalie.heure_brute_entree.slice(0, 5)
              : "-"}
          </div>
          <div className="text-sm text-gray-600">
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
  const [detecting, setDetecting] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const navigate = useNavigate();

  const fetchAnomalies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await anomalieService.getAnomaliesParSection(
        currentYear,
        currentMonth
      );
      setSectionsData(data.sections || []);

      const statsData = await anomalieService.getAnomalies(
        currentYear,
        currentMonth
      );
      setStats(statsData.statistiques);
    } catch (err) {
      console.error("Erreur:", err);
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
    fetchAnomalies();
    setSelectedDate("all");
  }, [fetchAnomalies, currentMonth, currentYear]);


  // Liste des sections uniques
  const allSections = React.useMemo(() => {
    return sectionsData.map((s) => s.section).sort();
  }, [sectionsData]);

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

  // currentMonth : 1 à 12
  // currentYear : année sélectionnée
  const getPeriodRange = (month, year) => {
    // Début : 21 du mois précédent
    const start = new Date(year, month - 1, 22);
    if (month === 1) {
      start.setFullYear(year - 1);
      start.setMonth(11); // Décembre
    } else {
      start.setMonth(month - 2); // mois précédent
    }

    // Fin : 20 du mois sélectionné
    const end = new Date(year, month - 1, 21);

    // Retour au format YYYY-MM-DD pour <input type="date">
    const format = (d) => d.toISOString().split("T")[0];

    return { min: format(start), max: format(end) };
  };

  const sectionStats = selectedSection === "all"
  ? null
  : {
      section: selectedSection,
    };
  
  const formatPeriod = (month, year) => {
    const { min, max } = getPeriodRange(month, year);
    const start = new Date(min);
    const end = new Date(max);

    return (
      <>
        <span className="font-bold">Période du: </span>{" "}
        {start.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}{" "}
        <span className="font-bold">au</span>{" "}
        {end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </>
    );
  };

  if (loading && sectionsData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des anomalies...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-akj-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-white shadow-md rounded-lg border border-gray-200 mb-6 p-6">
        {/* ===== Header principal ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 border-b-2 pb-8">
          {/* Badge + titre */}
          <div className="flex items-center gap-4">
            <button
                onClick={() => navigate("/attendance")} // ou le chemin exact de ta page AttendancePage
                className="mt-3 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
              >
                <ArrowLeft className="w-5 h-5" /> 
              </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gestion des Anomalies de Pointage
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Suivi et correction des anomalies de pointage par mois et par section
              </p>
            </div>
          </div>

          {/* Filtres mois/année + bouton */}
          <div className="flex flex-col md:flex-row md:items-end md:gap-4 w-full md:w-auto">
            <div className="flex gap-3">
              {/* Mois */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mois</label>
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleDateString('fr-FR', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              {/* Année */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Année</label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

            {/* Bouton */}
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="mt-3 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:bg-gray-400 transition"
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

        <div className="grid grid-cols-2 gap-4 pt-4 border-b-2 pb-4">
          <span className="font-bold italic">SECTION:
            {selectedSection && sectionStats && (
            <span className="ml-4 font-semibold">
              {sectionStats.section}
            </span>
          )}
          </span>
          <span className="text-md text-black-500 text-right">
              {formatPeriod(currentMonth, currentYear)}
          </span>
        </div>


        {/* ===== Statistiques ===== */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total anomalies</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-red-700">{stats.non_corrigees}</div>
              <div className="text-sm text-red-700">Non corrigées</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-700">{stats.corrigees}</div>
              <div className="text-sm text-green-700">Corrigées</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round((stats.corrigees / stats.total) * 100) || 0}%
              </div>
              <div className="text-sm text-blue-700">Taux de correction</div>
            </div>
          </div>
        )}

        {/* ===== Filtres supplémentaires ===== */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          {/* Filtrer par section */}
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Filtrer par section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Toutes les sections</option>
              {allSections.map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>

          {/* Filtrer par date */}
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Filtrer par date</label>
            {currentMonth && currentYear && (
              <input
                type="date"
                value={selectedDate === "all" ? "" : selectedDate}
                min={getPeriodRange(currentMonth, currentYear).min}
                max={getPeriodRange(currentMonth, currentYear).max}
                onChange={(e) => setSelectedDate(e.target.value || "all")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </div>
        </div>
      </div>



      {/* Tableau des anomalies */}
      {filteredData.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg border border-gray-200 mb-6 p-6 text-center">
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
            {/* Dates */}
            {Object.entries(section.par_date).map(([dateStr, anomalies]) => (
              <div key={dateStr} className="bg-white border border-gray-200 rounded-lg mb-4 shadow-sm">
                  {anomalies.length === 0 ? (
                    <div className="bg-white rounded-lg border-gray-200 mb-6 p-6 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-2xl font-semibold text-gray-800 mb-2">
                        Aucune anomalie détectée !
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gray-100 px-4 py-2 font-semibold border-b border-gray-300 rounded-t-lg flex justify-between items-center">
                        <span>
                          {new Date(dateStr).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-sm text-gray-500">({anomalies.length} anomalie(s))</span>
                      </div>

                      {/* Tableau */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-gray-200 text-center align-middle">
                              <th className="border border-gray-300 p-2">Section</th>
                              <th className="border border-gray-300 p-2">Badge</th>
                              <th className="border border-gray-300 p-2">Nom</th>
                              <th className="border border-gray-300 p-2">Type</th>
                              <th className="border border-gray-300 p-2">
                                {anomalies[0].code_date}
                              </th>
                              <th className="border border-gray-300 p-2">
                                {anomalies[0].code_date}(P)
                              </th>
                              <th className="border border-gray-300 p-2">
                                {anomalies[0].code_date}(B)
                              </th>
                              <th className="border border-gray-300 p-2">État</th>
                            </tr>
                          </thead>
                          <tbody>
                            {anomalies.map((anomalie) => (
                              <AnomalieRow
                                key={anomalie.id}
                                anomalie={anomalie}
                                onUpdate={fetchAnomalies}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AnomaliesPage;