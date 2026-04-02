import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEmployees } from "../../services/employeeService";
import presenceService from "../../services/presenceService";
import anomalieService from "../../services/anomalieService";

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const MOIS_NOMS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];

const getPeriodLabel = (mois, annee) => `${MOIS_NOMS[mois - 1]} ${annee}`;

// ─── Mini bar chart SVG ───────────────────────────────────────────────────────

const BarChart = ({ data, onClick }) => {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const W = 420, H = 140, padL = 8, padR = 8, padB = 28, barGap = 4;
  const barW = (W - padL - padR) / data.length - barGap;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" style={{ fontFamily: "'DM Mono', monospace" }}>
      {data.map((d, i) => {
        const barH = Math.max(4, ((d.value / maxVal) * (H - padB - 12)));
        const x = padL + i * ((W - padL - padR) / data.length) + barGap / 2;
        const y = H - padB - barH;
        return (
          <g key={i} className="cursor-pointer" onClick={() => onClick && onClick(d)}>
            <rect
              x={x} y={y} width={barW} height={barH}
              fill="#56656b" opacity="0.82" rx="2"
              style={{ transition: "opacity 0.15s" }}
              onMouseEnter={(e) => e.target.setAttribute("opacity", "1")}
              onMouseLeave={(e) => e.target.setAttribute("opacity", "0.82")}
            />
            <text
              x={x + barW / 2} y={H - padB + 14}
              textAnchor="middle" fontSize="9" fill="#6b7280"
            >
              {d.label.length > 8 ? d.label.slice(0, 7) + "…" : d.label}
            </text>
            <text
              x={x + barW / 2} y={y - 4}
              textAnchor="middle" fontSize="10" fill="#374151" fontWeight="600"
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Donut Chart SVG ─────────────────────────────────────────────────────────

const DonutChart = ({ corrigees, total }) => {
  const pct = total > 0 ? Math.round((corrigees / total) * 100) : 0;
  const r = 36, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <circle
        cx={cx} cy={cy} r={r} fill="none"
        stroke="#56656b" strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text x="50" y="47" textAnchor="middle" fontSize="16" fontWeight="700" fill="#1f2937">
        {pct}%
      </text>
      <text x="50" y="60" textAnchor="middle" fontSize="8" fill="#6b7280">
        corrigé
      </text>
    </svg>
  );
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, accent, onClick, loading }) => (
  <div
    onClick={onClick}
    className={`bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-1 shadow-sm ${
      onClick ? "cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200" : ""
    }`}
  >
    <div className="flex items-start justify-between">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
      {accent && (
        <span className={`w-2 h-2 rounded-full mt-1 ${accent}`} />
      )}
    </div>
    {loading ? (
      <div className="h-8 w-20 bg-gray-100 rounded animate-pulse mt-1" />
    ) : (
      <p className="text-3xl font-bold text-gray-900 leading-none mt-1">{value ?? "—"}</p>
    )}
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────

const SectionHeader = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{title}</h2>
    {action && (
      <button
        onClick={onAction}
        className="text-xs text-gray-400 hover:text-gray-700 font-medium transition-colors duration-150 underline underline-offset-2"
      >
        {action}
      </button>
    )}
  </div>
);

// ─── Page principale ──────────────────────────────────────────────────────────

const DashboardPage = () => {
  const navigate = useNavigate();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployes: null,
    hommes: null,
    femmes: null,
    totalAnomalies: null,
    anomaliesCorrigees: null,
    anomaliesNonCorrigees: null,
    totalPresences: null,
  });
  const [sectionData, setSectionData] = useState([]);
  const [recentAnomalies, setRecentAnomalies] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [employees, anomaliesData, sectionsData] = await Promise.all([
        getAllEmployees().catch(() => []),
        anomalieService.getAnomalies(currentYear, currentMonth).catch(() => null),
        presenceService.getSections().catch(() => null),
      ]);

      // Employés stats
      const hommes = employees.filter((e) => e.sexe === "Masculin").length;
      const femmes = employees.filter((e) => e.sexe === "Féminin").length;

      // Anomalies stats
      const totalAno = anomaliesData?.statistiques?.total ?? 0;
      const corrigees = anomaliesData?.statistiques?.corrigees ?? 0;
      const nonCorrigees = anomaliesData?.statistiques?.non_corrigees ?? 0;

      // Recent anomalies (last 6)
      const anomaliesList =
        anomaliesData?.anomalies ??
        anomaliesData?.results ??
        anomaliesData?.data ??
        [];
      setRecentAnomalies(anomaliesList.slice(0, 6));

      // Sections bar chart
      if (sectionsData?.sections) {
        const topSections = sectionsData.sections
          .sort((a, b) => b.nb_employes - a.nb_employes)
          .slice(0, 10)
          .map((s) => ({ label: s.nom_section, value: s.nb_employes, section: s.nom_section }));
        setSectionData(topSections);
      }

      setStats({
        totalEmployes: employees.length,
        hommes,
        femmes,
        totalAnomalies: totalAno,
        anomaliesCorrigees: corrigees,
        anomaliesNonCorrigees: nonCorrigees,
        totalPresences: null,
      });
    } catch (err) {
      console.error("Erreur dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const goToAttendance = () =>
    navigate("/attendance", { state: { month: currentMonth, year: currentYear } });

  const goToAnomalies = () =>
    navigate("/anomalies", { state: { month: currentMonth, year: currentYear } });

  const goToEmployees = () => navigate("/employees");

  const pctCorrection =
    stats.totalAnomalies > 0
      ? Math.round((stats.anomaliesCorrigees / stats.totalAnomalies) * 100)
      : 0;

  const getHourLabel = () => {
    const h = now.getHours();
    if (h < 12) return "Bonjour";
    if (h < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}
    >
      {/* ── En-tête ── */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Tableau de Bord
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {getHourLabel()}{username ? `, ${username}` : ""}.
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Synthèse de la période — {getPeriodLabel(currentMonth, currentYear)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">Données en temps réel</span>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Employés actifs"
          value={stats.totalEmployes}
          sub={`${stats.hommes ?? "—"} H · ${stats.femmes ?? "—"} F`}
          accent="bg-blue-400"
          loading={loading}
          onClick={goToEmployees}
        />
        <KpiCard
          label="Anomalies détectées"
          value={stats.totalAnomalies}
          sub={getPeriodLabel(currentMonth, currentYear)}
          accent="bg-red-400"
          loading={loading}
          onClick={goToAnomalies}
        />
        <KpiCard
          label="Corrigées"
          value={stats.anomaliesCorrigees}
          sub={`${pctCorrection}% du total`}
          accent="bg-green-400"
          loading={loading}
          onClick={goToAnomalies}
        />
        <KpiCard
          label="Non corrigées"
          value={stats.anomaliesNonCorrigees}
          sub="Requiert attention"
          accent={stats.anomaliesNonCorrigees > 0 ? "bg-orange-400" : "bg-gray-300"}
          loading={loading}
          onClick={goToAnomalies}
        />
      </div>

      {/* ── Ligne centrale ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Répartition par section */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <SectionHeader
            title="Effectifs par section (top 10)"
            action="Voir tous les employés →"
            onAction={goToEmployees}
          />
          {loading ? (
            <div className="flex items-end gap-2 h-36">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gray-100 rounded animate-pulse"
                  style={{ height: `${30 + Math.random() * 70}%` }}
                />
              ))}
            </div>
          ) : sectionData.length > 0 ? (
            <div className="h-40">
              <BarChart
                data={sectionData}
                onClick={(d) =>
                  navigate("/attendance", {
                    state: { month: currentMonth, year: currentYear, section: d.section },
                  })
                }
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-36 text-gray-300 text-sm">
              Aucune donnée
            </div>
          )}
        </div>

        {/* Taux de correction */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col">
          <SectionHeader
            title="Taux de correction"
            action="Corriger →"
            onAction={goToAnomalies}
          />
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {loading ? (
              <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse" />
            ) : (
              <DonutChart
                corrigees={stats.anomaliesCorrigees ?? 0}
                total={stats.totalAnomalies ?? 0}
              />
            )}
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-akj inline-block" />
                  <span className="text-gray-600">Corrigées</span>
                </div>
                <span className="font-semibold text-gray-800">{stats.anomaliesCorrigees ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200 inline-block" />
                  <span className="text-gray-600">Non corrigées</span>
                </div>
                <span className="font-semibold text-gray-800">{stats.anomaliesNonCorrigees ?? "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ligne inférieure ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Raccourcis */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <SectionHeader title="Accès rapides" />
          <div className="space-y-2">
            {[
              {
                label: "Fiche de présence",
                desc: getPeriodLabel(currentMonth, currentYear),
                color: "bg-slate-600",
                action: goToAttendance,
              },
              {
                label: "Anomalies de pointage",
                desc: `${stats.anomaliesNonCorrigees ?? "—"} non corrigées`,
                color: "bg-amber-600",
                action: goToAnomalies,
              },
              {
                label: "Gestion des employés",
                desc: `${stats.totalEmployes ?? "—"} employés`,
                color: "bg-blue-600",
                action: goToEmployees,
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={item.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-150 text-left group"
              >
                <div className={`w-2 h-8 rounded-full ${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Dernières anomalies */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <SectionHeader
            title="Anomalies récentes"
            action="Voir tout →"
            onAction={goToAnomalies}
          />
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 flex-1 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : recentAnomalies.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Badge</th>
                    <th className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Nom</th>
                    <th className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Section</th>
                    <th className="pb-2 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">État</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAnomalies.map((a, i) => {
                    const stateMap = {
                      pas_entree: { label: "Pas d'entrée", cls: "bg-red-50 text-red-700" },
                      pas_sortie: { label: "Pas de sortie", cls: "bg-orange-50 text-orange-700" },
                      multiples_pointages: { label: "Multiple", cls: "bg-yellow-50 text-yellow-700" },
                      abs: { label: "Absent", cls: "bg-gray-100 text-gray-600" },
                      ok: { label: "Corrigé", cls: "bg-green-50 text-green-700" },
                    };
                    const state = stateMap[a.etat] || { label: a.etat, cls: "bg-gray-100 text-gray-600" };
                    return (
                      <tr
                        key={i}
                        className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={goToAnomalies}
                      >
                        <td className="py-2.5 font-mono text-xs text-gray-500">{a.badgenumber}</td>
                        <td className="py-2.5 font-medium text-gray-800 truncate max-w-[140px]">{a.user_name}</td>
                        <td className="py-2.5 text-xs text-gray-500 truncate max-w-[100px]">{a.section}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${state.cls}`}>
                            {state.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">Aucune anomalie détectée</p>
              <p className="text-xs text-gray-400">Lancez une détection depuis la page Anomalies</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Pied ── */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-300">
          AKANJO — Système de Gestion RH
        </p>
        <p className="text-xs text-gray-300">
          {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;