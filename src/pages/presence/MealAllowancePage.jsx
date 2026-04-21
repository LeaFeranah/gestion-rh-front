import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Coffee,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import presenceService from "../../services/presenceService";
import PageHeader from "../../components/headers/PageHeader";
import "/src/styles/custom.css";

const MOIS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];

const formatMoney = (value) =>
  new Intl.NumberFormat("fr-MG", { style: "currency", currency: "MGA" }).format(value);

const ViewToggle = ({ value, onChange }) => (
  <div className="flex items-center rounded-lg border-2 border-gray-300 overflow-hidden h-7">
    <button
      onClick={() => onChange("jour")}
      className={`flex items-center gap-1.5 px-3 h-full text-sm font-medium transition-colors ${value === "jour" ? "bg-akj text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
    >
      <Calendar className="w-3.5 h-3.5" /> Par jour
    </button>
    <button
      onClick={() => onChange("semaine")}
      className={`flex items-center gap-1.5 px-3 h-full text-sm font-medium transition-colors border-l-2 border-gray-300 ${value === "semaine" ? "bg-akj text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
    >
      <LayoutGrid className="w-3.5 h-3.5" /> Par semaine
    </button>
  </div>
);

// ─── Tableau Vue SEMAINE ──────────────────────────────────────────────────────
const TableSemaine = ({ employes, semaineNums, montantJournalier, selectedSection }) => {
  const totaux = useMemo(() => {
    const t = {};
    semaineNums.forEach((s) => {
      t[s] = employes.reduce((a, e) => a + (e.par_semaine[s] || 0), 0);
    });
    t._total = employes.reduce((a, e) => a + e.total_jours, 0);
    return t;
  }, [employes, semaineNums]);

  return (
    <div className="bg-white border-2 border-gray-800">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-2 border-gray-800 py-3 px-2 font-bold text-sm text-left w-40">
              Badge / Nom{!selectedSection && " / Section"}
            </th>
            {semaineNums.map((s) => (
              <th key={s} className="border border-gray-600 py-3 px-1 text-center font-bold bg-gray-200 w-[70px]">
                Semaine {s}
                <div className="text-xs font-normal text-gray-500">jours</div>
              </th>
            ))}
            <th className="border border-gray-600 py-3 px-1 text-center font-bold bg-gray-300 w-[60px]">Jours</th>
            <th className="border-2 border-gray-800 py-3 px-1 text-center font-bold bg-green-100 w-[110px]">Total (Ar)</th>
          </tr>
        </thead>
        <tbody>
          {employes.map((emp) => (
            <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="border-2 border-gray-800 py-3 px-2 sticky left-0 bg-white z-10 break-words">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="font-bold text-sm">{emp.badgenumber}</span>
                    <span className="italic text-sm">{emp.name}</span>
                  </div>
                  {!selectedSection && <div className="text-gray-400">{emp.section}</div>}
                </div>
              </td>
              {semaineNums.map((s) => {
                const n = emp.par_semaine[s] || 0;
                return (
                  <td key={s} className={`border border-gray-600 py-3 px-1 text-center font-semibold ${n > 0 ? "bg-green-50" : "text-gray-300"}`}>
                    {n > 0 ? n : "—"}
                  </td>
                );
              })}
              <td className="border border-gray-600 py-3 px-1 text-center font-bold bg-gray-50">{emp.total_jours}</td>
              <td className="border-2 border-gray-800 py-3 px-1 text-center font-bold text-green-800 bg-green-50">
                {formatMoney(emp.total_jours * montantJournalier)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
            <td className="border-2 border-gray-800 py-3 px-2 text-right text-sm sticky left-0 bg-gray-100 z-10">
              TOTAL ({employes.length})
            </td>
            {semaineNums.map((s) => (
              <td key={s} className="border border-gray-500 py-3 px-1 text-center">{totaux[s]}</td>
            ))}
            <td className="border border-gray-600 py-3 px-1 text-center bg-gray-200">{totaux._total}</td>
            <td className="border-2 border-gray-800 py-3 px-1 text-center bg-green-100">
              {formatMoney(totaux._total * montantJournalier)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// ─── Tableau Vue JOUR ─────────────────────────────────────────────────────────
const TableJour = ({ employes, datesList, semaineNums, montantJournalier, selectedSection }) => {
  const totauxJour = useMemo(() => {
    const map = new Map();
    datesList.forEach((d) => {
      const total = employes.reduce((acc, e) => {
        const jour = e.jours.find((j) => j.date === d.date);
        return acc + (jour?.indemnite ? 1 : 0);
      }, 0);
      map.set(d.date, total);
    });
    return map;
  }, [employes, datesList]);

  return (
    <div className="bg-white border-1 border-gray-800 w-full">
      {/*
        Pas de table-fixed, pas de min-width sur les colonnes jour :
        le navigateur compresse librement → 5 ou 6 semaines, tout rentre.
      */}
      <table className="w-full border-collapse text-xs">
        <thead className="sticky top-0 z-20">

          {/* Ligne 1 : groupes Semaine */}
          <tr className="bg-gray-100">
            <th className="border-2 border-gray-800 p-2 text-left text-sm sticky left-0 bg-gray-100 z-30 w-[140px]" rowSpan={4}>
              Badge / Nom{!selectedSection && " / Section"}
            </th>
            {semaineNums.map((s) => {
              const count = datesList.filter((d) => d.code_date?.charAt(0) === s).length;
              return (
                <th key={s} colSpan={count} className="border border-gray-500 p-1 text-center font-bold bg-gray-200 text-sm">
                  Semaine {s}
                </th>
              );
            })}
            <th className="border border-gray-600 p-1 text-center font-bold bg-gray-200 w-[50px]" rowSpan={4}>Jours</th>
            <th className="border border-gray-600 p-1 text-center font-bold bg-green-50 w-[90px]" rowSpan={4}>Total (Ar)</th>
          </tr>

          {/* Ligne 2 : code_date — PAS de min-w pour laisser le navigateur comprimer */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`code-${idx}`} className="border border-gray-600 p-1 text-center font-bold">
                {d.code_date}
              </th>
            ))}
          </tr>

          {/* Ligne 3 : jour de la semaine + numéro */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`wd-${idx}`} className="border border-gray-600 p-1 text-center">
                <div className="text-xs">{new Date(d.date).toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                <div className="text-xs text-gray-600">{new Date(d.date).getDate()}</div>
              </th>
            ))}
          </tr>

          {/* Ligne 4 : mois */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`mo-${idx}`} className="border border-gray-600 p-1 text-center text-xs text-gray-600 font-normal">
                {new Date(d.date).toLocaleDateString("fr-FR", { month: "short" }).replace(/^./, (c) => c.toUpperCase()).replace(/\.$/, "")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {employes.map((emp) => {
            const joursMap = new Map(emp.jours.map((j) => [j.date, j.indemnite]));
            return (
              <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="border-2 border-gray-800 py-3 px-2 sticky left-0 bg-white z-10 w-[140px] break-words">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-1 flex-wrap">
                      <span className="font-bold shrink-0">{emp.badgenumber}</span>
                      <span className="italic text-sm print:text-[7pt] print:leading-tight print:break-words print:overflow-hidden print:line-clamp-2">{emp.name}</span>
                    </div>
                    {!selectedSection && <div className="text-gray-400">{emp.section}</div>}
                  </div>
                </td>
                {datesList.map((d, idx) => {
                  const indem = joursMap.get(d.date) || false;
                  return (
                    <td key={idx} className={`border border-gray-600 py-3 text-center font-bold ${indem ? "bg-green-100 text-green-700" : "text-gray-200"}`}>
                      {indem ? "✓" : "·"}
                    </td>
                  );
                })}
                <td className="border border-gray-600 py-3 px-1 text-center font-bold bg-gray-100">{emp.total_jours}</td>
                <td className="border border-gray-800 py-3 px-1 text-center font-bold bg-green-50 text-green-800">
                  {formatMoney(emp.total_jours * montantJournalier)}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="bg-gray-100 font-bold border-t-2 border-gray-800">
            <td className="border-2 border-gray-800 py-3 px-2 text-right sticky left-0 bg-gray-100 z-10 w-[140px]">
              TOTAL ({employes.length})
            </td>
            {datesList.map((d, idx) => {
              const n = totauxJour.get(d.date) || 0;
              return (
                <td key={idx} className="border-2 border-gray-600 py-3 text-center text-[10px]">{n > 0 ? n : ""}</td>
              );
            })}
            <td className="border-2 border-gray-600 py-3 px-1 text-center bg-gray-200 font-bold">
              {employes.reduce((a, e) => a + e.total_jours, 0)}
            </td>
            <td className="border-2 border-gray-600 py-3 px-1 text-center bg-green-100 font-bold">
              {formatMoney(employes.reduce((a, e) => a + e.total_jours * montantJournalier, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────
const MealAllowancePage = () => {
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [montantJournalier, setMontantJournalier] = useState(5500);
  const [viewMode, setViewMode] = useState("jour");

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(searchInput.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    presenceService.getSections().then((d) => setSections(d.sections || [])).catch(console.error);
  }, []);

  const isFirstLoad = useRef(true);

  const fetchData = useCallback(async () => {
    if (isFirstLoad.current) { setLoading(true); isFirstLoad.current = false; }
    else { setRefreshing(true); }
    try {
      const res = await presenceService.getIndemniteRepas(annee, mois, selectedSection, page, 50, debouncedQ);
      setData(res);
    } catch (err) {
      console.error("Erreur indemnité repas:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [annee, mois, selectedSection, page, debouncedQ]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const applyFilters = () => {
    setAnnee(selectedAnnee);
    setMois(selectedMois);
    setFilterChanged(false);
    setPage(1);
  };

  const stats = useMemo(() => {
    if (!data?.employes?.length) return null;
    const totalJours = data.employes.reduce((s, e) => s + e.total_jours, 0);
    return { totalJours, totalMontant: totalJours * montantJournalier };
  }, [data, montantJournalier]);

  const datesList = data?.dates || [];
  const semaineNums = data?.semaines || [];
  const pagination = data?.pagination || {};
  const periode = data?.periode || {};

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
        <p className="text-gray-600">Chargement des indemnités repas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {refreshing && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
          <span className="text-sm text-gray-600">Mise à jour...</span>
        </div>
      )}

      <PageHeader
        pageTag="Indemnités repas"
        title="Indemnités repas"
        subtitle={`Période du ${periode.du || "…"} au ${periode.au || "…"}`}
        kpis={[
          { label: "Employés", value: pagination.total_employees ?? 0, sub: "actifs", dotColor: "#3b82f6" },
          { label: "Total jours", value: stats?.totalJours ?? "—", sub: "indemnisés", dotColor: "#f97316" },
          { label: "Total (Ar)", value: stats ? formatMoney(stats.totalMontant) : "—", sub: "toutes sections", dotColor: "#22c55e" },
          { label: "Montant/jour", value: formatMoney(montantJournalier), sub: "taux journalier", dotColor: "#a855f7" },
        ]}
      />

      <div className="bg-white border-2 border-gray-800 mb-4 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-akj text-white px-5 py-2 font-bold text-lg">AKANJO</div>
            <h1 className="text-2xl font-bold uppercase">Indemnités repas</h1>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 mt-[20px]">
              <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Montant/jour (Ar) :</label>
              <input
                type="number"
                value={montantJournalier}
                onChange={(e) => setMontantJournalier(Math.max(0, parseInt(e.target.value) || 0))}
                className="px-3 py-0.5 border border-gray-300 rounded text-sm w-24 focus:ring-1 focus:outline-none focus:ring-gray-500"
                step="100" min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Mois</label>
                <select value={selectedMois} onChange={(e) => { setSelectedMois(+e.target.value); setFilterChanged(true); }}
                  className="px-3 py-0.5 border border-gray-300 rounded text-sm w-full focus:ring-1 focus:outline-none focus:ring-gray-500">
                  {MOIS_FR.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Année</label>
                <select value={selectedAnnee} onChange={(e) => { setSelectedAnnee(+e.target.value); setFilterChanged(true); }}
                  className="px-3 py-0.5 border border-gray-300 rounded text-sm w-full focus:ring-1 focus:outline-none focus:ring-gray-500">
                  {[...Array(7)].map((_, i) => { const y = 2020 + i; return <option key={y} value={y}>{y}</option>; })}
                </select>
              </div>
              {filterChanged && (
                <button onClick={applyFilters} className="mt-4 px-4 py-1 bg-akj text-white text-sm rounded hover:bg-gray-700">
                  Appliquer
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4 mt-4">
          <div>
            <span className="font-bold italic">SECTION :</span>
            <span className="ml-4 font-semibold">{selectedSection || "TOUTES LES SECTIONS"}</span>
          </div>
          <div className="print:text-right">
            <span className="font-bold italic">Période du :</span>
            <span className="ml-2">{periode.du || "…"}</span>
            <span className="mx-2 font-bold">au :</span>
            <span>{periode.au || "…"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center border-t-2 border-gray-800 pt-3 mt-4">
          <div className="relative flex-1 max-w-sm h-7 [&_input]:h-7 [&_input]:py-0 [&_input]:text-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Badge ou nom..."
              className="w-full pl-9 pr-8 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm" />
            {searchInput && (
              <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <div className="relative h-7 [&_select]:h-7 [&_select]:py-0 [&_select]:text-sm">
            <select value={selectedSection} onChange={(e) => { setSelectedSection(e.target.value); setPage(1); }}
              className="pl-3 pr-8 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px]">
              <option value="">— Toutes les sections —</option>
              {sections.map((s) => <option key={s.section_id} value={s.nom_section}>{s.nom_section} ({s.nb_employes})</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="flex items-center px-3 h-7 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
            <span className="font-semibold text-gray-800">{pagination.total_employees ?? 0}</span>
            <span className="ml-1">employé{(pagination.total_employees ?? 0) !== 1 ? "s" : ""}</span>
          </div>
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-medium">✓ Indemnisé (HT ≥ 3h50)</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">· Non indemnisé</span>
          </div>
        </div>
      </div>

      {data?.employes?.length === 0 && !loading && !refreshing && (
        <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
          <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">Aucune donnée d'indemnité pour cette période</p>
          {selectedSection && (
            <button onClick={() => { setSelectedSection(""); setPage(1); }}
              className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm">
              Voir toutes les sections
            </button>
          )}
        </div>
      )}

      {data?.employes?.length > 0 && (
        viewMode === "semaine" ? (
          <TableSemaine employes={data.employes} semaineNums={semaineNums} montantJournalier={montantJournalier} selectedSection={selectedSection} />
        ) : (
          <TableJour employes={data.employes} datesList={datesList} semaineNums={semaineNums} montantJournalier={montantJournalier} selectedSection={selectedSection} />
        )
      )}

      {(pagination.total_pages ?? 0) > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4">
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

export default MealAllowancePage;