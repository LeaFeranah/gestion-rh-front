import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  RefreshCw,
  MousePointerClick,
} from "lucide-react";
import presenceService from "../../services/presenceService";
import PageHeader from "../../components/headers/PageHeader";
import AppFooter from "../../components/layout/AppFooter";
import "/src/styles/custom.css";

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

const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, j] = String(d).slice(0, 10).split("-");
  return `${j}/${m}/${y}`;
};

const fmtDateHeure = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Motif déjà terminé par « OK » (saisi dans Access)
const motifFinitParOk = (m) => /ok[\s.!]*$/i.test((m || "").trim());

const fmtDuree = (v) =>
  v === null || v === undefined ? "—" : String(v).replace(".", ",");

const PAGE_SIZE = 50;

const CongesValidesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const st = location.state || {};

  const [annee, setAnnee] = useState(st.year || new Date().getFullYear());
  const [mois, setMois] = useState(st.month || new Date().getMonth() + 1);
  const [toutesPeriodes, setToutesPeriodes] = useState(!!st.toutesPeriodes);

  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [sections, setSections] = useState([]);
  const [section, setSection] = useState("");
  const [statut, setStatut] = useState(st.statut || "");
  // Congé ouvert depuis la notification (un seul congé affiché)
  const [congeId, setCongeId] = useState(st.congeId || null);
  const [congeMatricule, setCongeMatricule] = useState(st.matricule || "");

  // Clic dans la notification alors qu'on est déjà sur cette page
  useEffect(() => {
    if (!location.state) return;
    setCongeId(st.congeId || null);
    setCongeMatricule(st.matricule || "");
    if (!st.congeId) {
      setStatut(st.statut || "");
      setToutesPeriodes(!!st.toutesPeriodes);
      setSearchInput("");
      setSection("");
    }
    setPage("last");
  }, [location.key]); // eslint-disable-line react-hooks/exhaustive-deps

  const afficherTous = () => {
    setCongeId(null);
    setCongeMatricule("");
    setPage("last");
  };
  const [page, setPage] = useState("last"); // "last" = ouvre sur la dernière page (les plus récents)

  const [conges, setConges] = useState([]);
  const [stats, setStats] = useState({ total: 0, valides: 0, non_valides: 0 });
  const [pagination, setPagination] = useState({ total: 0, total_pages: 0 });
  const [derniereSynchro, setDerniereSynchro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(searchInput.trim());
      if (searchInput.trim()) setCongeId(null);
      setPage("last");
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    presenceService
      .getSections()
      .then((d) => setSections(d.sections || []))
      .catch(() => {});
  }, []);

  const fetchConges = useCallback(async () => {
    setLoading(true);
    try {
      const d = await presenceService.getCongesValides(
        congeId
          ? { congeId, page: 1, pageSize: PAGE_SIZE }
          : {
              annee: toutesPeriodes ? null : annee,
              mois: toutesPeriodes ? null : mois,
              q,
              section,
              statut,
              page,
              pageSize: PAGE_SIZE,
            },
      );
      setConges(d.conges || []);
      setStats(d.statistiques || { total: 0, valides: 0, non_valides: 0 });
      setPagination(d.pagination || { total: 0, total_pages: 0 });
      setDerniereSynchro(d.derniere_synchro);
    } catch (err) {
      console.error("Erreur congés validés:", err);
      alert("Erreur lors du chargement des congés validés : " + err.message);
    } finally {
      setLoading(false);
    }
  }, [annee, mois, toutesPeriodes, q, section, statut, page, congeId]);

  useEffect(() => {
    fetchConges();
  }, [fetchConges]);

  // Case « Validé »
  const toggleValide = async (conge) => {
    const nouveau = !conge.valide;
    setSavingId(conge.id);
    setConges((prev) =>
      prev.map((c) => (c.id === conge.id ? { ...c, valide: nouveau } : c)),
    );
    try {
      const r = await presenceService.validerConge(conge.id, nouveau);
      setConges((prev) =>
        prev.map((c) => (c.id === conge.id ? { ...c, ...r } : c)),
      );
      setStats((s) => ({
        ...s,
        valides: s.valides + (nouveau ? 1 : -1),
        non_valides: s.non_valides + (nouveau ? -1 : 1),
      }));
      // Met à jour tout de suite le compteur de la cloche
      window.dispatchEvent(new Event("conges-maj"));
    } catch (err) {
      setConges((prev) =>
        prev.map((c) => (c.id === conge.id ? { ...c, valide: !nouveau } : c)),
      );
      const status = err.response?.status;
      alert(
        status === 401 || status === 403
          ? "Vous devez être connecté pour valider un congé."
          : "Erreur lors de la validation : " +
              (err.response?.data?.error || err.message),
      );
    } finally {
      setSavingId(null);
    }
  };

  // Synchro Access → PostgreSQL
  const synchroniser = async () => {
    setSyncing(true);
    try {
      const r = await presenceService.synchroniserConges();
      alert(
        `Synchronisation Access terminée\n` +
          `${r.crees} nouveau(x), ${r.mises_a_jour} mis à jour, ${r.supprimees} supprimé(s)` +
          (r.auto_valides ? `\n${r.auto_valides} validé(s) automatiquement (motif OK)` : ""),
      );
      fetchConges();
      window.dispatchEvent(new Event("conges-maj"));
    } catch (err) {
      alert((err.response?.data?.error || err.message));
    } finally {
      setSyncing(false);
    }
  };

  // Double-clic → présence principale du matricule
  const ouvrirPresence = (c) => {
    const autrePeriode = toutesPeriodes || congeId;
    const year = autrePeriode ? c.periode_annee : annee;
    const month = autrePeriode ? c.periode_mois : mois;
    navigate("/attendance", {
      state: { year, month, matricule: c.matricule, nom: c.nom },
    });
  };

  const periodeLabel = congeId
    ? `Congé du matricule ${congeMatricule || ""}`.trim()
    : toutesPeriodes
      ? "Toutes les périodes"
      : `${MOIS_FR[mois - 1]} ${annee}`;

  const selectCls =
    "px-3 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <button
        onClick={() =>
          navigate("/attendance", { state: { month: mois, year: annee } })
        }
        className="flex items-center gap-1.5 px-2.5 py-1 bg-akj text-sm text-white rounded-md"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button> */}

      <PageHeader
        pageTag="Présence"
        title="Congés validés"
        subtitle={`Congés importés de la base Access — ${periodeLabel}`}
        kpis={[
          { label: "Congés", value: stats.total, sub: periodeLabel },
          { label: "Validés", value: stats.valides, dotColor: "#16a34a" },
          { label: "À valider", value: stats.non_valides, dotColor: "#f59e0b" },
          {
            label: "Dernière synchro Access",
            value: derniereSynchro
              ? fmtDateHeure(derniereSynchro).split(" ")[0]
              : "—",
            sub: derniereSynchro
              ? fmtDateHeure(derniereSynchro)
              : "Jamais synchronisé",
          },
        ]}
      />

      {/* Barre de contrôle */}
      <div className="bg-white border border-gray-200 rounded-xl mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                navigate("/attendance", { state: { month: mois, year: annee } })
              }
              className="flex items-center gap-1.5 px-2.5 py-1 bg-akj text-sm text-white rounded-md"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            <select
              value={mois}
              disabled={toutesPeriodes}
              onChange={(e) => {
                setMois(+e.target.value);
                setCongeId(null);
                setPage("last");
              }}
              className={`${selectCls} disabled:opacity-50`}
            >
              {MOIS_FR.map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={annee}
              disabled={toutesPeriodes}
              onChange={(e) => {
                setAnnee(+e.target.value);
                setCongeId(null);
                setPage("last");
              }}
              className={`${selectCls} disabled:opacity-50`}
            >
              {[...Array(11)].map((_, i) => {
                const y = 2020 + i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
            <label className="flex items-center gap-1.5 text-sm text-gray-600 ml-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={toutesPeriodes}
                onChange={(e) => {
                  setToutesPeriodes(e.target.checked);
                  setCongeId(null);
                setPage("last");
                }}
                className="accent-gray-700"
              />
              Toutes les périodes
            </label>
          </div>

          <button
            onClick={synchroniser}
            disabled={syncing}
            title="Copier tout de suite les nouveaux congés d'Access vers PostgreSQL"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-akj text-white rounded-md hover:opacity-90 disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Synchronisation…" : "Synchroniser"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center px-6 pb-3.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Matricule ou nom..."
              className="pl-9 pr-8 py-1 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 w-56"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={section}
            onChange={(e) => {
              setSection(e.target.value);
              setCongeId(null);
                setPage("last");
            }}
            className={selectCls}
          >
            <option value="">Toutes les sections</option>
            {sections.map((s) => (
              <option key={s.section_id ?? s.nom_section} value={s.nom_section}>
                {s.nom_section}
              </option>
            ))}
          </select>

          <select
            value={statut}
            onChange={(e) => {
              setStatut(e.target.value);
              setCongeId(null);
                setPage("last");
            }}
            className={selectCls}
          >
            <option value="">Tous les statuts</option>
            <option value="valide">Validés</option>
            <option value="non_valide">À valider</option>
            <option value="nouveau">Nouveaux à valider</option>
          </select>

          {/* <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
            <MousePointerClick className="w-3.5 h-3.5" />
            Double-cliquez sur une ligne pour ouvrir la présence de l'employé
          </span> */}
        </div>
      </div>

      {congeId && (
        <div className="flex items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-6 py-2.5 mb-4 text-sm text-gray-700">
          <span>
            Congé du matricule{" "}
            <span className="font-semibold">{congeMatricule}</span>
          </span>
          <button
            onClick={afficherTous}
            className="px-3 py-1 text-sm text-white bg-akj rounded-md"
          >
            Voir tous
          </button>
        </div>
      )}

      {/* Tableau (en-têtes comme la page Anomalies) */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-auto max-h-[calc(100vh-380px)]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-gray-100 bg-gray-200">
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Matricule
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Fonction
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Section
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Validation
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Départ
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Retour
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Durée
              </th>
              <th className="px-4 py-3 text-center text-sm font-bold uppercase tracking-wider">
                Validé
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wider">
                Motif
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && conges.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-gray-400"
                >
                  Chargement…
                </td>
              </tr>
            )}
            {!loading && conges.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  Aucun congé validé pour cette sélection.
                </td>
              </tr>
            )}
            {conges.map((c, index) => (
              <tr
                key={c.id}
                onDoubleClick={() => ouvrirPresence(c)}
                title={`Double-clic : présence de ${c.matricule}`}
                className={`hover:bg-gray-50 transition-colors cursor-pointer select-none ${
                  loading ? "opacity-60" : ""
                }`}
              >
                <td className="px-4 py-3 text-sm text-gray-500 align-top tabular-nums">
                  {((pagination.page || 1) - 1) * PAGE_SIZE + index + 1}
                </td>
                <td className="px-4 py-3 text-sm align-top">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    {c.matricule}
                    {c.nouveau && !c.valide && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-red-100 text-red-700 border border-red-200">
                        Nouveau
                      </span>
                    )}
                  </div>
                  {c.nom && (
                    <div className="text-sm text-gray-500">{c.nom}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 align-top">
                  {c.fonction || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 align-top">
                  {c.section || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 align-top whitespace-nowrap">
                  {fmtDate(c.date_validation)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 align-top whitespace-nowrap">
                  <div>{fmtDate(c.date_depart)}</div>
                  {c.heure_depart && (
                    <div className="text-sm text-gray-500">
                      {c.heure_depart}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 align-top whitespace-nowrap">
                  <div>{fmtDate(c.date_retour)}</div>
                  {c.heure_retour && (
                    <div className="text-xs text-gray-500">
                      {c.heure_retour}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 align-top">
                  {fmtDuree(c.duree)}
                </td>
                <td
                  className="px-4 py-3 text-center align-top"
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={!!c.valide}
                    disabled={savingId === c.id}
                    onChange={() => toggleValide(c)}
                    title={
                      c.valide && c.valide_par
                        ? `Validé par ${c.valide_par} le ${fmtDateHeure(c.valide_le)}`
                        : "Cocher pour valider"
                    }
                    className="w-4 h-4 accent-green-600 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 align-top max-w-[260px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate" title={c.motif || ""}>
                      {c.motif || "—"}
                    </span>
                    {c.valide && !motifFinitParOk(c.motif) && (
                      <span className="shrink-0 font-semibold text-green-600">
                        OK
                      </span>
                    )}
                  </div>
                  {/* {c.type_absence && (
                    <div className="text-xs text-gray-400">
                      {c.type_absence}
                    </div>
                  )} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-end gap-4 mt-4">
          <button
            onClick={() => setPage(Math.max(1, pagination.page - 1))}
            disabled={!pagination.has_previous}
            className="flex items-center gap-1 px-3 py-0.5 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" /> Précédent
          </button>
          <span className="text-sm">
            Page {pagination.page} / {pagination.total_pages}
          </span>
          <button
            onClick={() => setPage(pagination.page + 1)}
            disabled={!pagination.has_next}
            className="flex items-center gap-1 px-3 py-0.5 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <AppFooter />
    </div>
  );
};

export default CongesValidesPage;