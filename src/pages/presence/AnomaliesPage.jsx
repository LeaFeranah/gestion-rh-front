import React, { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
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

// ─── Sélecteur de pointage (multiples_pointages) ─────────────────────────────

const PointageSelector = ({ label, value, pointages, onChange }) => (
  <div className="space-y-1">
    <div className="text-xs text-gray-500 font-medium">{label}</div>
    <div className="flex flex-wrap gap-1">
      {pointages.map((p, i) => (
        <button
          key={i}
          onClick={() => onChange(value === p.time ? "" : p.time)}
          className={`px-2 py-1 rounded text-xs font-mono border transition-all ${
            value === p.time
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-700 border-gray-300 hover:border-gray-600 hover:bg-gray-50"
          }`}
        >
          {p.time}
        </button>
      ))}
      {value && (
        <button
          onClick={() => onChange("")}
          className="px-2 py-1 rounded text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
    {value && (
      <div className="text-xs text-gray-600 font-mono font-semibold">
        {value}
      </div>
    )}
  </div>
);

// ─── Ligne anomalie ───────────────────────────────────────────────────────────

const AnomalieRow = ({ anomalie, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const isMultiple = anomalie.etat === "multiples_pointages";
  const pointagesBruts = anomalie.pointages_bruts_json || [];

  const [formData, setFormData] = useState({
    heure_reelle_entree: formatTimeHHMM(anomalie.heure_reelle_entree) || "",
    heure_reelle_sortie: formatTimeHHMM(anomalie.heure_reelle_sortie) || "",
    heure_rectifiee_entree:
      formatTimeHHMM(anomalie.heure_rectifiee_entree) || "",
    heure_rectifiee_sortie:
      formatTimeHHMM(anomalie.heure_rectifiee_sortie) || "",
    commentaire: anomalie.commentaire || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const dataToSend = {
        ...formData,
        heure_reelle_entree:
          formatTimeHHMM(formData.heure_reelle_entree) || null,
        heure_reelle_sortie:
          formatTimeHHMM(formData.heure_reelle_sortie) || null,
        heure_rectifiee_entree:
          formatTimeHHMM(formData.heure_rectifiee_entree) || null,
        heure_rectifiee_sortie:
          formatTimeHHMM(formData.heure_rectifiee_sortie) || null,
      };
      await anomalieService.updateAnomalie(anomalie.id, dataToSend);
      await onUpdate();
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
      heure_rectifiee_entree: formatTimeHHMM(anomalie.heure_brute_entree) || "",
      heure_rectifiee_sortie: formatTimeHHMM(anomalie.heure_brute_sortie) || "",
    }));

  const handleCopierReel = () =>
    setFormData((p) => ({
      ...p,
      heure_rectifiee_entree: p.heure_reelle_entree,
      heure_rectifiee_sortie: p.heure_reelle_sortie,
    }));

  const handleEgaliserReelRectifie = () =>
    setFormData((p) => ({
      ...p,
      heure_reelle_entree: p.heure_rectifiee_entree,
      heure_reelle_sortie: p.heure_rectifiee_sortie,
    }));

  // ── Cellule brutes ─────────────────────────────────────────────────────────
  const renderBrutes = () => {
    if (isMultiple && pointagesBruts.length > 0) {
      return (
        <div className="space-y-1">
          {pointagesBruts.map((p, i) => (
            <div key={i} className="flex items-center gap-1 justify-center">
              <span>{p.time}</span>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="space-y-1">
        <div>{formatDisplayTime(anomalie.heure_brute_entree)}</div>
        <div>{formatDisplayTime(anomalie.heure_brute_sortie)}</div>
      </div>
    );
  };

  // ── Cellule réelles ────────────────────────────────────────────────────────
  const renderReel = () => (
    <div className="space-y-1">
      {editing ? (
        <>
          <input
            type="time"
            step="60"
            value={formData.heure_reelle_entree || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                heure_reelle_entree: e.target.value.substring(0, 5),
              })
            }
            className="w-full px-2 py-1 border rounded text-sm"
          />
          <input
            type="time"
            step="60"
            value={formData.heure_reelle_sortie || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                heure_reelle_sortie: e.target.value.substring(0, 5),
              })
            }
            className="w-full px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={handleEgaliserReelRectifie}
            className="w-full px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            Réel = Rectifié
          </button>
        </>
      ) : (
        <>
          <div className="text-sm font-medium">
            {formatDisplayTime(anomalie.heure_reelle_entree)}
          </div>
          <div className="text-sm font-medium">
            {formatDisplayTime(anomalie.heure_reelle_sortie)}
          </div>
        </>
      )}
    </div>
  );

  // ── Cellule rectifiées ─────────────────────────────────────────────────────
  // const renderRectifie = () => {
  //   if (!editing)
  //     return (
  //       <div className="space-y-1">
  //         <div className="text-sm font-medium">
  //           {formatDisplayTime(anomalie.heure_rectifiee_entree)}
  //         </div>
  //         <div className="text-sm font-medium">
  //           {formatDisplayTime(anomalie.heure_rectifiee_sortie)}
  //         </div>
  //       </div>
  //     );

  //   // Mode édition — multiples_pointages
  //   if (isMultiple && pointagesBruts.length > 0) {
  //     return (
  //       <div className="space-y-2 min-w-[180px]">
  //         <PointageSelector
  //           label="Entrée"
  //           value={formData.heure_rectifiee_entree}
  //           pointages={pointagesBruts}
  //           onChange={(v) =>
  //             setFormData((p) => ({ ...p, heure_rectifiee_entree: v }))
  //           }
  //         />
  //         <PointageSelector
  //           label="Sortie"
  //           value={formData.heure_rectifiee_sortie}
  //           pointages={pointagesBruts}
  //           onChange={(v) =>
  //             setFormData((p) => ({ ...p, heure_rectifiee_sortie: v }))
  //           }
  //         />
  //         {formData.heure_rectifiee_entree &&
  //           formData.heure_rectifiee_sortie &&
  //           formData.heure_rectifiee_entree >=
  //             formData.heure_rectifiee_sortie && (
  //             <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-1">
  //               ⚠ L'entrée doit être avant la sortie
  //             </div>
  //           )}
  //       </div>
  //     );
  //   }

  //   // Mode édition — cas standard
  //   return (
  //     <div className="space-y-1">
  //       <input
  //         type="time"
  //         step="60"
  //         value={formData.heure_rectifiee_entree || ""}
  //         onChange={(e) =>
  //           setFormData({
  //             ...formData,
  //             heure_rectifiee_entree: e.target.value.substring(0, 5),
  //           })
  //         }
  //         className="w-full px-2 py-1 border rounded text-sm"
  //       />
  //       <input
  //         type="time"
  //         step="60"
  //         value={formData.heure_rectifiee_sortie || ""}
  //         onChange={(e) =>
  //           setFormData({
  //             ...formData,
  //             heure_rectifiee_sortie: e.target.value.substring(0, 5),
  //           })
  //         }
  //         className="w-full px-2 py-1 border rounded text-sm"
  //       />
  //       <div className="flex flex-wrap gap-1 mt-2">
  //         <button
  //           onClick={handleInverser}
  //           className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
  //           title="Inverser"
  //         >
  //           <ArrowUpDown className="w-3 h-3" />
  //         </button>
  //         <button
  //           onClick={handleCopierBrut}
  //           className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
  //           title="Copier depuis brut"
  //         >
  //           B
  //         </button>
  //         <button
  //           onClick={handleCopierReel}
  //           className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
  //           title="Copier depuis réel"
  //         >
  //           R
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };


  const renderRectifie = () => {
  if (!editing) return (
    <div className="space-y-1">
      <div className="text-sm font-medium">{formatDisplayTime(anomalie.heure_rectifiee_entree)}</div>
      <div className="text-sm font-medium">{formatDisplayTime(anomalie.heure_rectifiee_sortie)}</div>
    </div>
  );

  // ✅ Pour multiples_pointages : saisie manuelle dans la colonne rectifiée
  if (isMultiple) {
    return (
      <div className="space-y-2 mb-6">
        <div>
          <input type="time" step="60"
            value={formData.heure_rectifiee_entree || ""}
            onChange={(e) => setFormData((p) => ({ ...p, heure_rectifiee_entree: e.target.value.substring(0, 5) }))}
            className="w-full px-2 py-1 border rounded text-sm font-mono"
          />
        </div>
        <div>
          <input type="time" step="60"
            value={formData.heure_rectifiee_sortie || ""}
            onChange={(e) => setFormData((p) => ({ ...p, heure_rectifiee_sortie: e.target.value.substring(0, 5) }))}
            className="w-full px-2 py-1 border rounded text-sm font-mono"
          />
        </div>
      </div>
    );
  }

  // Cas standard (pas_entree / pas_sortie)
  return (
    <div className="space-y-1">
      <input type="time" step="60"
        value={formData.heure_rectifiee_entree || ""}
        onChange={(e) => setFormData({ ...formData, heure_rectifiee_entree: e.target.value.substring(0, 5) })}
        className="w-full px-2 py-1 border rounded text-sm"
      />
      <input type="time" step="60"
        value={formData.heure_rectifiee_sortie || ""}
        onChange={(e) => setFormData({ ...formData, heure_rectifiee_sortie: e.target.value.substring(0, 5) })}
        className="w-full px-2 py-1 border rounded text-sm"
      />
      <div className="flex flex-wrap gap-1 mt-2">
        <button onClick={handleInverser} className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700" title="Inverser">
          <ArrowUpDown className="w-3 h-3" />
        </button>
        <button onClick={handleCopierBrut} className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700" title="Copier depuis brut">B</button>
        <button onClick={handleCopierReel} className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700" title="Copier depuis réel">R</button>
      </div>
    </div>
  );
};

  return (
    <tr className="border-b-2 border-gray-300 hover:bg-gray-50">
      <td className="border-2 border-gray-300 p-2 w-64 font-semibold">
        {anomalie.section}
      </td>
      <td className="border-2 border-gray-300 p-2 text-center w-24">
        {anomalie.badgenumber}
      </td>
      <td className="border-2 border-gray-300 p-2 w-64">
        {anomalie.user_name}
      </td>

      {/* Type */}
      <td className="border-2 border-gray-300 p-2 text-center w-24">
        <div className="space-y-1">
          <div className="text-sm">
            {anomalie.heure_reelle_entree === null ||
            anomalie.heure_reelle_entree < anomalie.heure_reelle_sortie
              ? "Entrée"
              : "Sortie"}
          </div>
          <div className="text-sm">
            {anomalie.heure_reelle_sortie === null ||
            anomalie.heure_reelle_sortie > anomalie.heure_reelle_entree
              ? "Sortie"
              : "Entrée"}
          </div>
        </div>
      </td>

      {/* Réelles */}
      <td className="border-2 border-gray-300 p-2 text-center w-24">
        {renderReel()}
      </td>

      {/* Rectifiées */}
      <td className="border-2 border-gray-300 p-2 text-center w-24">
        {renderRectifie()}
      </td>

      {/* Brutes */}
      <td className="border-2 border-gray-300 p-2 text-center w-24">
        {renderBrutes()}
      </td>

      {/* État */}
      <td className="border-2 border-gray-300 p-2 w-64">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2 py-1 rounded text-xs font-medium border-2 ${getEtatColor(anomalie.etat)}`}
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
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
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

// ─── Page principale ──────────────────────────────────────────────────────────

const AnomaliesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = React.useMemo(
    () => location.state || {},
    [location.state],
  );

  const getInitialMonth = () =>
    locationState.month || new Date().getMonth() + 1;
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
      const data = await anomalieService.getAnomaliesParSection(
        currentYear,
        currentMonth,
      );
      const statsData = await anomalieService.getAnomalies(
        currentYear,
        currentMonth,
      );
      setSectionsData(data.sections || []);
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
        "Voulez-vous détecter les anomalies pour ce mois ?\n\nCela peut prendre quelques instants.",
      )
    )
      return;
    setDetecting(true);
    try {
      const result = await anomalieService.detecterAnomalies(
        currentYear,
        currentMonth,
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

  useEffect(() => {
    if (locationState.month || locationState.year)
      window.history.replaceState({}, document.title);
  }, [locationState.month, locationState.year]);

  const allSections = React.useMemo(
    () => sectionsData.map((s) => s.section).sort(),
    [sectionsData],
  );

  const filteredData = React.useMemo(() => {
    let result = sectionsData;
    if (selectedSection !== "all")
      result = result.filter((s) => s.section === selectedSection);
    if (selectedDate !== "all")
      result = result.map((section) => ({
        ...section,
        par_date: { [selectedDate]: section.par_date[selectedDate] || [] },
      }));
    return result;
  }, [sectionsData, selectedSection, selectedDate]);

  const getPeriodRange = (month, year) => {
    const start = new Date(year, month - 1, 22);
    if (month === 1) {
      start.setFullYear(year - 1);
      start.setMonth(11);
    } else {
      start.setMonth(month - 2);
    }
    const end = new Date(year, month - 1, 21);
    const format = (d) => d.toISOString().split("T")[0];
    return { min: format(start), max: format(end) };
  };

  const sectionStats =
    selectedSection === "all" ? null : { section: selectedSection };

  const formatPeriod = (month, year) => {
    const { min, max } = getPeriodRange(month, year);
    return (
      <>
        <span className="font-bold">Période du: </span>
        {new Date(min).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}{" "}
        <span className="font-bold">au</span>{" "}
        {new Date(max).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </>
    );
  };

  // Compter multiples_pointages
  const nbMultiples = React.useMemo(() => {
    let count = 0;
    sectionsData.forEach((s) =>
      Object.values(s.par_date).forEach((anomalies) =>
        anomalies.forEach((a) => {
          if (a.etat === "multiples_pointages") count++;
        }),
      ),
    );
    return count;
  }, [sectionsData]);

  if (loading && sectionsData.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
        <p className="text-gray-600">Chargement des anomalies...</p>
      </div>
    );

  return (
    <div className="p-4 bg-akj-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-white shadow-md rounded-lg border border-gray-200 mb-6 p-6">
        {/* Header principal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 border-b-2 pb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate("/attendance", {
                  state: {
                    returnFromAnomalies: true,
                    month: currentMonth,
                    year: currentYear,
                  },
                })
              }
              className="mt-3 md:mt-0 w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transition"
            >
              <ArrowLeft className="w-5 h-5" /> Retour
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Gestion des Anomalies de Pointage
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Suivi et correction des anomalies de pointage par mois et par
                section
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:gap-4 w-full md:w-auto">
            <div className="flex gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Mois</label>
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 text-sm"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleDateString("fr-FR", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Année
                </label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 text-sm"
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
              className="flex items-center gap-2 px-4 py-[4.7px] text-sm bg-akj text-white rounded"
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
          <span className="font-bold italic">
            SECTION:
            {selectedSection && sectionStats && (
              <span className="ml-4 font-semibold">{sectionStats.section}</span>
            )}
          </span>
          <span className="text-md text-black-500 text-right">
            {formatPeriod(currentMonth, currentYear)}
          </span>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-600">Total anomalies</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-red-700">
                {stats.non_corrigees}
              </div>
              <div className="text-sm text-red-700">Non corrigées</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-green-700">
                {stats.corrigees}
              </div>
              <div className="text-sm text-green-700">Corrigées</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-yellow-700">
                {nbMultiples}
              </div>
              <div className="text-sm text-yellow-700">Pointages multiples</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round((stats.corrigees / stats.total) * 100) || 0}%
              </div>
              <div className="text-sm text-blue-700">Taux de correction</div>
            </div>
          </div>
        )}

        

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">
              Filtrer par section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-1 border border-gray-300 rounded shadow-sm focus:ring-1 focus:ring-gray-500"
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
            {currentMonth && currentYear && (
              <input
                type="date"
                value={selectedDate === "all" ? "" : selectedDate}
                min={getPeriodRange(currentMonth, currentYear).min}
                max={getPeriodRange(currentMonth, currentYear).max}
                onChange={(e) => setSelectedDate(e.target.value || "all")}
                className="w-full px-3 py-[2px] border border-gray-300 rounded shadow-sm focus:ring-1 focus:ring-gray-500"
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
            {Object.entries(section.par_date).map(([dateStr, anomalies]) => (
              <div
                key={dateStr}
                className="bg-white border border-gray-200 rounded-lg mb-4 shadow-sm"
              >
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
                      <div className="flex items-center gap-3 text-sm">
                        {anomalies.some(
                          (a) => a.etat === "multiples_pointages",
                        ) && (
                          <span className="px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-300 text-xs font-semibold">
                            {
                              anomalies.filter(
                                (a) => a.etat === "multiples_pointages",
                              ).length
                            }{" "}
                            multiple(s)
                          </span>
                        )}
                        <span className="text-gray-500">
                          ({anomalies.length} anomalie(s))
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gray-200 text-center align-middle">
                            <th className="border-2 border-gray-300 p-2 w-64">
                              Section
                            </th>
                            <th className="border-2 border-gray-300 p-2 w-24">
                              Badge
                            </th>
                            <th className="border-2 border-gray-300 p-2 w-64">
                              Nom
                            </th>
                            <th className="border-2 border-gray-300 p-2 w-24">
                              Type
                            </th>
                            <th className="border-2 border-gray-300 p-2 w-24">
                              {anomalies[0].code_date} (Heures par défaut)
                            </th>
                            <th className="border-2 border-gray-300 p-2 w-24">
                              {anomalies[0].code_date} (Pointages rectifiés)
                            </th>
                            <th className="border-2 border-gray-300 p-2 w-24">
                              {anomalies[0].code_date} (Pointages bruts)
                            </th>
                            <th className="border-2 border-gray-300 p-2 w-64">
                              État
                            </th>
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


