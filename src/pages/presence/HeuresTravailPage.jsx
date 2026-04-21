import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Clock,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import presenceService from "../../services/presenceService";
import PageHeader from "../../components/headers/PageHeader";
import "/src/styles/custom.css";

const fmtH = (heures) => {
  if (!heures && heures !== 0) return "—";
  const h = Math.floor(Math.abs(heures));
  const m = Math.round((Math.abs(heures) - h) * 60);
  const sign = heures < 0 ? "-" : "";
  return m > 0 ? `${sign}${h}h${String(m).padStart(2, "0")}` : `${sign}${h}h`;
};

const getCellClass = (valeur) => {
  if (!valeur || valeur === 0) return "text-gray-300";
  if (valeur >= 9) return "bg-green-100 text-green-800";
  if (valeur >= 7) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

const getHSClass = (valeur) =>
  valeur > 0 ? "bg-blue-100 text-blue-800" : "text-gray-300";

const MOIS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];

const EmpCell = ({ emp, maxNameWidth = 110, selectedSection }) => (
  <>
    <div className="flex items-center gap-1.5">
      <span className="font-bold text-sm shrink-0">{emp.badgenumber}</span>
      <span className="italic text-sm text-gray-700 truncate" style={{ maxWidth: maxNameWidth }} title={emp.name}>
        {emp.name}
      </span>
    </div>
    {!selectedSection && (
      <div className="text-gray-400 text-xs mt-0.5 truncate" style={{ maxWidth: maxNameWidth + 36 }} title={emp.section}>
        {emp.section}
      </div>
    )}
  </>
);

const Legende = () => (
  <div className="flex flex-wrap gap-2 text-xs">
    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-medium">≥ 9h HT</span>
    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded font-medium">7–9h HT</span>
    <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded font-medium">&lt; 7h HT</span>
    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">HS (heures sup.)</span>
  </div>
);

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
const TableSemaine = ({ employes, semaineNums, selectedSection }) => (
  <div className="bg-white border-2 border-gray-800">
    <table className="w-full border-collapse text-sm" style={{ tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: 170 }} />
        {semaineNums.flatMap((s) => [
          <col key={`ht-${s}`} />,
          <col key={`hs-${s}`} />,
        ])}
        <col /><col />
      </colgroup>
      <thead>
        <tr className="bg-gray-100">
          <th className="border-2 border-gray-800 py-3 px-2 text-left sticky left-0 bg-gray-100 z-10">
            Badge / Nom{!selectedSection && " / Section"}
          </th>
          {semaineNums.map((s) => (
            <th key={s} colSpan={2} className="border border-gray-600 py-3 px-1 text-center font-bold bg-gray-200">
              Semaine {s}
            </th>
          ))}
          <th colSpan={2} className="border-2 border-gray-800 py-3 px-1 text-center font-bold bg-gray-300">Total mois</th>
        </tr>
        <tr className="bg-gray-100">
          <th className="border-2 border-gray-800 py-2 px-2 sticky left-0 bg-gray-100 z-10" />
          {semaineNums.map((s) => (
            <React.Fragment key={`sub-${s}`}>
              <th className="border border-gray-800 py-2 px-1 text-center text-xs bg-gray-200 font-semibold">HT</th>
              <th className="border border-gray-800 py-2 px-1 text-center text-xs bg-gray-200 font-semibold">HS</th>
            </React.Fragment>
          ))}
          <th className="border border-gray-600 py-2 px-1 text-center text-xs bg-gray-300 font-bold">HT</th>
          <th className="border-2 border-gray-800 py-2 px-1 text-center text-xs bg-gray-300 font-bold">HS</th>
        </tr>
      </thead>
      <tbody>
        {employes.map((emp) => (
          <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td className="border-2 border-gray-800 py-3 px-2 sticky left-0 bg-white z-10">
              <EmpCell emp={emp} maxNameWidth={100} selectedSection={selectedSection} />
            </td>
            {semaineNums.map((s) => {
              const d = emp.par_semaine[s] || { ht: 0, hs: 0 };
              return (
                <React.Fragment key={`sem-${s}`}>
                  <td className={`border border-gray-800 py-3 px-1 text-center font-semibold ${getCellClass(d.ht)}`}>{d.ht > 0 ? fmtH(d.ht) : "-"}</td>
                  <td className={`border border-gray-800 py-3 px-1 text-center font-medium ${getHSClass(d.hs)}`}>{d.hs > 0 ? fmtH(d.hs) : "-"}</td>
                </React.Fragment>
              );
            })}
            <td className={`border border-gray-600 py-3 px-1 text-center font-bold text-sm ${getCellClass(emp.total_ht)}`}>{fmtH(emp.total_ht)}</td>
            <td className={`border-2 border-gray-800 py-3 px-1 text-center font-bold text-sm ${getHSClass(emp.total_hs)}`}>{emp.total_hs > 0 ? fmtH(emp.total_hs) : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Tableau Vue JOUR ─────────────────────────────────────────────────────────
const TableJour = ({ employes, datesList, semaineNums, selectedSection }) => {
  const jourMap = useCallback(
    (emp) => new Map(emp.details_jours.map((j) => [j.date, j])),
    [],
  );

  return (
    <div className="bg-white border-1 border-gray-800 w-full">
      {/*
        Pas de tableLayout fixed, pas de min-width, pas de whitespace-nowrap :
        le navigateur comprime librement les colonnes jour.
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
          </tr>

          {/* Ligne 2 : code_date — pas de min-width */}
          <tr className="bg-gray-100">
            {datesList.map((d, idx) => (
              <th key={`code-${idx}`} className="border border-gray-600 p-1 text-center font-bold">
                {d.code_affichage || d.code_date}
              </th>
            ))}
          </tr>

          {/* Ligne 3 : jour + numéro */}
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
            const jMap = jourMap(emp);
            return (
              <tr key={emp.userid} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="border-2 border-gray-800 py-3 px-2 sticky left-0 bg-white z-10 w-[145px] overflow-hidden">
                  <EmpCell emp={emp} maxNameWidth={85} selectedSection={selectedSection} />
                </td>
                {datesList.map((d, idx) => {
                  const jour = jMap.get(d.date) || { ht: 0, hs: 0 };
                  return (
                    <td key={idx} className="border border-gray-800 p-0 text-center align-middle overflow-hidden">
                      {/* whitespace-nowrap supprimé → le texte peut se couper si la cellule est trop petite */}
                      <div className={`py-1.5 border-b border-gray-200 font-medium leading-tight ${getCellClass(jour.ht)}`}>
                        {jour.ht > 0 ? fmtH(jour.ht) : "-"}
                      </div>
                      <div className={`py-1.5 leading-tight font-medium ${getHSClass(jour.hs)}`}>
                        {jour.hs > 0 ? fmtH(jour.hs) : ""}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────
const HeuresTravailPage = () => {
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
  const [forceRefresh, setForceRefresh] = useState(0);
  const [viewMode, setViewMode] = useState("jour");
  const componentRef = useRef();

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(searchInput.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    presenceService.getSections().then((d) => setSections(d.sections || [])).catch(console.error);
  }, []);

  const fetchData = useCallback(async () => {
    if (data) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await presenceService.getHeuresTravail(annee, mois, selectedSection, page, 50, debouncedQ);
      setData(res);
    } catch (err) {
      console.error("❌ Erreur heures travail:", err);
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
      totalHT: emp.reduce((s, e) => s + e.total_ht, 0),
      totalHS: emp.reduce((s, e) => s + e.total_hs, 0),
      complets: emp.filter((e) => e.total_jours > 0 && e.total_ht / e.total_jours >= 9).length,
    };
  }, [data]);

  const datesList = useMemo(() => data?.employes?.[0]?.details_jours || [], [data]);
  const semaineNums = useMemo(() => {
    const set = new Set();
    datesList.forEach((d) => { if (d.code_date) set.add(d.code_date.charAt(0)); });
    return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b));
  }, [datesList]);

  const pagination = data?.pagination || {};
  const periode = data?.periode || {};

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
        subtitle={`Période du ${periode.du ?? "…"} au ${periode.au ?? "…"}`}
        kpis={[
          { label: "Employés", value: pagination.total_employees ?? 0, sub: "actifs", dotColor: "#3b82f6" },
          { label: "Total HT", value: stats ? fmtH(stats.totalHT) : "—", sub: "page courante", dotColor: "#f97316" },
          { label: "Total HS", value: stats ? fmtH(stats.totalHS) : "—", sub: "page courante", dotColor: "#eab308" },
          { label: "Moy ≥ 9h/j", value: stats?.complets ?? 0, sub: "employés", dotColor: "#22c55e" },
        ]}
      />

      <div className="bg-white border-1 border-gray-800 mb-4 p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-akj text-white px-5 py-2 font-bold text-lg">AKANJO</div>
            <h1 className="text-2xl font-bold uppercase">Heures de Travail</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Mois</label>
              <select value={selectedMois} onChange={(e) => { setSelectedMois(+e.target.value); setFilterChanged(true); }}
                className="px-3 py-1 border border-gray-300 rounded text-sm">
                {MOIS_FR.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 mb-1">Année</label>
              <select value={selectedAnnee} onChange={(e) => { setSelectedAnnee(+e.target.value); setFilterChanged(true); }}
                className="px-3 py-1 border border-gray-300 rounded text-sm">
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

        <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
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
              <button onClick={() => setSearchInput("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
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
          <div className="ml-auto"><Legende /></div>
        </div>
      </div>

      {data?.employes?.length === 0 && !loading && !refreshing && (
        <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">
            {selectedSection ? `Aucun employé pour la section « ${selectedSection} »` : "Aucune donnée disponible pour cette période"}
          </p>
          {selectedSection && (
            <button onClick={() => { setSelectedSection(""); setPage(1); }}
              className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm">
              Voir toutes les sections
            </button>
          )}
        </div>
      )}

      {data?.employes?.length > 0 && (
        <div ref={componentRef}>
          {viewMode === "semaine" ? (
            <TableSemaine employes={data.employes} semaineNums={semaineNums} selectedSection={selectedSection} />
          ) : (
            <TableJour employes={data.employes} datesList={datesList} semaineNums={semaineNums} selectedSection={selectedSection} />
          )}
        </div>
      )}

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