import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Edit2,
  Save,
  X,
  RefreshCw,
  ArrowUpDown,
  ArrowLeft,
} from "lucide-react";
import anomalieService from "../../services/anomalieService";
import "/src/styles/custom.css";
import { useNavigate, useLocation } from "react-router-dom";

// ─── PageHeader ───────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, dotColor }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative">
    {dotColor && (
      <span
        className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full"
        style={{ background: dotColor }}
      />
    )}
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {label}
    </p>
    <p className="text-2xl font-bold text-gray-900 leading-none mb-1">
      {value ?? "—"}
    </p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const PageHeader = ({ pageTag, title, subtitle, kpis = [], kpiCols = 4 }) => {
  const colsMap = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
  };
  return (
    <div className="mb-8">
      {pageTag && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {pageTag}
        </p>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
      {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
      {kpis.length > 0 && (
        <div className={`grid gap-6 ${colsMap[kpiCols] ?? "grid-cols-4"}`}>
          {kpis.map((kpi, i) => (
            <KpiCard key={i} {...kpi} />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const getEtatColor = (etat) => {
  const colors = {
    pas_entree: "bg-red-100 text-red-700 border-red-300",
    pas_sortie: "bg-orange-100 text-orange-700 border-orange-300",
    multiples_pointages: "bg-yellow-100 text-yellow-700 border-yellow-300",
    abs: "bg-gray-200 text-gray-800 border-gray-400",
    ok: "bg-green-100 text-green-700 border-green-300",
  };
  return colors[etat] || "bg-gray-100 text-gray-700 border-gray-300";
};

const formatTimeHHMM = (timeStr) => {
  if (!timeStr || timeStr === "-") return "";
  if (timeStr.length === 5 && timeStr.includes(":")) return timeStr;
  if (timeStr.length >= 8 && timeStr.includes(":"))
    return timeStr.substring(0, 5);
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (match) return `${match[1].padStart(2, "0")}:${match[2]}`;
  return "";
};

const formatDisplayTime = (timeStr) => formatTimeHHMM(timeStr) || "-";

// ─── Ligne anomalie ───────────────────────────────────────────────────────────

const AnomalieRow = ({ anomalie, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [brutsOriginaux] = useState({
    estMultiple: anomalie.etat === "multiples_pointages",
    pointages: anomalie.pointages_bruts_json || [],
    entree: anomalie.heure_brute_entree,
    sortie: anomalie.heure_brute_sortie,
  });

  const isMultiple = brutsOriginaux.estMultiple;

  const [formData, setFormData] = useState({
    heure_reelle_entree: formatTimeHHMM(anomalie.heure_reelle_entree) || "",
    heure_reelle_sortie: formatTimeHHMM(anomalie.heure_reelle_sortie) || "",
    heure_rectifiee_entree: formatTimeHHMM(anomalie.heure_rectifiee_entree) || "",
    heure_rectifiee_sortie: formatTimeHHMM(anomalie.heure_rectifiee_sortie) || "",
    commentaire: anomalie.commentaire || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await anomalieService.updateAnomalie(anomalie.id, {
        ...formData,
        heure_reelle_entree: formatTimeHHMM(formData.heure_reelle_entree) || null,
        heure_reelle_sortie: formatTimeHHMM(formData.heure_reelle_sortie) || null,
        heure_rectifiee_entree: formatTimeHHMM(formData.heure_rectifiee_entree) || null,
        heure_rectifiee_sortie: formatTimeHHMM(formData.heure_rectifiee_sortie) || null,
      });
      // Mise à jour locale immédiate — pas de refetch
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleInverser = () =>
    setFormData((p) => ({
      ...p,
      heure_rectifiee_entree: p.heure_rectifiee_sortie,
      heure_rectifiee_sortie: p.heure_rectifiee_entree,
    }));
  const handleCopierBrut = () =>
    setFormData((p) => ({
      ...p,
      heure_rectifiee_entree: formatTimeHHMM(brutsOriginaux.entree) || "",
      heure_rectifiee_sortie: formatTimeHHMM(brutsOriginaux.sortie) || "",
    }));
  const handleCopierReel = () =>
    setFormData((p) => ({
      ...p,
      heure_rectifiee_entree: p.heure_reelle_entree,
      heure_rectifiee_sortie: p.heure_reelle_sortie,
    }));
  const handleEgaliserReelRect = () =>
    setFormData((p) => ({
      ...p,
      heure_reelle_entree: p.heure_rectifiee_entree,
      heure_reelle_sortie: p.heure_rectifiee_sortie,
    }));

  const inputCls =
    "w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-400";

  const renderBrutes = () => {
    if (brutsOriginaux.estMultiple && brutsOriginaux.pointages.length > 0)
      return (
        <div className="space-y-0.5">
          {brutsOriginaux.pointages.map((p, i) => (
            <div key={i} className="text-sm text-gray-900">{p.time}</div>
          ))}
        </div>
      );
    return (
      <div className="space-y-0.5 text-sm text-gray-900">
        <div>{formatDisplayTime(brutsOriginaux.entree)}</div>
        <div>{formatDisplayTime(brutsOriginaux.sortie)}</div>
      </div>
    );
  };

  const renderReel = () => (
    <div className="space-y-1">
      {editing ? (
        <>
          <input
            type="time"
            step="60"
            value={formData.heure_reelle_entree || ""}
            onChange={(e) =>
              setFormData({ ...formData, heure_reelle_entree: e.target.value.substring(0, 5) })
            }
            className={inputCls}
          />
          <input
            type="time"
            step="60"
            value={formData.heure_reelle_sortie || ""}
            onChange={(e) =>
              setFormData({ ...formData, heure_reelle_sortie: e.target.value.substring(0, 5) })
            }
            className={inputCls}
          />
          <button
            onClick={handleEgaliserReelRect}
            className="w-full px-2 py-0.5 bg-gray-700 text-white text-xs rounded hover:bg-gray-800"
          >
            Réel = Rectifié
          </button>
        </>
      ) : (
        <div className="space-y-0.5 text-sm text-gray-900">
          <div>{formatDisplayTime(anomalie.heure_reelle_entree)}</div>
          <div>{formatDisplayTime(anomalie.heure_reelle_sortie)}</div>
        </div>
      )}
    </div>
  );

  const renderRectifie = () => {
    if (!editing)
      return (
        <div className="space-y-0.5 text-sm text-gray-900">
          <div>{formatDisplayTime(anomalie.heure_rectifiee_entree)}</div>
          <div>{formatDisplayTime(anomalie.heure_rectifiee_sortie)}</div>
        </div>
      );
    if (isMultiple)
      return (
        <div className="space-y-1">
          <input
            type="time"
            step="60"
            value={formData.heure_rectifiee_entree || ""}
            onChange={(e) =>
              setFormData((p) => ({ ...p, heure_rectifiee_entree: e.target.value.substring(0, 5) }))
            }
            className={inputCls}
          />
          <input
            type="time"
            step="60"
            value={formData.heure_rectifiee_sortie || ""}
            onChange={(e) =>
              setFormData((p) => ({ ...p, heure_rectifiee_sortie: e.target.value.substring(0, 5) }))
            }
            className={inputCls}
          />
        </div>
      );
    return (
      <div className="space-y-1">
        <input
          type="time"
          step="60"
          value={formData.heure_rectifiee_entree || ""}
          onChange={(e) =>
            setFormData({ ...formData, heure_rectifiee_entree: e.target.value.substring(0, 5) })
          }
          className={inputCls}
        />
        <input
          type="time"
          step="60"
          value={formData.heure_rectifiee_sortie || ""}
          onChange={(e) =>
            setFormData({ ...formData, heure_rectifiee_sortie: e.target.value.substring(0, 5) })
          }
          className={inputCls}
        />
        <div className="flex gap-1 mt-1">
          <button onClick={handleInverser} title="Inverser" className="p-1 bg-gray-600 text-white rounded hover:bg-gray-700">
            <ArrowUpDown className="w-3 h-3" />
          </button>
          <button onClick={handleCopierBrut} title="Copier depuis brut" className="px-1.5 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">B</button>
          <button onClick={handleCopierReel} title="Copier depuis réel" className="px-1.5 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700">R</button>
        </div>
      </div>
    );
  };

  const td = "px-4 py-3 text-sm text-gray-700 align-top overflow-hidden";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className={td}><span className="text-sm line-clamp-2 text-gray-900">{anomalie.section}</span></td>
      <td className={td}><span className="text-sm text-gray-900">{anomalie.badgenumber}</span></td>
      <td className={td}><span className="text-sm text-gray-900">{anomalie.user_name}</span></td>
      <td className={td}>
        <div className="flex flex-col gap-0.5 text-sm text-gray-900">
          <span>{anomalie.heure_reelle_entree === null || anomalie.heure_reelle_entree < anomalie.heure_reelle_sortie ? "Entrée" : "Sortie"}</span>
          <span>{anomalie.heure_reelle_sortie === null || anomalie.heure_reelle_sortie > anomalie.heure_reelle_entree ? "Sortie" : "Entrée"}</span>
        </div>
      </td>
      <td className={td}>{renderReel()}</td>
      <td className={td}>{renderRectifie()}</td>
      <td className={td}>{renderBrutes()}</td>
      <td className={td}>
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium border ${getEtatColor(anomalie.etat)}`}>
            {anomalie.etat_display}
          </span>
          {editing ? (
            <div className="flex gap-1">
              <button onClick={handleSave} disabled={saving} className="p-1.5 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300">
                {saving ? <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" /> : <Save className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => setEditing(false)} className="p-1.5 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-100 text-gray-900 hover:text-gray-700">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────

const AnomaliesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = React.useMemo(() => location.state || {}, [location.state]);

  const getInitialMonth = () => locationState.month || new Date().getMonth() + 1;
  const getInitialYear = () => locationState.year || new Date().getFullYear();

  const [sectionsData, setSectionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedSection, setSelectedSection] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth);
  const [currentYear, setCurrentYear] = useState(getInitialYear);

  const fetchAnomalies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await anomalieService.getAnomaliesParSection(currentYear, currentMonth);
      const statsData = await anomalieService.getAnomalies(currentYear, currentMonth);
      setSectionsData(data.sections || []);
      setStats(statsData.statistiques);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  }, [currentYear, currentMonth]);

  // ── Mise à jour locale sans refetch ──────────────────────────────────────
  const handleUpdateAnomalie = useCallback((updatedAnomalie) => {
    setSectionsData((prev) =>
      prev.map((section) => ({
        ...section,
        par_date: Object.fromEntries(
          Object.entries(section.par_date).map(([dateStr, anomalies]) => [
            dateStr,
            anomalies.map((a) => (a.id === updatedAnomalie.id ? updatedAnomalie : a)),
          ])
        ),
      }))
    );
  }, []);

  const handleDetect = async () => {
    if (!window.confirm("Voulez-vous détecter les anomalies pour ce mois ?\n\nCela peut prendre quelques instants.")) return;
    setDetecting(true);
    try {
      const result = await anomalieService.detecterAnomalies(currentYear, currentMonth);
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

  useEffect(() => {
    if (locationState.month || locationState.year)
      window.history.replaceState({}, document.title);
  }, [locationState.month, locationState.year]);

  const allSections = React.useMemo(
    () => sectionsData.map((s) => s.section).sort(),
    [sectionsData]
  );

  const filteredData = React.useMemo(() => {
    const parDate = {};

    sectionsData.forEach((section) => {
      if (selectedSection !== "all" && section.section !== selectedSection) return;

      Object.entries(section.par_date).forEach(([dateStr, anomalies]) => {
        if (selectedDate !== "all" && dateStr !== selectedDate) return;
        if (!anomalies || anomalies.length === 0) return;

        if (!parDate[dateStr]) parDate[dateStr] = [];
        parDate[dateStr].push({ section: section.section, anomalies });
      });
    });

    return Object.entries(parDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([dateStr, sections]) => ({
        dateStr,
        sections: sections.sort((a, b) => a.section.localeCompare(b.section)),
        total: sections.reduce((acc, s) => acc + s.anomalies.length, 0),
      }));
  }, [sectionsData, selectedSection, selectedDate]);

  const getPeriodRange = (month, year) => {
    const start = new Date(year, month - 1, 22);
    if (month === 1) { start.setFullYear(year - 1); start.setMonth(11); }
    else start.setMonth(month - 2);
    const end = new Date(year, month - 1, 21);
    const format = (d) => d.toISOString().split("T")[0];
    return { min: format(start), max: format(end) };
  };

  const nbMultiples = React.useMemo(() => {
    let count = 0;
    sectionsData.forEach((s) =>
      Object.values(s.par_date).forEach((list) =>
        list.forEach((a) => { if (a.etat === "multiples_pointages") count++; })
      )
    );
    return count;
  }, [sectionsData]);

  const periodeLabel = new Date(currentYear, currentMonth - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const kpis = [
    { label: "Total",           value: stats?.total         ?? "—", sub: "anomalies",          dotColor: "#6b7280" },
    { label: "Non corrigées",   value: stats?.non_corrigees ?? "—", sub: "Requiert attention", dotColor: "#ef4444" },
    { label: "Corrigées",       value: stats?.corrigees     ?? "—", sub: "",                   dotColor: "#22c55e" },
    { label: "Multiples",       value: nbMultiples,                 sub: "pointages",          dotColor: "#eab308" },
    { label: "Taux correction", value: stats ? `${Math.round((stats.corrigees / stats.total) * 100) || 0}%` : "—", sub: "du total", dotColor: "#3b82f6" },
  ];

  if (loading && sectionsData.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <p className="text-gray-600">Chargement des anomalies...</p>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <PageHeader
        pageTag="Anomalies de pointage"
        title="Anomalies de Pointage"
        subtitle={`Suivi et correction des anomalies — ${periodeLabel}`}
        kpiCols={5}
        kpis={kpis}
      />

      {/* ── Barre de contrôle ── */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6">
        <div className="flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/attendance", { state: { returnFromAnomalies: true, month: currentMonth, year: currentYear } })}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-akj text-sm text-white rounded-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Retour
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Section</span>
              <span className="text-sm font-semibold text-gray-800">
                {selectedSection === "all" ? "Toutes" : selectedSection}
              </span>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Période</span>
              <span className="text-sm font-medium text-gray-800 capitalize">{periodeLabel}</span>
            </div>
          </div>
          <button onClick={handleDetect} disabled={detecting}
            className="flex items-center gap-1.5 px-3 py-1 text-sm font-medium bg-akj text-white rounded-md hover:opacity-90 disabled:opacity-60">
            {detecting
              ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Détection...</>
              : <><RefreshCw className="w-3.5 h-3.5" /> Détecter</>}
          </button>
        </div>

        <div className="flex items-center gap-3 px-6 pb-3.5">
          <select value={currentMonth} onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400">
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleDateString("fr-FR", { month: "long" })}
              </option>
            ))}
          </select>
          <select value={currentYear} onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400">
            {[...Array(11)].map((_, i) => {
              const y = 2020 + i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
          <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}
            className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400">
            <option value="all">Toutes les sections</option>
            {allSections.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="date"
            value={selectedDate === "all" ? "" : selectedDate}
            min={getPeriodRange(currentMonth, currentYear).min}
            max={getPeriodRange(currentMonth, currentYear).max}
            onChange={(e) => setSelectedDate(e.target.value || "all")}
            className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {selectedDate !== "all" && (
            <button onClick={() => setSelectedDate("all")} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Contenu ── */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-gray-400" />
          </div>
          <p className="text-base font-semibold text-gray-700 mb-1">Aucune anomalie détectée</p>
          <p className="text-sm text-gray-400">Utilisez "Détecter les anomalies" pour lancer une analyse.</p>
        </div>
      ) : (
        filteredData.map(({ dateStr, sections, total }) => (
          <div key={dateStr} className="mb-6">

            {/* En-tête date */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex flex-col items-center justify-center w-9 h-9 rounded-lg bg-gray-200 flex-shrink-0">
                <span className="text-xs font-semibold text-gray-400 leading-none uppercase">
                  {new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "short" })}
                </span>
                <span className="text-sm font-bold text-gray-800 leading-none">
                  {new Date(dateStr).getDate()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 capitalize">
                  {new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {total} anomalie{total > 1 ? "s" : ""} · {sections.length} section{sections.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Une carte par section */}
            {sections.map(({ section, anomalies }) => (
              <div key={section} className="bg-white border border-gray-200 rounded-xl mb-3 overflow-hidden">

                {/* En-tête section */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{section}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {anomalies.length} anomalie{anomalies.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {anomalies.some((a) => a.etat === "multiples_pointages") && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-yellow-50 text-yellow-700 border border-yellow-200">
                        {anomalies.filter((a) => a.etat === "multiples_pointages").length} multiple(s)
                      </span>
                    )}
                    {anomalies.some((a) => a.etat === "ok") && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-green-50 text-green-700 border border-green-200">
                        {anomalies.filter((a) => a.etat === "ok").length} corrigée(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Tableau */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm table-fixed">
                    <colgroup>
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "100px" }} />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Section</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Badge</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Nom</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                          <span className="text-gray-700 font-bold">{anomalies[0]?.code_date}</span>
                          <span className="block text-gray-400 font-normal normal-case tracking-normal">Heures par défaut</span>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                          <span className="text-gray-700 font-bold">{anomalies[0]?.code_date}</span>
                          <span className="block text-gray-400 font-normal normal-case tracking-normal">Pointages rectifiés</span>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                          <span className="text-gray-700 font-bold">{anomalies[0]?.code_date}</span>
                          <span className="block text-gray-400 font-normal normal-case tracking-normal">Pointages bruts</span>
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">État</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {anomalies.map((anomalie) => (
                        <AnomalieRow
                          key={anomalie.id}
                          anomalie={anomalie}
                          onUpdate={handleUpdateAnomalie}
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