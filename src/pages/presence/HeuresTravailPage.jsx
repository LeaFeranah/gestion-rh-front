import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
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
import AppFooter from "../../components/layout/AppFooter";

// ─── Constants ────────────────────────────────────────────────────────────────
const MOIS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// HT et HS en premier, puis tous les types absence
const ABS_TYPES = [
  { key: "ht", label: "HT", unit: "h", color: "text-green-700" },
  { key: "hs", label: "HS", unit: "h", color: "text-blue-700" },
  { key: "cm", label: "CM", unit: "j", color: "text-blue-700" },
  { key: "cp", label: "CP", unit: "h", color: "text-teal-700" },
  { key: "ps", label: "PS", unit: "h", color: "text-orange-700" },
  { key: "ano", label: "ANO", unit: "h", color: "text-gray-700" },
  { key: "mp", label: "MP", unit: "h", color: "text-red-700" },
  { key: "rm", label: "RM", unit: "h", color: "text-blue-700" },
  { key: "amp", label: "AMP", unit: "h", color: "text-indigo-700" },
  { key: "ef", label: "EF", unit: "h", color: "text-pink-700" },
  { key: "hp", label: "HP", unit: "h", color: "text-purple-700" },
  { key: "rc", label: "RC", unit: "h", color: "text-yellow-700" },
  { key: "ha", label: "HA", unit: "j", color: "text-purple-700" },
  { key: "tcp", label: "TCP", unit: "j", color: "text-gray-700" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtH = (h) => {
  if (!h || h === 0) return "";
  const hrs = Math.floor(Math.abs(h));
  const min = Math.round((Math.abs(h) - hrs) * 60);
  const sign = h < 0 ? "-" : "";
  return min > 0
    ? `${sign}${hrs}h${String(min).padStart(2, "0")}`
    : `${sign}${hrs}h`;
};

const fmtVal = (val, unit) => {
  if (!val || val === 0) return "";
  return unit === "j" ? `${val}j` : fmtH(val);
};

const jourCourt = (dateStr) =>
  new Date(dateStr)
    .toLocaleDateString("fr-FR", { weekday: "short" })
    .replace(".", "");

const moisCourt = (dateStr) => {
  const s = new Date(dateStr)
    .toLocaleDateString("fr-FR", { month: "short" })
    .replace(".", "");
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// ─── Fusion des deux jeux de données côté client ──────────────────────────────
const mergeData = (htEmployes, absEmployes) =>
  htEmployes.map((htEmp) => {
    const absEmp = absEmployes.find((e) => e.userid === htEmp.userid);

    // index rapide date → jour absence
    const absDayMap = {};
    (absEmp?.details_jours || []).forEach((j) => {
      absDayMap[j.date] = j;
    });

    // fusion jour par jour
    const details_jours = (htEmp.details_jours || []).map((jourHt) => {
      const jourAbs = absDayMap[jourHt.date] || {};
      return {
        date: jourHt.date,
        code_date: jourHt.code_date,
        ht: jourHt.ht || 0,
        hs: jourHt.hs || 0,
        cm: jourAbs.cm || 0,
        cp: jourAbs.cp || 0,
        ps: jourAbs.ps || 0,
        ano: jourAbs.ano || 0,
        mp: jourAbs.mp || 0,
        rm: jourAbs.rm || 0,
        amp: jourAbs.amp || 0,
        ef: jourAbs.ef || 0,
        hp: jourAbs.hp || 0,
        rc: jourAbs.rc || 0,
        ha: jourAbs.ha || 0,
        tcp: jourAbs.tcp || 0,
      };
    });

    // fusion par semaine
    const par_semaine = {};
    Object.keys(htEmp.par_semaine || {}).forEach((s) => {
      const htSem = htEmp.par_semaine[s] || { ht: 0, hs: 0 };
      const absSem = absEmp?.par_semaine?.[s] || {};
      par_semaine[s] = {
        ht: htSem.ht || 0,
        hs: htSem.hs || 0,
        cm: absSem.cm || 0,
        cp: absSem.cp || 0,
        ps: absSem.ps || 0,
        ano: absSem.ano || 0,
        mp: absSem.mp || 0,
        rm: absSem.rm || 0,
        amp: absSem.amp || 0,
        ef: absSem.ef || 0,
        hp: absSem.hp || 0,
        rc: absSem.rc || 0,
        ha: absSem.ha || 0,
        tcp: absSem.tcp || 0,
      };
    });

    return {
      userid: htEmp.userid,
      badgenumber: htEmp.badgenumber,
      name: htEmp.name,
      section: htEmp.section,
      total_ht: htEmp.total_ht || 0,
      total_hs: htEmp.total_hs || 0,
      total_cm: absEmp?.total_cm || 0,
      total_cp: absEmp?.total_cp || 0,
      total_ps: absEmp?.total_ps || 0,
      total_ano: absEmp?.total_ano || 0,
      total_mp: absEmp?.total_mp || 0,
      total_rm: absEmp?.total_rm || 0,
      total_amp: absEmp?.total_amp || 0,
      total_ef: absEmp?.total_ef || 0,
      total_hp: absEmp?.total_hp || 0,
      total_rc: absEmp?.total_rc || 0,
      total_ha: absEmp?.total_ha || 0,
      total_tcp: absEmp?.total_tcp || 0,
      details_jours,
      par_semaine,
    };
  });

// ─── TypeBadge ────────────────────────────────────────────────────────────────
const TypeBadge = ({ typeKey }) => {
  const t = ABS_TYPES.find((a) => a.key === typeKey);
  if (!t) return null;
  return (
    <span
      className={`inline-block px-1 py-0.5 rounded font-medium leading-none ${t.color}`}
    >
      {t.label}
    </span>
  );
};

// ─── Légende ──────────────────────────────────────────────────────────────────
const Legende = ({ activeTypes, onToggle }) => (
  <div className="flex flex-wrap gap-1.5 text-[11px]">
    {ABS_TYPES.map((t) => {
      const selected = activeTypes.has(t.key);
      return (
        <button
          key={t.key}
          onClick={() => onToggle(t.key)}
          className={`px-1.5 py-0.5 rounded font-bold border border-current ${t.color} transition-colors ${
            selected ? "bg-gray-400" : ""
          }`}
        >
          {t.label}
        </button>
      );
    })}
    {activeTypes.size > 0 && (
      <button
        onClick={() => onToggle(null)}
        className="px-1.5 py-0.5 rounded font-bold border border-gray-300 text-gray-400 hover:bg-gray-100 transition-colors"
      >
        ✕
      </button>
    )}
  </div>
);

// ─── ViewToggle ───────────────────────────────────────────────────────────────
const ViewToggle = ({ value, onChange }) => (
  <div className="flex items-center rounded-lg border-2 border-gray-300 overflow-hidden h-7">
    <button
      onClick={() => onChange("jour")}
      className={`flex items-center gap-1.5 px-3 h-full text-sm font-medium transition-colors ${
        value === "jour"
          ? "bg-akj text-white"
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Calendar className="w-3.5 h-3.5" /> Par jour
    </button>
    <button
      onClick={() => onChange("semaine")}
      className={`flex items-center gap-1.5 px-3 h-full text-sm font-medium transition-colors border-l-2 border-gray-300 ${
        value === "semaine"
          ? "bg-akj text-white"
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <LayoutGrid className="w-3.5 h-3.5" /> Par semaine
    </button>
  </div>
);

// ─── TableJour  (modèle AbsencesPage + HT/HS) ────────────────────────────────
const TableJour = ({
  employes,
  datesList,
  semaineNums,
  selectedSection,
  activeTypes,
}) => {
  const datesBySemaine = useMemo(() => {
    const map = {};
    datesList.forEach((d) => {
      const s = d.code_date?.charAt(0) || "1";
      if (!map[s]) map[s] = [];
      map[s].push(d);
    });
    return map;
  }, [datesList]);

  return (
    <div className="bg-white">
      <table className="w-full border-collapse text-sm">
        {/* ── EN-TÊTES ── */}
        <thead className="sticky top-0 z-20">
          {/* Ligne 1 : groupes semaine */}
          <tr className="bg-gray-100">
            <th
              rowSpan={4}
              className="border-2 border-gray-800 p-2 text-left sticky left-0 bg-gray-100 z-30 w-36 min-w-[140px]"
            >
              <div className="font-bold text-sm">N° / NOM</div>
              {!selectedSection && (
                <div className="font-normal text-gray-400">Section</div>
              )}
            </th>
            <th
              rowSpan={4}
              className="border-2 border-gray-800 p-1 text-center sticky left-36 bg-gray-100 z-30 w-14 min-w-[56px]"
            >
              <div className="font-bold">Type</div>
            </th>
            {semaineNums.map((s) => {
              const count = (datesBySemaine[s] || []).length;
              return (
                <th
                  key={s}
                  colSpan={count}
                  className="border border-gray-600 p-1 text-center font-bold bg-gray-100"
                >
                  Semaine {s}
                </th>
              );
            })}
            <th
              rowSpan={4}
              className="border-2 border-gray-800 p-1 text-center bg-gray-300 w-14 min-w-[52px]"
            >
              <div className="font-bold">Total</div>
              <div className="font-normal text-gray-500">(h/j)</div>
            </th>
          </tr>

          {/* Ligne 2 : code_date */}
          <tr className="bg-gray-100">
            {datesList.map((d, i) => (
              <th
                key={i}
                className="border border-gray-600 p-0.5 text-center font-bold bg-gray-100"
              >
                {d.code_date}
              </th>
            ))}
          </tr>

          {/* Ligne 3 : jour + numéro */}
          <tr className="bg-gray-100">
            {datesList.map((d, i) => (
              <th
                key={i}
                className="border border-gray-600 p-0.5 text-center bg-gray-100"
              >
                <div className="text-gray-500">{jourCourt(d.date)}</div>
                <div>{new Date(d.date).getDate()}</div>
              </th>
            ))}
          </tr>

          {/* Ligne 4 : mois */}
          <tr className="bg-gray-100">
            {datesList.map((d, i) => (
              <th
                key={i}
                className="border border-gray-600 p-0.5 text-center font-normal text-gray-500 bg-gray-100"
              >
                {moisCourt(d.date)}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── CORPS ── */}
        <tbody>
          {employes.map((emp) => {
            const jourMap = new Map(
              (emp.details_jours || []).map((j) => [j.date, j]),
            );
            const typesActifs = ABS_TYPES.filter(
              (t) =>
                (emp[`total_${t.key}`] || 0) > 0 &&
                (activeTypes.size === 0 || activeTypes.has(t.key)),
            );

            // Employé sans aucune valeur
            if (typesActifs.length === 0) {
              return (
                <tr
                  key={emp.userid}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10 w-36 min-w-[140px]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-sm shrink-0">
                        {emp.badgenumber}
                      </span>
                      <span className="italic text-sm" title={emp.name}>
                        {emp.name}
                      </span>
                    </div>
                    {!selectedSection && (
                      <div className="text-gray-400 mt-0.5">{emp.section}</div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 text-center sticky left-36 bg-white z-10 w-14">
                    <span className="text-gray-300">—</span>
                  </td>
                  {datesList.map((_, i) => (
                    <td
                      key={i}
                      className="border border-gray-200 p-0 text-center text-gray-200"
                    />
                  ))}
                  <td className="border-2 border-gray-800 p-1 text-center text-gray-300">
                    —
                  </td>
                </tr>
              );
            }

            // Une sous-ligne par type actif
            return typesActifs.map((t, tIdx) => {
              const isFirst = tIdx === 0;
              const isLast = tIdx === typesActifs.length - 1;
              const rowSpan = typesActifs.length;
              const total = emp[`total_${t.key}`] || 0;
              const totalStr = fmtVal(total, t.unit);

              return (
                <tr
                  key={`${emp.userid}-${t.key}`}
                  className={`${
                    isLast
                      ? "border-b-2 border-gray-800"
                      : "border-b border-gray-100"
                  } hover:bg-gray-50`}
                >
                  {/* N° / NOM : rowspan sur la première sous-ligne */}
                  {isFirst && (
                    <td
                      rowSpan={rowSpan}
                      className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10 w-36 min-w-[140px] align-top"
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm shrink-0">
                          {emp.badgenumber}
                        </span>
                        <span className="italic text-sm" title={emp.name}>
                          {emp.name}
                        </span>
                      </div>
                      {!selectedSection && (
                        <div className="text-gray-400 mt-0.5">
                          {emp.section}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Colonne Type */}
                  <td
                    className={`border-2 border-gray-800 p-1 text-center sticky left-36 bg-white z-10 w-14 min-w-[56px] ${
                      isFirst ? "border-t-2 border-t-gray-800" : ""
                    }`}
                  >
                    <TypeBadge typeKey={t.key} />
                  </td>

                  {/* Cellules par date */}
                  {datesList.map((d, i) => {
                    const jour = jourMap.get(d.date);
                    const val = jour ? jour[t.key] || 0 : 0;
                    const disp = fmtVal(val, t.unit);
                    // const cellColor =
                    //   t.key === "hs" && val >= 2 ? "text-red-600" : t.color;
                    const dayOfWeek = new Date(d.date).getDay();
                    const isSaturday = dayOfWeek === 6;
                    const isSunday = dayOfWeek === 0;

                    let cellColor;
                    if (isSunday) {
                      cellColor = "text-amber-800"; // Dimanche → marron
                    } else if (t.key === "hs") {
                      if (isSaturday) {
                        cellColor = val >= 7 ? "text-red-600" : "text-blue-700"; // Samedi → rouge ≥7h, bleu sinon
                      } else {
                        cellColor = val >= 2 ? "text-red-600" : t.color; // Jours normaux → rouge ≥2h ✅
                      }
                    } else {
                      cellColor = t.color;
                    }
                    return (
                      <td
                        key={i}
                        className={`border border-gray-200 p-0.5 text-center ${
                          isFirst ? "border-t border-t-gray-300" : ""
                        } ${disp ? `font-semibold ${cellColor}` : "text-gray-200"}`}
                      >
                        {disp}
                      </td>
                    );
                  })}

                  {/* Total */}
                  <td
                    className={`border-2 border-gray-800 p-4 text-center font-bold w-14 ${
                      isFirst ? "align-top" : ""
                    } ${totalStr ? "text-gray-800" : "text-transparent"}`}
                  >
                    {totalStr || "—"}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

// ─── TableSemaine  (résumé HT / HS / Abs. par semaine) ───────────────────────
const TableSemaine = ({
  employes,
  semaineNums,
  selectedSection,
  activeTypes,
}) => {
  return (
    <div className="bg-white border-2 border-gray-800">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-20">
          <tr className="bg-gray-100">
            <th
              rowSpan={2}
              className="border-2 border-gray-800 p-2 text-left sticky left-0 bg-gray-100 z-30 w-36 min-w-[140px]"
            >
              <div className="font-bold text-sm">N° / NOM</div>
              {!selectedSection && (
                <div className="font-normal text-gray-400">Section</div>
              )}
            </th>
            <th
              rowSpan={2}
              className="border-2 border-gray-800 p-1 text-center sticky left-36 bg-gray-100 z-30 w-14 min-w-[56px]"
            >
              <div className="font-bold">Type</div>
            </th>
            {semaineNums.map((s) => (
              <th
                key={s}
                className="border border-gray-600 p-1 text-center font-bold bg-gray-200"
              >
                Semaine {s}
              </th>
            ))}
            <th
              rowSpan={2}
              className="border-2 border-gray-800 p-1 text-center bg-gray-300 w-14 min-w-[52px]"
            >
              <div className="font-bold">Total</div>
              <div className="font-normal text-gray-500">(h/j)</div>
            </th>
          </tr>
          <tr className="bg-gray-100">
            {semaineNums.map((s) => (
              <th
                key={s}
                className="border border-gray-600 p-0.5 text-center text-xs text-gray-500 bg-gray-100 font-normal"
              >
                S{s}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {employes.map((emp) => {
            const typesActifs = ABS_TYPES.filter(
              (t) =>
                (emp[`total_${t.key}`] || 0) > 0 &&
                (activeTypes.size === 0 || activeTypes.has(t.key)),
            );
            if (typesActifs.length === 0) {
              return (
                <tr
                  key={emp.userid}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10 w-36 min-w-[140px]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-sm shrink-0">
                        {emp.badgenumber}
                      </span>
                      <span className="italic text-sm" title={emp.name}>
                        {emp.name}
                      </span>
                    </div>
                    {!selectedSection && (
                      <div className="text-gray-400 mt-0.5">{emp.section}</div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-1 text-center sticky left-36 bg-white z-10 w-14">
                    <span className="text-gray-300">—</span>
                  </td>
                  {semaineNums.map((s) => (
                    <td
                      key={s}
                      className="border border-gray-200 p-1 text-center text-gray-200"
                    >
                      —
                    </td>
                  ))}
                  <td className="border-2 border-gray-800 p-1 text-center text-gray-300">
                    —
                  </td>
                </tr>
              );
            }

            return typesActifs.map((t, tIdx) => {
              const isFirst = tIdx === 0;
              const isLast = tIdx === typesActifs.length - 1;
              const rowSpan = typesActifs.length;
              const total = emp[`total_${t.key}`] || 0;
              const totalStr = fmtVal(total, t.unit);

              return (
                <tr
                  key={`${emp.userid}-${t.key}`}
                  className={`${
                    isLast
                      ? "border-b-2 border-gray-800"
                      : "border-b border-gray-100"
                  } hover:bg-gray-50`}
                >
                  {isFirst && (
                    <td
                      rowSpan={rowSpan}
                      className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10 w-36 min-w-[140px] align-top"
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-sm shrink-0">
                          {emp.badgenumber}
                        </span>
                        <span className="italic text-sm" title={emp.name}>
                          {emp.name}
                        </span>
                      </div>
                      {!selectedSection && (
                        <div className="text-gray-400 mt-0.5">
                          {emp.section}
                        </div>
                      )}
                    </td>
                  )}

                  {/* Colonne Type */}
                  <td className="border border-gray-300 p-1 text-center sticky left-36 bg-white z-10 w-14 min-w-[56px]">
                    <TypeBadge typeKey={t.key} />
                  </td>

                  {/* Valeur par semaine */}
                  {semaineNums.map((s) => {
                    const val = (emp.par_semaine[s] || {})[t.key] || 0;
                    const disp = fmtVal(val, t.unit);
                    return (
                      <td
                        key={s}
                        className={`border border-gray-200 p-0.5 text-center ${
                          disp ? `font-semibold ${t.color}` : "text-gray-200"
                        }`}
                      >
                        {disp}
                      </td>
                    );
                  })}

                  {/* Total */}
                  <td
                    className={`border-2 border-gray-800 p-1 text-center font-bold w-14 ${
                      isFirst ? "align-top" : ""
                    } ${totalStr ? "text-gray-800" : "text-transparent"}`}
                  >
                    {totalStr || "—"}
                  </td>
                </tr>
              );
            });
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
  // const [viewMode, setViewMode] = useState("jour");
  // const componentRef = useRef();
  const [viewMode, setViewMode] = useState("jour");
  const [activeTypes, setActiveTypes] = useState(new Set()); // ← AJOUT

  const toggleType = useCallback((key) => {
    // ← AJOUT
    if (key === null) {
      setActiveTypes(new Set());
      return;
    }
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const componentRef = useRef();

  // debounce recherche
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // sections
  useEffect(() => {
    presenceService
      .getSections()
      .then((d) => setSections(d.sections || []))
      .catch(console.error);
  }, []);

  // ── Chargement : deux APIs en parallèle, fusion côté client ──────────────
  const fetchData = useCallback(async () => {
    if (data) setRefreshing(true);
    else setLoading(true);

    try {
      const [htRes, absRes] = await Promise.all([
        presenceService.getHeuresTravail(
          annee,
          mois,
          selectedSection,
          page,
          50,
          debouncedQ,
        ),
        presenceService.getAbsencesMois(
          annee,
          mois,
          selectedSection,
          page,
          50,
          debouncedQ,
        ),
      ]);

      const merged = mergeData(htRes.employes || [], absRes.employes || []);
      setData({ ...htRes, employes: merged });
    } catch (err) {
      console.error("❌ Erreur heures + absences:", err);
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

  // ── Stats KPI ────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!data?.employes?.length) return null;
    const emp = data.employes;
    const absOnlyKs = ABS_TYPES.filter((t) => t.key !== "ht" && t.key !== "hs");
    return {
      totalHT: emp.reduce((s, e) => s + e.total_ht, 0),
      totalHS: emp.reduce((s, e) => s + e.total_hs, 0),
      avecAbsence: emp.filter((e) =>
        absOnlyKs.some((t) => (e[`total_${t.key}`] || 0) > 0),
      ).length,
    };
  }, [data]);

  // datesList et semaines depuis le 1er employé
  const datesList = useMemo(
    () => data?.employes?.[0]?.details_jours || [],
    [data],
  );
  const semaineNums = useMemo(() => {
    const set = new Set();
    datesList.forEach((d) => {
      if (d.code_date) set.add(d.code_date.charAt(0));
    });
    return Array.from(set).sort((a, b) => parseInt(a) - parseInt(b));
  }, [datesList]);

  const pagination = data?.pagination || {};
  const periode = data?.periode || {};

  // ── Chargement initial ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-akj mb-4" />
        <p className="text-gray-600">Calcul des heures et absences...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Spinner de rafraîchissement */}
      {refreshing && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-akj" />
          <span className="text-sm text-gray-600 font-medium">
            Mise à jour...
          </span>
        </div>
      )}

      <PageHeader
        pageTag="Heures & Absences"
        title="Heures de Travail & Absences"
        subtitle={`Période du ${periode.du ?? "…"} au ${periode.au ?? "…"}`}
        kpis={[
          {
            label: "Employés",
            value: pagination.total_employees ?? 0,
            sub: "actifs",
            dotColor: "#3b82f6",
          },
          {
            label: "Total HT",
            value: stats ? fmtH(stats.totalHT) || "0h" : "—",
            sub: "page courante",
            dotColor: "#22c55e",
          },
          {
            label: "Total HS",
            value: stats ? fmtH(stats.totalHS) || "0h" : "—",
            sub: "page courante",
            dotColor: "#eab308",
          },
          {
            label: "Avec absence",
            value: stats?.avecAbsence ?? 0,
            sub: "employés",
            dotColor: "#ef4444",
          },
        ]}
      />

      {/* ── En-tête contrôles ── */}
      <div className="bg-white border-2 border-gray-800 mb-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-akj text-white px-6 py-3 font-bold text-lg">
              AKANJO
            </div>
            <h1 className="text-2xl font-bold uppercase">
              Heures de Travail &amp; Absences
            </h1>
          </div>

          {/* Sélecteurs mois / année */}
          <div className="text-right">
            <h2 className="text-xl font-bold mb-3">
              {periode.mois} {periode.annee}
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Mois</label>
                <select
                  value={selectedMois}
                  onChange={(e) => {
                    setSelectedMois(+e.target.value);
                    setFilterChanged(true);
                  }}
                  className="px-3 py-0.5 border border-gray-300 rounded text-sm w-full focus:ring-1 focus:outline-none focus:ring-gray-500"
                >
                  {MOIS_FR.map((m, i) => (
                    <option key={i + 1} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-1">Année</label>
                <select
                  value={selectedAnnee}
                  onChange={(e) => {
                    setSelectedAnnee(+e.target.value);
                    setFilterChanged(true);
                  }}
                  className="px-3 py-0.5 border border-gray-300 rounded text-sm w-full focus:ring-1 focus:outline-none focus:ring-gray-500"
                >
                  {[...Array(7)].map((_, i) => {
                    const y = 2020 + i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
              </div>
              {filterChanged && (
                <button
                  onClick={applyFilters}
                  className="mt-4 px-4 py-1 bg-akj text-white text-sm rounded hover:bg-gray-700"
                >
                  Appliquer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Infos période */}
        <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
          <div>
            <span className="font-bold italic">SECTION :</span>
            <span className="ml-4 font-semibold">
              {selectedSection || "TOUTES LES SECTIONS"}
            </span>
          </div>
          <div>
            <span className="font-bold italic">Période du :</span>
            <span className="ml-2">{periode.du || "…"}</span>
            <span className="mx-2 font-bold">au :</span>
            <span>{periode.au || "…"}</span>
          </div>
        </div>

        {/* ── Barre d'outils ── */}
        <div className="flex flex-wrap gap-2 items-center border-t-2 border-gray-800 pt-3 mt-4">
          {/* Recherche */}
          <div className="relative flex-1 max-w-sm h-7 [&_input]:h-7 [&_input]:py-0 [&_input]:text-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Badge ou nom..."
              className="w-full pl-9 pr-8 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm"
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
          <div className="relative h-7 [&_select]:h-7 [&_select]:py-0 [&_select]:text-sm">
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setPage(1);
              }}
              className="pl-3 pr-8 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px]"
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

          {/* Compteur */}
          <div className="flex items-center px-3 h-7 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
            <span className="font-semibold text-gray-800">
              {pagination.total_employees ?? 0}
            </span>
            <span className="ml-1">
              employé{(pagination.total_employees ?? 0) !== 1 ? "s" : ""}
            </span>
          </div>

          <ViewToggle value={viewMode} onChange={setViewMode} />

          <div className="ml-auto">
            <Legende activeTypes={activeTypes} onToggle={toggleType} />
          </div>
        </div>
      </div>

      {/* ── Tableau vide ── */}
      {data?.employes?.length === 0 && !loading && !refreshing && (
        <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-semibold">
            {selectedSection
              ? `Aucun employé pour la section « ${selectedSection} »`
              : "Aucune donnée disponible pour cette période"}
          </p>
          {selectedSection && (
            <button
              onClick={() => {
                setSelectedSection("");
                setPage(1);
              }}
              className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm"
            >
              Voir toutes les sections
            </button>
          )}
        </div>
      )}

      {/* ── Tableau principal ── */}
      {data?.employes?.length > 0 && (
        <div>
          <div ref={componentRef} className="bg-white">
            <div ref={componentRef} className="bg-white">
              {viewMode === "semaine" ? (
                <TableSemaine
                  employes={data.employes}
                  semaineNums={semaineNums}
                  selectedSection={selectedSection}
                  activeTypes={activeTypes}
                />
              ) : (
                <TableJour
                  employes={data.employes}
                  datesList={datesList}
                  semaineNums={semaineNums}
                  selectedSection={selectedSection}
                  activeTypes={activeTypes}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Pagination ── */}
      {(pagination.total_pages ?? 0) > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={!pagination.has_previous}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} / {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.has_next}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-400"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
      <AppFooter />
    </div>
  );
};

export default HeuresTravailPage;
