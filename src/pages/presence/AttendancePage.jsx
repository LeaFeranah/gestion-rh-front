import React, { useState, useEffect, useCallback, useRef } from "react";
import { Settings, Edit2, Plus, Save, X, Clock, RefreshCw, AlertCircle, Trash2 } from "lucide-react";
import { useReactToPrint } from 'react-to-print';
import presenceService from "../../services/presenceService";

// Utilitaires pour conversion heures
const decimalToTime = (decimal) => {
  if (!decimal && decimal !== 0) return "00:00";
  
  const decimalNum = parseFloat(decimal);
  const hours = Math.floor(decimalNum);
  const minutes = Math.round((decimalNum - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const timeToDecimal = (timeStr) => {
  if (!timeStr) return 0;
  
  const [hours, minutes] = timeStr.split(":").map(Number);
  const decimal = hours + minutes / 60;
  return Math.round(decimal * 100) / 100;
};

const formatDate = (dateStr) => {
  if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.error('❌ Date invalide:', dateStr);
    return '';
  }
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
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

// Modal pour modifier les heures comptabilisées
const ModifierHeuresModal = ({ employee, dateStr, attendance, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    heure_entree: attendance?.heure_entree_comptabilisee?.slice(0, 5) || "",
    heure_sortie: attendance?.heure_sortie_comptabilisee?.slice(0, 5) || "",
    motif: attendance?.motif_anomalie || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!formData.heure_entree && !formData.heure_sortie) {
      alert("Veuillez entrer au moins une heure (entrée ou sortie)");
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

  const handleSupprimer = async () => {
    if (window.confirm("Supprimer cette modification d'heures ?")) {
      setSaving(true);
      try {
        await presenceService.deleteAnomalieByUserDate(employee.userid, dateStr);
        alert("Modification supprimée avec succès");
        onClose();
        window.location.reload();
      } catch (err) {
        console.error("Erreur:", err);
        alert("Erreur lors de la suppression");
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            <h3 className="text-xl font-bold">Modifier les heures comptabilisées</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-bold mb-1">⚠️ MODIFICATION DES HEURES COMPTABILISÉES SEULEMENT</p>
              <p className="mb-1">• Vous modifiez uniquement les <strong>heures comptabilisées</strong></p>
              <p className="mb-1">• Les <strong>heures réelles de pointage</strong> restent inchangées</p>
              <p>• Les modifications apparaîtront uniquement en mode "Heures comptabilisées"</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold">Employé:</span>
                <div className="mt-1">{employee.name}</div>
              </div>
              <div>
                <span className="font-bold">Badge:</span>
                <div className="mt-1">{employee.badgenumber}</div>
              </div>
              <div className="col-span-2">
                <span className="font-bold">Date:</span>
                <div className="mt-1">{dateStr}</div>
              </div>
            </div>
          </div>

          {attendance?.heure_entree_reelle && (
            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="font-bold mb-2">Heures réelles (pointage - NON MODIFIABLES):</p>
              <div className="grid grid-cols-2 gap-2">
                <div>Entrée: <strong className="text-blue-700">{attendance.heure_entree_reelle?.slice(0, 5)}</strong></div>
                <div>Sortie: <strong className="text-blue-700">{attendance.heure_sortie_reelle?.slice(0, 5)}</strong></div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-1">
              Heure d'entrée comptabilisée *
            </label>
            <input
              type="time"
              value={formData.heure_entree}
              onChange={(e) => setFormData({ ...formData, heure_entree: e.target.value })}
              className="w-full px-3 py-2 border-2 border-yellow-300 rounded focus:border-yellow-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Heure de sortie comptabilisée *
            </label>
            <input
              type="time"
              value={formData.heure_sortie}
              onChange={(e) => setFormData({ ...formData, heure_sortie: e.target.value })}
              className="w-full px-3 py-2 border-2 border-yellow-300 rounded focus:border-yellow-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Motif de la modification
            </label>
            <textarea
              value={formData.motif}
              onChange={(e) => setFormData({ ...formData, motif: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
              rows="3"
              placeholder="Ex: Oubli de pointage, Pointeuse en panne, etc."
            />
          </div>

          <div className="flex gap-3 pt-4">
            {attendance?.a_anomalie && (
              <button
                onClick={handleSupprimer}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                Supprimer
              </button>
            )}
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
              {saving ? "Enregistrement..." : (
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

// Modal de gestion des horaires AVEC JOURS DE PAIEMENT
const HoraireModal = ({ horaire, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    section: horaire?.section || "",
    heure_entree: horaire ? decimalToTime(horaire.heure_entree) : "07:30",
    heure_sortie: horaire ? decimalToTime(horaire.heure_sortie) : "17:50",
    sortie_samedi: horaire ? decimalToTime(horaire.sortie_samedi) : "15:30",
    // NOUVEAUX CHAMPS POUR LES JOURS DE PAIEMENT
    sortie_vendredi_paiement: horaire ? decimalToTime(horaire.sortie_vendredi_paiement) : "17:33",
    sortie_samedi_paiement: horaire ? decimalToTime(horaire.sortie_samedi_paiement) : "13:00",
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
        heure_entree: timeToDecimal(formData.heure_entree),
        heure_sortie: timeToDecimal(formData.heure_sortie),
        sortie_samedi: timeToDecimal(formData.sortie_samedi),
        // NOUVEAUX CHAMPS
        sortie_vendredi_paiement: timeToDecimal(formData.sortie_vendredi_paiement),
        sortie_samedi_paiement: timeToDecimal(formData.sortie_samedi_paiement),
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
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">Section *</label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
              disabled={!!horaire}
              placeholder="Ex: BRODERIE MAIN DEV"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Heure d'entrée *</label>
            <input
              type="time"
              value={formData.heure_entree}
              onChange={(e) => setFormData({ ...formData, heure_entree: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Heure de sortie (lundi-ven normal) *</label>
            <input
              type="time"
              value={formData.heure_sortie}
              onChange={(e) => setFormData({ ...formData, heure_sortie: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Sortie samedi normal *</label>
            <input
              type="time"
              value={formData.sortie_samedi}
              onChange={(e) => setFormData({ ...formData, sortie_samedi: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
          </div>

          <div className="border-t-2 border-gray-300 pt-4">
            <h4 className="font-bold text-gray-700 mb-3">Horaires pour jours de paiement (P)</h4>
            
            <div className="mb-3">
              <label className="block text-sm font-bold mb-1">Sortie vendredi de paiement *</label>
              <input
                type="time"
                value={formData.sortie_vendredi_paiement}
                onChange={(e) => setFormData({ ...formData, sortie_vendredi_paiement: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-yellow-600"
              />
              {/* <p className="text-xs text-gray-600 mt-1">Heure de sortie les vendredis marqués "P"</p> */}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-bold mb-1">Sortie samedi de paiement *</label>
              <input
                type="time"
                value={formData.sortie_samedi_paiement}
                onChange={(e) => setFormData({ ...formData, sortie_samedi_paiement: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-yellow-600"
              />
              {/* <p className="text-xs text-gray-600 mt-1">Heure de sortie les samedis marqués "P"</p> */}
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
              {saving ? "Enregistrement..." : (
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

// Modal de gestion des événements avec suppression
const EvenementModal = ({ evenement, onClose, onSave, onDelete, typesEvenement }) => {
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
    if (window.confirm("Voulez-vous supprimer cet événement ?\n\nL'événement sera réinitialisé à 'X' (Travail normal).")) {
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

  const canDelete = evenement && evenement.type_evenement !== 'X';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800">
          <h3 className="text-xl font-bold">
            {evenement ? "Modifier" : "Ajouter"} un événement
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
            <label className="block text-sm font-bold mb-1">Type d'événement *</label>
            <select
              value={formData.type_evenement}
              onChange={(e) => setFormData({ ...formData, type_evenement: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
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
                {deleting ? "Suppression..." : (
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
              {saving ? "Enregistrement..." : (
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
  const [presences, setPresences] = useState([]);
  const [periode, setPeriode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dates, setDates] = useState([]);
  const [showHoraires, setShowHoraires] = useState(false);
  const [horaires, setHoraires] = useState([]);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showHoraireModal, setShowHoraireModal] = useState(false);
  const [modeHeures, setModeHeures] = useState("comptabilisees");
  const [refreshing, setRefreshing] = useState(false);

  const [typesEvenement, setTypesEvenement] = useState([]);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [showEvenementModal, setShowEvenementModal] = useState(false);
  const [evenementsMap, setEvenementsMap] = useState({});

  const [showModifierHeuresModal, setShowModifierHeuresModal] = useState(false);
  const [selectedHeures, setSelectedHeures] = useState(null);
  const [anomaliesMap, setAnomaliesMap] = useState({});
  const [anomaliesDetailsMap, setAnomaliesDetailsMap] = useState({});

  // Dictionnaire des horaires par section
  const horairesDict = React.useMemo(() => {
    const dict = {};
    horaires.forEach(h => {
      dict[h.section] = {
        ...h,
        heure_entree_normale: decimalToTime(h.heure_entree),
        heure_sortie_normale: decimalToTime(h.heure_sortie),
        sortie_samedi_normale: decimalToTime(h.sortie_samedi),
        sortie_vendredi_paiement_normale: decimalToTime(h.sortie_vendredi_paiement),
        sortie_samedi_paiement_normale: decimalToTime(h.sortie_samedi_paiement)
      };
    });
    return dict;
  }, [horaires]);

  const fetchAnomaliesMois = useCallback(async (annee, mois) => {
    try {
      const anomaliesData = await presenceService.getAnomalies(annee, mois);
      
      const newAnomaliesMap = {};
      const newAnomaliesDetailsMap = {};
      
      if (anomaliesData.anomalies && anomaliesData.anomalies.length > 0) {
        anomaliesData.anomalies.forEach((a) => {
          const dateFormatted = formatDate(a.date);
          if (dateFormatted) {
            const key = `${a.userid}-${dateFormatted}`;
            newAnomaliesMap[key] = true;
            
            newAnomaliesDetailsMap[key] = {
              heure_entree_modifiee: a.heure_entree_modifiee,
              heure_sortie_modifiee: a.heure_sortie_modifiee,
              motif: a.motif,
              modifie_par: a.modifie_par
            };
          }
        });
        
        setAnomaliesMap(newAnomaliesMap);
        setAnomaliesDetailsMap(newAnomaliesDetailsMap);
      } else {
        setAnomaliesMap({});
        setAnomaliesDetailsMap({});
      }
      
    } catch (err) {
      console.error("Erreur chargement anomalies:", err);
      setAnomaliesMap({});
      setAnomaliesDetailsMap({});
    }
  }, []);

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

  const fetchPresences = useCallback(async (annee, mois) => {
    try {
      setLoading(true);

      try {
        await presenceService.genererDates(annee, mois);
      } catch {
        console.log('ℹ️ Génération des dates déjà effectuée');
      }

      const datesData = await presenceService.getDates(annee, mois);
      setDates(datesData);

      const presencesData = await presenceService.getPresencesMoisCalculee(annee, mois, false);

      setPeriode(presencesData.periode);
      setPresences(presencesData.presences || []);

      await Promise.all([
        fetchEvenementsMois(annee, mois),
        fetchAnomaliesMois(annee, mois)
      ]);
      
    } catch (err) {
      console.error("❌ Erreur lors du chargement:", err);
      alert("Erreur lors du chargement des présences: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchEvenementsMois, fetchAnomaliesMois]);

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

  const handleModifierHeuresClick = useCallback((employee, dateStr, attendance) => {
    if (modeHeures === "reelles") {
      alert("⚠️ Impossible de modifier en mode Heures Réelles.\nPassez en mode Heures Comptabilisées.");
      return;
    }

    const dateFormatted = formatDate(dateStr);
    
    if (!dateFormatted) {
      console.error('❌ Date invalide:', dateStr);
      return;
    }

    const heuresData = {
      userid: employee.userid,
      badgenumber: employee.badgenumber,
      name: employee.name,
      date: dateFormatted,
      attendance: attendance,
    };
    
    setSelectedHeures(heuresData);
    setShowModifierHeuresModal(true);
  }, [modeHeures]);

  const handleSaveHeuresModifiees = useCallback(async (formData) => {
    try {
      const { userid, date } = selectedHeures;

      await presenceService.updateAnomalieByUserDate(
        userid,
        date,
        formData.heure_entree || null,
        formData.heure_sortie || null,
        formData.motif,
        'admin'
      );

      const key = `${userid}-${date}`;
      setAnomaliesMap(prev => ({
        ...prev,
        [key]: true
      }));

      setAnomaliesDetailsMap(prev => ({
        ...prev,
        [key]: {
          heure_entree_modifiee: formData.heure_entree,
          heure_sortie_modifiee: formData.heure_sortie,
          motif: formData.motif,
          modifie_par: 'admin'
        }
      }));

      setShowModifierHeuresModal(false);
      setSelectedHeures(null);

      alert("Heures comptabilisées modifiées avec succès !");
      
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    }
  }, [selectedHeures]);

  const handleEvenementClick = useCallback((employee, dateStr, attendance) => {
    const dateFormatted = formatDate(dateStr);
    
    if (!dateFormatted) {
      console.error('❌ Date invalide:', dateStr);
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
  }, [evenementsMap]);

  const handleSaveEvenement = useCallback(async (formData) => {
    try {
      const { userid, date } = selectedEvenement;

      await presenceService.updateEvenementByUserDate(
        userid,
        date,
        formData.type_evenement,
        formData.commentaire || ""
      );

      const key = `${userid}-${date}`;
      setEvenementsMap(prev => ({
        ...prev,
        [key]: formData.type_evenement
      }));

      await fetchEvenementsMois(currentYear, currentMonth);

      setShowEvenementModal(false);
      setSelectedEvenement(null);

      console.log('✅ Événement mis à jour');
      
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
    }
  }, [selectedEvenement, currentYear, currentMonth, fetchEvenementsMois]);

  const handleDeleteEvenement = useCallback(async () => {
    try {
      const { userid, date } = selectedEvenement;
      
      await presenceService.deleteEvenementByUserDate(userid, date);
      
      const key = `${userid}-${date}`;
      setEvenementsMap(prev => ({
        ...prev,
        [key]: 'X'
      }));
      
      alert("Événement supprimé avec succès !");
      
      await fetchEvenementsMois(currentYear, currentMonth);
      
      setShowEvenementModal(false);
      setSelectedEvenement(null);
      
    } catch (err) {
      console.error("❌ Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression de l'événement. Veuillez réessayer.");
    }
  }, [selectedEvenement, currentYear, currentMonth, fetchEvenementsMois]);

  const handleSaveHoraire = useCallback(async (data) => {
    try {
      if (selectedHoraire) {
        // Mise à jour
        const result = await presenceService.updateHoraireSection(selectedHoraire.section, data);
        console.log('✅ Horaire mis à jour:', result);
      } else {
        // Création
        const result = await presenceService.createHoraireSection(data);
        console.log('✅ Horaire créé:', result);
      }
      
      setShowHoraireModal(false);
      setSelectedHoraire(null);
      await fetchHoraires();
      
      alert("Horaire enregistré avec succès !");
    } catch (err) {
      console.error("❌ Erreur détaillée lors de la sauvegarde de l'horaire:", err);
      alert(`Erreur lors de la sauvegarde: ${err.response?.data?.message || err.message}`);
    }
  }, [selectedHoraire, fetchHoraires]);

  const getHeuresAffichees = useCallback((employee, dateStr, attendance) => {
    const dateFormatted = formatDate(dateStr);
    const key = `${employee.userid}-${dateFormatted}`;
    
    const anomalie = anomaliesDetailsMap[key];
    const aAnomalie = anomaliesMap[key] || attendance?.a_anomalie;
    
    // Récupérer l'horaire de la section
    const horaire = horairesDict[employee.section] || horairesDict["ADMINISTRATION"] || {};
    
    let heureEntreeAffichee = "";
    let heureSortieAffichee = "";
    
    if (modeHeures === "reelles") {
      heureEntreeAffichee = attendance?.heure_entree_reelle 
        ? attendance.heure_entree_reelle.slice(0, 5)
        : "";
      heureSortieAffichee = attendance?.heure_sortie_reelle 
        ? attendance.heure_sortie_reelle.slice(0, 5)
        : "";
    } else {
      if (aAnomalie && anomalie) {
        heureEntreeAffichee = anomalie.heure_entree_modifiee 
          ? anomalie.heure_entree_modifiee.slice(0, 5)
          : (attendance?.heure_entree_comptabilisee?.slice(0, 5) || "");
        heureSortieAffichee = anomalie.heure_sortie_modifiee 
          ? anomalie.heure_sortie_modifiee.slice(0, 5)
          : (attendance?.heure_sortie_comptabilisee?.slice(0, 5) || "");
      } else {
        heureEntreeAffichee = attendance?.heure_entree_comptabilisee 
          ? attendance.heure_entree_comptabilisee.slice(0, 5)
          : "";
        heureSortieAffichee = attendance?.heure_sortie_comptabilisee 
          ? attendance.heure_sortie_comptabilisee.slice(0, 5)
          : "";
      }
    }
    
    return {
      heureEntreeAffichee,
      heureSortieAffichee,
      aAnomalie,
      anomalie,
      modeHeures,
      horaire
    };
  }, [anomaliesMap, anomaliesDetailsMap, modeHeures, horairesDict]);

  useEffect(() => {
    fetchPresences(currentYear, currentMonth);
    fetchTypesEvenements();
    fetchHoraires(); // Charger les horaires même quand on n'est pas dans la vue de gestion

    if (showHoraires) {
      fetchHoraires();
    }
  }, [currentYear, currentMonth, showHoraires, fetchPresences, fetchTypesEvenements, fetchHoraires]);

  const getEmployeeData = useCallback(() => {
    const employees = {};
    presences.forEach((presence) => {
      if (!employees[presence.userid]) {
        employees[presence.userid] = {
          userid: presence.userid,
          badgenumber: presence.badgenumber,
          name: presence.name,
          section: presence.section || "ADMINISTRATION",
          horaire: horairesDict[presence.section] || horairesDict["ADMINISTRATION"] || {},
          presences: {},
        };
      }
      const dateFormatted = formatDate(presence.date);
      if (dateFormatted) {
        employees[presence.userid].presences[dateFormatted] = presence;
      }
    });
    return Object.values(employees);
  }, [presences, horairesDict]);

  const getAttendanceData = useCallback((employee, dateStr) => {
    const dateFormatted = formatDate(dateStr);
    return dateFormatted ? employee.presences[dateFormatted] || null : null;
  }, []);

  const getEvenementForCell = useCallback((userId, dateStr) => {
    const dateFormatted = formatDate(dateStr);
    if (!dateFormatted) return 'X';
    
    const key = `${userId}-${dateFormatted}`;
    return evenementsMap[key] || 'X';
  }, [evenementsMap]);

  const groupDatesByWeek = useCallback(() => {
    const weeks = {};
    dates.forEach((date) => {
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
      "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
      "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
    ];
    return monthNames[date.getMonth()];
  }, []);

  // Déterminer la couleur de fond en fonction du type de jour
  const getCellBackgroundColor = useCallback((attendance) => {
    if (!attendance) return 'transparent';
    
    if (attendance.a_anomalie) {
      return ''; // Rouge pâle pour anomalies
    }
    
    if (attendance.est_jour_paiement) {
      return ''; // Jaune pâle pour jours de paiement
    }
    
    if (attendance.est_samedi) {
      return ''; // Gris très clair pour samedis
    }
    
    return 'transparent';
  }, []);

  const employees = getEmployeeData();
  const weeks = groupDatesByWeek();
  const weekNumbers = Object.keys(weeks).sort();

  const componentRef = useRef(); // 3. Créer la référence

  // 4. Configurer la fonction d'impression
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Correction pour les versions récentes
    documentTitle: `Fiche_Presence_${periode?.mois}_${periode?.annee}`,
  });

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
              <div className="bg-gray-800 text-white px-6 py-3 font-bold text-lg">
                AKANJO
              </div>
              <h1 className="text-2xl font-bold uppercase">FICHE DE PRESENCE:</h1>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-3">
                {periode?.mois} {periode?.annee}
              </h2>
              <div className="flex gap-3 print:hidden">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Mois</label>
                  <select
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Année</label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Gérer les horaires
            </button>
            
            <button
              onClick={() => setModeHeures("reelles")}
              className={`flex items-center gap-2 px-4 py-2 border-2 rounded ${
                modeHeures === "reelles" 
                  ? "border-gray-500 bg-gray-50 text-gray-700 font-bold" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Heures Brutes
            </button>
            
            <button
              onClick={() => setModeHeures("comptabilisees")}
              className={`flex items-center gap-2 px-4 py-2 border-2 rounded ${
                modeHeures === "comptabilisees" 
                  ? "border-gray-500 bg-gray-50 text-gray-700 font-bold" 
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Heures Rectifiées
            </button>

            <button
              onClick={() => handlePrint()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Imprimer la fiche
            </button>
          </div>

          <div className="mt-4 border-t-2 border-gray-800 pt-4 print:hidden">
            <div className="text-sm font-bold mb-2">Légende des événements:</div>
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

        <div className="bg-white border-2 border-gray-800 overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse text-xs table-fixed md:table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10"
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
                {dates.map((date, idx) => (
                  <th key={idx} className="border border-gray-600 p-1 min-w-16">
                    <div className="font-bold">{date.code_affichage}</div>
                  </th>
                ))}
              </tr>

              <tr className="bg-gray-100">
                {dates.map((date, idx) => (
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
                {dates.map((date, idx) => (
                  <th key={idx} className="border border-gray-600 p-1">
                    <div className="text-xs font-bold text-gray-700">
                      {getMonthAbbreviation(date.date)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {employees.map((employee, empIdx) => (
                <React.Fragment key={empIdx}>
                  <tr className="border-b-2 border-gray-800">
                    <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm">
                          {employee.badgenumber}
                        </span>
                        <span className="italic text-sm">{employee.name}</span>
                      </div>
                    </td>
                    {dates.map((dateObj, dayIdx) => {
                      if (dateObj.hors_periode) {
                        return (
                          <td
                            key={dayIdx}
                            className="border border-gray-600 p-0 text-center bg-gray-100"
                          >
                            <div className="flex flex-col h-full">
                              <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-medium"></div>
                              <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-bold"></div>
                              <div className="px-1 py-0.5 min-h-[20px] text-xs font-medium"></div>
                            </div>
                          </td>
                        );
                      }

                      const attendance = getAttendanceData(employee, dateObj.date);
                      const evenementType = getEvenementForCell(employee.userid, dateObj.date);
                      
                      const { 
                        heureEntreeAffichee, 
                        heureSortieAffichee, 
                        aAnomalie, 
                        anomalie,
                        modeHeures: currentMode 
                      } = getHeuresAffichees(employee, dateObj.date, attendance);
                      
                      const entreeModifiee = currentMode === "comptabilisees" && aAnomalie && anomalie?.heure_entree_modifiee;
                      const sortieModifiee = currentMode === "comptabilisees" && aAnomalie && anomalie?.heure_sortie_modifiee;
                      const backgroundColor = getCellBackgroundColor(attendance);

                      return (
                        <td
                          key={dayIdx}
                          className="border border-gray-600 p-0 text-center group"
                          style={{ backgroundColor }}
                        >
                          <div className="flex flex-col h-full">
                            {/* HEURE D'ENTRÉE */}
                            <div
                              onDoubleClick={currentMode === "comptabilisees" ? () => handleModifierHeuresClick(employee, dateObj.date, attendance) : undefined}
                              className={`border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-medium ${
                                currentMode === "comptabilisees" ? 'cursor-pointer hover:bg-yellow-50' : 'cursor-default'
                              } ${entreeModifiee ? '' : ''}`}
                              title={currentMode === "comptabilisees" 
                                ? "Double-clic pour modifier les heures comptabilisées" 
                                : "Heures réelles (non modifiables)"}
                            >
                              {heureEntreeAffichee && (
                                <span className="flex items-center justify-center gap-0.5">
                                  {heureEntreeAffichee}
                                  {entreeModifiee && (
                                    <span className="text-gray-600 font-bold" title="Heure modifiée manuellement">*</span>
                                  )}
                                </span>
                              )}
                            </div>

                            {/* ÉVÉNEMENT */}
                            <button
                              onClick={() => handleEvenementClick(employee, dateObj.date, attendance)}
                              className={`border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-bold w-full hover:bg-gray-50 transition-colors ${getEvenementTextColor(evenementType)}`}
                              title={`Modifier l'événement (${evenementType})`}
                            >
                              {evenementType !== "X" ||
                              attendance?.heure_entree_reelle ||
                              attendance?.heure_sortie_reelle
                                ? evenementType
                                : ""}
                            </button>

                            {/* HEURE DE SORTIE */}
                            <div
                              onDoubleClick={currentMode === "comptabilisees" ? () => handleModifierHeuresClick(employee, dateObj.date, attendance) : undefined}
                              className={`px-1 py-0.5 min-h-[20px] text-xs font-medium ${
                                currentMode === "comptabilisees" ? 'cursor-pointer hover:bg-yellow-50' : 'cursor-default'
                              } ${sortieModifiee ? '' : ''}`}
                              title={currentMode === "comptabilisees" 
                                ? "Double-clic pour modifier les heures comptabilisées" 
                                : "Heures réelles (non modifiables)"}
                            >
                              {heureSortieAffichee && (
                                <span className="flex items-center justify-center gap-0.5">
                                  {heureSortieAffichee}
                                  {sortieModifiee && (
                                    <span className="text-gray-600 font-bold" title="Heure modifiée manuellement">*</span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="border-b border-gray-400">
                    <td className="border-r-2 border-gray-800 p-1 sticky left-0 bg-gray-50 z-10"></td>
                    {dates.map((date, dayIdx) => (
                      <td
                        key={dayIdx}
                        className="border border-gray-300 p-1 h-8 bg-gray-50"
                      ></td>
                    ))}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
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

      {showModifierHeuresModal && selectedHeures && (
        <ModifierHeuresModal
          employee={selectedHeures}
          dateStr={selectedHeures.date}
          attendance={selectedHeures.attendance}
          onClose={() => {
            setShowModifierHeuresModal(false);
            setSelectedHeures(null);
          }}
          onSave={handleSaveHeuresModifiees}
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