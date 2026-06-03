

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import {
//   Calendar, Plus, Edit2, Trash2, X, Save,
//   ChevronDown, AlertTriangle, ChevronLeft, ChevronRight,
// } from 'lucide-react';
// import PageHeader from '../../components/headers/PageHeader';
// import AppFooter from '../../components/layout/AppFooter';
// import calendrierService from '../../services/calendrierService';

// // ─── Constantes ────────────────────────────────────────────────────────────────

// const TYPES = [
//   { value: 'ferie_national',   label: 'Férié national',   icon: '🇲🇬' },
//   { value: 'ferie_entreprise', label: 'Férié entreprise', icon: '🏢' },
//   { value: 'evenement',        label: 'Événement',         icon: '🎉' },
//   { value: 'fermeture',        label: 'Fermeture',         icon: '🔒' },
//   { value: 'autre',            label: 'Autre',             icon: '📌' },
// ];

// const COULEURS = [
//   { value: '#ef4444', label: 'Rouge' },
//   { value: '#f97316', label: 'Orange' },
//   { value: '#eab308', label: 'Jaune' },
//   { value: '#22c55e', label: 'Vert' },
//   { value: '#3b82f6', label: 'Bleu' },
//   { value: '#8b5cf6', label: 'Violet' },
//   { value: '#ec4899', label: 'Rose' },
//   { value: '#6b7280', label: 'Gris' },
//   { value: '#56656b', label: 'Ardoise (AKJ)' },
//   { value: '#0ea5e9', label: 'Cyan' },
// ];

// const MOIS_FR = [
//   'Janvier','Février','Mars','Avril','Mai','Juin',
//   'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
// ];

// const JOURS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// const typeInfo = (v) => TYPES.find(t => t.value === v) || TYPES[4];

// // ─── Helpers ───────────────────────────────────────────────────────────────────

// const buildCalendarGrid = (year, month) => {
//   const firstDay = new Date(year, month - 1, 1);
//   const lastDay  = new Date(year, month, 0);
//   const startDow = (firstDay.getDay() + 6) % 7;
//   const days = [];
//   for (let i = 0; i < startDow; i++) days.push(null);
//   for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
//   while (days.length % 7 !== 0) days.push(null);
//   return days;
// };

// // ─── Modal Jour Férié ──────────────────────────────────────────────────────────

// const JourFerieFormModal = ({ initial, annee, onClose, onSave }) => {
//   const [form, setForm] = useState({
//     titre:         initial?.titre         || '',
//     date:          initial?.date          || `${annee}-01-01`,
//     type_jour:     initial?.type_jour     || 'ferie_national',
//     couleur:       initial?.couleur       || '#ef4444',
//     est_recurrent: initial?.est_recurrent ?? false,
//     description:   initial?.description   || '',
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError]   = useState('');

//   const handleSave = async () => {
//     if (!form.titre.trim()) { setError('Le titre est obligatoire.'); return; }
//     if (!form.date)         { setError('La date est obligatoire.');  return; }
//     setSaving(true);
//     setError('');
//     try {
//       await onSave(form);
//     } catch (err) {
//       const d = err.response?.data;
//       const msg =
//         d?.date?.[0] ||
//         d?.non_field_errors?.[0] ||
//         d?.detail ||
//         JSON.stringify(d) ||
//         err.message;
//       setError(msg);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
//           <h3 className="text-sm font-semibold text-gray-800">
//             {initial ? 'Modifier le jour férié' : 'Ajouter un jour'}
//           </h3>
//           <button
//             onClick={onClose}
//             disabled={saving}
//             className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//           >
//             <X className="w-3.5 h-3.5" />
//           </button>
//         </div>

//         <div className="px-5 py-4 space-y-3.5">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2">{error}</div>
//           )}

//           {/* Titre */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Titre <span className="text-red-400">*</span></label>
//             <input
//               type="text"
//               value={form.titre}
//               onChange={e => setForm({ ...form, titre: e.target.value })}
//               placeholder="Ex : Fête de l'indépendance"
//               className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none transition-shadow"
//             />
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Date <span className="text-red-400">*</span></label>
//             <input
//               type="date"
//               value={form.date}
//               min={`${annee}-01-01`}
//               max={`${annee}-12-31`}
//               onChange={e => setForm({ ...form, date: e.target.value })}
//               className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-800 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none transition-shadow"
//             />
//             <p className="text-sm text-gray-400 mt-0.5">Doit être en {annee}</p>
//           </div>

//           {/* Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1.5">Type</label>
//             <div className="grid grid-cols-2 gap-1.5">
//               {TYPES.map(t => (
//                 <button
//                   key={t.value}
//                   type="button"
//                   onClick={() => setForm({ ...form, type_jour: t.value })}
//                   className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-sm transition-all ${
//                     form.type_jour === t.value
//                       ? 'border-[#56656b] bg-[#56656b]/5 text-gray-800 font-medium'
//                       : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className="text-sm leading-none">{t.icon}</span>
//                   <span>{t.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Couleur */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1.5">Couleur</label>
//             <div className="flex flex-wrap gap-1.5">
//               {COULEURS.map(c => (
//                 <button
//                   key={c.value}
//                   type="button"
//                   onClick={() => setForm({ ...form, couleur: c.value })}
//                   title={c.label}
//                   className={`w-6 h-6 rounded-full transition-all ${
//                     form.couleur === c.value
//                       ? 'ring-2 ring-offset-1 ring-gray-700 scale-110'
//                       : 'hover:scale-105 ring-1 ring-transparent hover:ring-gray-300'
//                   }`}
//                   style={{ backgroundColor: c.value }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Récurrent */}
//           <label className="flex items-start gap-2.5 cursor-pointer select-none">
//             <input
//               type="checkbox"
//               checked={form.est_recurrent}
//               onChange={e => setForm({ ...form, est_recurrent: e.target.checked })}
//               className="w-3.5 h-3.5 mt-0.5 accent-[#56656b] cursor-pointer"
//             />
//             <div>
//               <span className="text-sm font-medium text-gray-700">Récurrent chaque année</span>
//               <p className="text-sm text-gray-400 leading-tight mt-0.5">Marqué automatiquement férié chaque année</p>
//             </div>
//           </label>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
//             <textarea
//               value={form.description}
//               onChange={e => setForm({ ...form, description: e.target.value })}
//               rows={2}
//               placeholder="Note optionnelle..."
//               className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none resize-none transition-shadow"
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex gap-2 px-5 pb-4">
//           <button
//             onClick={onClose}
//             disabled={saving}
//             className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
//           >
//             Annuler
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={saving}
//             className="flex-1 px-3 py-1.5 bg-[#56656b] hover:bg-[#47535a] text-white rounded-md text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
//           >
//             {saving
//               ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               : <Save className="w-4 h-4" />
//             }
//             Enregistrer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ─── Mini-calendrier mensuel ───────────────────────────────────────────────────

// const MiniCalendar = ({ year, month, joursFeries, isAdmin, onEditJour, onDeleteJour }) => {
//   const grid = useMemo(() => buildCalendarGrid(year, month), [year, month]);
//   const today = new Date();

//   const joursMap = useMemo(() => {
//     const m = {};
//     joursFeries.forEach(j => {
//       const parts = j.date.split('-').map(Number);
//       const mo = parts[1];
//       const d  = parts[2];
//       if (mo === month) m[d] = j;
//     });
//     return m;
//   }, [joursFeries, month]);

//   return (
//     <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
//       {/* Mois header */}
//       <div className="px-3 py-2 bg-akj flex items-center justify-between">
//         <span className="text-sm font-semibold text-white tracking-wide uppercase">
//           {MOIS_FR[month - 1]}
//         </span>
//         <span className="text-xs text-white/60">{year}</span>
//       </div>

//       <div className="p-2">
//         {/* Jours de la semaine */}
//         <div className="grid grid-cols-7 mb-1">
//           {JOURS_FR.map((j, i) => (
//             <div
//               key={i}
//               className={`text-center text-sm font-semibold py-0.5 ${
//                 i >= 5 ? 'text-gray-300' : 'text-gray-400'
//               }`}
//             >
//               {j}
//             </div>
//           ))}
//         </div>

//         {/* Grille */}
//         <div className="grid grid-cols-7 gap-px">
//           {grid.map((day, i) => {
//             if (!day) return <div key={i} className="aspect-square" />;

//             const jour    = joursMap[day];
//             const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day;
//             const isSam   = (i % 7 === 5);
//             const isDim   = (i % 7 === 6);

//             return (
//               <div key={i} className="relative group aspect-square">
//                 <div
//                   className={`w-full h-full flex items-center justify-center rounded text-sm transition-all ${
//                     jour
//                       ? 'font-semibold text-white cursor-pointer hover:opacity-90'
//                       : isToday
//                         ? 'bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-200'
//                         : isSam || isDim
//                           ? 'text-gray-300'
//                           : 'text-gray-600 hover:bg-gray-50'
//                   }`}
//                   style={jour ? { backgroundColor: jour.couleur } : {}}
//                   title={jour?.titre}
//                 >
//                   {day}
//                 </div>

//                 {/* Tooltip admin */}
//                 {jour && isAdmin && (
//                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 hidden group-hover:block pointer-events-auto">
//                     <div className="bg-gray-900 text-white rounded-md px-2.5 py-2 shadow-lg whitespace-nowrap">
//                       <p className="text-sm font-medium max-w-[110px] truncate mb-1.5">{jour.titre}</p>
//                       <div className="flex gap-1">
//                         <button
//                           onClick={() => onEditJour(jour)}
//                           className="px-2 py-0.5 bg-white/10 hover:bg-blue-500 rounded text-sm transition-colors"
//                         >
//                           <Edit2 className="w-2.5 h-2.5" />
//                         </button>
//                         <button
//                           onClick={() => onDeleteJour(jour)}
//                           className="px-2 py-0.5 bg-white/10 hover:bg-red-500 rounded text-sm transition-colors"
//                         >
//                           <Trash2 className="w-2.5 h-2.5" />
//                         </button>
//                       </div>
//                     </div>
//                     {/* Flèche */}
//                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Légende jours fériés du mois */}
//       {Object.values(joursMap).length > 0 && (
//         <div className="px-2 pb-2 space-y-0.5">
//           {Object.values(joursMap).slice(0, 3).map(j => (
//             <div key={j.id} className="flex items-center gap-1.5 text-sm text-gray-500 truncate">
//               <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: j.couleur }} />
//               <span className="truncate">{j.titre}</span>
//             </div>
//           ))}
//           {Object.values(joursMap).length > 3 && (
//             <div className="text-sm text-gray-400 pl-3">
//               +{Object.values(joursMap).length - 3} autre{Object.values(joursMap).length - 3 > 1 ? 's' : ''}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // ─── Page principale ───────────────────────────────────────────────────────────

// const CalendrierPage = () => {
//   const isAdminRaw = localStorage.getItem('is_admin');
//   const isAdmin = isAdminRaw === 'true' || isAdminRaw === true || isAdminRaw === '1' || isAdminRaw === 1;

//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [calendrier, setCalendrier]   = useState(null);
//   const [joursFeries, setJoursFeries] = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [loadingJours, setLoadingJours] = useState(false);

//   const [showJourModal, setShowJourModal] = useState(false);
//   const [editingJour, setEditingJour]     = useState(null);
//   const [confirmDelete, setConfirmDelete] = useState(null);

//   const [viewMode, setViewMode]     = useState('calendar');
//   const [filterType, setFilterType] = useState('');
//   const [searchJour, setSearchJour] = useState('');

//   // ── Fetch calendrier par année ─────────────────────────────────────────────
//   const fetchCalendrier = useCallback(async (annee) => {
//     setLoading(true);
//     try {
//       const cal = await calendrierService.getCalendrierByAnnee(annee);
//       setCalendrier(cal);
//       return cal;
//     } catch (err) {
//       console.error("Erreur lors du chargement du calendrier:", err);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ── Fetch jours fériés ─────────────────────────────────────────────────────
//   const fetchJoursFeries = useCallback(async (cal) => {
//     if (!cal) return;
//     setLoadingJours(true);
//     try {
//       const d = await calendrierService.getCalendrier(cal.id);
//       setJoursFeries(d.jours_feries || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoadingJours(false);
//     }
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       const cal = await fetchCalendrier(currentYear);
//       if (cal) await fetchJoursFeries(cal);
//     };
//     loadData();
//   }, [currentYear, fetchCalendrier, fetchJoursFeries]);

//   // ── Actions ────────────────────────────────────────────────────────────────
//   const handleSaveJour = async (form) => {
//     if (editingJour?.id) {
//       await calendrierService.updateJourFerie(editingJour.id, form);
//     } else {
//       await calendrierService.createJourFerie(calendrier.id, form);
//     }
//     setShowJourModal(false);
//     setEditingJour(null);
//     if (calendrier) await fetchJoursFeries(calendrier);
//   };

//   const handleDeleteJour = async () => {
//     if (!confirmDelete) return;
//     await calendrierService.deleteJourFerie(confirmDelete.obj.id);
//     setConfirmDelete(null);
//     if (calendrier) await fetchJoursFeries(calendrier);
//   };

//   // ── Filtres ────────────────────────────────────────────────────────────────
//   const joursFiltered = useMemo(() => {
//     return joursFeries.filter(j => {
//       const matchType   = !filterType || j.type_jour === filterType;
//       const matchSearch = !searchJour || j.titre.toLowerCase().includes(searchJour.toLowerCase());
//       return matchType && matchSearch;
//     });
//   }, [joursFeries, filterType, searchJour]);

//   // ── Stats ──────────────────────────────────────────────────────────────────
//   const stats = useMemo(() => {
//     const today = new Date();
//     return {
//       total:      joursFeries.length,
//       passes:     joursFeries.filter(j => new Date(j.date) < today).length,
//       avenir:     joursFeries.filter(j => new Date(j.date) >= today).length,
//       recurrents: joursFeries.filter(j => j.est_recurrent).length,
//     };
//   }, [joursFeries]);

//   // ─────────────────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="px-3 sm:px-5 py-4 sm:py-5">
//         <div className="max-w-full mx-auto">

//           <PageHeader
//             pageTag="Gestion des calendriers"
//             title="Calendrier d'entreprise"
//             subtitle="Gérez les jours fériés et événements de l'entreprise"
//             kpis={[
//               { label: 'Total jours',  value: stats.total,      dotColor: '#56656b' },
//               { label: 'À venir',      value: stats.avenir,     dotColor: '#22c55e' },
//               { label: 'Passés',       value: stats.passes,     dotColor: '#6b7280' },
//               { label: 'Récurrents',   value: stats.recurrents, dotColor: '#3b82f6' },
//             ]}
//           />

//           {/* ── Barre d'outils ── */}
//           <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-3 sm:px-4 py-2.5 mb-4">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">

//               {/* Sélecteur année */}
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setCurrentYear(prev => prev - 1)}
//                   className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 <span className="text-base font-semibold text-gray-800 w-16 text-center tabular-nums">
//                   {currentYear}
//                 </span>
//                 <button
//                   onClick={() => setCurrentYear(prev => prev + 1)}
//                   className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>

//               {/* Contrôles droite */}
//               <div className="flex flex-wrap items-center gap-2">
//                 {/* Recherche */}
//                 <input
//                   type="text"
//                   value={searchJour}
//                   onChange={e => setSearchJour(e.target.value)}
//                   placeholder="Rechercher..."
//                   className="px-2.5 py-1.5 border border-gray-200 rounded-md text-sm w-36 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none"
//                 />

//                 {/* Filtre type */}
//                 <div className="relative">
//                   <select
//                     value={filterType}
//                     onChange={e => setFilterType(e.target.value)}
//                     className="pl-2.5 pr-7 py-1.5 border border-gray-200 rounded-md text-sm appearance-none focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none bg-white text-gray-700"
//                   >
//                     <option value="">Tous les types</option>
//                     {TYPES.map(t => (
//                       <option key={t.value} value={t.value}>{t.label}</option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
//                 </div>

//                 {/* Toggle vue */}
//                 <div className="flex bg-gray-100 rounded-md p-0.5 gap-0.5">
//                   <button
//                     onClick={() => setViewMode('calendar')}
//                     className={`px-2.5 py-1 rounded text-sm font-medium transition-all ${
//                       viewMode === 'calendar'
//                         ? 'bg-white shadow-sm text-gray-800'
//                         : 'text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Calendrier
//                   </button>
//                   <button
//                     onClick={() => setViewMode('list')}
//                     className={`px-2.5 py-1 rounded text-sm font-medium transition-all ${
//                       viewMode === 'list'
//                         ? 'bg-white shadow-sm text-gray-800'
//                         : 'text-gray-500 hover:text-gray-700'
//                     }`}
//                   >
//                     Liste
//                   </button>
//                 </div>

//                 {/* Bouton ajouter */}
//                 {isAdmin && (
//                   <button
//                     onClick={() => { setEditingJour(null); setShowJourModal(true); }}
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-[#56656b] hover:bg-[#47535a] text-white rounded-md text-sm font-medium transition-colors"
//                   >
//                     <Plus className="w-3.5 h-3.5" />
//                     <span>Ajouter</span>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ── Contenu ── */}
//           {loading ? (
//             <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-400 text-sm">
//               Chargement...
//             </div>
//           ) : (
//             <>
//               {/* Vue calendrier */}
//               {viewMode === 'calendar' && (
//                 loadingJours ? (
//                   <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-400 text-sm">
//                     Chargement des jours fériés...
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
//                     {[...Array(12)].map((_, i) => (
//                       <MiniCalendar
//                         key={i}
//                         year={currentYear}
//                         month={i + 1}
//                         joursFeries={joursFiltered}
//                         isAdmin={isAdmin}
//                         onEditJour={j => { setEditingJour(j); setShowJourModal(true); }}
//                         onDeleteJour={j => setConfirmDelete({ type: 'jour', obj: j })}
//                       />
//                     ))}
//                   </div>
//                 )
//               )}

//               {/* Vue liste */}
//               {viewMode === 'list' && (
//                 <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
//                   {loadingJours ? (
//                     <div className="p-12 text-center text-gray-400 text-sm">Chargement...</div>
//                   ) : joursFiltered.length === 0 ? (
//                     <div className="p-12 text-center">
//                       <Calendar className="w-8 h-8 mx-auto text-gray-200 mb-2.5" />
//                       <p className="text-gray-400 text-sm">Aucun jour férié pour {currentYear}</p>
//                       {isAdmin && (
//                         <button
//                           onClick={() => { setEditingJour(null); setShowJourModal(true); }}
//                           className="mt-3 px-3 py-1.5 bg-[#56656b] hover:bg-[#47535a] text-white rounded-md text-sm transition-colors"
//                         >
//                           Ajouter le premier
//                         </button>
//                       )}
//                     </div>
//                   ) : (
//                     <>
//                       {/* Desktop */}
//                       <div className="hidden md:block overflow-x-auto">
//                         <table className="w-full text-sm">
//                           <thead>
//                             <tr className="border-b border-gray-100 bg-gray-50/70">
//                               {['Date', 'Titre', 'Type', 'Couleur', 'Récurrent', ...(isAdmin ? [''] : [])].map((h, idx) => (
//                                 <th key={idx} className="px-4 py-2.5 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
//                                   {h}
//                                 </th>
//                               ))}
//                             </tr>
//                           </thead>
//                           <tbody className="divide-y divide-gray-50">
//                             {joursFiltered.map(j => {
//                               const info   = typeInfo(j.type_jour);
//                               const isPast = new Date(j.date) < new Date();
//                               return (
//                                 <tr
//                                   key={j.id}
//                                   className={`hover:bg-gray-50/60 transition-colors ${isPast ? 'opacity-50' : ''}`}
//                                 >
//                                   <td className="px-4 py-2.5 whitespace-nowrap">
//                                     <div className="text-sm text-gray-400">{j.jour_semaine}</div>
//                                     <div className="font-medium text-gray-700">
//                                       {new Date(j.date).toLocaleDateString('fr-FR', {
//                                         day: '2-digit', month: 'long', year: 'numeric',
//                                       })}
//                                     </div>
//                                   </td>
//                                   <td className="px-4 py-2.5">
//                                     <div className="font-medium text-gray-800">{j.titre}</div>
//                                     {j.description && (
//                                       <div className="text-sm text-gray-400 truncate max-w-xs mt-0.5">{j.description}</div>
//                                     )}
//                                   </td>
//                                   <td className="px-4 py-2.5">
//                                     <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-sm text-gray-600">
//                                       {info.icon} {info.label}
//                                     </span>
//                                   </td>
//                                   <td className="px-4 py-2.5">
//                                     <span
//                                       className="inline-block w-4 h-4 rounded-full"
//                                       style={{ backgroundColor: j.couleur }}
//                                       title={COULEURS.find(c => c.value === j.couleur)?.label}
//                                     />
//                                   </td>
//                                   <td className="px-4 py-2.5">
//                                     {j.est_recurrent
//                                       ? <span className="inline-flex items-center gap-1 text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">↻ Récurrent</span>
//                                       : <span className="text-gray-300">—</span>
//                                     }
//                                   </td>
//                                   {isAdmin && (
//                                     <td className="px-4 py-2.5">
//                                       <div className="flex gap-1 justify-end">
//                                         <button
//                                           onClick={() => { setEditingJour(j); setShowJourModal(true); }}
//                                           className="p-1 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
//                                         >
//                                           <Edit2 className="w-3.5 h-3.5" />
//                                         </button>
//                                         <button
//                                           onClick={() => setConfirmDelete({ type: 'jour', obj: j })}
//                                           className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
//                                         >
//                                           <Trash2 className="w-3.5 h-3.5" />
//                                         </button>
//                                       </div>
//                                     </td>
//                                   )}
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>

//                       {/* Mobile */}
//                       <div className="md:hidden divide-y divide-gray-50">
//                         {joursFiltered.map(j => {
//                           const info   = typeInfo(j.type_jour);
//                           const isPast = new Date(j.date) < new Date();
//                           return (
//                             <div key={j.id} className={`px-4 py-3 ${isPast ? 'opacity-50' : ''}`}>
//                               <div className="flex items-start justify-between">
//                                 <div>
//                                   <div className="text-sm font-medium text-gray-800">{j.titre}</div>
//                                   <div className="text-sm text-gray-400 mt-0.5">
//                                     {new Date(j.date).toLocaleDateString('fr-FR', {
//                                       day: '2-digit', month: 'long', year: 'numeric',
//                                     })} · {j.jour_semaine}
//                                   </div>
//                                 </div>
//                                 {isAdmin && (
//                                   <div className="flex gap-1">
//                                     <button
//                                       onClick={() => { setEditingJour(j); setShowJourModal(true); }}
//                                       className="p-1 text-gray-300 hover:text-blue-500 transition-colors"
//                                     >
//                                       <Edit2 className="w-3.5 h-3.5" />
//                                     </button>
//                                     <button
//                                       onClick={() => setConfirmDelete({ type: 'jour', obj: j })}
//                                       className="p-1 text-gray-300 hover:text-red-500 transition-colors"
//                                     >
//                                       <Trash2 className="w-3.5 h-3.5" />
//                                     </button>
//                                   </div>
//                                 )}
//                               </div>
//                               <div className="flex flex-wrap gap-1.5 mt-2">
//                                 <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-sm text-gray-600">
//                                   {info.icon} {info.label}
//                                 </span>
//                                 {j.est_recurrent && (
//                                   <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">↻ Récurrent</span>
//                                 )}
//                                 <span
//                                   className="w-4 h-4 rounded-full self-center"
//                                   style={{ backgroundColor: j.couleur }}
//                                 />
//                               </div>
//                               {j.description && (
//                                 <p className="text-sm text-gray-400 mt-1.5">{j.description}</p>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </>
//                   )}
//                 </div>
//               )}
//             </>
//           )}

//           <AppFooter />
//         </div>
//       </div>

//       {/* ── Modal ajout / édition ── */}
//       {showJourModal && calendrier && (
//         <JourFerieFormModal
//           initial={editingJour}
//           annee={currentYear}
//           onClose={() => { setShowJourModal(false); setEditingJour(null); }}
//           onSave={handleSaveJour}
//         />
//       )}

//       {/* ── Confirmation suppression ── */}
//       {confirmDelete && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-xs w-full p-5">
//             <div className="flex items-start gap-3 mb-3.5">
//               <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
//                 <AlertTriangle className="w-4 h-4 text-red-500" />
//               </div>
//               <div>
//                 <h3 className="text-sm font-semibold text-gray-800">Confirmer la suppression</h3>
//                 <p className="text-sm text-gray-400 mt-0.5">Cette action est irréversible.</p>
//               </div>
//             </div>
//             <p className="text-sm text-gray-600 mb-4 pl-11">
//               Supprimer <strong>"{confirmDelete.obj.titre}"</strong> du{' '}
//               <strong>{confirmDelete.obj.date}</strong> ?
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setConfirmDelete(null)}
//                 className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
//               >
//                 Annuler
//               </button>
//               <button
//                 onClick={handleDeleteJour}
//                 className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
//               >
//                 Supprimer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CalendrierPage;


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar, Plus, Edit2, Trash2, X, Save,
  ChevronDown, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import PageHeader from '../../components/headers/PageHeader';
import AppFooter from '../../components/layout/AppFooter';
import calendrierService from '../../services/calendrierService';

// ─── Constantes ────────────────────────────────────────────────────────────────

const TYPES = [
  { value: 'ferie_national',   label: 'Férié national' },
  { value: 'ferie_entreprise', label: 'Férié entreprise' },
  { value: 'evenement',        label: 'Événement', },
  { value: 'fermeture',        label: 'Fermeture', },
  { value: 'autre',            label: 'Autre',  },
];

const COULEURS = [
  { value: '#ef4444', label: 'Rouge' },
  { value: '#f97316', label: 'Orange' },
  { value: '#eab308', label: 'Jaune' },
  { value: '#22c55e', label: 'Vert' },
  { value: '#3b82f6', label: 'Bleu' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec4899', label: 'Rose' },
  { value: '#6b7280', label: 'Gris' },
  { value: '#56656b', label: 'Ardoise (AKJ)' },
  { value: '#0ea5e9', label: 'Cyan' },
];

const MOIS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

const JOURS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const typeInfo = (v) => TYPES.find(t => t.value === v) || TYPES[4];

// ─── Helpers ───────────────────────────────────────────────────────────────────

const buildCalendarGrid = (year, month) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay  = new Date(year, month, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const days = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);
  return days;
};

// ─── Modal Jour Férié ──────────────────────────────────────────────────────────

const JourFerieFormModal = ({ initial, annee, onClose, onSave }) => {
  const [form, setForm] = useState({
    titre:         initial?.titre         || '',
    date:          initial?.date          || `${annee}-01-01`,
    type_jour:     initial?.type_jour     || 'ferie_national',
    couleur:       initial?.couleur       || '#ef4444',
    est_recurrent: initial?.est_recurrent ?? false,
    description:   initial?.description   || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const handleSave = async () => {
    if (!form.titre.trim()) { setError('Le titre est obligatoire.'); return; }
    if (!form.date)         { setError('La date est obligatoire.');  return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
    } catch (err) {
      const d = err.response?.data;
      const msg =
        d?.date?.[0] ||
        d?.non_field_errors?.[0] ||
        d?.detail ||
        JSON.stringify(d) ||
        err.message;
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            {initial ? 'Modifier le jour férié' : 'Ajouter un jour'}
          </h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3.5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-md px-3 py-2">{error}</div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Titre <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.titre}
              onChange={e => setForm({ ...form, titre: e.target.value })}
              placeholder="Ex : Fête de l'indépendance"
              className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none transition-shadow"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Date <span className="text-red-400">*</span></label>
            <input
              type="date"
              value={form.date}
              min={`${annee}-01-01`}
              max={`${annee}-12-31`}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-800 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none transition-shadow"
            />
            <p className="text-sm text-gray-400 mt-0.5">Doit être en {annee}</p>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, type_jour: t.value })}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-sm transition-all ${
                    form.type_jour === t.value
                      ? 'border-[#56656b] bg-[#56656b]/5 text-gray-800 font-medium'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm leading-none">{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Couleur</label>
            <div className="flex flex-wrap gap-1.5">
              {COULEURS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, couleur: c.value })}
                  title={c.label}
                  className={`w-6 h-6 rounded-full transition-all ${
                    form.couleur === c.value
                      ? 'ring-2 ring-offset-1 ring-gray-700 scale-110'
                      : 'hover:scale-105 ring-1 ring-transparent hover:ring-gray-300'
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>

          {/* Récurrent */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.est_recurrent}
              onChange={e => setForm({ ...form, est_recurrent: e.target.checked })}
              className="w-3.5 h-3.5 mt-0.5 accent-[#56656b] cursor-pointer"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">Récurrent chaque année</span>
              <p className="text-sm text-gray-400 leading-tight mt-0.5">Marqué automatiquement férié chaque année</p>
            </div>
          </label>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Note</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Note optionnelle..."
              className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none resize-none transition-shadow"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-3 py-1.5 bg-[#56656b] hover:bg-[#47535a] text-white rounded-md text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
          >
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Save className="w-4 h-4" />
            }
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Mini-calendrier mensuel ───────────────────────────────────────────────────

const MiniCalendar = ({ year, month, joursFeries, isAdmin, onEditJour, onDeleteJour }) => {
  const grid = useMemo(() => buildCalendarGrid(year, month), [year, month]);
  const today = new Date();

  const joursMap = useMemo(() => {
    const m = {};
    joursFeries.forEach(j => {
      const parts = j.date.split('-').map(Number);
      const mo = parts[1];
      const d  = parts[2];
      if (mo === month) m[d] = j;
    });
    return m;
  }, [joursFeries, month]);

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Mois header */}
      <div className="px-3 py-2 bg-akj flex items-center justify-between">
        <span className="text-sm font-semibold text-white tracking-wide uppercase">
          {MOIS_FR[month - 1]}
        </span>
        <span className="text-xs text-white/60">{year}</span>
      </div>

      <div className="p-2">
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 mb-1">
          {JOURS_FR.map((j, i) => (
            <div
              key={i}
              className={`text-center text-sm font-semibold py-0.5 ${
                i >= 5 ? 'text-gray-300' : 'text-gray-400'
              }`}
            >
              {j}
            </div>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-7 gap-px">
          {grid.map((day, i) => {
            if (!day) return <div key={i} className="aspect-square" />;

            const jour    = joursMap[day];
            const isToday = today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === day;
            const isSam   = (i % 7 === 5);
            const isDim   = (i % 7 === 6);

            return (
              <div key={i} className="relative group aspect-square">
                <div
                  className={`w-full h-full flex items-center justify-center rounded text-xs transition-all ${
                    jour
                      ? 'font-semibold text-white cursor-pointer hover:opacity-90'
                      : isToday
                        ? 'bg-blue-50 text-blue-600 font-semibold ring-1 ring-blue-200'
                        : isSam || isDim
                          ? 'text-gray-300'
                          : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={jour ? { backgroundColor: jour.couleur } : {}}
                  title={jour?.titre}
                >
                  {day}
                </div>

                {/* Tooltip admin */}
                {jour && isAdmin && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 hidden group-hover:block pointer-events-auto">
                    <div className="bg-gray-900 text-white rounded-md px-2.5 py-2 shadow-lg whitespace-nowrap">
                      <p className="text-sm font-medium max-w-[110px] truncate mb-1.5">{jour.titre}</p>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEditJour(jour)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-blue-500 rounded text-sm transition-colors"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => onDeleteJour(jour)}
                          className="px-2 py-0.5 bg-white/10 hover:bg-red-500 rounded text-sm transition-colors"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                    {/* Flèche */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende jours fériés du mois */}
      {Object.values(joursMap).length > 0 && (
        <div className="px-2 pb-2 space-y-0.5">
          {Object.values(joursMap).slice(0, 3).map(j => (
            <div key={j.id} className="flex items-center gap-1.5 text-sm text-gray-500 truncate">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: j.couleur }} />
              <span className="truncate">{j.titre}</span>
            </div>
          ))}
          {Object.values(joursMap).length > 3 && (
            <div className="text-sm text-gray-400 pl-3">
              +{Object.values(joursMap).length - 3} autre{Object.values(joursMap).length - 3 > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Page principale ───────────────────────────────────────────────────────────

const CalendrierPage = () => {
  const isAdminRaw = localStorage.getItem('is_admin');
  const isAdmin = isAdminRaw === 'true' || isAdminRaw === true || isAdminRaw === '1' || isAdminRaw === 1;

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendrier, setCalendrier]   = useState(null);
  const [joursFeries, setJoursFeries] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingJours, setLoadingJours] = useState(false);

  const [showJourModal, setShowJourModal] = useState(false);
  const [editingJour, setEditingJour]     = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [viewMode, setViewMode]     = useState('calendar');
  const [filterType, setFilterType] = useState('');
  //const [searchJour, setSearchJour] = useState('');

  // ── Fetch calendrier par année ─────────────────────────────────────────────
  const fetchCalendrier = useCallback(async (annee) => {
    setLoading(true);
    try {
      const cal = await calendrierService.getCalendrierByAnnee(annee);
      setCalendrier(cal);
      return cal;
    } catch (err) {
      console.error("Erreur lors du chargement du calendrier:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch jours fériés ─────────────────────────────────────────────────────
  const fetchJoursFeries = useCallback(async (cal) => {
    if (!cal) return;
    setLoadingJours(true);
    try {
      const d = await calendrierService.getCalendrier(cal.id);
      setJoursFeries(d.jours_feries || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJours(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const cal = await fetchCalendrier(currentYear);
      if (cal) await fetchJoursFeries(cal);
    };
    loadData();
  }, [currentYear, fetchCalendrier, fetchJoursFeries]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleSaveJour = async (form) => {
    if (editingJour?.id) {
      await calendrierService.updateJourFerie(editingJour.id, form);
    } else {
      await calendrierService.createJourFerie(calendrier.id, form);
    }
    setShowJourModal(false);
    setEditingJour(null);
    if (calendrier) await fetchJoursFeries(calendrier);
  };

  const handleDeleteJour = async () => {
    if (!confirmDelete) return;
    await calendrierService.deleteJourFerie(confirmDelete.obj.id);
    setConfirmDelete(null);
    if (calendrier) await fetchJoursFeries(calendrier);
  };

  // ── Filtres ────────────────────────────────────────────────────────────────
  const joursFiltered = useMemo(() => {
    return joursFeries.filter(j => {
      const matchType   = !filterType || j.type_jour === filterType;
      //const matchSearch = !searchJour || j.titre.toLowerCase().includes(searchJour.toLowerCase());
      return matchType;
    });
  }, [joursFeries, filterType]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const today = new Date();
    return {
      total:      joursFeries.length,
      passes:     joursFeries.filter(j => new Date(j.date) < today).length,
      avenir:     joursFeries.filter(j => new Date(j.date) >= today).length,
      recurrents: joursFeries.filter(j => j.est_recurrent).length,
    };
  }, [joursFeries]);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 sm:px-5 py-4 sm:py-5">
        <div className="max-w-full mx-auto">

          <PageHeader
            pageTag="Gestion des calendriers"
            title="Calendrier d'entreprise"
            subtitle="Gérez les jours fériés et événements de l'entreprise"
            kpis={[
              { label: 'Total jours',  value: stats.total,      dotColor: '#56656b' },
              { label: 'À venir',      value: stats.avenir,     dotColor: '#22c55e' },
              { label: 'Passés',       value: stats.passes,     dotColor: '#6b7280' },
              { label: 'Récurrents',   value: stats.recurrents, dotColor: '#3b82f6' },
            ]}
          />

          {/* ── Barre d'outils ── */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm px-3 sm:px-4 py-2.5 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">

              {/* Sélecteur année */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentYear(prev => prev - 1)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-base font-semibold text-gray-800 w-16 text-center tabular-nums">
                  {currentYear}
                </span>
                <button
                  onClick={() => setCurrentYear(prev => prev + 1)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Contrôles droite */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Recherche */}
                {/* <input
                  type="text"
                  value={searchJour}
                  onChange={e => setSearchJour(e.target.value)}
                  placeholder="Rechercher..."
                  className="px-2.5 py-1.5 border border-gray-200 rounded-md text-sm w-36 focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none"
                /> */}

                {/* Filtre type */}
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={e => setFilterType(e.target.value)}
                    className="pl-2.5 pr-7 py-1.5 border border-gray-200 rounded-md text-sm appearance-none focus:ring-1 focus:ring-[#56656b] focus:border-[#56656b] focus:outline-none bg-white text-gray-700"
                  >
                    <option value="">Tous les types</option>
                    {TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Toggle vue */}
                <div className="flex bg-gray-100 rounded-md p-0.5 gap-0.5">
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-2.5 py-1 rounded text-sm font-medium transition-all ${
                      viewMode === 'calendar'
                        ? 'bg-white shadow-sm text-gray-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Calendrier
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1 rounded text-sm font-medium transition-all ${
                      viewMode === 'list'
                        ? 'bg-white shadow-sm text-gray-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Liste
                  </button>
                </div>

                {/* Bouton ajouter */}
                {isAdmin && (
                  <button
                    onClick={() => { setEditingJour(null); setShowJourModal(true); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#56656b] hover:bg-[#47535a] text-white rounded-md text-sm font-medium transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Contenu ── */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-400 text-sm">
              Chargement...
            </div>
          ) : (
            <>
              {/* Vue calendrier */}
              {viewMode === 'calendar' && (
                loadingJours ? (
                  <div className="bg-white rounded-lg border border-gray-100 p-12 text-center text-gray-400 text-sm">
                    Chargement des jours fériés...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
                    {[...Array(12)].map((_, i) => (
                      <MiniCalendar
                        key={i}
                        year={currentYear}
                        month={i + 1}
                        joursFeries={joursFiltered}
                        isAdmin={isAdmin}
                        onEditJour={j => { setEditingJour(j); setShowJourModal(true); }}
                        onDeleteJour={j => setConfirmDelete({ type: 'jour', obj: j })}
                      />
                    ))}
                  </div>
                )
              )}

              {/* Vue liste */}
              {viewMode === 'list' && (
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                  {loadingJours ? (
                    <div className="p-12 text-center text-gray-400 text-sm">Chargement...</div>
                  ) : joursFiltered.length === 0 ? (
                    <div className="p-12 text-center">
                      <Calendar className="w-8 h-8 mx-auto text-gray-200 mb-2.5" />
                      <p className="text-gray-400 text-sm">Aucun jour férié pour {currentYear}</p>
                      {isAdmin && (
                        <button
                          onClick={() => { setEditingJour(null); setShowJourModal(true); }}
                          className="mt-3 px-3 py-1.5 bg-[#56656b] hover:bg-[#47535a] text-white rounded-md text-sm transition-colors"
                        >
                          Ajouter le premier
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Desktop */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                              {['Date', 'Titre', 'Type','Couleur', 'Récurrent', ...(isAdmin ? ['Actions'] : [])].map((h, idx) => (
                                <th key={idx} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {joursFiltered.map(j => {
                              const info   = typeInfo(j.type_jour);
                              const isPast = new Date(j.date) < new Date();
                              return (
                                <tr
                                  key={j.id}
                                  className={`hover:bg-gray-50 transition-colors group ${isPast ? 'opacity-60' : ''}`}
                                >
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-xs text-gray-400 mb-0.5">{j.jour_semaine}</div>
                                    <div className="font-medium text-gray-800">
                                      {new Date(j.date).toLocaleDateString('fr-FR', {
                                        day: '2-digit', month: 'long', year: 'numeric',
                                      })}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="font-medium text-gray-800">{j.titre}</div>
                                    {j.description && (
                                      <div className="text-xs text-gray-500 truncate max-w-xs mt-0.5">{j.description}</div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600">
                                      {info.icon} {info.label}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span
                                      className="inline-block w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                      style={{ backgroundColor: j.couleur }}
                                      title={COULEURS.find(c => c.value === j.couleur)?.label}
                                    />
                                  </td>
                                  <td className="px-4 py-3">
                                    {j.est_recurrent
                                      ? <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600  px-2.5 py-1">↻ Récurrent</span>
                                      : <span className="text-gray-300 text-sm">—</span>
                                    }
                                  </td>
                                  {isAdmin && (
                                    <td className="px-4 py-3">
                                      <div className="flex gap-1.5 items-center">
                                        <button
                                          onClick={() => { setEditingJour(j); setShowJourModal(true); }}
                                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-colors"
                                          title="Modifier"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => setConfirmDelete({ type: 'jour', obj: j })}
                                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-colors"
                                          title="Supprimer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile */}
                      <div className="md:hidden divide-y divide-gray-50">
                        {joursFiltered.map(j => {
                          const info   = typeInfo(j.type_jour);
                          const isPast = new Date(j.date) < new Date();
                          return (
                            <div key={j.id} className={`px-4 py-3 ${isPast ? 'opacity-50' : ''}`}>
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-800">{j.titre}</div>
                                  <div className="text-sm text-gray-400 mt-0.5">
                                    {new Date(j.date).toLocaleDateString('fr-FR', {
                                      day: '2-digit', month: 'long', year: 'numeric',
                                    })} · {j.jour_semaine}
                                  </div>
                                </div>
                                {isAdmin && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => { setEditingJour(j); setShowJourModal(true); }}
                                      className="p-1 text-gray-300 hover:text-blue-500 transition-colors"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setConfirmDelete({ type: 'jour', obj: j })}
                                      className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-sm text-gray-600">
                                  {info.icon} {info.label}
                                </span>
                                {j.est_recurrent && (
                                  <span className="text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">↻ Récurrent</span>
                                )}
                                <span
                                  className="w-4 h-4 rounded-full self-center"
                                  style={{ backgroundColor: j.couleur }}
                                />
                              </div>
                              {j.description && (
                                <p className="text-sm text-gray-400 mt-1.5">{j.description}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}

          <AppFooter />
        </div>
      </div>

      {/* ── Modal ajout / édition ── */}
      {showJourModal && calendrier && (
        <JourFerieFormModal
          initial={editingJour}
          annee={currentYear}
          onClose={() => { setShowJourModal(false); setEditingJour(null); }}
          onSave={handleSaveJour}
        />
      )}

      {/* ── Confirmation suppression ── */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xs w-full p-5">
            <div className="flex items-start gap-3 mb-3.5">
              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Confirmer la suppression</h3>
                <p className="text-sm text-gray-400 mt-0.5">Cette action est irréversible.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 pl-11">
              Supprimer <strong>"{confirmDelete.obj.titre}"</strong> du{' '}
              <strong>{confirmDelete.obj.date}</strong> ?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteJour}
                className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendrierPage;