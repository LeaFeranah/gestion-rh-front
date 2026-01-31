import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings,
  Edit2,
  Plus,
  Save,
  X,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import presenceService from "../../services/presenceService";
import { useReactToPrint } from "react-to-print";
import "/src/styles/custom.css";

// Utilitaires pour conversion heures
const decimalToTime = (decimal) => {
  if (!decimal && decimal !== 0) return "00:00";

  const decimalNum = parseFloat(decimal);
  const hours = Math.floor(decimalNum);
  const minutes = Math.round((decimalNum - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const formatDate = (dateStr) => {
  if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error("❌ Date invalide:", dateStr);
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Couleurs pour les types d'événements
const getEvenementColor = (type) => {
  const colors = {
    X: "bg-green-50 text-green-700",
    RM: "bg-blue-50 text-blue-700",
    HP: "bg-purple-50 text-purple-700",
    RC: "bg-yellow-50 text-yellow-700",
    ANO: "bg-gray-50 text-gray-700",
    CP: "bg-teal-50 text-teal-700",
    EF: "bg-pink-50 text-pink-700",
    F: "bg-indigo-50 text-indigo-700",
    PS: "bg-orange-50 text-orange-700",
    A: "bg-red-50 text-red-700",
  };
  return colors[type] || "bg-gray-50 text-gray-700";
};

const getEvenementTextColor = (type) => {
  const textColors = {
    X: "text-green-700",
    RM: "text-blue-700",
    HP: "text-purple-700",
    RC: "text-yellow-700",
    ANO: "text-gray-700",
    CP: "text-teal-700",
    EF: "text-pink-700",
    F: "text-indigo-700",
    PS: "text-orange-700",
    A: "text-red-700",
  };
  return textColors[type] || "text-gray-700";
};

// Modal de gestion des horaires
const HoraireModal = ({ horaire, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    section: horaire?.section || "",
    heure_entree: horaire ? decimalToTime(horaire.heure_entree) : "07:30",
    heure_sortie: horaire ? decimalToTime(horaire.heure_sortie) : "17:50",
    sortie_samedi: horaire ? decimalToTime(horaire.sortie_samedi) : "15:30",
    sortie_vendredi_paiement: horaire
      ? decimalToTime(horaire.sortie_vendredi_paiement)
      : "17:33",
    sortie_samedi_paiement: horaire
      ? decimalToTime(horaire.sortie_samedi_paiement)
      : "13:00",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!formData.section) {
      alert("Veuillez entrer un nom de section");
      return;
    }

    setSaving(true);
    try {
      const data = {
        section: formData.section,
        heure_entree: parseFloat(formData.heure_entree.replace(":", ".")),
        heure_sortie: parseFloat(formData.heure_sortie.replace(":", ".")),
        sortie_samedi: parseFloat(formData.sortie_samedi.replace(":", ".")),
        sortie_vendredi_paiement: parseFloat(
          formData.sortie_vendredi_paiement.replace(":", "."),
        ),
        sortie_samedi_paiement: parseFloat(
          formData.sortie_samedi_paiement.replace(":", "."),
        ),
      };
      await onSave(data);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800">
          <h3 className="text-xl font-bold">
            {horaire ? "Modifier" : "Ajouter"} un horaire
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Section *</label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) =>
                setFormData({ ...formData, section: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
              disabled={!!horaire}
              placeholder="Ex: BRODERIE MAIN DEV"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Heure d'entrée *
            </label>
            <input
              type="time"
              value={formData.heure_entree}
              onChange={(e) =>
                setFormData({ ...formData, heure_entree: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Heure de sortie (lundi-ven normal) *
            </label>
            <input
              type="time"
              value={formData.heure_sortie}
              onChange={(e) =>
                setFormData({ ...formData, heure_sortie: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Sortie samedi normal *
            </label>
            <input
              type="time"
              value={formData.sortie_samedi}
              onChange={(e) =>
                setFormData({ ...formData, sortie_samedi: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
          </div>

          <div className="border-t-2 border-gray-300 pt-4">
            <h4 className="font-bold text-gray-700 mb-3">
              Horaires pour jours de paiement (P)
            </h4>

            <div className="mb-3">
              <label className="block text-sm font-bold mb-1">
                Sortie vendredi de paiement *
              </label>
              <input
                type="time"
                value={formData.sortie_vendredi_paiement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortie_vendredi_paiement: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-yellow-600"
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-bold mb-1">
                Sortie samedi de paiement *
              </label>
              <input
                type="time"
                value={formData.sortie_samedi_paiement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortie_samedi_paiement: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-yellow-600"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {saving ? (
                "Enregistrement..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal de gestion des événements
const EvenementModal = ({
  evenement,
  onClose,
  onSave,
  onDelete,
  typesEvenement,
}) => {
  const [formData, setFormData] = useState({
    type_evenement: evenement?.type_evenement || "X",
    commentaire: evenement?.commentaire || "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.type_evenement) {
      alert("Veuillez sélectionner un type d'événement");
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Voulez-vous supprimer cet événement ?\n\nL'événement sera réinitialisé à 'X' (Travail normal).",
      )
    ) {
      setDeleting(true);
      try {
        await onDelete();
        onClose();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression de l'événement");
      } finally {
        setDeleting(false);
      }
    }
  };

  const canDelete = evenement && evenement.type_evenement !== "X";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800">
          <h3 className="text-xl font-bold">
            {evenement ? "Modifier" : "Ajouter"} un événement
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold">Employé:</span>
                <div className="mt-1">{evenement?.name}</div>
              </div>
              <div>
                <span className="font-bold">Badge:</span>
                <div className="mt-1">{evenement?.badgenumber}</div>
              </div>
              <div className="col-span-2">
                <span className="font-bold">Date:</span>
                <div className="mt-1">{evenement?.date}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Type d'événement *
            </label>
            <select
              value={formData.type_evenement}
              onChange={(e) =>
                setFormData({ ...formData, type_evenement: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            >
              {typesEvenement.map((type) => (
                <option key={type.code} value={type.code}>
                  {type.libelle} ({type.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Commentaire (optionnel)
            </label>
            <textarea
              value={formData.commentaire}
              onChange={(e) =>
                setFormData({ ...formData, commentaire: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
              rows="2"
              placeholder="Commentaire facultatif..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={saving || deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  "Suppression..."
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50"
              disabled={saving || deleting}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || deleting}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {saving ? (
                "Enregistrement..."
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [presences, setPresences] = useState([]);
  const [periode, setPeriode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'état de navigation une seule fois
  const locationState = React.useMemo(
    () => location.state || {},
    [location.state],
  );

  // Initialiser avec l'état de navigation si disponible, sinon date actuelle
  const getInitialMonth = () => {
    if (locationState.month && locationState.returnFromAnomalies) {
      return locationState.month;
    }
    return new Date().getMonth() + 1;
  };

  const getInitialYear = () => {
    if (locationState.year && locationState.returnFromAnomalies) {
      return locationState.year;
    }
    return new Date().getFullYear();
  };

  // États pour les filtres
  const [currentMonth, setCurrentMonth] = useState(getInitialMonth());
  const [currentYear, setCurrentYear] = useState(getInitialYear());
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth());
  const [selectedYear, setSelectedYear] = useState(getInitialYear());
  const [filterChanged, setFilterChanged] = useState(false);

  const [dates, setDates] = useState([]);
  const [showHoraires, setShowHoraires] = useState(false);
  const [horaires, setHoraires] = useState([]);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showHoraireModal, setShowHoraireModal] = useState(false);
  const [modeHeures, setModeHeures] = useState("rectifiees");
  const [forceRefresh, setForceRefresh] = useState(0);

  const [typesEvenement, setTypesEvenement] = useState([]);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [showEvenementModal, setShowEvenementModal] = useState(false);
  const [evenementsMap, setEvenementsMap] = useState({});

  const componentRef = useRef();

  // Nettoyer le state de navigation après l'avoir utilisé
  useEffect(() => {
    // Utiliser une référence stable pour locationState
    const state = locationState;

    if (state.returnFromAnomalies) {
      // Effacer le state pour éviter qu'il persiste
      window.history.replaceState({}, document.title);

      // Si le mois/année dans l'état est différent de ce qui est déjà affiché
      if (state.month !== currentMonth || state.year !== currentYear) {
        setCurrentMonth(state.month);
        setCurrentYear(state.year);
        setSelectedMonth(state.month);
        setSelectedYear(state.year);
        setFilterChanged(false);

        // Rafraîchir les données immédiatement
        refreshData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    locationState.returnFromAnomalies,
    locationState.month,
    locationState.year,
  ]);

  // Gestionnaires de changement de filtre
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setFilterChanged(month !== currentMonth || selectedYear !== currentYear);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setFilterChanged(selectedMonth !== currentMonth || year !== currentYear);
  };

  const applyFilters = () => {
    setCurrentMonth(selectedMonth);
    setCurrentYear(selectedYear);
    setFilterChanged(false);
    refreshData();
  };

  // Fonction pour rafraîchir les données
  const refreshData = useCallback(() => {
    setForceRefresh((prev) => prev + 1);
  }, []);

  // Gestionnaire F5 pour actualiser
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F5") {
        e.preventDefault();
        refreshData();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [refreshData]);

  const fetchEvenementsMois = useCallback(async (annee, mois) => {
    try {
      const evenementsData = await presenceService.getEvenements(annee, mois);

      const newEvenementsMap = {};

      if (evenementsData.evenements && evenementsData.evenements.length > 0) {
        evenementsData.evenements.forEach((e) => {
          const dateFormatted = formatDate(e.date);
          if (dateFormatted) {
            const key = `${e.userid}-${dateFormatted}`;
            newEvenementsMap[key] = e.type_evenement;
          }
        });

        setEvenementsMap(newEvenementsMap);
      }
    } catch (err) {
      console.error("Erreur chargement événements:", err);
    }
  }, []);

  const fetchPresences = useCallback(
    async (annee, mois) => {
      try {
        setLoading(true);
        console.log(`🔄 Chargement des présences pour ${mois}/${annee}`);

        try {
          await presenceService.genererDates(annee, mois);
        } catch (err) {
          console.log(
            "ℹ️ Génération des dates déjà effectuée ou erreur:",
            err.message,
          );
        }

        const datesData = await presenceService.getDates(annee, mois);
        setDates(datesData);

        const presencesData = await presenceService.getPresencesMoisCalculee(
          annee,
          mois,
          false,
        );
        console.log("📊 Données reçues:", {
          periode: presencesData.periode,
          nombrePresences: presencesData.presences?.length,
          statistiques: presencesData.statistiques,
        });

        setPeriode(presencesData.periode);
        setPresences(presencesData.presences || []);

        await fetchEvenementsMois(annee, mois);
      } catch (err) {
        console.error("❌ Erreur lors du chargement:", err);
        alert("Erreur lors du chargement des présences: " + err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchEvenementsMois],
  );

  const fetchTypesEvenements = useCallback(async () => {
    try {
      const data = await presenceService.getTypesEvenements();
      setTypesEvenement(data.types_evenements);
    } catch (err) {
      console.error("Erreur lors du chargement des types d'événements:", err);
    }
  }, []);

  const fetchHoraires = useCallback(async () => {
    try {
      const horairesData = await presenceService.getHorairesSection();
      setHoraires(horairesData.horaires);
    } catch (err) {
      console.error("Erreur:", err);
    }
  }, []);

  const handleEvenementClick = useCallback(
    (employee, dateStr, attendance) => {
      const dateFormatted = formatDate(dateStr);

      if (!dateFormatted) {
        console.error("❌ Date invalide:", dateStr);
        return;
      }

      const key = `${employee.userid}-${dateFormatted}`;
      const currentEvenement = evenementsMap[key] || "X";

      const evenementData = {
        userid: employee.userid,
        badgenumber: employee.badgenumber,
        name: employee.name,
        date: dateFormatted,
        type_evenement: currentEvenement,
        commentaire: "",
        attendance: attendance,
      };
      setSelectedEvenement(evenementData);
      setShowEvenementModal(true);
    },
    [evenementsMap],
  );

  const handleSaveEvenement = useCallback(
    async (formData) => {
      try {
        const { userid, date } = selectedEvenement;

        await presenceService.updateEvenementByUserDate(
          userid,
          date,
          formData.type_evenement,
          formData.commentaire || "",
        );

        const key = `${userid}-${date}`;
        setEvenementsMap((prev) => ({
          ...prev,
          [key]: formData.type_evenement,
        }));

        await fetchEvenementsMois(currentYear, currentMonth);

        setShowEvenementModal(false);
        setSelectedEvenement(null);

        console.log("✅ Événement mis à jour");

        // Rafraîchir les données après modification
        refreshData();
      } catch (err) {
        console.error("❌ Erreur lors de la sauvegarde:", err);
        alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
      }
    },
    [
      selectedEvenement,
      currentYear,
      currentMonth,
      fetchEvenementsMois,
      refreshData,
    ],
  );

  const handleDeleteEvenement = useCallback(async () => {
    try {
      const { userid, date } = selectedEvenement;

      await presenceService.deleteEvenementByUserDate(userid, date);

      const key = `${userid}-${date}`;
      setEvenementsMap((prev) => ({
        ...prev,
        [key]: "X",
      }));

      alert("Événement supprimé avec succès !");

      await fetchEvenementsMois(currentYear, currentMonth);

      setShowEvenementModal(false);
      setSelectedEvenement(null);

      // Rafraîchir les données après suppression
      refreshData();
    } catch (err) {
      console.error("❌ Erreur lors de la suppression:", err);
      alert(
        "Erreur lors de la suppression de l'événement. Veuillez réessayer.",
      );
    }
  }, [
    selectedEvenement,
    currentYear,
    currentMonth,
    fetchEvenementsMois,
    refreshData,
  ]);

  const handleSaveHoraire = useCallback(
    async (data) => {
      try {
        if (selectedHoraire) {
          const result = await presenceService.updateHoraireSection(
            selectedHoraire.section,
            data,
          );
          console.log("✅ Horaire mis à jour:", result);
        } else {
          const result = await presenceService.createHoraireSection(data);
          console.log("✅ Horaire créé:", result);
        }

        setShowHoraireModal(false);
        setSelectedHoraire(null);
        await fetchHoraires();

        alert("Horaire enregistré avec succès !");

        // Rafraîchir les données après modification
        refreshData();
      } catch (err) {
        console.error(
          "❌ Erreur détaillée lors de la sauvegarde de l'horaire:",
          err,
        );
        alert(
          `Erreur lors de la sauvegarde: ${err.response?.data?.message || err.message}`,
        );
      }
    },
    [selectedHoraire, fetchHoraires, refreshData],
  );

  // FONCTION POUR DETERMINER LES HEURES A AFFICHER
  const getHeuresAffichees = useCallback(
    (attendance) => {
      let heureEntreeAffichee = "";
      let heureSortieAffichee = "";

      if (!attendance) {
        return { heureEntreeAffichee: "", heureSortieAffichee: "" };
      }

      if (modeHeures === "brutes") {
        // MODE "HEURES BRUTES" : TOUJOURS afficher les heures brutes
        if (attendance.est_anomalie_corrigee) {
          // Pour les anomalies corrigées, afficher les heures brutes
          heureEntreeAffichee = attendance.heure_brute_entree
            ? attendance.heure_brute_entree.slice(0, 5)
            : "";
          heureSortieAffichee = attendance.heure_brute_sortie
            ? attendance.heure_brute_sortie.slice(0, 5)
            : "";
        } else {
          // Pour les autres, afficher les heures réelles (brutes)
          heureEntreeAffichee = attendance.heure_entree_reelle
            ? attendance.heure_entree_reelle.slice(0, 5)
            : "";
          heureSortieAffichee = attendance.heure_sortie_reelle
            ? attendance.heure_sortie_reelle.slice(0, 5)
            : "";
        }
      } else {
        // MODE "HEURES RECTIFIÉES" : TOUJOURS afficher les heures après traitement
        if (attendance.est_anomalie_corrigee) {
          // Pour les anomalies corrigées, afficher les heures rectifiées
          heureEntreeAffichee = attendance.heure_entree_rectifiee
            ? attendance.heure_entree_rectifiee.slice(0, 5)
            : "";
          heureSortieAffichee = attendance.heure_sortie_rectifiee
            ? attendance.heure_sortie_rectifiee.slice(0, 5)
            : "";
        } else {
          // Pour les autres, afficher les heures comptabilisées
          heureEntreeAffichee = attendance.heure_entree_comptabilisee
            ? attendance.heure_entree_comptabilisee.slice(0, 5)
            : "";
          heureSortieAffichee = attendance.heure_sortie_comptabilisee
            ? attendance.heure_sortie_comptabilisee.slice(0, 5)
            : "";
        }
      }

      return {
        heureEntreeAffichee,
        heureSortieAffichee,
      };
    },
    [modeHeures],
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPresences(currentYear, currentMonth);
    fetchTypesEvenements();
    fetchHoraires();
  }, [
    currentYear,
    currentMonth,
    forceRefresh,
    fetchPresences,
    fetchTypesEvenements,
    fetchHoraires,
  ]);

  const getEmployeeData = useCallback(() => {
    const employees = {};
    presences.forEach((presence) => {
      if (!employees[presence.userid]) {
        employees[presence.userid] = {
          userid: presence.userid,
          badgenumber: presence.badgenumber,
          name: presence.name,
          section: presence.section || "ADMINISTRATION",
          presences: {},
        };
      }
      const dateFormatted = formatDate(presence.date);
      if (dateFormatted) {
        employees[presence.userid].presences[dateFormatted] = presence;
      }
    });
    return Object.values(employees);
  }, [presences]);

  const getAttendanceData = useCallback((employee, dateStr) => {
    const dateFormatted = formatDate(dateStr);
    if (!dateFormatted) return null;

    return employee.presences[dateFormatted] || null;
  }, []);

  const getEvenementForCell = useCallback(
    (userId, dateStr) => {
      const dateFormatted = formatDate(dateStr);
      if (!dateFormatted) return "X";

      const key = `${userId}-${dateFormatted}`;
      return evenementsMap[key] || "X";
    },
    [evenementsMap],
  );

  const groupDatesByWeek = useCallback(() => {
    const weeks = {};

    const datesDansPeriode = dates.filter((date) => !date.hors_periode);

    datesDansPeriode.forEach((date) => {
      if (date.code_date && date.code_date.length > 0) {
        const semaine = date.code_date[0];

        if (!weeks[semaine]) {
          weeks[semaine] = [];
        }
        weeks[semaine].push(date);
      }
    });

    return weeks;
  }, [dates]);

  const getMonthAbbreviation = useCallback((dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const monthNames = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Jun",
      "Jul",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    return monthNames[date.getMonth()];
  }, []);

  const getCellBackgroundColor = useCallback((attendance) => {
    if (!attendance) return "transparent";

    if (attendance.est_jour_paiement) {
      return "bg-yellow-50";
    }

    if (attendance.est_samedi) {
      return "bg-gray-50";
    }

    return "transparent";
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Fiche_Presence_${periode?.mois}_${periode?.annee}`,
  });

  const employees = getEmployeeData();
  const weeks = groupDatesByWeek();
  const weekNumbers = Object.keys(weeks).sort((a, b) => {
    return parseInt(a) - parseInt(b);
  });

  const datesValides = dates.filter((dateObj) => !dateObj.hors_periode);

  const getVariableGroups = (array) => {
    if (!array || array.length === 0) return [];

    const groups = [];

    const firstGroup = array.slice(0, 7);
    groups.push(firstGroup);

    const remainingEmployees = array.slice(7);
    for (let i = 0; i < remainingEmployees.length; i += 10) {
      groups.push(remainingEmployees.slice(i, i + 10));
    }

    return groups;
  };

  const employeeGroups = getVariableGroups(employees);

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des présences...</p>
      </div>
    );
  }

  if (showHoraires) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="bg-white border-2 border-gray-800 mb-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gray-800 text-white px-6 py-3 font-bold text-lg">
                AKANJO
              </div>
              <h1 className="text-2xl font-bold uppercase">
                GESTION DES HORAIRES
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowHoraires(false)}
                className="px-4 py-2 border-2 border-gray-800 rounded hover:bg-gray-100"
              >
                ← Retour aux présences
              </button>
              <button
                onClick={() => {
                  setSelectedHoraire(null);
                  setShowHoraireModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
                Nouveau horaire
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-800 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-2 border-gray-800 p-3 text-left font-bold">
                  SECTION
                </th>
                <th className="border-2 border-gray-800 p-3 font-bold">
                  HEURE ENTRÉE
                </th>
                <th className="border-2 border-gray-800 p-3 font-bold">
                  SORTIE NORMALE
                </th>
                <th className="border-2 border-gray-800 p-3 font-bold">
                  SORTIE SAMEDI NORMAL
                </th>
                <th className="border-2 border-gray-800 p-3 font-bold">
                  SORTIE VENDREDI P
                </th>
                <th className="border-2 border-gray-800 p-3 font-bold">
                  SORTIE SAMEDI P
                </th>
                <th className="border-2 border-gray-800 p-3 font-bold">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {horaires.map((horaire, idx) => (
                <tr key={idx} className="border-b-2 border-gray-800">
                  <td className="border-2 border-gray-800 p-3 font-semibold">
                    {horaire.section}
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {decimalToTime(horaire.heure_entree)}
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {decimalToTime(horaire.heure_sortie)}
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {decimalToTime(horaire.sortie_samedi)}
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {decimalToTime(horaire.sortie_vendredi_paiement)}
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {decimalToTime(horaire.sortie_samedi_paiement)}
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedHoraire(horaire);
                        setShowHoraireModal(true);
                      }}
                      className="p-2 border-2 border-gray-800 rounded hover:bg-gray-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showHoraireModal && (
          <HoraireModal
            horaire={selectedHoraire}
            onClose={() => {
              setShowHoraireModal(false);
              setSelectedHoraire(null);
            }}
            onSave={handleSaveHoraire}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div ref={componentRef} className="print-container">
        <div className="bg-white border-2 border-gray-800 mb-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-akj text-white px-6 py-3 font-bold text-lg">
                AKANJO
              </div>
              <h1 className="text-2xl font-bold uppercase">
                FICHE DE PRESENCE:
              </h1>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-3">
                {periode?.mois} {periode?.annee}
              </h2>
              <div className="flex items-center gap-3 print:hidden">
                <div className="flex flex-col">
                  <label className="block text-xs text-gray-600 mb-1">
                    Mois
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) =>
                      handleMonthChange(parseInt(e.target.value))
                    }
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-gray-500 text-sm"
                  >
                    <option value={1}>Janvier</option>
                    <option value={2}>Février</option>
                    <option value={3}>Mars</option>
                    <option value={4}>Avril</option>
                    <option value={5}>Mai</option>
                    <option value={6}>Juin</option>
                    <option value={7}>Juillet</option>
                    <option value={8}>Août</option>
                    <option value={9}>Septembre</option>
                    <option value={10}>Octobre</option>
                    <option value={11}>Novembre</option>
                    <option value={12}>Décembre</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs text-gray-600 mb-1">
                    Année
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
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

                {/* Bouton Appliquer */}
                {filterChanged && (
                  <button
                    onClick={applyFilters}
                    className="flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded mt-5"
                    title="Appliquer les filtres"
                  >
                    Appliquer
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
            <div>
              <span className="font-bold italic">SECTION:</span>
              <span className="ml-4 font-semibold">
                {employees.length > 0 && employees[0].section
                  ? employees[0].section
                  : "ADMINISTRATION"}
              </span>
            </div>
            <div className="print:text-right">
              <span className="font-bold italic">Période du:</span>
              <span className="ml-2">{periode?.du}</span>
              <span className="mx-2 font-bold">au:</span>
              <span>{periode?.au}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 border-t-2 border-gray-800 pt-4 print:hidden">
            <button
              onClick={() => setShowHoraires(true)}
              className="flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              Gérer les horaires
            </button>

            {/* <button
              onClick={() => navigate("/anomalies")}
              className="flex items-center gap-2 px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              <AlertCircle className="w-4 h-4" />
              Anomalies
            </button> */}
            <button
              onClick={() =>
                navigate("/anomalies", {
                  state: {
                    month: currentMonth,
                    year: currentYear,
                  },
                })
              }
              className="flex items-center gap-2 px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              <AlertCircle className="w-4 h-4" />
              Anomalies
            </button>

            <button
              onClick={() => setModeHeures("brutes")}
              className={`flex items-center gap-2 px-4 py-1 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-gray-800 ${
                modeHeures === "brutes"
                  ? "border-gray-400 bg-gray-50 text-gray-700 font-semibold"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Heures Brutes
            </button>

            <button
              onClick={() => setModeHeures("rectifiees")}
              className={`flex items-center gap-2 px-4 py-1 text-sm rounded border focus:outline-none focus:ring-1 focus:ring-gray-800 ${
                modeHeures === "rectifiees"
                  ? "border-gray-400 bg-gray-50 text-gray-700 font-semibold"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Heures Rectifiées
            </button>

            <button
              onClick={() => handlePrint()}
              className="ml-auto flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded hover:bg-gray-700"
            >
              Imprimer la fiche
            </button>
          </div>

          <div className="mt-4 border-t-2 border-gray-800 pt-4 print:hidden">
            <div className="text-sm font-bold mb-2">
              Légende des événements:
            </div>
            <div className="flex flex-wrap gap-2">
              {typesEvenement.map((type) => (
                <div
                  key={type.code}
                  className={`px-3 py-1 rounded text-xs font-medium ${getEvenementColor(type.code)}`}
                >
                  {type.code}: {type.libelle}
                </div>
              ))}
            </div>
          </div>
        </div>

        {employeeGroups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="bg-white border-x-2 border-b-2 border-gray-800 overflow-x-auto print:overflow-visible"
            style={{
              pageBreakAfter: "always",
              borderTop: groupIdx === 0 ? "none" : "2px solid #1f2937",
              marginTop: groupIdx === 0 ? "0" : "20px",
            }}
          >
            <table className="w-full border-collapse text-xs print:text-[7.5pt] print:table-fixed">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10 print:w-[150px]"
                    rowSpan="4"
                  >
                    <div className="font-bold text-sm w-32">N° / NOM</div>
                  </th>
                  {weekNumbers.map((weekNum) => (
                    <th
                      key={weekNum}
                      colSpan={weeks[weekNum].length}
                      className="border border-gray-600 p-1 font-bold"
                    >
                      Semaine {weekNum}
                    </th>
                  ))}
                </tr>

                <tr className="bg-gray-100">
                  {datesValides.map((date, idx) => (
                    <th
                      key={idx}
                      className="border border-gray-600 p-1 min-w-10"
                    >
                      <div className="font-bold">{date.code_affichage}</div>
                    </th>
                  ))}
                </tr>

                <tr className="bg-gray-100">
                  {datesValides.map((date, idx) => (
                    <th key={idx} className="border border-gray-600 p-1">
                      <div className="text-xs">
                        {new Date(date.date).toLocaleDateString("fr-FR", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(date.date).getDate()}
                      </div>
                    </th>
                  ))}
                </tr>

                <tr className="bg-gray-100">
                  {datesValides.map((date, idx) => (
                    <th key={idx} className="border border-gray-600 p-1">
                      <div className="text-xs font-bold text-gray-700">
                        {getMonthAbbreviation(date.date)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {group.map((employee, empIdx) => (
                  <React.Fragment key={empIdx}>
                    <tr className="border-b-2 border-gray-800">
                      <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-sm">
                            {employee.badgenumber}
                          </span>
                          <span className="italic text-sm">
                            {employee.name}
                          </span>
                        </div>
                      </td>

                      {datesValides.map((dateObj, dayIdx) => {
                        const attendance = getAttendanceData(
                          employee,
                          dateObj.date,
                        );
                        const evenementType = getEvenementForCell(
                          employee.userid,
                          dateObj.date,
                        );
                        const { heureEntreeAffichee, heureSortieAffichee } =
                          getHeuresAffichees(attendance);
                        const backgroundColor =
                          getCellBackgroundColor(attendance);
                        const estAnomalieCorrigee =
                          attendance?.est_anomalie_corrigee || false;

                        // Afficher la cellule même si vide pour les anomalies corrigées
                        const shouldDisplay =
                          attendance ||
                          (estAnomalieCorrigee && evenementType === "A"); // Anomalie corrigée avec absence

                        if (!shouldDisplay) {
                          return (
                            <td
                              key={dayIdx}
                              className="border border-gray-600 p-0 text-center"
                              style={{ backgroundColor }}
                            >
                              {/* Cellule vide */}
                            </td>
                          );
                        }

                        return (
                          <td
                            key={dayIdx}
                            className="border border-gray-600 p-0 text-center relative"
                            style={{ backgroundColor }}
                          >
                            <div className="flex flex-col h-full">
                              <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px]">
                                {heureEntreeAffichee}
                              </div>
                              {/* ÉVÉNEMENT */}
                              <button
                                onClick={() =>
                                  handleEvenementClick(
                                    employee,
                                    dateObj.date,
                                    attendance,
                                  )
                                }
                                className={`print:text-[7pt] border-b border-gray-300 px-1 py-0.5 min-h-[21px] text-xs font-bold w-full hover:bg-gray-50 transition-colors ${getEvenementTextColor(evenementType)}`}
                                title={`Modifier l'événement (${evenementType})`}
                              >
                                {evenementType}
                              </button>
                              <div className="px-1 py-0.5 min-h-[20px]">
                                {heureSortieAffichee}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {showEvenementModal && selectedEvenement && (
        <EvenementModal
          evenement={selectedEvenement}
          onClose={() => {
            setShowEvenementModal(false);
            setSelectedEvenement(null);
          }}
          onSave={handleSaveEvenement}
          onDelete={handleDeleteEvenement}
          typesEvenement={typesEvenement}
        />
      )}

      {showHoraireModal && (
        <HoraireModal
          horaire={selectedHoraire}
          onClose={() => {
            setShowHoraireModal(false);
            setSelectedHoraire(null);
          }}
          onSave={handleSaveHoraire}
        />
      )}
    </div>
  );
};

export default AttendancePage;
