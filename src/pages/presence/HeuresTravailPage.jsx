// // // import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// // // import {
// // //   Clock,
// // //   Search,
// // //   X,
// // //   ChevronDown,
// // //   ChevronLeft,
// // //   ChevronRight,
// // //   TrendingUp,
// // // } from 'lucide-react';
// // // import presenceService from '../../services/presenceService';
// // // import PageHeader from '../../components/headers/PageHeader';
// // // import '/src/styles/custom.css';

// // // // ── Utilitaires ───────────────────────────────────────────────────────────────

// // // const fmtH = (heures) => {
// // //   if (!heures && heures !== 0) return '—';
// // //   const h = Math.floor(heures);
// // //   const m = Math.round((heures - h) * 60);
// // //   return m > 0
// // //     ? `${h}h${String(m).padStart(2, '0')}`
// // //     : `${h}h`;
// // // };

// // // const getCellClass = (heures) => {
// // //   if (heures === 0 || !heures) return 'ht-zero';
// // //   if (heures >= 9)              return 'ht-ok';
// // //   if (heures >= 7)              return 'ht-moyen';
// // //   return 'ht-faible';
// // // };

// // // const getTotalClass = (heures, nbJours) => {
// // //   if (heures === 0 || !heures) return 'ht-zero';
// // //   const moy = nbJours > 0 ? heures / nbJours : 0;
// // //   if (moy >= 9)                return 'ht-total-ok';
// // //   if (moy >= 7)                return 'ht-total-moyen';
// // //   return 'ht-total-faible';
// // // };

// // // // ── Barre de recherche ────────────────────────────────────────────────────────

// // // const SearchBar = ({ value, onChange }) => (
// // //   <div className="relative flex-1 max-w-sm">
// // //     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// // //     <input
// // //       value={value}
// // //       onChange={(e) => onChange(e.target.value)}
// // //       placeholder="Badge ou nom..."
// // //       className="w-full pl-9 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm"
// // //     />
// // //     {value && (
// // //       <button
// // //         onClick={() => onChange('')}
// // //         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
// // //       >
// // //         <X className="w-4 h-4" />
// // //       </button>
// // //     )}
// // //   </div>
// // // );

// // // // ── Sélecteur de section ──────────────────────────────────────────────────────

// // // const SectionSelect = ({ sections, value, onChange }) => (
// // //   <div className="relative">
// // //     <select
// // //       value={value}
// // //       onChange={(e) => onChange(e.target.value)}
// // //       className="pl-3 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px]"
// // //     >
// // //       <option value="">— Toutes les sections —</option>
// // //       {sections.map((s) => (
// // //         <option key={s.section_id} value={s.nom_section}>
// // //           {s.nom_section} ({s.nb_employes})
// // //         </option>
// // //       ))}
// // //     </select>
// // //     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
// // //   </div>
// // // );

// // // // ── Légende ───────────────────────────────────────────────────────────────────

// // // const Legende = () => (
// // //   <div className="flex flex-wrap gap-3 text-xs print:hidden">
// // //     {[
// // //       { cls: 'ht-ok',     label: '≥ 9h / jour' },
// // //       { cls: 'ht-moyen',  label: '7h – 9h' },
// // //       { cls: 'ht-faible', label: '< 7h' },
// // //       { cls: 'ht-zero',   label: 'Absent (0h)' },
// // //     ].map(({ cls, label }) => (
// // //       <span key={cls} className={`px-2 py-0.5 rounded ${cls}`}>
// // //         {label}
// // //       </span>
// // //     ))}
// // //   </div>
// // // );

// // // // ── Composant principal ───────────────────────────────────────────────────────

// // // const MOIS_FR = [
// // //   'Janvier','Février','Mars','Avril','Mai','Juin',
// // //   'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
// // // ];

// // // const HeuresTravailPage = () => {
// // //   const today = new Date();

// // //   // Mois / année appliqués (déclenchent le fetch)
// // //   const [annee, setAnnee] = useState(today.getFullYear());
// // //   const [mois,  setMois]  = useState(today.getMonth() + 1);

// // //   // Mois / année sélectionnés dans les dropdowns (avant application)
// // //   const [selectedAnnee,   setSelectedAnnee]   = useState(today.getFullYear());
// // //   const [selectedMois,    setSelectedMois]     = useState(today.getMonth() + 1);
// // //   const [filterChanged,   setFilterChanged]    = useState(false);

// // //   const [sections,         setSections]        = useState([]);
// // //   const [selectedSection,  setSelectedSection] = useState('');
// // //   const [searchInput,      setSearchInput]     = useState('');
// // //   const [debouncedQ,       setDebouncedQ]      = useState('');

// // //   const [data,       setData]       = useState(null);
// // //   const [loading,    setLoading]    = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [page,       setPage]       = useState(1);
// // //   const [forceRefresh, setForceRefresh] = useState(0);

// // //   const componentRef = useRef();

// // //   // ── Debounce recherche ────────────────────────────────────────────────────
// // //   useEffect(() => {
// // //     const t = setTimeout(() => {
// // //       setDebouncedQ(searchInput.trim());
// // //       setPage(1);
// // //     }, 350);
// // //     return () => clearTimeout(t);
// // //   }, [searchInput]);

// // //   // ── Chargement sections ───────────────────────────────────────────────────
// // //   useEffect(() => {
// // //     presenceService
// // //       .getSections()
// // //       .then((d) => setSections(d.sections || []))
// // //       .catch(console.error);
// // //   }, []);

// // //   // ── Chargement principal ──────────────────────────────────────────────────
// // //   const fetchData = useCallback(async () => {
// // //     if (data) setRefreshing(true);
// // //     else      setLoading(true);
// // //     try {
// // //       const res = await presenceService.getHeuresTravail(
// // //         annee, mois, selectedSection, page, 50, debouncedQ,
// // //       );
// // //       setData(res);
// // //     } catch (err) {
// // //       console.error('❌ Erreur heures travail:', err);
// // //     } finally {
// // //       setLoading(false);
// // //       setRefreshing(false);
// // //     }
// // //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [annee, mois, selectedSection, page, debouncedQ, forceRefresh]);

// // //   useEffect(() => { fetchData(); }, [fetchData]);

// // //   // ── Appliquer filtres mois / année ────────────────────────────────────────
// // //   const applyFilters = () => {
// // //     setAnnee(selectedAnnee);
// // //     setMois(selectedMois);
// // //     setFilterChanged(false);
// // //     setPage(1);
// // //     setForceRefresh((p) => p + 1);
// // //   };

// // //   // ── Stats globales ────────────────────────────────────────────────────────
// // //   const stats = useMemo(() => {
// // //     if (!data?.employes?.length) return null;
// // //     const emp = data.employes;
// // //     return {
// // //       totalHeures: Math.round(emp.reduce((s, e) => s + e.total_heures, 0)),
// // //       complets:    emp.filter((e) => {
// // //         const j = Object.values(e.par_semaine).reduce((a, s) => a + s.jours, 0);
// // //         return j > 0 && e.total_heures / j >= 9;
// // //       }).length,
// // //       partiel: emp.filter((e) => {
// // //         const j = Object.values(e.par_semaine).reduce((a, s) => a + s.jours, 0);
// // //         if (!j) return false;
// // //         const moy = e.total_heures / j;
// // //         return moy >= 7 && moy < 9;
// // //       }).length,
// // //       absents: emp.filter((e) => e.total_heures === 0).length,
// // //     };
// // //   }, [data]);

// // //   const semaines   = data?.semaines   || [];
// // //   const employes   = data?.employes   || [];
// // //   const pagination = data?.pagination || {};
// // //   const periode    = data?.periode    || {};

// // //   // ── Spinner premier chargement ────────────────────────────────────────────
// // //   if (loading) {
// // //     return (
// // //       <div className="flex flex-col items-center justify-center h-64">
// // //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
// // //         <p className="text-gray-600">Calcul des heures de travail...</p>
// // //       </div>
// // //     );
// // //   }

// // //   // ── Render ────────────────────────────────────────────────────────────────
// // //   return (
// // //     <div className="p-4 bg-gray-50 min-h-screen">

// // //       {/* Spinner discret au rechargement */}
// // //       {refreshing && (
// // //         <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
// // //           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
// // //           <span className="text-sm text-gray-600 font-medium">Mise à jour...</span>
// // //         </div>
// // //       )}

// // //       <PageHeader
// // //         pageTag="Heures de Travail"
// // //         title="Heures de Travail"
// // //         subtitle={`Période du ${periode.du ?? '…'} au ${periode.au ?? '…'}${selectedSection ? ` · ${selectedSection}` : ''}`}
// // //         kpis={[
// // //           {
// // //             label:    'Employés',
// // //             value:    pagination.total_employees ?? 0,
// // //             sub:      'actifs',
// // //             dotColor: '#3b82f6',
// // //           },
// // //           {
// // //             label:    'Total heures',
// // //             value:    stats ? `${stats.totalHeures}h` : '—',
// // //             sub:      `page courante`,
// // //             dotColor: '#f97316',
// // //           },
// // //           {
// // //             label:    'Moy ≥ 9h/j',
// // //             value:    stats?.complets ?? 0,
// // //             sub:      'employés',
// // //             dotColor: '#22c55e',
// // //           },
// // //           {
// // //             label:    'Absents',
// // //             value:    stats?.absents ?? 0,
// // //             sub:      '0 heure',
// // //             dotColor: '#ef4444',
// // //           },
// // //         ]}
// // //       />

// // //       {/* ── En-tête & filtres ── */}
// // //       <div className="bg-white border-2 border-gray-800 mb-4 p-5">
// // //         <div className="flex items-center justify-between mb-4">
// // //           {/* Titre */}
// // //           <div className="flex items-center gap-4">
// // //             <div className="bg-akj text-white px-5 py-2 font-bold text-lg">
// // //               AKANJO
// // //             </div>
// // //             <div className="flex items-center gap-2">
// // //               <Clock className="w-6 h-6 text-gray-700" />
// // //               <h1 className="text-2xl font-bold uppercase">Heures de Travail</h1>
// // //             </div>
// // //           </div>

// // //           {/* Sélecteurs mois / année */}
// // //           <div className="flex items-center gap-2">
// // //             <div className="flex flex-col">
// // //               <label className="text-xs text-gray-500 mb-1">Mois</label>
// // //               <select
// // //                 value={selectedMois}
// // //                 onChange={(e) => {
// // //                   setSelectedMois(+e.target.value);
// // //                   setFilterChanged(true);
// // //                 }}
// // //                 className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
// // //               >
// // //                 {MOIS_FR.map((m, i) => (
// // //                   <option key={i + 1} value={i + 1}>{m}</option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //             <div className="flex flex-col">
// // //               <label className="text-xs text-gray-500 mb-1">Année</label>
// // //               <select
// // //                 value={selectedAnnee}
// // //                 onChange={(e) => {
// // //                   setSelectedAnnee(+e.target.value);
// // //                   setFilterChanged(true);
// // //                 }}
// // //                 className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
// // //               >
// // //                 {[2022, 2023, 2024, 2025, 2026].map((y) => (
// // //                   <option key={y} value={y}>{y}</option>
// // //                 ))}
// // //               </select>
// // //             </div>
// // //             {filterChanged && (
// // //               <button
// // //                 onClick={applyFilters}
// // //                 className="mt-4 px-4 py-1 bg-akj text-white text-sm rounded hover:bg-gray-700"
// // //               >
// // //                 Appliquer
// // //               </button>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Barre de filtres */}
// // //         <div className="flex flex-wrap gap-2 items-center border-t-2 border-gray-800 pt-3">
// // //           <SearchBar value={searchInput} onChange={setSearchInput} />

// // //           <SectionSelect
// // //             sections={sections}
// // //             value={selectedSection}
// // //             onChange={(s) => { setSelectedSection(s); setPage(1); }}
// // //           />

// // //           <div className="flex items-center px-3 h-8 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
// // //             <span className="font-semibold text-gray-800">
// // //               {pagination.total_employees ?? 0}
// // //             </span>
// // //             <span className="ml-1">
// // //               employé{(pagination.total_employees ?? 0) !== 1 ? 's' : ''}
// // //             </span>
// // //           </div>

// // //           <div className="ml-auto">
// // //             <Legende />
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* ── Message vide ── */}
// // //       {employes.length === 0 && !loading && !refreshing && (
// // //         <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
// // //           <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
// // //           <p className="text-gray-500 font-semibold">
// // //             {selectedSection
// // //               ? `Aucun employé trouvé pour la section « ${selectedSection} »`
// // //               : 'Aucune donnée disponible pour cette période'}
// // //           </p>
// // //           {selectedSection && (
// // //             <button
// // //               onClick={() => { setSelectedSection(''); setPage(1); }}
// // //               className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm"
// // //             >
// // //               Voir toutes les sections
// // //             </button>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* ── Tableau ── */}
// // //       {employes.length > 0 && (
// // //         <div
// // //           ref={componentRef}
// // //           className="bg-white border-2 border-gray-800 overflow-x-auto print:overflow-visible"
// // //         >
// // //           <table className="w-full border-collapse text-xs print:text-[8pt]">
// // //             <thead>
// // //               <tr className="bg-gray-100">
// // //                 <th
// // //                   className="border-2 border-gray-800 p-2 text-left sticky left-0 bg-gray-100 z-10"
// // //                   style={{ minWidth: 220 }}
// // //                 >
// // //                   Badge / Nom / Section
// // //                 </th>
// // //                 {semaines.map((s) => (
// // //                   <th
// // //                     key={s}
// // //                     className="border border-gray-500 p-1 text-center font-bold"
// // //                     style={{ minWidth: 80 }}
// // //                   >
// // //                     Semaine {s}
// // //                   </th>
// // //                 ))}
// // //                 <th
// // //                   className="border-2 border-gray-800 p-1 text-center font-bold bg-gray-200"
// // //                   style={{ minWidth: 90 }}
// // //                 >
// // //                   Total mois
// // //                 </th>
// // //               </tr>
// // //             </thead>

// // //             <tbody>
// // //               {employes.map((emp) => {
// // //                 const totalJours = Object.values(emp.par_semaine)
// // //                   .reduce((a, s) => a + s.jours, 0);
// // //                 return (
// // //                   <tr
// // //                     key={emp.userid}
// // //                     className="border-b border-gray-300 hover:bg-gray-50"
// // //                   >
// // //                     {/* Identité */}
// // //                     <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
// // //                       <div className="flex items-baseline gap-2">
// // //                         <span className="font-bold shrink-0">
// // //                           {emp.badgenumber}
// // //                         </span>
// // //                         <span className="italic text-gray-700 text-xs">
// // //                           {emp.name}
// // //                         </span>
// // //                       </div>
// // //                       <div className="text-gray-400 text-xs mt-0.5">
// // //                         {emp.section}
// // //                       </div>
// // //                     </td>

// // //                     {/* Heures par semaine */}
// // //                     {semaines.map((s) => {
// // //                       const sw = emp.par_semaine[s] || { heures: 0, jours: 0 };
// // //                       return (
// // //                         <td
// // //                           key={s}
// // //                           className={`border border-gray-400 p-1 text-center ${getCellClass(sw.heures)}`}
// // //                           title={sw.jours > 0 ? `${sw.jours} jour(s)` : 'Absent'}
// // //                         >
// // //                           {sw.heures > 0 ? fmtH(sw.heures) : '—'}
// // //                         </td>
// // //                       );
// // //                     })}

// // //                     {/* Total mois */}
// // //                     <td
// // //                       className={`border-2 border-gray-800 p-1 text-center text-sm font-semibold
// // //                         ${getTotalClass(emp.total_heures, totalJours)}`}
// // //                     >
// // //                       {fmtH(emp.total_heures)}
// // //                     </td>
// // //                   </tr>
// // //                 );
// // //               })}
// // //             </tbody>

// // //             {/* Pied de tableau : totaux colonnes */}
// // //             {employes.length > 1 && (
// // //               <tfoot>
// // //                 <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
// // //                   <td className="border-2 border-gray-800 p-2 text-right text-sm sticky left-0 bg-gray-100">
// // //                     TOTAL ({employes.length} employés)
// // //                   </td>
// // //                   {semaines.map((s) => {
// // //                     const totH = employes.reduce(
// // //                       (acc, e) => acc + (e.par_semaine[s]?.heures ?? 0), 0,
// // //                     );
// // //                     const totJ = employes.reduce(
// // //                       (acc, e) => acc + (e.par_semaine[s]?.jours  ?? 0), 0,
// // //                     );
// // //                     return (
// // //                       <td
// // //                         key={s}
// // //                         className={`border border-gray-500 p-1 text-center
// // //                           ${getTotalClass(totH, totJ > 0 ? totJ / employes.length : 0)}`}
// // //                       >
// // //                         {fmtH(Math.round(totH * 100) / 100)}
// // //                       </td>
// // //                     );
// // //                   })}
// // //                   <td className="border-2 border-gray-800 p-1 text-center bg-gray-200 text-sm">
// // //                     {fmtH(
// // //                       Math.round(
// // //                         employes.reduce((a, e) => a + e.total_heures, 0) * 100,
// // //                       ) / 100,
// // //                     )}
// // //                   </td>
// // //                 </tr>
// // //               </tfoot>
// // //             )}
// // //           </table>
// // //         </div>
// // //       )}

// // //       {/* ── Pagination ── */}
// // //       {(pagination.total_pages ?? 0) > 1 && (
// // //         <div className="flex items-center justify-end gap-4 mt-4 print:hidden">
// // //           <button
// // //             onClick={() => setPage((p) => p - 1)}
// // //             disabled={!pagination.has_previous}
// // //             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
// // //           >
// // //             <ChevronLeft className="w-4 h-4" /> Précédent
// // //           </button>
// // //           <span className="text-sm text-gray-600">
// // //             Page {pagination.page} / {pagination.total_pages}
// // //           </span>
// // //           <button
// // //             onClick={() => setPage((p) => p + 1)}
// // //             disabled={!pagination.has_next}
// // //             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
// // //           >
// // //             Suivant <ChevronRight className="w-4 h-4" />
// // //           </button>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default HeuresTravailPage;





// // import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// // import {
// //   Clock,
// //   Search,
// //   X,
// //   ChevronDown,
// //   ChevronLeft,
// //   ChevronRight,
// //   TrendingUp,
// // } from 'lucide-react';
// // import presenceService from '../../services/presenceService';
// // import PageHeader from '../../components/headers/PageHeader';
// // import '/src/styles/custom.css';

// // const fmtH = (heures) => {
// //   if (!heures && heures !== 0) return '—';
// //   const h = Math.floor(heures);
// //   const m = Math.round((heures - h) * 60);
// //   return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
// // };

// // const getCellClass = (valeur) => {
// //   if (valeur === 0) return '';
// //   if (valeur >= 9) return 'bg-green-100 text-green-800';
// //   if (valeur >= 7) return 'bg-yellow-100 text-yellow-800';
// //   return 'bg-red-100 text-red-800';
// // };

// // const SearchBar = ({ value, onChange }) => (
// //   <div className="relative flex-1 max-w-sm">
// //     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
// //     <input
// //       value={value}
// //       onChange={(e) => onChange(e.target.value)}
// //       placeholder="Badge ou nom..."
// //       className="w-full pl-9 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm"
// //     />
// //     {value && (
// //       <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
// //         <X className="w-4 h-4" />
// //       </button>
// //     )}
// //   </div>
// // );

// // const SectionSelect = ({ sections, value, onChange }) => (
// //   <div className="relative">
// //     <select
// //       value={value}
// //       onChange={(e) => onChange(e.target.value)}
// //       className="pl-3 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px]"
// //     >
// //       <option value="">— Toutes les sections —</option>
// //       {sections.map((s) => (
// //         <option key={s.section_id} value={s.nom_section}>
// //           {s.nom_section} ({s.nb_employes})
// //         </option>
// //       ))}
// //     </select>
// //     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
// //   </div>
// // );

// // const Legende = () => (
// //   <div className="flex flex-wrap gap-3 text-xs print:hidden">
// //     <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded">≥9h HT</span>
// //     <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">7-9h HT</span>
// //     <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded">&lt;7h HT</span>
// //     <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">HS (≥1h)</span>
// //   </div>
// // );

// // const MOIS_FR = [
// //   'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
// //   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
// // ];

// // const HeuresTravailPage = () => {
// //   const today = new Date();
// //   const [annee, setAnnee] = useState(today.getFullYear());
// //   const [mois, setMois] = useState(today.getMonth() + 1);
// //   const [selectedAnnee, setSelectedAnnee] = useState(today.getFullYear());
// //   const [selectedMois, setSelectedMois] = useState(today.getMonth() + 1);
// //   const [filterChanged, setFilterChanged] = useState(false);
// //   const [sections, setSections] = useState([]);
// //   const [selectedSection, setSelectedSection] = useState('');
// //   const [searchInput, setSearchInput] = useState('');
// //   const [debouncedQ, setDebouncedQ] = useState('');
// //   const [data, setData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [forceRefresh, setForceRefresh] = useState(0);
// //   const componentRef = useRef();

// //   useEffect(() => {
// //     const t = setTimeout(() => {
// //       setDebouncedQ(searchInput.trim());
// //       setPage(1);
// //     }, 350);
// //     return () => clearTimeout(t);
// //   }, [searchInput]);

// //   useEffect(() => {
// //     presenceService.getSections().then((d) => setSections(d.sections || [])).catch(console.error);
// //   }, []);

// //   const fetchData = useCallback(async () => {
// //     if (data) setRefreshing(true);
// //     else setLoading(true);
// //     try {
// //       const res = await presenceService.getHeuresTravail(annee, mois, selectedSection, page, 50, debouncedQ);
// //       setData(res);
// //     } catch (err) {
// //       console.error('❌ Erreur heures travail:', err);
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   }, [annee, mois, selectedSection, page, debouncedQ, forceRefresh]);

// //   useEffect(() => { fetchData(); }, [fetchData]);

// //   const applyFilters = () => {
// //     setAnnee(selectedAnnee);
// //     setMois(selectedMois);
// //     setFilterChanged(false);
// //     setPage(1);
// //     setForceRefresh((p) => p + 1);
// //   };

// //   const stats = useMemo(() => {
// //     if (!data?.employes?.length) return null;
// //     const emp = data.employes;
// //     const totalHT = emp.reduce((s, e) => s + e.total_ht, 0);
// //     const totalHS = emp.reduce((s, e) => s + e.total_hs, 0);
// //     const complets = emp.filter((e) => {
// //       const moy = e.total_jours > 0 ? e.total_ht / e.total_jours : 0;
// //       return moy >= 9;
// //     }).length;
// //     const absents = emp.filter((e) => e.total_ht === 0).length;
// //     return { totalHT, totalHS, complets, absents };
// //   }, [data]);

// //   // Liste des dates depuis le premier employé
// //   const datesList = useMemo(() => {
// //     if (!data?.employes?.length) return [];
// //     return data.employes[0].details_jours || [];
// //   }, [data]);

// //   // Regroupement des dates par semaine (basé sur code_date[0])
// //   const weeksMap = useMemo(() => {
// //     const map = new Map();
// //     datesList.forEach((d, idx) => {
// //       const weekNum = d.code_date?.charAt(0) || '1';
// //       if (!map.has(weekNum)) {
// //         map.set(weekNum, { start: idx, end: idx, dates: [] });
// //       }
// //       const week = map.get(weekNum);
// //       week.end = idx;
// //       week.dates.push(d);
// //     });
// //     return map;
// //   }, [datesList]);

// //   const semaineNums = Array.from(weeksMap.keys()).sort((a, b) => parseInt(a) - parseInt(b));
// //   const pagination = data?.pagination || {};
// //   const periode = data?.periode || {};

// //   if (loading) {
// //     return (
// //       <div className="flex flex-col items-center justify-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
// //         <p className="text-gray-600">Calcul des heures de travail...</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 bg-gray-50 min-h-screen">
// //       {refreshing && (
// //         <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
// //           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
// //           <span className="text-sm text-gray-600 font-medium">Mise à jour...</span>
// //         </div>
// //       )}

// //       <PageHeader
// //         pageTag="Heures de Travail"
// //         title="Heures de Travail"
// //         subtitle={`Période du ${periode.du ?? '…'} au ${periode.au ?? '…'}${selectedSection ? ` · ${selectedSection}` : ''}`}
// //         kpis={[
// //           { label: 'Employés', value: pagination.total_employees ?? 0, sub: 'actifs', dotColor: '#3b82f6' },
// //           { label: 'Total HT', value: stats ? `${fmtH(stats.totalHT)}` : '—', sub: 'page courante', dotColor: '#f97316' },
// //           { label: 'Total HS', value: stats ? `${fmtH(stats.totalHS)}` : '—', sub: 'page courante', dotColor: '#eab308' },
// //           { label: 'Moy ≥ 9h/j', value: stats?.complets ?? 0, sub: 'employés', dotColor: '#22c55e' },
// //           { label: 'Absents (0h)', value: stats?.absents ?? 0, sub: 'employés', dotColor: '#ef4444' },
// //         ]}
// //       />

// //       <div className="bg-white border-2 border-gray-800 mb-4 p-5">
// //         <div className="flex items-center justify-between mb-4">
// //           <div className="flex items-center gap-4">
// //             <div className="bg-akj text-white px-5 py-2 font-bold text-lg">AKANJO</div>
// //             <div className="flex items-center gap-2">
// //               <Clock className="w-6 h-6 text-gray-700" />
// //               <h1 className="text-2xl font-bold uppercase">Heures de Travail</h1>
// //             </div>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="flex flex-col">
// //               <label className="text-xs text-gray-500 mb-1">Mois</label>
// //               <select value={selectedMois} onChange={(e) => { setSelectedMois(+e.target.value); setFilterChanged(true); }}
// //                 className="px-3 py-1 border border-gray-300 rounded text-sm">
// //                 {MOIS_FR.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
// //               </select>
// //             </div>
// //             <div className="flex flex-col">
// //               <label className="text-xs text-gray-500 mb-1">Année</label>
// //               <select value={selectedAnnee} onChange={(e) => { setSelectedAnnee(+e.target.value); setFilterChanged(true); }}
// //                 className="px-3 py-1 border border-gray-300 rounded text-sm">
// //                 {[2022,2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
// //               </select>
// //             </div>
// //             {filterChanged && (
// //               <button onClick={applyFilters} className="mt-4 px-4 py-1 bg-akj text-white text-sm rounded hover:bg-gray-700">
// //                 Appliquer
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         <div className="flex flex-wrap gap-2 items-center border-t-2 border-gray-800 pt-3">
// //           <SearchBar value={searchInput} onChange={setSearchInput} />
// //           <SectionSelect sections={sections} value={selectedSection} onChange={(s) => { setSelectedSection(s); setPage(1); }} />
// //           <div className="flex items-center px-3 h-8 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
// //             <span className="font-semibold text-gray-800">{pagination.total_employees ?? 0}</span>
// //             <span className="ml-1">employé{(pagination.total_employees ?? 0) !== 1 ? 's' : ''}</span>
// //           </div>
// //           <div className="ml-auto"><Legende /></div>
// //         </div>
// //       </div>

// //       {data?.employes?.length === 0 && !loading && !refreshing && (
// //         <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
// //           <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
// //           <p className="text-gray-500 font-semibold">
// //             {selectedSection ? `Aucun employé pour la section « ${selectedSection} »` : 'Aucune donnée disponible'}
// //           </p>
// //           {selectedSection && (
// //             <button onClick={() => { setSelectedSection(''); setPage(1); }} className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm">
// //               Voir toutes les sections
// //             </button>
// //           )}
// //         </div>
// //       )}

// //       {data?.employes?.length > 0 && (
// //         <div ref={componentRef} className="bg-white border-2 border-gray-800 overflow-x-auto print:overflow-visible">
// //           <table className="w-full border-collapse text-xs print:text-[8pt]">
// //             <thead>
// //               {/* Ligne 1 : code_date et numéro du jour */}
// //               <tr className="bg-gray-100">
// //                 <th className="border-2 border-gray-800 p-2 text-left sticky left-0 bg-gray-100 z-20" rowSpan="3" style={{ minWidth: 200 }}>
// //                   Badge / Nom / Section
// //                 </th>
// //                 {datesList.map((d, idx) => (
// //                   <th key={`day-${idx}`} className="border border-gray-400 p-1 text-center" style={{ minWidth: 55 }}>
// //                     <div className="font-bold">{d.code_date}</div>
// //                     <div className="text-xs text-gray-600">{new Date(d.date).getDate()}</div>
// //                   </th>
// //                 ))}
// //                 {semaineNums.map((s) => (
// //                   <th key={`week-${s}`} className="border border-gray-500 p-1 text-center font-bold bg-gray-200" colSpan="2" style={{ minWidth: 80 }}>
// //                     Semaine {s}
// //                   </th>
// //                 ))}
// //                 <th className="border-2 border-gray-800 p-1 text-center font-bold bg-gray-200" colSpan="2" style={{ minWidth: 90 }}>
// //                   Total mois
// //                 </th>
// //               </tr>
// //               {/* Ligne 2 : jour de semaine */}
// //               <tr className="bg-gray-100">
// //                 {datesList.map((d, idx) => (
// //                   <th key={`weekday-${idx}`} className="border border-gray-400 p-1 text-center text-xs">
// //                     {new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
// //                   </th>
// //                 ))}
// //                 {semaineNums.map((s) => (
// //                   <React.Fragment key={`week-sub-${s}`}>
// //                     <th className="border border-gray-400 p-1 text-center text-xs bg-gray-200">HT</th>
// //                     <th className="border border-gray-400 p-1 text-center text-xs bg-gray-200">HS</th>
// //                   </React.Fragment>
// //                 ))}
// //                 <th className="border-2 border-gray-800 p-1 text-center bg-gray-200">HT</th>
// //                 <th className="border-2 border-gray-800 p-1 text-center bg-gray-200">HS</th>
// //               </tr>
// //               {/* Ligne 3 : sous-titre vide pour les colonnes jours */}
// //               <tr className="bg-gray-100">
// //                 {datesList.map((_, idx) => (
// //                   <th key={`empty-${idx}`} className="border border-gray-400 p-1 text-center text-xs">
// //                     HT/HS
// //                   </th>
// //                 ))}
// //                 <th colSpan={semaineNums.length * 2} className="border-0"></th>
// //                 <th colSpan="2" className="border-0"></th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {data.employes.map((emp) => {
// //                 const jourMap = new Map();
// //                 emp.details_jours.forEach((j) => {
// //                   jourMap.set(j.date, { ht: j.ht, hs: j.hs });
// //                 });
// //                 return (
// //                   <tr key={emp.userid} className="border-b border-gray-300 hover:bg-gray-50">
// //                     <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
// //                       <div className="flex items-baseline gap-2">
// //                         <span className="font-bold shrink-0">{emp.badgenumber}</span>
// //                         <span className="italic text-gray-700 text-xs">{emp.name}</span>
// //                       </div>
// //                       <div className="text-gray-400 text-xs mt-0.5">{emp.section}</div>
// //                     </td>
// //                     {/* Cellules par jour : deux lignes (HT / HS) */}
// //                     {datesList.map((d, idx) => {
// //                       const jour = jourMap.get(d.date) || { ht: 0, hs: 0 };
// //                       return (
// //                         <td key={`jour-${idx}`} className="border border-gray-400 p-0 text-center align-middle">
// //                           <div className={`py-0.5 border-b border-gray-300 ${getCellClass(jour.ht)}`}>
// //                             {jour.ht > 0 ? fmtH(jour.ht) : '—'}
// //                           </div>
// //                           <div className={`py-0.5 ${jour.hs > 0 ? 'bg-blue-100 text-blue-800' : ''}`}>
// //                             {jour.hs > 0 ? fmtH(jour.hs) : ''}
// //                           </div>
// //                         </td>
// //                       );
// //                     })}
// //                     {/* Colonnes par semaine */}
// //                     {semaineNums.map((s) => {
// //                       const semaineData = emp.par_semaine[s] || { ht: 0, hs: 0 };
// //                       return (
// //                         <React.Fragment key={`sem-${s}`}>
// //                           <td className={`border border-gray-400 p-1 text-center ${getCellClass(semaineData.ht)}`}>
// //                             {semaineData.ht > 0 ? fmtH(semaineData.ht) : '—'}
// //                           </td>
// //                           <td className={`border border-gray-400 p-1 text-center ${semaineData.hs > 0 ? 'bg-blue-100 text-blue-800' : ''}`}>
// //                             {semaineData.hs > 0 ? fmtH(semaineData.hs) : '—'}
// //                           </td>
// //                         </React.Fragment>
// //                       );
// //                     })}
// //                     {/* Totaux mois */}
// //                     <td className={`border-2 border-gray-800 p-1 text-center text-sm font-semibold ${getCellClass(emp.total_ht)}`}>
// //                       {fmtH(emp.total_ht)}
// //                     </td>
// //                     <td className={`border-2 border-gray-800 p-1 text-center text-sm font-semibold ${emp.total_hs > 0 ? 'bg-blue-100 text-blue-800' : ''}`}>
// //                       {emp.total_hs > 0 ? fmtH(emp.total_hs) : '—'}
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>

// //             {data.employes.length > 1 && (
// //               <tfoot>
// //                 <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
// //                   <td className="border-2 border-gray-800 p-2 text-right text-sm sticky left-0 bg-gray-100">
// //                     TOTAL ({data.employes.length} employés)
// //                   </td>
// //                   {/* Totaux par jour */}
// //                   {datesList.map((d, idx) => {
// //                     const sumHT = data.employes.reduce((acc, e) => {
// //                       const jour = e.details_jours.find(j => j.date === d.date);
// //                       return acc + (jour?.ht || 0);
// //                     }, 0);
// //                     const sumHS = data.employes.reduce((acc, e) => {
// //                       const jour = e.details_jours.find(j => j.date === d.date);
// //                       return acc + (jour?.hs || 0);
// //                     }, 0);
// //                     return (
// //                       <td key={`total-jour-${idx}`} className="border border-gray-400 p-0 text-center">
// //                         <div className={`py-0.5 border-b border-gray-300 ${getCellClass(sumHT)}`}>
// //                           {sumHT > 0 ? fmtH(sumHT) : '—'}
// //                         </div>
// //                         <div className={`py-0.5 ${sumHS > 0 ? 'bg-blue-100 text-blue-800' : ''}`}>
// //                           {sumHS > 0 ? fmtH(sumHS) : ''}
// //                         </div>
// //                       </td>
// //                     );
// //                   })}
// //                   {/* Totaux par semaine */}
// //                   {semaineNums.map((s) => {
// //                     const totHT = data.employes.reduce((acc, e) => acc + (e.par_semaine[s]?.ht || 0), 0);
// //                     const totHS = data.employes.reduce((acc, e) => acc + (e.par_semaine[s]?.hs || 0), 0);
// //                     return (
// //                       <React.Fragment key={`total-sem-${s}`}>
// //                         <td className={`border border-gray-500 p-1 text-center ${getCellClass(totHT)}`}>
// //                           {fmtH(totHT)}
// //                         </td>
// //                         <td className={`border border-gray-500 p-1 text-center ${totHS > 0 ? 'bg-blue-100 text-blue-800' : ''}`}>
// //                           {fmtH(totHS)}
// //                         </td>
// //                       </React.Fragment>
// //                     );
// //                   })}
// //                   <td className="border-2 border-gray-800 p-1 text-center bg-gray-200 text-sm">
// //                     {fmtH(data.employes.reduce((a, e) => a + e.total_ht, 0))}
// //                   </td>
// //                   <td className="border-2 border-gray-800 p-1 text-center bg-gray-200 text-sm">
// //                     {fmtH(data.employes.reduce((a, e) => a + e.total_hs, 0))}
// //                   </td>
// //                 </tr>
// //               </tfoot>
// //             )}
// //           </table>
// //         </div>
// //       )}

// //       {(pagination.total_pages ?? 0) > 1 && (
// //         <div className="flex items-center justify-end gap-4 mt-4 print:hidden">
// //           <button onClick={() => setPage(p => p - 1)} disabled={!pagination.has_previous}
// //             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
// //             <ChevronLeft className="w-4 h-4" /> Précédent
// //           </button>
// //           <span className="text-sm text-gray-600">Page {pagination.page} / {pagination.total_pages}</span>
// //           <button onClick={() => setPage(p => p + 1)} disabled={!pagination.has_next}
// //             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
// //             Suivant <ChevronRight className="w-4 h-4" />
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default HeuresTravailPage;



// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import {
//   Clock, Search, X, ChevronDown, ChevronLeft, ChevronRight,
//   TrendingUp, Calendar, LayoutGrid,
// } from 'lucide-react';
// import presenceService from '../../services/presenceService';
// import PageHeader from '../../components/headers/PageHeader';
// import '/src/styles/custom.css';

// // ─── Utilitaires ──────────────────────────────────────────────────────────────

// const fmtH = (heures) => {
//   if (!heures && heures !== 0) return '—';
//   const h = Math.floor(Math.abs(heures));
//   const m = Math.round((Math.abs(heures) - h) * 60);
//   const sign = heures < 0 ? '-' : '';
//   return m > 0 ? `${sign}${h}h${String(m).padStart(2, '0')}` : `${sign}${h}h`;
// };

// const getCellClass = (valeur) => {
//   if (!valeur || valeur === 0) return 'text-gray-300';
//   if (valeur >= 9)  return 'bg-green-100 text-green-800';
//   if (valeur >= 7)  return 'bg-yellow-100 text-yellow-800';
//   return 'bg-red-100 text-red-800';
// };

// const getHSClass = (valeur) =>
//   valeur > 0 ? 'bg-blue-100 text-blue-800' : 'text-gray-300';

// const MOIS_FR = [
//   'Janvier','Février','Mars','Avril','Mai','Juin',
//   'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
// ];

// // ─── Barre de recherche ───────────────────────────────────────────────────────

// const SearchBar = ({ value, onChange }) => (
//   <div className="relative flex-1 max-w-sm">
//     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//     <input
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder="Badge ou nom..."
//       className="w-full pl-9 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm"
//     />
//     {value && (
//       <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
//         <X className="w-4 h-4" />
//       </button>
//     )}
//   </div>
// );

// // ─── Sélecteur section ────────────────────────────────────────────────────────

// const SectionSelect = ({ sections, value, onChange }) => (
//   <div className="relative">
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="pl-3 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px]"
//     >
//       <option value="">— Toutes les sections —</option>
//       {sections.map((s) => (
//         <option key={s.section_id} value={s.nom_section}>
//           {s.nom_section} ({s.nb_employes})
//         </option>
//       ))}
//     </select>
//     <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//   </div>
// );

// // ─── Légende ──────────────────────────────────────────────────────────────────

// const Legende = () => (
//   <div className="flex flex-wrap gap-2 text-xs">
//     <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-medium">≥ 9h HT</span>
//     <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-medium">7–9h HT</span>
//     <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-medium">&lt; 7h HT</span>
//     <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">HS (heures sup.)</span>
//   </div>
// );

// // ─── Toggle Vue ───────────────────────────────────────────────────────────────

// const ViewToggle = ({ value, onChange }) => (
//   <div className="flex items-center rounded-lg border-2 border-gray-300 overflow-hidden">
//     <button
//       onClick={() => onChange('semaine')}
//       className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
//         value === 'semaine'
//           ? 'bg-akj text-white'
//           : 'bg-white text-gray-600 hover:bg-gray-50'
//       }`}
//     >
//       <LayoutGrid className="w-3.5 h-3.5" />
//       Par semaine
//     </button>
//     <button
//       onClick={() => onChange('jour')}
//       className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors border-l-2 border-gray-300 ${
//         value === 'jour'
//           ? 'bg-akj text-white'
//           : 'bg-white text-gray-600 hover:bg-gray-50'
//       }`}
//     >
//       <Calendar className="w-3.5 h-3.5" />
//       Par jour
//     </button>
//   </div>
// );

// // ─── Tableau Vue SEMAINE (compact, sans scroll horizontal) ───────────────────

// const TableSemaine = ({ employes, semaineNums }) => {
//   const totaux = useMemo(() => {
//     const t = {};
//     semaineNums.forEach((s) => {
//       t[s] = {
//         ht: employes.reduce((a, e) => a + (e.par_semaine[s]?.ht || 0), 0),
//         hs: employes.reduce((a, e) => a + (e.par_semaine[s]?.hs || 0), 0),
//       };
//     });
//     t._total = {
//       ht: employes.reduce((a, e) => a + e.total_ht, 0),
//       hs: employes.reduce((a, e) => a + e.total_hs, 0),
//     };
//     return t;
//   }, [employes, semaineNums]);

//   return (
//     <div className="bg-white border-2 border-gray-800">
//       <table className="w-full border-collapse text-sm">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border-2 border-gray-800 p-3 text-left sticky left-0 bg-gray-100 z-10" style={{ minWidth: 220 }}>
//               Badge / Nom / Section
//             </th>
//             {semaineNums.map((s) => (
//               <th key={s} colSpan={2} className="border border-gray-600 p-2 text-center font-bold bg-gray-200">
//                 Semaine {s}
//               </th>
//             ))}
//             <th colSpan={2} className="border-2 border-gray-800 p-2 text-center font-bold bg-gray-300">
//               Total mois
//             </th>
//           </tr>
//           <tr className="bg-gray-100">
//             <th className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10" />
//             {semaineNums.map((s) => (
//               <React.Fragment key={`sub-${s}`}>
//                 <th className="border border-gray-400 p-2 text-center text-xs bg-gray-200 font-semibold">HT</th>
//                 <th className="border border-gray-400 p-2 text-center text-xs bg-gray-200 font-semibold">HS</th>
//               </React.Fragment>
//             ))}
//             <th className="border border-gray-600 p-2 text-center text-xs bg-gray-300 font-bold">HT</th>
//             <th className="border-2 border-gray-800 p-2 text-center text-xs bg-gray-300 font-bold">HS</th>
//           </tr>
//         </thead>
//         <tbody>
//           {employes.map((emp) => (
//             <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//               <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
//                 <div className="flex items-baseline gap-2">
//                   <span className="font-bold text-sm shrink-0">{emp.badgenumber}</span>
//                   <span className="italic text-sm print:text-[7pt] print:leading-tight print:break-words print:overflow-hidden print:line-clamp-2">{emp.name}</span>
//                 </div>
//                 <div className="text-gray-400 text-xs mt-0.5">{emp.section}</div>
//               </td>
//               {semaineNums.map((s) => {
//                 const d = emp.par_semaine[s] || { ht: 0, hs: 0 };
//                 return (
//                   <React.Fragment key={`sem-${s}`}>
//                     <td className={`border border-gray-400 p-2 text-center font-semibold ${getCellClass(d.ht)}`}>
//                       {d.ht > 0 ? fmtH(d.ht) : '—'}
//                     </td>
//                     <td className={`border border-gray-400 p-2 text-center font-medium ${getHSClass(d.hs)}`}>
//                       {d.hs > 0 ? fmtH(d.hs) : '—'}
//                     </td>
//                   </React.Fragment>
//                 );
//               })}
//               <td className={`border border-gray-600 p-2 text-center font-bold text-sm ${getCellClass(emp.total_ht)}`}>
//                 {fmtH(emp.total_ht)}
//               </td>
//               <td className={`border-2 border-gray-800 p-2 text-center font-bold text-sm ${getHSClass(emp.total_hs)}`}>
//                 {emp.total_hs > 0 ? fmtH(emp.total_hs) : '—'}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//         {employes.length > 1 && (
//           <tfoot>
//             <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
//               <td className="border-2 border-gray-800 p-2 text-right text-sm sticky left-0 bg-gray-100 z-10">
//                 TOTAL ({employes.length} employés)
//               </td>
//               {semaineNums.map((s) => (
//                 <React.Fragment key={`total-${s}`}>
//                   <td className={`border border-gray-500 p-2 text-center ${getCellClass(totaux[s].ht)}`}>
//                     {fmtH(totaux[s].ht)}
//                   </td>
//                   <td className={`border border-gray-500 p-2 text-center ${getHSClass(totaux[s].hs)}`}>
//                     {totaux[s].hs > 0 ? fmtH(totaux[s].hs) : '—'}
//                   </td>
//                 </React.Fragment>
//               ))}
//               <td className="border border-gray-600 p-2 text-center bg-gray-200 text-sm font-bold">
//                 {fmtH(totaux._total.ht)}
//               </td>
//               <td className={`border-2 border-gray-800 p-2 text-center bg-gray-200 text-sm font-bold ${getHSClass(totaux._total.hs)}`}>
//                 {totaux._total.hs > 0 ? fmtH(totaux._total.hs) : '—'}
//               </td>
//             </tr>
//           </tfoot>
//         )}
//       </table>
//     </div>
//   );
// };


// const TableJour = ({ employes, datesList, semaineNums }) => {
//   const jourMap = useCallback(
//     (emp) => new Map(emp.details_jours.map((j) => [j.date, j])),
//     [],
//   );

//   const totauxJour = useMemo(() => {
//     const map = new Map();
//     datesList.forEach((d) => {
//       const sumHT = employes.reduce((acc, e) => {
//         const j = e.details_jours.find((j) => j.date === d.date);
//         return acc + (j?.ht || 0);
//       }, 0);
//       const sumHS = employes.reduce((acc, e) => {
//         const j = e.details_jours.find((j) => j.date === d.date);
//         return acc + (j?.hs || 0);
//       }, 0);
//       map.set(d.date, { ht: sumHT, hs: sumHS });
//     });
//     return map;
//   }, [employes, datesList]);

//   return (
//     <div className="bg-white border-2 border-gray-800 overflow-x-auto">
//       <table className="w-full border-collapse text-xs" style={{ minWidth: 'max-content', width: '100%' }}>
//         <thead className="sticky top-0 z-20">
//           {/* Ligne 1 : Semaines */}
//           <tr className="bg-gray-100">
//             <th className="border-2 border-gray-800 p-2 text-left sticky left-0 bg-gray-100 z-30" rowSpan={3} style={{ minWidth: 210 }}>
//               Badge / Nom / Section
//             </th>
//             {semaineNums.map((s) => {
//               const count = datesList.filter((d) => d.code_date?.charAt(0) === s).length;
//               return (
//                 <th key={s} colSpan={count} className="border border-gray-500 p-1 text-center font-bold bg-gray-200">
//                   Semaine {s}
//                 </th>
//               );
//             })}
//             {/* ── Colonnes S1/S2/S3/S4 supprimées ── */}
//             <th colSpan={2} className="border-2 border-gray-800 p-1 text-center font-bold bg-gray-400">
//               Total
//             </th>
//           </tr>

//           {/* Ligne 2 : Codes date */}
//           <tr className="bg-gray-100">
//             {datesList.map((d, idx) => (
//               <th key={`code-${idx}`} className="border border-gray-400 p-1 text-center" style={{ minWidth: 52 }}>
//                 <div className="font-bold text-xs">{d.code_affichage || d.code_date}</div>
//                 <div className="text-gray-500 font-normal">{new Date(d.date).getDate()}</div>
//               </th>
//             ))}
//             {/* ── Sous-colonnes HT/HS par semaine supprimées ── */}
//             <th className="border border-gray-600 p-1 text-center text-xs bg-gray-300 font-bold">HT</th>
//             <th className="border-2 border-gray-800 p-1 text-center text-xs bg-gray-300 font-bold">HS</th>
//           </tr>

//           {/* Ligne 3 : Jour de semaine */}
//           <tr className="bg-gray-100">
//             {datesList.map((d, idx) => (
//               <th key={`wd-${idx}`} className="border border-gray-400 p-1 text-center text-xs text-gray-500 font-normal">
//                 {new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
//               </th>
//             ))}
//             {/* colSpan ajusté : plus de colonnes semaine, juste les 2 Total */}
//             <th colSpan={2} className="border-0" />
//           </tr>
//         </thead>

//         <tbody>
//           {employes.map((emp) => {
//             const jMap = jourMap(emp);
//             return (
//               <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//                 <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
//                   <div className="flex items-baseline gap-2">
//                     <span className="font-bold shrink-0">{emp.badgenumber}</span>
//                     <span className="italic text-sm print:text-[7pt] print:leading-tight print:break-words print:overflow-hidden print:line-clamp-2">{emp.name}</span>
//                   </div>
//                   <div className="text-gray-400 text-xs mt-0.5">{emp.section}</div>
//                 </td>
//                 {datesList.map((d, idx) => {
//                   const jour = jMap.get(d.date) || { ht: 0, hs: 0 };
//                   return (
//                     <td key={idx} className="border border-gray-300 p-0 text-center align-middle" style={{ minWidth: 52 }}>
//                       <div className={`py-0.5 border-b border-gray-200 text-xs font-medium ${getCellClass(jour.ht)}`}>
//                         {jour.ht > 0 ? fmtH(jour.ht) : '—'}
//                       </div>
//                       <div className={`py-0.5 text-xs ${getHSClass(jour.hs)}`}>
//                         {jour.hs > 0 ? fmtH(jour.hs) : ''}
//                       </div>
//                     </td>
//                   );
//                 })}
//                 {/* ── Cellules par_semaine supprimées ── */}
//                 <td className={`border border-gray-600 p-1 text-center text-xs font-bold ${getCellClass(emp.total_ht)}`}>
//                   {fmtH(emp.total_ht)}
//                 </td>
//                 <td className={`border-2 border-gray-800 p-1 text-center text-xs font-bold ${getHSClass(emp.total_hs)}`}>
//                   {emp.total_hs > 0 ? fmtH(emp.total_hs) : '—'}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>

//         {employes.length > 1 && (
//           <tfoot>
//             <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
//               <td className="border-2 border-gray-800 p-2 text-right text-xs sticky left-0 bg-gray-100 z-10">
//                 TOTAL ({employes.length})
//               </td>
//               {datesList.map((d, idx) => {
//                 const t = totauxJour.get(d.date) || { ht: 0, hs: 0 };
//                 return (
//                   <td key={idx} className="border border-gray-400 p-0 text-center">
//                     <div className={`py-0.5 border-b border-gray-200 text-xs ${getCellClass(t.ht)}`}>
//                       {t.ht > 0 ? fmtH(t.ht) : '—'}
//                     </div>
//                     <div className={`py-0.5 text-xs ${getHSClass(t.hs)}`}>
//                       {t.hs > 0 ? fmtH(t.hs) : ''}
//                     </div>
//                   </td>
//                 );
//               })}
//               {/* ── Totaux par semaine supprimés ── */}
//               <td className="border border-gray-600 p-1 text-center text-xs bg-gray-200">
//                 {fmtH(employes.reduce((a, e) => a + e.total_ht, 0))}
//               </td>
//               <td className="border-2 border-gray-800 p-1 text-center text-xs bg-gray-200">
//                 {fmtH(employes.reduce((a, e) => a + e.total_hs, 0))}
//               </td>
//             </tr>
//           </tfoot>
//         )}
//       </table>
//     </div>
//   );
// };

// // ─── Page principale ──────────────────────────────────────────────────────────

// const HeuresTravailPage = () => {
//   const today = new Date();
//   const [annee, setAnnee]                 = useState(today.getFullYear());
//   const [mois, setMois]                   = useState(today.getMonth() + 1);
//   const [selectedAnnee, setSelectedAnnee] = useState(today.getFullYear());
//   const [selectedMois, setSelectedMois]   = useState(today.getMonth() + 1);
//   const [filterChanged, setFilterChanged] = useState(false);
//   const [sections, setSections]           = useState([]);
//   const [selectedSection, setSelectedSection] = useState('');
//   const [searchInput, setSearchInput]     = useState('');
//   const [debouncedQ, setDebouncedQ]       = useState('');
//   const [data, setData]                   = useState(null);
//   const [loading, setLoading]             = useState(true);
//   const [refreshing, setRefreshing]       = useState(false);
//   const [page, setPage]                   = useState(1);
//   const [forceRefresh, setForceRefresh]   = useState(0);
//   const [viewMode, setViewMode]           = useState('semaine'); // 'semaine' | 'jour'
//   const componentRef = useRef();

//   // Debounce recherche
//   useEffect(() => {
//     const t = setTimeout(() => { setDebouncedQ(searchInput.trim()); setPage(1); }, 350);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   // Chargement sections
//   useEffect(() => {
//     presenceService.getSections().then((d) => setSections(d.sections || [])).catch(console.error);
//   }, []);

//   // Chargement données
//   const fetchData = useCallback(async () => {
//     if (data) setRefreshing(true); else setLoading(true);
//     try {
//       const res = await presenceService.getHeuresTravail(annee, mois, selectedSection, page, 50, debouncedQ);
//       setData(res);
//     } catch (err) {
//       console.error('❌ Erreur heures travail:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [annee, mois, selectedSection, page, debouncedQ, forceRefresh]); // eslint-disable-line

//   useEffect(() => { fetchData(); }, [fetchData]);

//   const applyFilters = () => {
//     setAnnee(selectedAnnee);
//     setMois(selectedMois);
//     setFilterChanged(false);
//     setPage(1);
//     setForceRefresh((p) => p + 1);
//   };

//   // Statistiques récapitulatives
//   const stats = useMemo(() => {
//     if (!data?.employes?.length) return null;
//     const emp = data.employes;
//     return {
//       totalHT:   emp.reduce((s, e) => s + e.total_ht, 0),
//       totalHS:   emp.reduce((s, e) => s + e.total_hs, 0),
//       complets:  emp.filter((e) => e.total_jours > 0 && e.total_ht / e.total_jours >= 9).length,
//       absents:   emp.filter((e) => e.total_ht === 0).length,
//     };
//   }, [data]);

//   const datesList   = useMemo(() => data?.employes?.[0]?.details_jours || [], [data]);
//   const semaineNums = useMemo(() => {
//     const set = new Set();
//     datesList.forEach((d) => { if (d.code_date) set.add(d.code_date.charAt(0)); });
//     return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b));
//   }, [datesList]);

//   const pagination = data?.pagination || {};
//   const periode    = data?.periode    || {};

//   // ── Rendu ──────────────────────────────────────────────────────────────────

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
//         <p className="text-gray-600">Calcul des heures de travail...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">
//       {/* Indicateur de rechargement */}
//       {refreshing && (
//         <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
//           <span className="text-sm text-gray-600 font-medium">Mise à jour...</span>
//         </div>
//       )}

//       <PageHeader
//         pageTag="Heures de Travail"
//         title="Heures de Travail"
//         subtitle={`Période du ${periode.du ?? '…'} au ${periode.au ?? '…'}${selectedSection ? ` · ${selectedSection}` : ''}`}
//         kpis={[
//           { label: 'Employés',   value: pagination.total_employees ?? 0, sub: 'actifs',          dotColor: '#3b82f6' },
//           { label: 'Total HT',   value: stats ? fmtH(stats.totalHT) : '—',  sub: 'page courante', dotColor: '#f97316' },
//           { label: 'Total HS',   value: stats ? fmtH(stats.totalHS) : '—',  sub: 'page courante', dotColor: '#eab308' },
//           { label: 'Moy ≥ 9h/j', value: stats?.complets ?? 0, sub: 'employés',                   dotColor: '#22c55e' },
//           { label: 'Absents',    value: stats?.absents  ?? 0, sub: '0h travaillée',               dotColor: '#ef4444' },
//         ]}
//       />

//       {/* ── En-tête & filtres ── */}
//       <div className="bg-white border-2 border-gray-800 mb-4 p-5">
//         <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
//           <div className="flex items-center gap-4">
//             <div className="bg-akj text-white px-5 py-2 font-bold text-lg">AKANJO</div>
//             <div className="flex items-center gap-2">
//               <Clock className="w-6 h-6 text-gray-700" />
//               <h1 className="text-2xl font-bold uppercase">Heures de Travail</h1>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="flex flex-col">
//               <label className="text-xs text-gray-500 mb-1">Mois</label>
//               <select value={selectedMois}
//                 onChange={(e) => { setSelectedMois(+e.target.value); setFilterChanged(true); }}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm">
//                 {MOIS_FR.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
//               </select>
//             </div>
//             <div className="flex flex-col">
//               <label className="text-xs text-gray-500 mb-1">Année</label>
//               <select value={selectedAnnee}
//                 onChange={(e) => { setSelectedAnnee(+e.target.value); setFilterChanged(true); }}
//                 className="px-3 py-1 border border-gray-300 rounded text-sm">
//                 {[2022, 2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
//               </select>
//             </div>
//             {filterChanged && (
//               <button onClick={applyFilters}
//                 className="mt-4 px-4 py-1 bg-akj text-white text-sm rounded hover:bg-gray-700">
//                 Appliquer
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Barre d'outils */}
//         <div className="flex flex-wrap gap-2 items-center border-t-2 border-gray-800 pt-3">
//           <SearchBar value={searchInput} onChange={setSearchInput} />
//           <SectionSelect sections={sections} value={selectedSection}
//             onChange={(s) => { setSelectedSection(s); setPage(1); }} />

//           <div className="flex items-center px-3 h-8 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
//             <span className="font-semibold text-gray-800">{pagination.total_employees ?? 0}</span>
//             <span className="ml-1">employé{(pagination.total_employees ?? 0) !== 1 ? 's' : ''}</span>
//           </div>

//           {/* Toggle vue */}
//           <ViewToggle value={viewMode} onChange={setViewMode} />

//           <div className="ml-auto">
//             <Legende />
//           </div>
//         </div>
//       </div>

//       {/* ── État vide ── */}
//       {data?.employes?.length === 0 && !loading && !refreshing && (
//         <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
//           <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500 font-semibold">
//             {selectedSection
//               ? `Aucun employé pour la section « ${selectedSection} »`
//               : 'Aucune donnée disponible pour cette période'}
//           </p>
//           {selectedSection && (
//             <button
//               onClick={() => { setSelectedSection(''); setPage(1); }}
//               className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm">
//               Voir toutes les sections
//             </button>
//           )}
//         </div>
//       )}

//       {/* ── Tableau ── */}
//       {data?.employes?.length > 0 && (
//         <div ref={componentRef}>
//           {viewMode === 'semaine' ? (
//             <TableSemaine employes={data.employes} semaineNums={semaineNums} />
//           ) : (
//             <TableJour employes={data.employes} datesList={datesList} semaineNums={semaineNums} />
//           )}
//         </div>
//       )}

//       {/* ── Pagination ── */}
//       {(pagination.total_pages ?? 0) > 1 && (
//         <div className="flex items-center justify-end gap-4 mt-4 print:hidden">
//           <button onClick={() => setPage((p) => p - 1)} disabled={!pagination.has_previous}
//             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
//             <ChevronLeft className="w-4 h-4" /> Précédent
//           </button>
//           <span className="text-sm text-gray-600">Page {pagination.page} / {pagination.total_pages}</span>
//           <button onClick={() => setPage((p) => p + 1)} disabled={!pagination.has_next}
//             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
//             Suivant <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HeuresTravailPage;





import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Clock, Search, X, ChevronDown, ChevronLeft, ChevronRight,
  TrendingUp, Calendar, LayoutGrid,
} from 'lucide-react';
import presenceService from '../../services/presenceService';
import PageHeader from '../../components/headers/PageHeader';
import '/src/styles/custom.css';

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const fmtH = (heures) => {
  if (!heures && heures !== 0) return '—';
  const h = Math.floor(Math.abs(heures));
  const m = Math.round((Math.abs(heures) - h) * 60);
  const sign = heures < 0 ? '-' : '';
  return m > 0 ? `${sign}${h}h${String(m).padStart(2, '0')}` : `${sign}${h}h`;
};

const getCellClass = (valeur) => {
  if (!valeur || valeur === 0) return 'text-gray-300';
  if (valeur >= 9)  return 'bg-green-100 text-green-800';
  if (valeur >= 7)  return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const getHSClass = (valeur) =>
  valeur > 0 ? 'bg-blue-100 text-blue-800' : 'text-gray-300';

const MOIS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
];

// ─── Cellule identité employé (réutilisée dans les deux tableaux) ─────────────

/**
 * Affichage compact : badge en gras, nom tronqué, section en gris.
 * maxNameWidth : largeur max CSS pour le tronquage du nom.
 */
const EmpCell = ({ emp, maxNameWidth = 110 }) => (
  <>
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-xs shrink-0">{emp.badgenumber}</span>
      <span
        className="italic text-xs text-gray-700 truncate"
        style={{ maxWidth: maxNameWidth }}
        title={emp.name}
      >
        {emp.name}
      </span>
    </div>
    <div className="text-gray-400 text-xs mt-0.5 truncate" style={{ maxWidth: maxNameWidth + 36 }} title={emp.section}>
      {emp.section}
    </div>
  </>
);

// ─── Barre de recherche ───────────────────────────────────────────────────────

const SearchBar = ({ value, onChange }) => (
  <div className="relative flex-1 max-w-sm">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Badge ou nom..."
      className="w-full pl-9 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm"
    />
    {value && (
      <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

// ─── Sélecteur section ────────────────────────────────────────────────────────

const SectionSelect = ({ sections, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="pl-3 pr-8 py-1.5 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px]"
    >
      <option value="">— Toutes les sections —</option>
      {sections.map((s) => (
        <option key={s.section_id} value={s.nom_section}>
          {s.nom_section} ({s.nb_employes})
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
);

// ─── Légende ──────────────────────────────────────────────────────────────────

const Legende = () => (
  <div className="flex flex-wrap gap-2 text-xs">
    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-medium">≥ 9h HT</span>
    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-medium">7–9h HT</span>
    <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-medium">&lt; 7h HT</span>
    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">HS (heures sup.)</span>
  </div>
);

// ─── Toggle Vue ───────────────────────────────────────────────────────────────

const ViewToggle = ({ value, onChange }) => (
  <div className="flex items-center rounded-lg border-2 border-gray-300 overflow-hidden">
    <button
      onClick={() => onChange('semaine')}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${
        value === 'semaine'
          ? 'bg-akj text-white'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      <LayoutGrid className="w-3.5 h-3.5" />
      Par semaine
    </button>
    <button
      onClick={() => onChange('jour')}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors border-l-2 border-gray-300 ${
        value === 'jour'
          ? 'bg-akj text-white'
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      <Calendar className="w-3.5 h-3.5" />
      Par jour
    </button>
  </div>
);

// ─── Tableau Vue SEMAINE ──────────────────────────────────────────────────────

const TableSemaine = ({ employes, semaineNums }) => {
  const totaux = useMemo(() => {
    const t = {};
    semaineNums.forEach((s) => {
      t[s] = {
        ht: employes.reduce((a, e) => a + (e.par_semaine[s]?.ht || 0), 0),
        hs: employes.reduce((a, e) => a + (e.par_semaine[s]?.hs || 0), 0),
      };
    });
    t._total = {
      ht: employes.reduce((a, e) => a + e.total_ht, 0),
      hs: employes.reduce((a, e) => a + e.total_hs, 0),
    };
    return t;
  }, [employes, semaineNums]);

  return (
    <div className="bg-white border-2 border-gray-800">
      <table className="w-full border-collapse text-sm" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          {/* Colonne identité réduite */}
          <col style={{ width: 170 }} />
          {semaineNums.flatMap((s) => [
            <col key={`ht-${s}`} />,
            <col key={`hs-${s}`} />,
          ])}
          <col />
          <col />
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border-2 border-gray-800 p-2 text-left sticky left-0 bg-gray-100 z-10">
              Badge / Nom / Section
            </th>
            {semaineNums.map((s) => (
              <th key={s} colSpan={2} className="border border-gray-600 p-2 text-center font-bold bg-gray-200">
                S{s}
              </th>
            ))}
            <th colSpan={2} className="border-2 border-gray-800 p-2 text-center font-bold bg-gray-300">
              Total mois
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10" />
            {semaineNums.map((s) => (
              <React.Fragment key={`sub-${s}`}>
                <th className="border border-gray-400 p-2 text-center text-xs bg-gray-200 font-semibold">HT</th>
                <th className="border border-gray-400 p-2 text-center text-xs bg-gray-200 font-semibold">HS</th>
              </React.Fragment>
            ))}
            <th className="border border-gray-600 p-2 text-center text-xs bg-gray-300 font-bold">HT</th>
            <th className="border-2 border-gray-800 p-2 text-center text-xs bg-gray-300 font-bold">HS</th>
          </tr>
        </thead>
        <tbody>
          {employes.map((emp) => (
            <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
                <EmpCell emp={emp} maxNameWidth={100} />
              </td>
              {semaineNums.map((s) => {
                const d = emp.par_semaine[s] || { ht: 0, hs: 0 };
                return (
                  <React.Fragment key={`sem-${s}`}>
                    <td className={`border border-gray-400 p-2 text-center font-semibold ${getCellClass(d.ht)}`}>
                      {d.ht > 0 ? fmtH(d.ht) : '—'}
                    </td>
                    <td className={`border border-gray-400 p-2 text-center font-medium ${getHSClass(d.hs)}`}>
                      {d.hs > 0 ? fmtH(d.hs) : '—'}
                    </td>
                  </React.Fragment>
                );
              })}
              <td className={`border border-gray-600 p-2 text-center font-bold text-sm ${getCellClass(emp.total_ht)}`}>
                {fmtH(emp.total_ht)}
              </td>
              <td className={`border-2 border-gray-800 p-2 text-center font-bold text-sm ${getHSClass(emp.total_hs)}`}>
                {emp.total_hs > 0 ? fmtH(emp.total_hs) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
        {employes.length > 1 && (
          <tfoot>
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
              <td className="border-2 border-gray-800 p-2 text-right text-sm sticky left-0 bg-gray-100 z-10">
                TOTAL ({employes.length} employés)
              </td>
              {semaineNums.map((s) => (
                <React.Fragment key={`total-${s}`}>
                  <td className={`border border-gray-500 p-2 text-center ${getCellClass(totaux[s].ht)}`}>
                    {fmtH(totaux[s].ht)}
                  </td>
                  <td className={`border border-gray-500 p-2 text-center ${getHSClass(totaux[s].hs)}`}>
                    {totaux[s].hs > 0 ? fmtH(totaux[s].hs) : '—'}
                  </td>
                </React.Fragment>
              ))}
              <td className="border border-gray-600 p-2 text-center bg-gray-200 text-sm font-bold">
                {fmtH(totaux._total.ht)}
              </td>
              <td className={`border-2 border-gray-800 p-2 text-center bg-gray-200 text-sm font-bold ${getHSClass(totaux._total.hs)}`}>
                {totaux._total.hs > 0 ? fmtH(totaux._total.hs) : '—'}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

// ─── Tableau Vue JOUR ─────────────────────────────────────────────────────────

const TableJour = ({ employes, datesList, semaineNums }) => {
  const jourMap = useCallback(
    (emp) => new Map(emp.details_jours.map((j) => [j.date, j])),
    [],
  );

  const totauxJour = useMemo(() => {
    const map = new Map();
    datesList.forEach((d) => {
      const sumHT = employes.reduce((acc, e) => {
        const j = e.details_jours.find((j) => j.date === d.date);
        return acc + (j?.ht || 0);
      }, 0);
      const sumHS = employes.reduce((acc, e) => {
        const j = e.details_jours.find((j) => j.date === d.date);
        return acc + (j?.hs || 0);
      }, 0);
      map.set(d.date, { ht: sumHT, hs: sumHS });
    });
    return map;
  }, [employes, datesList]);

  return (
    /*
     * Pas de overflow-x-auto : le tableau doit tenir dans la largeur disponible.
     * table-layout: fixed + largeur 100% → les colonnes se partagent l'espace.
     */
    <div className="bg-white border-2 border-gray-800 w-full">
      <table
        className="w-full border-collapse text-xs"
        style={{ tableLayout: 'fixed' }}
      >
        <colgroup>
          {/* Colonne identité : fixe à 145 px */}
          <col style={{ width: 145 }} />
          {/* Colonnes jours : taille flexible égale */}
          {datesList.map((_, i) => <col key={i} />)}
          {/* Colonnes Total HT / HS : fixe ~46 px */}
          <col style={{ width: 46 }} />
          <col style={{ width: 46 }} />
        </colgroup>

        <thead className="sticky top-0 z-20">
          {/* Ligne 1 : Semaines */}
          <tr className="bg-gray-100">
            <th
              className="border-2 border-gray-800 p-1.5 text-left sticky left-0 bg-gray-100 z-30 text-xs"
              rowSpan={5}
            >
              Badge / Nom
            </th>
            {semaineNums.map((s) => {
              const count = datesList.filter((d) => d.code_date?.charAt(0) === s).length;
              return (
                <th key={s} colSpan={count} className="border border-gray-500 p-1 text-center font-bold bg-gray-200 text-xs">
                  Semaine {s}
                </th>
              );
            })}
            <th colSpan={2} rowSpan={4} className="border-2 border-gray-800 p-1 text-center font-bold bg-gray-400 text-xs align-middle">
              Total
            </th>
          </tr>

          {/* Ligne 2 : Codes date */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`code-${idx}`} className="border border-gray-400 p-0.5 text-center text-xs font-bold leading-tight overflow-hidden">
                {d.code_affichage || d.code_date}
              </th>
            ))}
          </tr>

          {/* Ligne 3 : Jour de semaine abrégé (3 lettres + point) */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`wd-${idx}`} className="border border-gray-400 p-0.5 text-center text-xs text-gray-600 font-normal leading-tight">
                {new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
              </th>
            ))}
          </tr>

          {/* Ligne 4 : Numéro du jour */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`day-${idx}`} className="border border-gray-400 p-0.5 text-center text-xs font-normal leading-tight">
                {new Date(d.date).getDate()}
              </th>
            ))}
          </tr>

          {/* Ligne 5 : Mois abrégé + colonnes Total HT/HS */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`mo-${idx}`} className="border border-gray-400 p-0.5 text-center text-xs text-gray-600 font-normal leading-tight">
                {new Date(d.date).toLocaleDateString('fr-FR', { month: 'short' })
                  .replace(/^./, (c) => c.toUpperCase())
                  .replace(/\.$/, '')}
              </th>
            ))}
            <th className="border border-gray-600 p-1 text-center text-xs bg-gray-300 font-bold">HT</th>
            <th className="border-2 border-gray-800 p-1 text-center text-xs bg-gray-300 font-bold">HS</th>
          </tr>
        </thead>

        <tbody>
          {employes.map((emp) => {
            const jMap = jourMap(emp);
            return (
              <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="border-2 border-gray-800 p-1.5 sticky left-0 bg-white z-10 overflow-hidden">
                  <EmpCell emp={emp} maxNameWidth={85} />
                </td>
                {datesList.map((d, idx) => {
                  const jour = jMap.get(d.date) || { ht: 0, hs: 0 };
                  return (
                    <td key={idx} className="border border-gray-300 p-0 text-center align-middle">
                      <div className={`py-0.5 border-b border-gray-200 text-xs font-medium leading-tight ${getCellClass(jour.ht)}`}>
                        {jour.ht > 0 ? fmtH(jour.ht) : '—'}
                      </div>
                      <div className={`py-0.5 text-xs leading-tight ${getHSClass(jour.hs)}`}>
                        {jour.hs > 0 ? fmtH(jour.hs) : ''}
                      </div>
                    </td>
                  );
                })}
                <td className={`border border-gray-600 p-1 text-center text-xs font-bold ${getCellClass(emp.total_ht)}`}>
                  {fmtH(emp.total_ht)}
                </td>
                <td className={`border-2 border-gray-800 p-1 text-center text-xs font-bold ${getHSClass(emp.total_hs)}`}>
                  {emp.total_hs > 0 ? fmtH(emp.total_hs) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>

        {employes.length > 1 && (
          <tfoot>
            <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
              <td className="border-2 border-gray-800 p-1.5 text-right text-xs sticky left-0 bg-gray-100 z-10">
                TOTAL ({employes.length})
              </td>
              {datesList.map((d, idx) => {
                const t = totauxJour.get(d.date) || { ht: 0, hs: 0 };
                return (
                  <td key={idx} className="border border-gray-400 p-0 text-center">
                    <div className={`py-0.5 border-b border-gray-200 text-xs leading-tight ${getCellClass(t.ht)}`}>
                      {t.ht > 0 ? fmtH(t.ht) : '—'}
                    </div>
                    <div className={`py-0.5 text-xs leading-tight ${getHSClass(t.hs)}`}>
                      {t.hs > 0 ? fmtH(t.hs) : ''}
                    </div>
                  </td>
                );
              })}
              <td className="border border-gray-600 p-1 text-center text-xs bg-gray-200">
                {fmtH(employes.reduce((a, e) => a + e.total_ht, 0))}
              </td>
              <td className="border-2 border-gray-800 p-1 text-center text-xs bg-gray-200">
                {fmtH(employes.reduce((a, e) => a + e.total_hs, 0))}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const HeuresTravailPage = () => {
  const today = new Date();
  const [annee, setAnnee]                 = useState(today.getFullYear());
  const [mois, setMois]                   = useState(today.getMonth() + 1);
  const [selectedAnnee, setSelectedAnnee] = useState(today.getFullYear());
  const [selectedMois, setSelectedMois]   = useState(today.getMonth() + 1);
  const [filterChanged, setFilterChanged] = useState(false);
  const [sections, setSections]           = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [searchInput, setSearchInput]     = useState('');
  const [debouncedQ, setDebouncedQ]       = useState('');
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [page, setPage]                   = useState(1);
  const [forceRefresh, setForceRefresh]   = useState(0);
  const [viewMode, setViewMode]           = useState('semaine');
  const componentRef = useRef();

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(searchInput.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    presenceService.getSections().then((d) => setSections(d.sections || [])).catch(console.error);
  }, []);

  const fetchData = useCallback(async () => {
    if (data) setRefreshing(true); else setLoading(true);
    try {
      const res = await presenceService.getHeuresTravail(annee, mois, selectedSection, page, 50, debouncedQ);
      setData(res);
    } catch (err) {
      console.error('❌ Erreur heures travail:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [annee, mois, selectedSection, page, debouncedQ, forceRefresh]); // eslint-disable-line

  useEffect(() => { fetchData(); }, [fetchData]);

  const applyFilters = () => {
    setAnnee(selectedAnnee);
    setMois(selectedMois);
    setFilterChanged(false);
    setPage(1);
    setForceRefresh((p) => p + 1);
  };

  const stats = useMemo(() => {
    if (!data?.employes?.length) return null;
    const emp = data.employes;
    return {
      totalHT:   emp.reduce((s, e) => s + e.total_ht, 0),
      totalHS:   emp.reduce((s, e) => s + e.total_hs, 0),
      complets:  emp.filter((e) => e.total_jours > 0 && e.total_ht / e.total_jours >= 9).length,
      absents:   emp.filter((e) => e.total_ht === 0).length,
    };
  }, [data]);

  const datesList   = useMemo(() => data?.employes?.[0]?.details_jours || [], [data]);
  const semaineNums = useMemo(() => {
    const set = new Set();
    datesList.forEach((d) => { if (d.code_date) set.add(d.code_date.charAt(0)); });
    return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b));
  }, [datesList]);

  const pagination = data?.pagination || {};
  const periode    = data?.periode    || {};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
        <p className="text-gray-600">Calcul des heures de travail...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {refreshing && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
          <span className="text-sm text-gray-600 font-medium">Mise à jour...</span>
        </div>
      )}

      <PageHeader
        pageTag="Heures de Travail"
        title="Heures de Travail"
        subtitle={`Période du ${periode.du ?? '…'} au ${periode.au ?? '…'}${selectedSection ? ` · ${selectedSection}` : ''}`}
        kpis={[
          { label: 'Employés',   value: pagination.total_employees ?? 0, sub: 'actifs',          dotColor: '#3b82f6' },
          { label: 'Total HT',   value: stats ? fmtH(stats.totalHT) : '—',  sub: 'page courante', dotColor: '#f97316' },
          { label: 'Total HS',   value: stats ? fmtH(stats.totalHS) : '—',  sub: 'page courante', dotColor: '#eab308' },
          { label: 'Moy ≥ 9h/j', value: stats?.complets ?? 0, sub: 'employés',                   dotColor: '#22c55e' },
          { label: 'Absents',    value: stats?.absents  ?? 0, sub: '0h travaillée',               dotColor: '#ef4444' },
        ]}
      />

      {/* ── En-tête & filtres ── */}
      <div className="bg-white border-2 border-gray-800 mb-4 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-akj text-white px-5 py-2 font-bold text-lg">AKANJO</div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-bold uppercase">Heures de Travail</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Mois</label>
              <select value={selectedMois}
                onChange={(e) => { setSelectedMois(+e.target.value); setFilterChanged(true); }}
                className="px-3 py-1 border border-gray-300 rounded text-sm">
                {MOIS_FR.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Année</label>
              <select value={selectedAnnee}
                onChange={(e) => { setSelectedAnnee(+e.target.value); setFilterChanged(true); }}
                className="px-3 py-1 border border-gray-300 rounded text-sm">
                {[2022, 2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {filterChanged && (
              <button onClick={applyFilters}
                className="mt-4 px-4 py-1 bg-akj text-white text-sm rounded hover:bg-gray-700">
                Appliquer
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center border-t-2 border-gray-800 pt-3">
          <SearchBar value={searchInput} onChange={setSearchInput} />
          <SectionSelect sections={sections} value={selectedSection}
            onChange={(s) => { setSelectedSection(s); setPage(1); }} />

          <div className="flex items-center px-3 h-8 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
            <span className="font-semibold text-gray-800">{pagination.total_employees ?? 0}</span>
            <span className="ml-1">employé{(pagination.total_employees ?? 0) !== 1 ? 's' : ''}</span>
          </div>

          <ViewToggle value={viewMode} onChange={setViewMode} />

          <div className="ml-auto">
            <Legende />
          </div>
        </div>
      </div>

      {/* ── État vide ── */}
      {data?.employes?.length === 0 && !loading && !refreshing && (
        <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">
            {selectedSection
              ? `Aucun employé pour la section « ${selectedSection} »`
              : 'Aucune donnée disponible pour cette période'}
          </p>
          {selectedSection && (
            <button
              onClick={() => { setSelectedSection(''); setPage(1); }}
              className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm">
              Voir toutes les sections
            </button>
          )}
        </div>
      )}

      {/* ── Tableau ── */}
      {data?.employes?.length > 0 && (
        <div ref={componentRef}>
          {viewMode === 'semaine' ? (
            <TableSemaine employes={data.employes} semaineNums={semaineNums} />
          ) : (
            <TableJour employes={data.employes} datesList={datesList} semaineNums={semaineNums} />
          )}
        </div>
      )}

      {/* ── Pagination ── */}
      {(pagination.total_pages ?? 0) > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4 print:hidden">
          <button onClick={() => setPage((p) => p - 1)} disabled={!pagination.has_previous}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <span className="text-sm text-gray-600">Page {pagination.page} / {pagination.total_pages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={!pagination.has_next}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50">
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HeuresTravailPage;