// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Calendar, 
//   TrendingUp, 
//   Download, 
//   FileText, 
//   RefreshCw,
//   User,
//   Clock
// } from 'lucide-react';
// import { 
//   getHistoriqueBySalaire, 
//   getHistoriqueSalaireParEmploye
// } from '../../services/employeeService';

// const HistoriqueSalaire = ({ employeId, salaireId }) => {
//   const [historiques, setHistoriques] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fonction pour charger l'historique avec useCallback
//   const loadHistorique = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       let data;
      
//       if (salaireId) {
//         data = await getHistoriqueBySalaire(salaireId);
//         console.log('Données reçues (salaire):', data);
//         setHistoriques(data.historiques || []);
//       } 
//       else if (employeId) {
//         data = await getHistoriqueSalaireParEmploye(employeId);
//         console.log('Données reçues (employé):', data);
//         setHistoriques(data || []);
//       } 
//       else {
//         throw new Error('Aucun identifiant fourni pour charger l\'historique');
//       }
      
//     } catch (err) {
//       console.error('Erreur chargement historique:', err);
//       setError(err.response?.data?.message || 'Erreur lors du chargement de l\'historique');
//     } finally {
//       setLoading(false);
//     }
//   }, [salaireId, employeId]);

//   // Charger l'historique au montage du composant
//   useEffect(() => {
//     if (salaireId || employeId) {
//       loadHistorique();
//     }
//   }, [salaireId, employeId, loadHistorique]);

//   // Formater la date et heure - Version plus robuste
//   const formatDateTime = (dateString) => {
//     console.log('Formatting date:', dateString);
    
//     if (!dateString || dateString === 'null' || dateString === 'undefined') {
//       return 'Non spécifié';
//     }
    
//     try {
//       // Essayer différents formats de date
//       let date;
      
//       // Si c'est déjà un objet Date
//       if (dateString instanceof Date) {
//         date = dateString;
//       } 
//       // Si c'est une string ISO
//       else if (typeof dateString === 'string') {
//         date = new Date(dateString);
        
//         // Si le parsing échoue, essayer sans le timezone
//         if (isNaN(date.getTime())) {
//           date = new Date(dateString.replace('Z', '').replace('T', ' '));
//         }
//       } else {
//         return 'Format invalide';
//       }
      
//       // Vérifier si la date est valide
//       if (isNaN(date.getTime())) {
//         console.warn('Date invalide:', dateString);
//         return 'Date invalide';
//       }
      
//       // Format date
//       const dateFormatted = date.toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
      
//       // Format heure
//       const timeFormatted = date.toLocaleTimeString('fr-FR', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
      
//       return `${dateFormatted} à ${timeFormatted}`;
//     } catch (error) {
//       console.error('Erreur formatage date:', error, 'Input:', dateString);
//       return 'Erreur date';
//     }
//   };

//   // Formater un montant
//   const formatMontant = (montant) => {
//     if (!montant) return '-';
//     return `${Number(montant).toLocaleString('fr-FR')} Ar`;
//   };

//   // Calculer la variation en pourcentage
//   const calculerVariation = (ancienMontant, nouveauMontant) => {
//     if (!ancienMontant || !nouveauMontant || ancienMontant === 0) return null;
    
//     const variation = ((nouveauMontant - ancienMontant) / ancienMontant) * 100;
//     return variation.toFixed(1);
//   };

//   // Télécharger l'historique (fonction simulée)
//   const handleDownload = () => {
//     alert('Fonction d\'export à implémenter');
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//         <div className="flex items-center justify-center py-8">
//           <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
//           <span className="text-gray-500">Chargement de l'historique...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//         <div className="text-center py-4">
//           <div className="text-red-500 text-sm mb-2">Erreur: {error}</div>
//           <button
//             onClick={loadHistorique}
//             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             Réessayer
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//       {/* En-tête */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div className="flex items-center gap-3 mb-3 sm:mb-0">
//           <div className="bg-gray-100 p-2 rounded-lg">
//             <TrendingUp className="w-5 h-5 text-gray-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">
//               Historique des Salaires
//             </h3>
//             <p className="text-sm text-gray-500">
//               {historiques.length} modification(s) enregistrée(s)
//             </p>
//           </div>
//         </div>

//         {historiques.length > 0 && (
//           <button
//             onClick={handleDownload}
//             className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
//           >
//             <Download className="w-4 h-4" />
//             Exporter
//           </button>
//         )}
//       </div>

//       {/* Liste des historiques */}
//       {historiques.length === 0 ? (
//         <div className="text-center py-8">
//           <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500 text-sm">Aucun historique de salaire disponible</p>
//           <p className="text-gray-400 text-xs mt-1">
//             Les modifications de salaire apparaîtront ici
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {historiques.map((historique, index) => {
//             console.log('Historique item:', historique);
            
//             const variation = calculerVariation(
//               historique.ancien_salaire_total,
//               historique.nouveau_salaire_total
//             );

//             return (
//               <div
//                 key={historique.id || index}
//                 className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
//               >
//                 {/* En-tête de l'historique */}
//                 <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
//                   <div className="flex items-start gap-3">
//                     <div className="bg-gray-100 p-2 rounded mt-1">
//                       <Calendar className="w-4 h-4 text-gray-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 text-base mb-2">
//                         Modification du salaire
//                       </h4>
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4" />
//                           <span>{formatDateTime(historique.date_modification || historique.created_at || historique.date_creation)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4" />
//                           <span>Par {historique.modifie_par || historique.created_by || 'Système'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Variation et salaire total */}
//                   <div className="text-right">
//                     {variation && (
//                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
//                         parseFloat(variation) >= 0
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {parseFloat(variation) >= 0 ? '+' : ''}{variation}%
//                       </div>
//                     )}
//                     <div className="text-sm text-gray-500">Nouveau salaire total</div>
//                     <div className="font-semibold text-gray-900 text-lg">
//                       {formatMontant(historique.nouveau_salaire_total)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Détails de l'historique */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Anciennes valeurs */}
//                   <div className="border border-gray-200 rounded-lg p-4">
//                     <h5 className="font-medium text-gray-700 mb-3 text-sm">Ancien salaire</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Salaire de base:</span>
//                         <span className="font-medium">{formatMontant(historique.ancien_salaire_base)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Taux horaire:</span>
//                         <span className="font-medium">{formatMontant(historique.ancien_taux_horaire)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Prime ancienneté:</span>
//                         <span className="font-medium">{formatMontant(historique.ancienne_prime_anciennete)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Indemnité déplacement:</span>
//                         <span className="font-medium">{formatMontant(historique.ancienne_indemnite_deplacement)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Autre indemnité:</span>
//                         <span className="font-medium">{formatMontant(historique.ancienne_autre_indemnite)}</span>
//                       </div>
//                       <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
//                         <span className="text-gray-700 font-semibold">Total:</span>
//                         <span className="font-bold text-gray-900">{formatMontant(historique.ancien_salaire_total)}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Nouvelles valeurs */}
//                   <div className="border border-gray-200 rounded-lg p-4">
//                     <h5 className="font-medium text-gray-700 mb-3 text-sm">Nouveau salaire</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Salaire de base:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouveau_salaire_base)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Taux horaire:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouveau_taux_horaire)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Prime ancienneté:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_prime_anciennete)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Indemnité déplacement:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_indemnite_deplacement)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Autre indemnité:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_autre_indemnite)}</span>
//                       </div>
//                       <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
//                         <span className="text-gray-700 font-semibold">Total:</span>
//                         <span className="font-bold text-gray-900">{formatMontant(historique.nouveau_salaire_total)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Motif */}
//                 {historique.motif && (
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <span className="font-medium text-gray-700 text-sm">Motif:</span>
//                     <p className="text-gray-600 text-sm mt-1 bg-gray-50 p-3 rounded border border-gray-100">
//                       {historique.motif}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Bouton de rafraîchissement */}
//       {historiques.length > 0 && (
//         <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
//           <button
//             onClick={loadHistorique}
//             className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Actualiser
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoriqueSalaire;



// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Calendar, 
//   TrendingUp, 
//   Download, 
//   FileText, 
//   RefreshCw,
//   User,
//   Clock
// } from 'lucide-react';
// import { 
//   getHistoriqueBySalaire, 
//   getHistoriqueSalaireParEmploye
// } from '../../services/employeeService';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const HistoriqueSalaire = ({ employeId, salaireId }) => {
//   const [historiques, setHistoriques] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const loadHistorique = useCallback(async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       let data;
//       if (salaireId) {
//         data = await getHistoriqueBySalaire(salaireId);
//         setHistoriques(data.historiques || []);
//       } else if (employeId) {
//         data = await getHistoriqueSalaireParEmploye(employeId);
//         setHistoriques(data || []);
//       } else {
//         throw new Error('Aucun identifiant fourni pour charger l\'historique');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Erreur lors du chargement de l\'historique');
//     } finally {
//       setLoading(false);
//     }
//   }, [salaireId, employeId]);

//   useEffect(() => {
//     if (salaireId || employeId) loadHistorique();
//   }, [salaireId, employeId, loadHistorique]);

//   const formatDateTime = (dateString) => {
//     if (!dateString || dateString === 'null' || dateString === 'undefined') return 'Non spécifié';
//     let date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Date invalide';
//     const dateFormatted = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
//     const timeFormatted = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
//     return `${dateFormatted} à ${timeFormatted}`;
//   };

//   const formatMontant = (montant) => {
//     if (!montant) return '-';
//     return `${Number(montant).toLocaleString('fr-FR')} Ar`;
//   };

//   const calculerVariation = (ancienMontant, nouveauMontant) => {
//     if (!ancienMontant || !nouveauMontant || ancienMontant === 0) return null;
//     const variation = ((nouveauMontant - ancienMontant) / ancienMontant) * 100;
//     return variation.toFixed(1);
//   };

//   const handleDownload = () => {
//     alert('Fonction d\'export à implémenter');
//   };

//   // Préparer les données du graphique avec tri chronologique et couleur des points
//   const chartData = [...historiques]
//     .sort((a, b) => new Date(a.date_modification || a.created_at || a.date_creation) - new Date(b.date_modification || b.created_at || b.date_creation))
//     .map((h, index, arr) => {
//       const salaire = Number(h.nouveau_salaire_total);
//       let variationColor = '#4ade80'; // vert par défaut
//       if (index > 0 && salaire < Number(arr[index - 1].nouveau_salaire_total)) variationColor = '#f87171'; // rouge si baisse
//       return {
//         date: new Date(h.date_modification || h.created_at || h.date_creation).toLocaleDateString('fr-FR'),
//         salaire,
//         color: variationColor,
//       };
//     });

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//         <div className="flex items-center justify-center py-8">
//           <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
//           <span className="text-gray-500">Chargement de l'historique...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//         <div className="text-center py-4">
//           <div className="text-red-500 text-sm mb-2">Erreur: {error}</div>
//           <button
//             onClick={loadHistorique}
//             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             Réessayer
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white border border-gray-200 p-6 mt-6">
//       {/* En-tête */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div className="flex items-center gap-3 mb-3 sm:mb-0">
//           <div className="bg-gray-100 p-2 rounded-lg">
//             <TrendingUp className="w-5 h-5 text-gray-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">
//               Historique des Salaires
//             </h3>
//             <p className="text-sm text-gray-500">
//               {historiques.length} modification(s) enregistrée(s)
//             </p>
//           </div>
//         </div>

//         {historiques.length > 0 && (
//           <button
//             onClick={handleDownload}
//             className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
//           >
//             <Download className="w-4 h-4" />
//             Exporter
//           </button>
//         )}
//       </div>

//       {/* Liste des historiques */}
//       {historiques.length === 0 ? (
//         <div className="text-center py-8">
//           <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500 text-sm">Aucun historique de salaire disponible</p>
//           <p className="text-gray-400 text-xs mt-1">
//             Les modifications de salaire apparaîtront ici
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {historiques.map((historique, index) => {
//             const variation = calculerVariation(
//               historique.ancien_salaire_total,
//               historique.nouveau_salaire_total
//             );

//             return (
//               <div
//                 key={historique.id || index}
//                 className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
//               >
//                 {/* En-tête de l'historique */}
//                 <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
//                   <div className="flex items-start gap-3">
//                     <div className="bg-gray-100 p-2 rounded mt-1">
//                       <Calendar className="w-4 h-4 text-gray-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 text-base mb-2">
//                         Modification du salaire
//                       </h4>
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4" />
//                           <span>{formatDateTime(historique.date_modification || historique.created_at || historique.date_creation)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4" />
//                           <span>Par {historique.modifie_par || historique.created_by || 'Système'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Variation et salaire total */}
//                   <div className="text-right">
//                     {variation && (
//                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
//                         parseFloat(variation) >= 0
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {parseFloat(variation) >= 0 ? '+' : ''}{variation}%
//                       </div>
//                     )}
//                     <div className="text-sm text-gray-500">Nouveau salaire total</div>
//                     <div className="font-semibold text-gray-900 text-lg">
//                       {formatMontant(historique.nouveau_salaire_total)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Détails de l'historique */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Anciennes valeurs */}
//                   <div className="border border-gray-200 rounded-lg p-4">
//                     <h5 className="font-medium text-gray-700 mb-3 text-sm">Ancien salaire</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between"><span className="text-gray-600">Salaire de base:</span><span className="font-medium">{formatMontant(historique.ancien_salaire_base)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Taux horaire:</span><span className="font-medium">{formatMontant(historique.ancien_taux_horaire)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Prime ancienneté:</span><span className="font-medium">{formatMontant(historique.ancienne_prime_anciennete)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Indemnité déplacement:</span><span className="font-medium">{formatMontant(historique.ancienne_indemnite_deplacement)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Autre indemnité:</span><span className="font-medium">{formatMontant(historique.ancienne_autre_indemnite)}</span></div>
//                       <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-700 font-semibold">Total:</span><span className="font-bold text-gray-900">{formatMontant(historique.ancien_salaire_total)}</span></div>
//                     </div>
//                   </div>

//                   {/* Nouvelles valeurs */}
//                   <div className="border border-gray-200 rounded-lg p-4">
//                     <h5 className="font-medium text-gray-700 mb-3 text-sm">Nouveau salaire</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between"><span className="text-gray-600">Salaire de base:</span><span className="font-medium text-gray-900">{formatMontant(historique.nouveau_salaire_base)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Taux horaire:</span><span className="font-medium text-gray-900">{formatMontant(historique.nouveau_taux_horaire)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Prime ancienneté:</span><span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_prime_anciennete)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Indemnité déplacement:</span><span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_indemnite_deplacement)}</span></div>
//                       <div className="flex justify-between"><span className="text-gray-600">Autre indemnité:</span><span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_autre_indemnite)}</span></div>
//                       <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="text-gray-700 font-semibold">Total:</span><span className="font-bold text-gray-900">{formatMontant(historique.nouveau_salaire_total)}</span></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Motif */}
//                 {historique.motif && (
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <span className="font-medium text-gray-700 text-sm">Motif:</span>
//                     <p className="text-gray-600 text-sm mt-1 bg-gray-50 p-3 rounded border border-gray-100">{historique.motif}</p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {/* Graphique LineChart amélioré */}
//           <div className="mt-8">
//             <h4 className="text-gray-900 font-semibold mb-4">Évolution du salaire</h4>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                 <YAxis tickFormatter={(value) => `${value.toLocaleString('fr-FR')} Ar`} />
//                 <Tooltip formatter={(value) => `${Number(value).toLocaleString('fr-FR')} Ar`} />
//                 <Line
//                   type="monotone"
//                   dataKey="salaire"
//                   stroke="#4ade80"
//                   strokeWidth={2}
//                   dot={(props) => {
//                     const { cx, cy, payload } = props;
//                     return <circle cx={cx} cy={cy} r={4} fill={payload.color} stroke="#000" strokeWidth={0.5} />;
//                   }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//         </div>
//       )}

//       {/* Bouton de rafraîchissement */}
//       {historiques.length > 0 && (
//         <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
//           <button
//             onClick={loadHistorique}
//             className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Actualiser
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoriqueSalaire;



// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Calendar, 
//   TrendingUp, 
//   Download, 
//   FileText, 
//   RefreshCw,
//   User,
//   Clock
// } from 'lucide-react';
// import { 
//   LineChart, 
//   Line, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer 
// } from 'recharts';
// import { 
//   getHistoriqueBySalaire, 
//   getHistoriqueSalaireParEmploye
// } from '../../services/employeeService';

// const HistoriqueSalaire = ({ employeId, salaireId }) => {
//   const [historiques, setHistoriques] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fonction pour charger l'historique avec useCallback
//   const loadHistorique = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       let data;
      
//       if (salaireId) {
//         data = await getHistoriqueBySalaire(salaireId);
//         console.log('Données reçues (salaire):', data);
//         setHistoriques(data.historiques || []);
//       } 
//       else if (employeId) {
//         data = await getHistoriqueSalaireParEmploye(employeId);
//         console.log('Données reçues (employé):', data);
//         setHistoriques(data || []);
//       } 
//       else {
//         throw new Error('Aucun identifiant fourni pour charger l\'historique');
//       }
      
//     } catch (err) {
//       console.error('Erreur chargement historique:', err);
//       setError(err.response?.data?.message || 'Erreur lors du chargement de l\'historique');
//     } finally {
//       setLoading(false);
//     }
//   }, [salaireId, employeId]);

//   // Charger l'historique au montage du composant
//   useEffect(() => {
//     if (salaireId || employeId) {
//       loadHistorique();
//     }
//   }, [salaireId, employeId, loadHistorique]);

//   // Préparer les données pour le graphique
//   const prepareChartData = () => {
//     if (!historiques || historiques.length === 0) return [];
    
//     // Trier par date (du plus ancien au plus récent)
//     const sortedHistoriques = [...historiques].sort((a, b) => {
//       const dateA = new Date(a.date_modification || a.created_at || a.dateModification);
//       const dateB = new Date(b.date_modification || b.created_at || b.dateModification);
//       return dateA - dateB;
//     });
    
//     return sortedHistoriques.map(hist => {
//       // Récupérer le salaire total - essayer tous les formats possibles
//       const salaireTotal = Number(
//         hist.nouveau_salaire_total 
//         || hist.nouveauSalaireTotal 
//         || hist.salaire_total 
//         || hist.salaireTotal
//         || hist.nouveau_salaire
//         || hist.nouveauSalaire
//         || 0
//       );
      
//       return {
//         date: formatDateShort(hist.date_modification || hist.created_at || hist.dateModification),
//         'Salaire Total': salaireTotal,
//         fullDate: hist.date_modification || hist.created_at || hist.dateModification
//       };
//     });
//   };

//   // Formater la date courte pour le graphique
//   const formatDateShort = (dateString) => {
//     if (!dateString) return '';
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: '2-digit'
//       });
//     } catch {
//       return '';
//     }
//   };

//   // Formater la date et heure - Version plus robuste
//   const formatDateTime = (dateString) => {
//     if (!dateString || dateString === 'null' || dateString === 'undefined') {
//       return 'Non spécifié';
//     }
    
//     try {
//       let date;
      
//       if (dateString instanceof Date) {
//         date = dateString;
//       } 
//       else if (typeof dateString === 'string') {
//         date = new Date(dateString);
        
//         if (isNaN(date.getTime())) {
//           date = new Date(dateString.replace('Z', '').replace('T', ' '));
//         }
//       } else {
//         return 'Format invalide';
//       }
      
//       if (isNaN(date.getTime())) {
//         return 'Date invalide';
//       }
      
//       const dateFormatted = date.toLocaleDateString('fr-FR', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric'
//       });
      
//       const timeFormatted = date.toLocaleTimeString('fr-FR', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
      
//       return `${dateFormatted} à ${timeFormatted}`;
//     } catch {
//       return 'Erreur date';
//     }
//   };

//   // Formater un montant
//   const formatMontant = (montant) => {
//     if (!montant) return '-';
//     return `${Number(montant).toLocaleString('fr-FR')} Ar`;
//   };

//   // Calculer la variation en pourcentage
//   const calculerVariation = (ancienMontant, nouveauMontant) => {
//     if (!ancienMontant || !nouveauMontant || ancienMontant === 0) return null;
    
//     const variation = ((nouveauMontant - ancienMontant) / ancienMontant) * 100;
//     return variation.toFixed(1);
//   };

//   // Tooltip personnalisé pour le graphique
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
//           <p className="font-semibold text-gray-900 mb-2">{label}</p>
//           {payload.map((entry, index) => (
//             <p key={index} className="text-sm" style={{ color: entry.color }}>
//               {entry.name}: <span className="font-medium">{formatMontant(entry.value)}</span>
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   // Télécharger l'historique (fonction simulée)
//   const handleDownload = () => {
//     alert('Fonction d\'export à implémenter');
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//         <div className="flex items-center justify-center py-8">
//           <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
//           <span className="text-gray-500">Chargement de l'historique...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//         <div className="text-center py-4">
//           <div className="text-red-500 text-sm mb-2">Erreur: {error}</div>
//           <button
//             onClick={loadHistorique}
//             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//           >
//             Réessayer
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const chartData = prepareChartData();

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
//       {/* En-tête */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div className="flex items-center gap-3 mb-3 sm:mb-0">
//           <div className="bg-gray-100 p-2 rounded-lg">
//             <TrendingUp className="w-5 h-5 text-gray-600" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">
//               Historique des Salaires
//             </h3>
//             <p className="text-sm text-gray-500">
//               {historiques.length} modification(s) enregistrée(s)
//             </p>
//           </div>
//         </div>

//         {historiques.length > 0 && (
//           <button
//             onClick={handleDownload}
//             className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
//           >
//             <Download className="w-4 h-4" />
//             Exporter
//           </button>
//         )}
//       </div>

//       {/* Graphique d'évolution */}
//       {chartData.length > 0 && (
//         <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
//           <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//             <TrendingUp className="w-5 h-5 text-blue-600" />
//             Évolution du Salaire
//           </h4>
//           <ResponsiveContainer width="100%" height={350}>
//             <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis 
//                 dataKey="date" 
//                 stroke="#6b7280"
//                 style={{ fontSize: '12px' }}
//               />
//               <YAxis 
//                 stroke="#6b7280"
//                 style={{ fontSize: '12px' }}
//                 tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
//               />
//               <Tooltip content={<CustomTooltip />} />
//               <Legend 
//                 wrapperStyle={{ fontSize: '12px' }}
//                 iconType="line"
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="Salaire Total" 
//                 stroke="#2563eb" 
//                 strokeWidth={3}
//                 dot={{ fill: '#2563eb', r: 6 }}
//                 activeDot={{ r: 8 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       )}

//       {/* Liste des historiques */}
//       {historiques.length === 0 ? (
//         <div className="text-center py-8">
//           <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500 text-sm">Aucun historique de salaire disponible</p>
//           <p className="text-gray-400 text-xs mt-1">
//             Les modifications de salaire apparaîtront ici
//           </p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {historiques.map((historique, index) => {
//             const variation = calculerVariation(
//               historique.ancien_salaire_total,
//               historique.nouveau_salaire_total
//             );

//             return (
//               <div
//                 key={historique.id || index}
//                 className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
//               >
//                 {/* En-tête de l'historique */}
//                 <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
//                   <div className="flex items-start gap-3">
//                     <div className="bg-gray-100 p-2 rounded mt-1">
//                       <Calendar className="w-4 h-4 text-gray-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-gray-900 text-base mb-2">
//                         Modification du salaire
//                       </h4>
//                       <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
//                         <div className="flex items-center gap-2">
//                           <Clock className="w-4 h-4" />
//                           <span>{formatDateTime(historique.date_modification || historique.created_at || historique.date_creation)}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <User className="w-4 h-4" />
//                           <span>Par {historique.modifie_par || historique.created_by || 'Système'}</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Variation et salaire total */}
//                   <div className="text-right">
//                     {variation && (
//                       <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
//                         parseFloat(variation) >= 0
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {parseFloat(variation) >= 0 ? '+' : ''}{variation}%
//                       </div>
//                     )}
//                     <div className="text-sm text-gray-500">Nouveau salaire total</div>
//                     <div className="font-semibold text-gray-900 text-lg">
//                       {formatMontant(historique.nouveau_salaire_total)}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Détails de l'historique */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Anciennes valeurs */}
//                   <div className="border border-gray-200 rounded-lg p-4">
//                     <h5 className="font-medium text-gray-700 mb-3 text-sm">Ancien salaire</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Salaire de base:</span>
//                         <span className="font-medium">{formatMontant(historique.ancien_salaire_base)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Taux horaire:</span>
//                         <span className="font-medium">{formatMontant(historique.ancien_taux_horaire)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Prime ancienneté:</span>
//                         <span className="font-medium">{formatMontant(historique.ancienne_prime_anciennete)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Indemnité déplacement:</span>
//                         <span className="font-medium">{formatMontant(historique.ancienne_indemnite_deplacement)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Autre indemnité:</span>
//                         <span className="font-medium">{formatMontant(historique.ancienne_autre_indemnite)}</span>
//                       </div>
//                       <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
//                         <span className="text-gray-700 font-semibold">Total:</span>
//                         <span className="font-bold text-gray-900">{formatMontant(historique.ancien_salaire_total)}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Nouvelles valeurs */}
//                   <div className="border border-gray-200 rounded-lg p-4">
//                     <h5 className="font-medium text-gray-700 mb-3 text-sm">Nouveau salaire</h5>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Salaire de base:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouveau_salaire_base)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Taux horaire:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouveau_taux_horaire)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Prime ancienneté:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_prime_anciennete)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Indemnité déplacement:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_indemnite_deplacement)}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-gray-600">Autre indemnité:</span>
//                         <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_autre_indemnite)}</span>
//                       </div>
//                       <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
//                         <span className="text-gray-700 font-semibold">Total:</span>
//                         <span className="font-bold text-gray-900">{formatMontant(historique.nouveau_salaire_total)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Motif */}
//                 {historique.motif && (
//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <span className="font-medium text-gray-700 text-sm">Motif:</span>
//                     <p className="text-gray-600 text-sm mt-1 bg-gray-50 p-3 rounded border border-gray-100">
//                       {historique.motif}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Bouton de rafraîchissement */}
//       {historiques.length > 0 && (
//         <div className="flex justify-center mt-6 pt-4 border-t border-gray-200">
//           <button
//             onClick={loadHistorique}
//             className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Actualiser
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HistoriqueSalaire;










import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Download, 
  FileText, 
  RefreshCw,
  User,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  getHistoriqueBySalaire, 
  getHistoriqueSalaireParEmploye
} from '../../services/employeeService';

const HistoriqueSalaire = ({ employeId, salaireId }) => {
  const [historiques, setHistoriques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction pour charger l'historique avec useCallback
  const loadHistorique = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      if (salaireId) {
        data = await getHistoriqueBySalaire(salaireId);
        setHistoriques(data.historiques || []);
      } 
      else if (employeId) {
        data = await getHistoriqueSalaireParEmploye(employeId);
        setHistoriques(data || []);
      } 
      else {
        throw new Error('Aucun identifiant fourni pour charger l\'historique');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  }, [salaireId, employeId]);

  // Charger l'historique au montage du composant
  useEffect(() => {
    if (salaireId || employeId) {
      loadHistorique();
    }
  }, [salaireId, employeId, loadHistorique]);

  // Préparer les données pour le graphique
  const prepareChartData = () => {
    if (!historiques || historiques.length === 0) return [];
    
    // Trier par date (du plus ancien au plus récent)
    const sortedHistoriques = [...historiques].sort((a, b) => {
      const dateA = new Date(a.date_modification || a.created_at || a.dateModification);
      const dateB = new Date(b.date_modification || b.created_at || b.dateModification);
      return dateA - dateB;
    });
    
    return sortedHistoriques.map(hist => {
      const salaireTotal = Number(
        hist.nouveau_salaire_total 
        || hist.nouveauSalaireTotal 
        || hist.salaire_total 
        || hist.salaireTotal
        || hist.nouveau_salaire
        || hist.nouveauSalaire
        || 0
      );
      
      return {
        date: formatDateShort(hist.date_modification || hist.created_at || hist.dateModification),
        'Salaire Total': salaireTotal,
        fullDate: hist.date_modification || hist.created_at || hist.dateModification
      };
    });
  };

  // Formater la date courte pour le graphique
  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    } catch {
      return '';
    }
  };

  // Formater la date et heure - Version plus robuste
  const formatDateTime = (dateString) => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') {
      return 'Non spécifié';
    }
    
    try {
      let date;
      
      if (dateString instanceof Date) {
        date = dateString;
      } 
      else if (typeof dateString === 'string') {
        date = new Date(dateString);
        
        if (isNaN(date.getTime())) {
          date = new Date(dateString.replace('Z', '').replace('T', ' '));
        }
      } else {
        return 'Format invalide';
      }
      
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      const dateFormatted = date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      
      const timeFormatted = date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return `${dateFormatted} à ${timeFormatted}`;
    } catch {
      return 'Erreur date';
    }
  };

  // Formater un montant
  const formatMontant = (montant) => {
    if (!montant) return '-';
    return `${Number(montant).toLocaleString('fr-FR')} Ar`;
  };

  // Calculer la variation en pourcentage
  const calculerVariation = (ancienMontant, nouveauMontant) => {
    if (!ancienMontant || !nouveauMontant || ancienMontant === 0) return null;
    
    const variation = ((nouveauMontant - ancienMontant) / ancienMontant) * 100;
    return variation.toFixed(1);
  };

  // Tooltip personnalisé pour le graphique
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-medium">{formatMontant(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500">Chargement de l'historique...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="text-center py-4">
          <div className="text-red-500 text-sm mb-2">Erreur: {error}</div>
          <button
            onClick={loadHistorique}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="bg-white rounded-md border border-gray-200 mt-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 pb-4">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Historique des Salaires
            </h3>
            <p className="text-sm text-gray-500">
              {historiques.length} modification(s) enregistrée(s)
            </p>
          </div>
        </div>
         
      {/* Bouton Actualiser à droite - visible seulement s'il y a des historiques */}
      {historiques.length > 0 && (
        <button
          onClick={loadHistorique}
          className="flex items-center gap-2 px-4 py-1 border bg-akj text-white text-gray-700 rounded-md transition text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      )}
      </div>

      {/* Graphique d'évolution */}
      {chartData.length > 0 && (
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Évolution du Salaire
          </h4>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="Salaire Total" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Liste des historiques */}
      {historiques.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun historique de salaire disponible</p>
          <p className="text-gray-400 text-xs mt-1">
            Les modifications de salaire apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {historiques.map((historique, index) => {
            const variation = calculerVariation(
              historique.ancien_salaire_total,
              historique.nouveau_salaire_total
            );

            return (
              <div
                key={historique.id || index}
                className="border-t border-gray-400 p-6 hover:bg-gray-50 transition-colors first:border-t-0"
              >
                {/* En-tête de l'historique */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded mt-1">
                      <Calendar className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base mb-2">
                        Modification du salaire
                      </h4>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                        
                          <span>{formatDateTime(historique.date_modification || historique.created_at || historique.date_creation)}</span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Par {historique.modifie_par || historique.created_by || 'Système'}</span>
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Variation et salaire total */}
                  <div className="text-right">
                    {variation && (
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                        parseFloat(variation) >= 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {parseFloat(variation) >= 0 ? '+' : ''}{variation}%
                      </div>
                    )}
                    <div className="text-sm text-gray-500">Nouveau salaire total</div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {formatMontant(historique.nouveau_salaire_total)}
                    </div>
                  </div>
                </div>

                {/* Détails de l'historique */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Anciennes valeurs */}
                  <div className="border border-gray-100 rounded-lg p-4">
                    <h5 className="font-medium text-gray-700 mb-3 text-sm">Ancien salaire</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salaire de base:</span>
                        <span className="font-medium">{formatMontant(historique.ancien_salaire_base)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taux horaire:</span>
                        <span className="font-medium">{formatMontant(historique.ancien_taux_horaire)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prime ancienneté:</span>
                        <span className="font-medium">{formatMontant(historique.ancienne_prime_anciennete)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Indemnité déplacement:</span>
                        <span className="font-medium">{formatMontant(historique.ancienne_indemnite_deplacement)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Autre indemnité:</span>
                        <span className="font-medium">{formatMontant(historique.ancienne_autre_indemnite)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="text-gray-700 font-semibold">Total:</span>
                        <span className="font-bold text-gray-900">{formatMontant(historique.ancien_salaire_total)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Nouvelles valeurs */}
                  <div className="border border-gray-100 rounded-lg p-4">
                    <h5 className="font-medium text-gray-700 mb-3 text-sm">Nouveau salaire</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salaire de base:</span>
                        <span className="font-medium text-gray-900">{formatMontant(historique.nouveau_salaire_base)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taux horaire:</span>
                        <span className="font-medium text-gray-900">{formatMontant(historique.nouveau_taux_horaire)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Prime ancienneté:</span>
                        <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_prime_anciennete)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Indemnité déplacement:</span>
                        <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_indemnite_deplacement)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Autre indemnité:</span>
                        <span className="font-medium text-gray-900">{formatMontant(historique.nouvelle_autre_indemnite)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                        <span className="text-gray-700 font-semibold">Total:</span>
                        <span className="font-bold text-gray-900">{formatMontant(historique.nouveau_salaire_total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motif */}
                {historique.motif && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="font-medium text-gray-700 text-sm">Motif:</span>
                    <p className="text-gray-600 text-sm mt-1 bg-gray-50 p-3 rounded border border-gray-100">
                      {historique.motif}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      
      
    </div>
  );
};

export default HistoriqueSalaire;