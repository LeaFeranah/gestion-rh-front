// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   Search,
//   X,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ShieldAlert,
//   RefreshCw,
// } from "lucide-react";
// import presenceService from "../../services/presenceService";
// import PageHeader from "../../components/headers/PageHeader";
// import "/src/styles/custom.css";
// import AppFooter from "../../components/layout/AppFooter";

// // ─── Constants ────────────────────────────────────────────────────────────────

// const MOIS_FR = [
//   "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
//   "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
// ];

// const TYPE_ERREUR_CONFIG = {
//   absence_avec_evenement: {
//     label: "Absence avec événement",
//     sub: "entrée et sortie manquantes",
//     dot: "#ef4444",
//     badge: "bg-red-100 text-red-700 border border-red-300",
//   },
//   entree_egale_sortie: {
//     label: "Entrée = Sortie",
//     sub: "doublon",
//     dot: "#eab308",
//     badge: "bg-yellow-100 text-yellow-700 border border-yellow-300",
//   },
//   sortie_avant_entree: {
//     label: "Sortie avant entrée",
//     sub: "inversion",
//     dot: "#a855f7",
//     badge: "bg-purple-100 text-purple-700 border border-purple-300",
//   },
//   presence_sans_evenement: {
//     label: "Présence sans événement",
//     sub: "événement manquant",
//     dot: "#3b82f6",
//     badge: "bg-blue-100 text-blue-700 border border-blue-300",
//   },
// };

// const fmt = (t) => {
//   if (!t) return "—";
//   return t.length > 5 ? t.slice(0, 5) : t;
// };

// // ─── KpiCard ──────────────────────────────────────────────────────────────────

// const KpiCard = ({ label, sub, value, dotColor, active, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`text-left bg-white rounded-xl p-5 shadow-sm border transition-all relative ${
//       active ? "border-gray-800 ring-2 ring-gray-800" : "border-gray-100 hover:border-gray-300"
//     }`}
//   >
//     {dotColor && (
//       <span
//         className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
//         style={{ background: dotColor }}
//       />
//     )}
//     <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//       {label}
//     </p>
//     {sub && <p className="text-xs text-gray-400 mb-3">{sub}</p>}
//     <p className="text-2xl font-bold text-gray-900 leading-none">{value ?? "—"}</p>
//   </button>
// );

// // ─── Page principale ──────────────────────────────────────────────────────────

// const VerificationPresencesPage = () => {
//   const today = new Date();
//   const [annee, setAnnee] = useState(today.getFullYear());
//   const [mois, setMois] = useState(today.getMonth() + 1);
//   const [selectedAnnee, setSelectedAnnee] = useState(today.getFullYear());
//   const [selectedMois, setSelectedMois] = useState(today.getMonth() + 1);
//   const [filterChanged, setFilterChanged] = useState(false);

//   const [sections, setSections] = useState([]);
//   const [selectedSection, setSelectedSection] = useState("");
//   const [searchInput, setSearchInput] = useState("");
//   const [debouncedQ, setDebouncedQ] = useState("");
//   const [activeTypeFilter, setActiveTypeFilter] = useState(null);

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [page, setPage] = useState(1);
//   const [forceRefresh, setForceRefresh] = useState(0);

//   // ── Debounce ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const t = setTimeout(() => {
//       setDebouncedQ(searchInput.trim());
//       setPage(1);
//     }, 350);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   // ── Sections ────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     presenceService
//       .getSections()
//       .then((d) => setSections(d.sections || []))
//       .catch(console.error);
//   }, []);

//   // ── Fetch ────────────────────────────────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     if (data) setRefreshing(true);
//     else setLoading(true);
//     try {
//       const res = await presenceService.getVerificationPresences(
//         annee, mois, selectedSection, page, 100, debouncedQ
//       );
//       setData(res);
//     } catch (err) {
//       console.error("❌ Erreur vérification:", err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [annee, mois, selectedSection, page, debouncedQ, forceRefresh]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const applyFilters = () => {
//     setAnnee(selectedAnnee);
//     setMois(selectedMois);
//     setFilterChanged(false);
//     setPage(1);
//     setForceRefresh((p) => p + 1);
//   };

//   // ── Dérivations — TOUTES avant tout early return ─────────────────────────
//   const statistiques = data?.statistiques || {};
//   const pagination   = data?.pagination   || {};
//   const periode      = data?.periode      || {};

//   const erreurs = useMemo(() => {
//     const all = data?.erreurs || [];
//     if (!activeTypeFilter) return all;
//     return all.filter((e) => e.type_erreur === activeTypeFilter);
//   }, [data, activeTypeFilter]);

//   const periodeLabel = periode.mois
//     ? `${MOIS_FR[(periode.mois || 1) - 1]} ${periode.annee}`
//     : `${MOIS_FR[mois - 1]} ${annee}`;

//   const kpiCards = [
//     {
//       key: null,
//       label: "Total erreurs",
//       sub: "tous types",
//       value: statistiques.total ?? 0,
//       dot: "#6b7280",
//     },
//     {
//       key: "absence_avec_evenement",
//       label: "Absence avec événement",
//       sub: "entrée et sortie nulles",
//       value: statistiques.absence_avec_evenement ?? 0,
//       dot: "#ef4444",
//     },
//     {
//       key: "entree_egale_sortie",
//       label: "Entrée = Sortie",
//       sub: "doublon",
//       value: statistiques.entree_egale_sortie ?? 0,
//       dot: "#eab308",
//     },
//     {
//       key: "sortie_avant_entree",
//       label: "Sortie avant entrée",
//       sub: "inversion",
//       value: statistiques.sortie_avant_entree ?? 0,
//       dot: "#a855f7",
//     },
//     {
//       key: "presence_sans_evenement",
//       label: "Présence sans événement",
//       sub: "événement manquant",
//       value: statistiques.presence_sans_evenement ?? 0,
//       dot: "#3b82f6",
//     },
//   ];

//   // ── Early return chargement initial ──────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
//         <p className="text-gray-600">Analyse des présences en cours...</p>
//       </div>
//     );
//   }

//   // ── Rendu ─────────────────────────────────────────────────────────────────
//   return (
//     <div className="p-4 bg-gray-50 min-h-screen">

//       {refreshing && (
//         <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
//           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
//           <span className="text-sm text-gray-600 font-medium">Analyse en cours...</span>
//         </div>
//       )}

//       <PageHeader
//         pageTag="Contrôle qualité"
//         title="Vérification des Présences"
//         subtitle={`Détection des incohérences — ${periodeLabel}`}
//         kpis={[]}
//       />

//       {/* ── KPI cards cliquables ── */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
//         {kpiCards.map((k) => (
//           <KpiCard
//             key={String(k.key)}
//             label={k.label}
//             sub={k.sub}
//             value={k.value}
//             dotColor={k.dot}
//             active={activeTypeFilter === k.key}
//             onClick={() =>
//               setActiveTypeFilter(activeTypeFilter === k.key ? null : k.key)
//             }
//           />
//         ))}
//       </div>

//       {/* ── En-tête contrôles ── */}
//       <div className="bg-white border-2 border-gray-800 mb-4 p-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-4">
//             <div className="bg-akj text-white px-6 py-3 font-bold text-lg">AKANJO</div>
//             <h1 className="text-2xl font-bold uppercase">Vérification des Présences</h1>
//           </div>
//           <div className="text-right">
//             <h2 className="text-xl font-bold mb-3">{periodeLabel}</h2>
//             <div className="flex items-center gap-2">
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">Mois</label>
//                 <select
//                   value={selectedMois}
//                   onChange={(e) => {
//                     setSelectedMois(+e.target.value);
//                     setFilterChanged(true);
//                   }}
//                   className="px-3 py-0.5 border border-gray-300 rounded text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
//                 >
//                   {MOIS_FR.map((m, i) => (
//                     <option key={i + 1} value={i + 1}>{m}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex flex-col">
//                 <label className="text-xs text-gray-500 mb-1">Année</label>
//                 <select
//                   value={selectedAnnee}
//                   onChange={(e) => {
//                     setSelectedAnnee(+e.target.value);
//                     setFilterChanged(true);
//                   }}
//                   className="px-3 py-0.5 border border-gray-300 rounded text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
//                 >
//                   {[...Array(7)].map((_, i) => {
//                     const y = 2020 + i;
//                     return <option key={y} value={y}>{y}</option>;
//                   })}
//                 </select>
//               </div>
//               {filterChanged && (
//                 <button
//                   onClick={applyFilters}
//                   className="mt-4 px-4 py-1 bg-akj text-white text-sm rounded hover:opacity-90"
//                 >
//                   Appliquer
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Infos période */}
//         <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
//           <div>
//             <span className="font-bold italic">SECTION :</span>
//             <span className="ml-4 font-semibold">
//               {selectedSection || "TOUTES LES SECTIONS"}
//             </span>
//           </div>
//           <div>
//             <span className="font-bold italic">Période :</span>
//             <span className="ml-2">{periodeLabel}</span>
//           </div>
//         </div>

//         {/* Barre d'outils */}
//         <div className="flex flex-wrap gap-2 items-center border-t-2 border-gray-800 pt-3 mt-4">
//           {/* Recherche */}
//           <div className="relative flex-1 max-w-sm h-7">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               placeholder="Badge ou nom..."
//               className="w-full h-7 pl-9 pr-8 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm py-0"
//             />
//             {searchInput && (
//               <button
//                 onClick={() => setSearchInput("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </div>

//           {/* Section */}
//           <div className="relative h-7">
//             <select
//               value={selectedSection}
//               onChange={(e) => {
//                 setSelectedSection(e.target.value);
//                 setPage(1);
//               }}
//               className="h-7 pl-3 pr-8 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px] py-0"
//             >
//               <option value="">— Toutes les sections —</option>
//               {sections.map((s) => (
//                 <option key={s.section_id} value={s.nom_section}>
//                   {s.nom_section} ({s.nb_employes})
//                 </option>
//               ))}
//             </select>
//             <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//           </div>

//           {/* Compteur */}
//           <div className="flex items-center px-3 h-7 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
//             <span className="font-semibold text-gray-800">{erreurs.length}</span>
//             <span className="ml-1">erreur{erreurs.length !== 1 ? "s" : ""}</span>
//             {activeTypeFilter && (
//               <span className="ml-1 text-gray-400">
//                 · {TYPE_ERREUR_CONFIG[activeTypeFilter]?.label}
//               </span>
//             )}
//           </div>

//           {/* Effacer filtre type */}
//           {activeTypeFilter && (
//             <button
//               onClick={() => setActiveTypeFilter(null)}
//               className="flex items-center gap-1 h-7 px-3 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
//             >
//               <X className="w-3.5 h-3.5" /> Tous les types
//             </button>
//           )}

//           {/* Refresh */}
//           <button
//             onClick={() => setForceRefresh((p) => p + 1)}
//             className="ml-auto flex items-center gap-1.5 h-7 px-3 text-sm bg-akj text-white rounded hover:opacity-90"
//           >
//             <RefreshCw className="w-3.5 h-3.5" /> Actualiser
//           </button>
//         </div>
//       </div>

//       {/* ── Tableau ── */}
//       {erreurs.length === 0 ? (
//         <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
//           <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
//             <ShieldAlert className="w-7 h-7 text-green-500" />
//           </div>
//           <p className="text-base font-semibold text-gray-700 mb-1">
//             {activeTypeFilter ? "Aucune erreur pour ce type" : "Aucune erreur détectée"}
//           </p>
//           <p className="text-sm text-gray-400">
//             {activeTypeFilter
//               ? "Essayez un autre filtre ou actualisez."
//               : "Toutes les présences de cette période sont cohérentes."}
//           </p>
//         </div>
//       ) : (
//         <div className="bg-white border-2 border-gray-800 overflow-auto max-h-[calc(100vh-380px)]">
//           <table className="w-full border-collapse text-sm">
//             <thead className="sticky top-0 z-10 shadow-[0_2px_0_0_#1f2937]">
//               <tr className="bg-gray-100">
//                 {["Section", "Badge", "Nom", "Date", "Entrée", "Événement", "Sortie", "État"].map(
//                   (h) => (
//                     <th
//                       key={h}
//                       className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-b-2 border-gray-800 bg-gray-100 whitespace-nowrap"
//                     >
//                       {h}
//                     </th>
//                   )
//                 )}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {erreurs.map((e, idx) => {
//                 const cfg = TYPE_ERREUR_CONFIG[e.type_erreur] || {};
//                 return (
//                   <tr key={idx} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
//                       {e.section}
//                     </td>
//                     <td className="px-4 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
//                       {e.badgenumber}
//                     </td>
//                     <td className="px-4 py-3 text-sm text-gray-900">{e.nom}</td>
//                     <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
//                       <div className="font-medium">
//                         {new Date(e.date).toLocaleDateString("fr-FR", {
//                           weekday: "short",
//                           day: "numeric",
//                           month: "short",
//                         })}
//                       </div>
//                       <div className="text-xs text-gray-400">{e.code_date}</div>
//                     </td>
//                     <td className="px-4 py-3 text-sm whitespace-nowrap">
//                       <span
//                         className={
//                           e.entree
//                             ? "font-semibold text-gray-900"
//                             : "text-red-500 italic"
//                         }
//                       >
//                         {e.entree ? fmt(e.entree) : "—"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-sm whitespace-nowrap">
//                       {e.evenement && e.evenement !== "X" ? (
//                         <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
//                           {e.evenement}
//                         </span>
//                       ) : (
//                         <span className="text-gray-400 italic text-xs">X</span>
//                       )}
//                     </td>
//                     <td className="px-4 py-3 text-sm whitespace-nowrap">
//                       <span
//                         className={
//                           e.sortie
//                             ? "font-semibold text-gray-900"
//                             : "text-red-500 italic"
//                         }
//                       >
//                         {e.sortie ? fmt(e.sortie) : "—"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${
//                           cfg.badge || ""
//                         }`}
//                       >
//                         {cfg.label || e.type_erreur}
//                         {cfg.sub && (
//                           <span className="ml-1 font-normal opacity-75">
//                             · {cfg.sub}
//                           </span>
//                         )}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ── Pagination ── */}
//       {(pagination.total_pages ?? 0) > 1 && (
//         <div className="flex items-center justify-end gap-4 mt-4">
//           <button
//             onClick={() => setPage((p) => p - 1)}
//             disabled={!pagination.has_previous}
//             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 focus:outline-none"
//           >
//             <ChevronLeft className="w-4 h-4" /> Précédent
//           </button>
//           <span className="text-sm text-gray-600">
//             Page {pagination.page} / {pagination.total_pages}
//           </span>
//           <button
//             onClick={() => setPage((p) => p + 1)}
//             disabled={!pagination.has_next}
//             className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 focus:outline-none"
//           >
//             Suivant <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       <AppFooter />
//     </div>
//   );
// };

// export default VerificationPresencesPage;




import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import presenceService from "../../services/presenceService";
import PageHeader from "../../components/headers/PageHeader";
import "/src/styles/custom.css";
import AppFooter from "../../components/layout/AppFooter";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOIS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const TYPE_ERREUR_CONFIG = {
  absence_avec_evenement: {
    label: "Absence avec événement",
    sub: "entrée et sortie manquantes",
    dot: "#ef4444",
    badge: "bg-red-100 text-red-700 border-red-300",
  },
  entree_egale_sortie: {
    label: "Entrée = Sortie",
    sub: "doublon",
    dot: "#eab308",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },
  sortie_avant_entree: {
    label: "Sortie avant entrée",
    sub: "inversion",
    dot: "#a855f7",
    badge: "bg-purple-100 text-purple-700 border-purple-300",
  },
  presence_sans_evenement: {
    label: "Présence sans événement",
    sub: "événement manquant",
    dot: "#3b82f6",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
  },
};

const fmt = (t) => {
  if (!t) return "—";
  return t.length > 5 ? t.slice(0, 5) : t;
};

// ─── KpiCard ──────────────────────────────────────────────────────────────────

const KpiCard = ({ label, sub, value, dotColor, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-left bg-white rounded-xl p-5 shadow-sm border transition-all relative ${
      active ? "border-gray-800 ring-2 ring-gray-800" : "border-gray-100 hover:border-gray-300"
    }`}
  >
    {dotColor && (
      <span
        className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
        style={{ background: dotColor }}
      />
    )}
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </p>
    {sub && <p className="text-xs text-gray-400 mb-3">{sub}</p>}
    <p className="text-2xl font-bold text-gray-900 leading-none">{value ?? "—"}</p>
  </button>
);

// ─── Page principale ──────────────────────────────────────────────────────────

const VerificationPresencesPage = () => {
  const today = new Date();
  const [annee, setAnnee] = useState(today.getFullYear());
  const [mois, setMois] = useState(today.getMonth() + 1);
  const [selectedAnnee, setSelectedAnnee] = useState(today.getFullYear());
  const [selectedMois, setSelectedMois] = useState(today.getMonth() + 1);
  const [filterChanged, setFilterChanged] = useState(false);

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [forceRefresh, setForceRefresh] = useState(0);

  // ── Debounce ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── Sections ────────────────────────────────────────────────────────────────
  useEffect(() => {
    presenceService
      .getSections()
      .then((d) => setSections(d.sections || []))
      .catch(console.error);
  }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (data) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await presenceService.getVerificationPresences(
        annee, mois, selectedSection, page, 100, debouncedQ
      );
      setData(res);
    } catch (err) {
      console.error("❌ Erreur vérification:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annee, mois, selectedSection, page, debouncedQ, forceRefresh]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const applyFilters = () => {
    setAnnee(selectedAnnee);
    setMois(selectedMois);
    setFilterChanged(false);
    setPage(1);
    setForceRefresh((p) => p + 1);
  };

  // ── Dérivations — TOUTES avant tout early return ─────────────────────────
  const statistiques = data?.statistiques || {};
  const pagination   = data?.pagination   || {};
  const periode      = data?.periode      || {};

  const erreurs = useMemo(() => {
    const all = data?.erreurs || [];
    if (!activeTypeFilter) return all;
    return all.filter((e) => e.type_erreur === activeTypeFilter);
  }, [data, activeTypeFilter]);

  const periodeLabel = periode.mois
    ? `${MOIS_FR[(periode.mois || 1) - 1]} ${periode.annee}`
    : `${MOIS_FR[mois - 1]} ${annee}`;

  const kpiCards = [
    {
      key: null,
      label: "Total erreurs",
      sub: "tous types",
      value: statistiques.total ?? 0,
      dot: "#6b7280",
    },
    {
      key: "absence_avec_evenement",
      label: "Absence avec événement",
      sub: "entrée et sortie nulles",
      value: statistiques.absence_avec_evenement ?? 0,
      dot: "#ef4444",
    },
    {
      key: "entree_egale_sortie",
      label: "Entrée = Sortie",
      sub: "doublon",
      value: statistiques.entree_egale_sortie ?? 0,
      dot: "#eab308",
    },
    {
      key: "sortie_avant_entree",
      label: "Sortie avant entrée",
      sub: "inversion",
      value: statistiques.sortie_avant_entree ?? 0,
      dot: "#a855f7",
    },
    {
      key: "presence_sans_evenement",
      label: "Présence sans événement",
      sub: "événement manquant",
      value: statistiques.presence_sans_evenement ?? 0,
      dot: "#3b82f6",
    },
  ];

  // ── Early return chargement initial ──────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
        <p className="text-gray-600">Analyse des présences en cours...</p>
      </div>
    );
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {refreshing && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
          <span className="text-sm text-gray-600 font-medium">Analyse en cours...</span>
        </div>
      )}

      <PageHeader
        pageTag="Contrôle qualité"
        title="Vérification des Présences"
        subtitle={`Détection des incohérences — ${periodeLabel}`}
        kpis={[]}
      />

      {/* ── KPI cards cliquables ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {kpiCards.map((k) => (
          <KpiCard
            key={String(k.key)}
            label={k.label}
            sub={k.sub}
            value={k.value}
            dotColor={k.dot}
            active={activeTypeFilter === k.key}
            onClick={() =>
              setActiveTypeFilter(activeTypeFilter === k.key ? null : k.key)
            }
          />
        ))}
      </div>

      {/* ── Barre de contrôle ── */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6">

        {/* Ligne supérieure : info période + selects */}
        <div className="flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Section</span>
              <span className="text-sm font-semibold text-gray-800">
                {selectedSection || "Toutes"}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Période</span>
              <span className="text-sm font-medium text-gray-800 capitalize">{periodeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMois}
              onChange={(e) => { setSelectedMois(+e.target.value); setFilterChanged(true); }}
              className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              {MOIS_FR.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              value={selectedAnnee}
              onChange={(e) => { setSelectedAnnee(+e.target.value); setFilterChanged(true); }}
              className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              {[...Array(7)].map((_, i) => {
                const y = 2020 + i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
            {filterChanged && (
              <button
                onClick={applyFilters}
                className="px-3 py-1 text-sm font-medium bg-akj text-white rounded-md hover:opacity-90"
              >
                Appliquer
              </button>
            )}
          </div>
        </div>

        {/* Ligne inférieure : recherche + section + compteur + actions */}
        <div className="flex flex-wrap gap-2 items-center px-6 pb-3.5">

          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Badge ou nom..."
              className="pl-9 pr-8 px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 w-56"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Section */}
          <select
            value={selectedSection}
            onChange={(e) => { setSelectedSection(e.target.value); setPage(1); }}
            className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Toutes les sections</option>
            {sections.map((s) => (
              <option key={s.section_id} value={s.nom_section}>
                {s.nom_section} ({s.nb_employes})
              </option>
            ))}
          </select>

          {/* Compteur */}
          <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-md">
            <span className="font-semibold text-gray-800">{erreurs.length}</span>
            {" "}erreur{erreurs.length !== 1 ? "s" : ""}
            {activeTypeFilter && (
              <span className="ml-1 text-gray-400">
                · {TYPE_ERREUR_CONFIG[activeTypeFilter]?.label}
              </span>
            )}
          </span>

          {/* Effacer filtre type */}
          {activeTypeFilter && (
            <button
              onClick={() => setActiveTypeFilter(null)}
              className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <X className="w-3.5 h-3.5" /> Tous les types
            </button>
          )}

          {/* Refresh */}
          <button
            onClick={() => setForceRefresh((p) => p + 1)}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-akj text-white rounded-md hover:opacity-90"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Actualiser
          </button>
        </div>
      </div>

      {/* ── Contenu ── */}
      {erreurs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">
            {activeTypeFilter ? "Aucune erreur pour ce type" : "Aucune erreur détectée"}
          </p>
          <p className="text-sm text-gray-400">
            {activeTypeFilter
              ? "Essayez un autre filtre ou actualisez."
              : "Toutes les présences de cette période sont cohérentes."}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                {["Section","Badge","Nom","Date","Entrée","Événement","Sortie","État"].map((_, i) => (
                  <col key={i} style={{ width: "12.5%" }} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-200">
                  {["Section", "Badge", "Nom", "Date", "Entrée", "Événement", "Sortie", "État"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {erreurs.map((e, idx) => {
                  const cfg = TYPE_ERREUR_CONFIG[e.type_erreur] || {};
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {e.section}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {e.badgenumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {e.nom}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="font-medium">
                          {new Date(e.date).toLocaleDateString("fr-FR", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                        <div className="text-xs text-gray-400">{e.code_date}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={e.entree ? "font-semibold text-gray-900" : "text-red-500 italic"}>
                          {e.entree ? fmt(e.entree) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {e.evenement && e.evenement !== "X" ? (
                          <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
                            {e.evenement}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic text-xs">X</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={e.sortie ? "font-semibold text-gray-900" : "text-red-500 italic"}>
                          {e.sortie ? fmt(e.sortie) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${
                            cfg.badge || "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          {cfg.label || e.type_erreur}
                        </span> 
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
      {(pagination.total_pages ?? 0) > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!pagination.has_previous}
            className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 focus:outline-none"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} / {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.has_next}
            className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded-md text-sm disabled:opacity-50 hover:bg-gray-50 focus:outline-none"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <AppFooter />
    </div>
  );
};

export default VerificationPresencesPage;