import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings,
  Edit2,
  Plus,
  Save,
  X,
  Trash2,
  AlertCircle,
  Clock,
  Search,
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

// ========== COMPOSANT DE RECHERCHE LOCALE ==========
const LocalEmployeeSearch = ({ onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onFilter("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onFilter]);

  const handleChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onFilter(query);
  };

  const handleClear = () => {
    setSearchQuery("");
    onFilter("");
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Rechercher dans la liste..."
          className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// ========== MODAL DE MODIFICATION DES HEURES ==========
const HeureModal = ({
  employee,
  date,
  attendance,
  onClose,
  onSave,
  onDelete: _onDelete,
}) => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    heure_entree: "",
    heure_sortie: "",
    commentaire: "",
  });
  const [horairesPrevus, setHorairesPrevus] = useState(null);

  // Charger les données existantes
  useEffect(() => {
    const loadData = async () => {
      if (!employee || !date) return;

      setLoading(true);
      try {
        const data = await presenceService.getHeuresJour(employee.userid, date);

        // Sauvegarder les horaires prévus pour affichage
        setHorairesPrevus(data.horaires_prevu);

        // Déterminer quelles heures afficher par défaut
        let heureEntreeDefaut = "";
        let heureSortieDefaut = "";

        if (attendance) {
  // Toujours prendre les heures rectifiées en premier
  if (attendance.heure_entree_rectifiee) {
    heureEntreeDefaut = attendance.heure_entree_rectifiee.slice(0, 5);
  } else if (attendance.heure_entree_comptabilisee) {
    heureEntreeDefaut = attendance.heure_entree_comptabilisee.slice(0, 5);
  }

  if (attendance.heure_sortie_rectifiee) {
    heureSortieDefaut = attendance.heure_sortie_rectifiee.slice(0, 5);
  } else if (attendance.heure_sortie_comptabilisee) {
    heureSortieDefaut = attendance.heure_sortie_comptabilisee.slice(0, 5);
  }
} else {
  // Pas de présence : utiliser les horaires prévus
  heureEntreeDefaut = data.horaires_prevu?.entree?.slice(0, 5) || "";
  heureSortieDefaut = data.horaires_prevu?.sortie?.slice(0, 5) || "";
}

        setFormData({
          heure_entree: heureEntreeDefaut,
          heure_sortie: heureSortieDefaut,
          commentaire: data.anomalie?.commentaire || "",
        });
      } catch (error) {
        console.error("❌ Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [employee, date, attendance]);

  const handleSubmit = async () => {
    // Validation
    if (!formData.heure_entree && !formData.heure_sortie) {
      alert("Veuillez saisir au moins une heure (entrée ou sortie)");
      return;
    }

    // Validation format heures
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (formData.heure_entree && !timeRegex.test(formData.heure_entree)) {
      alert("Format d'heure d'entrée invalide. Utilisez HH:MM");
      return;
    }
    if (formData.heure_sortie && !timeRegex.test(formData.heure_sortie)) {
      alert("Format d'heure de sortie invalide. Utilisez HH:MM");
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        userid: employee.userid,
        date: date,
        heure_entree: formData.heure_entree
          ? `${formData.heure_entree}:00`
          : null,
        heure_sortie: formData.heure_sortie
          ? `${formData.heure_sortie}:00`
          : null,
        commentaire: formData.commentaire || "Ajouté manuellement",
      };

      await presenceService.modifierHeuresManuellement(dataToSend);

      alert("✅ Présence enregistrée avec succès !");
      onSave();
      onClose();
    } catch (error) {
      console.error("❌ Erreur modification heures:", error);
      alert(`❌ Erreur: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette présence ?\nLes pointages bruts seront rétablis s'ils existent.",
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await presenceService.supprimerHeuresManuellement(employee.userid, date);
      alert("✅ Présence supprimée avec succès !");
      if (_onDelete) _onDelete();
      onClose();
    } catch (error) {
      console.error("❌ Erreur suppression:", error);
      alert(`❌ Erreur: ${error.response?.data?.error || error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return "Non renseigné";
    return timeStr.length > 5 ? timeStr.slice(0, 5) : timeStr;
  };

  const canDelete = attendance !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-gray-800" />
              <h3 className="text-xl font-bold">
                {attendance ? "Modifier la présence" : "Ajouter une présence"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading || deleting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-6">
          {/* Informations employé */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-bold text-gray-600">Employé:</span>
                <div className="mt-1 font-semibold">{employee?.name}</div>
              </div>
              <div>
                <span className="font-bold text-gray-600">Badge:</span>
                <div className="mt-1 font-semibold">
                  {employee?.badgenumber}
                </div>
              </div>
              <div className="col-span-2">
                <span className="font-bold text-gray-600">Date:</span>
                <div className="mt-1 font-semibold">
                  {new Date(date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              {(attendance?.section || employee?.section) && (
                <div className="col-span-2">
                  <span className="font-bold text-gray-600">Section:</span>
                  <div className="mt-1 font-semibold">
                    {attendance?.section || employee?.section}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Horaires prévus */}
          {horairesPrevus && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">
                Horaires prévus pour cette date:
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Entrée:</span>
                  <span className="ml-2 font-semibold">
                    {formatTimeDisplay(horairesPrevus.entree)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Sortie:</span>
                  <span className="ml-2 font-semibold">
                    {formatTimeDisplay(horairesPrevus.sortie)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Heures existantes (si présence existe) */}
          {attendance && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700">Heures existantes:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold text-gray-600 mb-2">Brutes</div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Entrée</div>
                    <div className="font-medium">
                      {formatTimeDisplay(attendance.heure_brute_entree)}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Sortie</div>
                    <div className="font-medium">
                      {formatTimeDisplay(attendance.heure_brute_sortie)}
                    </div>
                  </div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-700 mb-2">Prévues</div>
                  <div className="space-y-1">
                    <div className="text-xs text-blue-600">Entrée</div>
                    <div className="font-medium text-blue-900">
                      {formatTimeDisplay(attendance.heure_entree_prevue)}
                    </div>
                    <div className="text-xs text-blue-600 mt-2">Sortie</div>
                    <div className="font-medium text-blue-900">
                      {formatTimeDisplay(attendance.heure_sortie_prevue)}
                    </div>
                  </div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-700 mb-2">
                    Rectifiées
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-green-600">Entrée</div>
                    <div className="font-medium text-green-900">
                      {formatTimeDisplay(attendance.heure_entree_rectifiee)}
                    </div>
                    <div className="text-xs text-green-600 mt-2">Sortie</div>
                    <div className="font-medium text-green-900">
                      {formatTimeDisplay(attendance.heure_sortie_rectifiee)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire de modification */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700">
              {attendance ? "Modifier les heures" : "Saisir les heures"}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Heure d'entrée *
                </label>
                <input
                  type="time"
                  value={formData.heure_entree}
                  onChange={(e) =>
                    setFormData({ ...formData, heure_entree: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none transition-colors"
                  disabled={loading || deleting}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Heure de sortie *
                </label>
                <input
                  type="time"
                  value={formData.heure_sortie}
                  onChange={(e) =>
                    setFormData({ ...formData, heure_sortie: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none transition-colors"
                  disabled={loading || deleting}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Commentaire
              </label>
              <textarea
                value={formData.commentaire}
                onChange={(e) =>
                  setFormData({ ...formData, commentaire: e.target.value })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none transition-colors"
                rows="2"
                placeholder="Ex: Oubli de pointage, appareil en panne..."
                disabled={loading || deleting}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={loading || deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Suppression...
                  </>
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
              disabled={loading || deleting}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Annuler
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading || deleting}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enregistrement...
                </>
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

// Modal de gestion des horaires
const HoraireModal = ({ horaire, onClose, onSave }) => {
  const [saving, setSaving] = useState(false);

  // ========== FONCTIONS DE CONVERSION ==========

  /**
   * Convertit HH:MM en format décimal
   * Ex: "08:20" → 8.33
   */
  const timeToDecimal = (timeStr) => {
    if (!timeStr) return 0;

    const [hours, minutes] = timeStr.split(":").map(Number);

    // Convertir les minutes en centièmes d'heure
    // 60 minutes = 100 centièmes
    const centiemes = (minutes / 60) * 100;

    // Arrondir à 2 décimales
    return parseFloat((hours + centiemes / 100).toFixed(2));
  };

  /**
   * Convertit le format décimal en HH:MM
   * Ex: 8.33 → "08:20"
   */
  const decimalToTimeLocal = (decimal) => {
    if (!decimal && decimal !== 0) return "00:00";

    const decimalNum = parseFloat(decimal);
    const hours = Math.floor(decimalNum);

    // Extraire les centièmes et convertir en minutes
    const centiemes = (decimalNum - hours) * 100;
    const minutes = Math.round(centiemes * 0.6);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  // ========== ÉTAT DU FORMULAIRE ==========

  const [formData, setFormData] = useState({
    section: horaire?.section || "",
    heure_entree: horaire ? decimalToTimeLocal(horaire.heure_entree) : "07:30",
    heure_sortie: horaire ? decimalToTimeLocal(horaire.heure_sortie) : "17:50",
    sortie_samedi: horaire
      ? decimalToTimeLocal(horaire.sortie_samedi)
      : "15:30",
    sortie_vendredi_paiement: horaire
      ? decimalToTimeLocal(horaire.sortie_vendredi_paiement)
      : "17:33",
    sortie_samedi_paiement: horaire
      ? decimalToTimeLocal(horaire.sortie_samedi_paiement)
      : "13:00",
  });

  // ========== SOUMISSION DU FORMULAIRE ==========

  const handleSubmit = async () => {
    // Validation
    if (!formData.section) {
      alert("Veuillez entrer un nom de section");
      return;
    }

    setSaving(true);
    try {
      // Conversion HH:MM → Décimal pour l'envoi au backend
      const data = {
        section: formData.section,
        heure_entree: timeToDecimal(formData.heure_entree),
        heure_sortie: timeToDecimal(formData.heure_sortie),
        sortie_samedi: timeToDecimal(formData.sortie_samedi),
        sortie_vendredi_paiement: timeToDecimal(
          formData.sortie_vendredi_paiement,
        ),
        sortie_samedi_paiement: timeToDecimal(formData.sortie_samedi_paiement),
      };

      console.log("📤 Données converties pour envoi:", data);

      await onSave(data);
    } catch (err) {
      console.error("❌ Erreur:", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  // ========== RENDU ==========

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800 sticky top-0 bg-white">
          <h3 className="text-xl font-bold">
            {horaire ? "Modifier" : "Ajouter"} un horaire
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={saving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du formulaire */}
        <div className="p-6 space-y-4">
          {/* Section */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">
              Section *
            </label>
            <input
              type="text"
              value={formData.section}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  section: e.target.value.toUpperCase(),
                })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none transition-colors"
              disabled={!!horaire}
              placeholder="Ex: BRODERIE MAIN DEV"
            />
            {!!horaire && (
              <p className="text-xs text-gray-500 mt-1">
                La section ne peut pas être modifiée
              </p>
            )}
          </div>

          {/* Heure d'entrée */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">
              Heure d'entrée *
            </label>
            <input
              type="time"
              value={formData.heure_entree}
              onChange={(e) =>
                setFormData({ ...formData, heure_entree: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              En décimal: {timeToDecimal(formData.heure_entree)}
            </p>
          </div>

          {/* Heure de sortie normale */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">
              Heure de sortie (lundi-vendredi normal) *
            </label>
            <input
              type="time"
              value={formData.heure_sortie}
              onChange={(e) =>
                setFormData({ ...formData, heure_sortie: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              En décimal: {timeToDecimal(formData.heure_sortie)}
            </p>
          </div>

          {/* Sortie samedi normal */}
          <div>
            <label className="block text-sm font-bold mb-1 text-gray-700">
              Sortie samedi normal *
            </label>
            <input
              type="time"
              value={formData.sortie_samedi}
              onChange={(e) =>
                setFormData({ ...formData, sortie_samedi: e.target.value })
              }
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              En décimal: {timeToDecimal(formData.sortie_samedi)}
            </p>
          </div>

          {/* Séparateur */}
          <div className="border-t-2 border-gray-300 pt-4">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className="text-yellow-600">●</span>
              Horaires pour jours de paiement (P)
            </h4>

            {/* Sortie vendredi paiement */}
            <div className="mb-3">
              <label className="block text-sm font-bold mb-1 text-gray-700">
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
                className="w-full px-3 py-2 border-2 border-yellow-300 rounded focus:border-yellow-600 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                En décimal: {timeToDecimal(formData.sortie_vendredi_paiement)}
              </p>
            </div>

            {/* Sortie samedi paiement */}
            <div className="mb-3">
              <label className="block text-sm font-bold mb-1 text-gray-700">
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
                className="w-full px-3 py-2 border-2 border-yellow-300 rounded focus:border-yellow-600 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                En décimal: {timeToDecimal(formData.sortie_samedi_paiement)}
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={saving}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Enregistrement...
                </>
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

// ========== COMPOSANT PRINCIPAL ==========
const AttendancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [presences, setPresences] = useState([]);
  const [periode, setPeriode] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'état de navigation
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
  const [searchFilter, setSearchFilter] = useState("");

  const [dates, setDates] = useState([]);
  const [showHoraires, setShowHoraires] = useState(false);
  const [horaires, setHoraires] = useState([]);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showHoraireModal, setShowHoraireModal] = useState(false);
  const [modeHeures, setModeHeures] = useState("rectifiees"); // <-- IMPORTANT: RÉTABLI
  const [forceRefresh, setForceRefresh] = useState(0);

  const [typesEvenement, setTypesEvenement] = useState([]);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [showEvenementModal, setShowEvenementModal] = useState(false);
  const [evenementsMap, setEvenementsMap] = useState({});

  // NOUVEAUX ÉTATS POUR LA MODIFICATION DES HEURES
  const [showHeureModal, setShowHeureModal] = useState(false);
  const [selectedHeureData, setSelectedHeureData] = useState(null);

  const componentRef = useRef();

  // Nettoyer le state de navigation après l'avoir utilisé
  useEffect(() => {
    const state = locationState;

    if (state.returnFromAnomalies) {
      window.history.replaceState({}, document.title);

      if (state.month !== currentMonth || state.year !== currentYear) {
        setCurrentMonth(state.month);
        setCurrentYear(state.year);
        setSelectedMonth(state.month);
        setSelectedYear(state.year);
        setFilterChanged(false);

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

  // FONCTION MODIFIÉE : Gestion du clic sur les heures avec vérification du mode
  const handleHeureClick = useCallback((employee, dateStr, attendance) => {
    // ❌ INTERDIRE LA MODIFICATION EN MODE HEURES BRUTES
    if (modeHeures === "brutes") {
      alert("Les heures brutes ne sont pas modifiables. Veuillez passer en mode 'Heures Rectifiées' pour modifier.");
      return;
    }

    const dateFormatted = formatDate(dateStr);
    if (!dateFormatted) {
      console.error("❌ Date invalide:", dateStr);
      return;
    }

    setSelectedHeureData({
      employee,
      date: dateFormatted,
      attendance,
    });
    setShowHeureModal(true);
  }, [modeHeures]); // ⚠️ AJOUTER modeHeures DANS LES DÉPENDANCES

  // FONCTION MODIFIÉE : Ne retourne l'événement "X" que si l'employé a une présence
  const getEvenementForCell = useCallback(
    (userId, dateStr, attendance) => {
      const dateFormatted = formatDate(dateStr);
      if (!dateFormatted) return "";

      const key = `${userId}-${dateFormatted}`;
      const eventFromMap = evenementsMap[key];

      // Si l'événement est "X" et qu'il n'y a pas de présence (pas de pointage et pas d'anomalie corrigée)
      if (eventFromMap === "X") {
        // Si pas d'attendance (null) ou (pas présent et pas d'anomalie corrigée)
        if (
          !attendance ||
          (!attendance.present && !attendance.est_anomalie_corrigee)
        ) {
          return "";
        }
      }

      // Sinon, retourner l'événement (même s'il est "X" et qu'il y a présence, ou un autre événement)
      return eventFromMap || "";
    },
    [evenementsMap],
  );

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

  // FONCTION CORRIGÉE : Prend en compte le modeHeures
  const getHeuresAffichees = useCallback(
    (attendance) => {
      if (!attendance) {
        return { heureEntreeAffichee: "", heureSortieAffichee: "" };
      }

      let heureEntreeAffichee = "";
      let heureSortieAffichee = "";

      if (modeHeures === "brutes") {
        // Afficher les heures brutes (déjà corrigées automatiquement)
        heureEntreeAffichee = attendance.heure_brute_entree
          ? attendance.heure_brute_entree.slice(0, 5)
          : "";
        heureSortieAffichee = attendance.heure_brute_sortie
          ? attendance.heure_brute_sortie.slice(0, 5)
          : "";
      } else {
        // Afficher les heures rectifiées (après analyse)
        heureEntreeAffichee = attendance.heure_entree_comptabilisee
          ? attendance.heure_entree_comptabilisee.slice(0, 5)
          : "";
        heureSortieAffichee = attendance.heure_sortie_comptabilisee
          ? attendance.heure_sortie_comptabilisee.slice(0, 5)
          : "";
      }

      return {
        heureEntreeAffichee,
        heureSortieAffichee,
      };
    },
    [modeHeures] // <-- IMPORTANT: modeHeures dans les dépendances
  );

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

  // FONCTION MODIFIÉE POUR LA RECHERCHE LOCALE
  const getEmployeeData = useCallback(() => {
    const employeesMap = {};

    // Regrouper les employés ayant des présences dans le mois
    presences.forEach((presence) => {
      // Ignorer les présences hors période si nécessaire
      if (presence.hors_periode) return;

      // NOUVEAU: Ne pas créer d'entrée pour les jours où il n'y a que l'événement "X" sans présence
      // et sans anomalie corrigée
      if (
        !presence.present &&
        !presence.est_anomalie_corrigee &&
        presence.evenement === "X"
      ) {
        return;
      }

      if (!employeesMap[presence.userid]) {
        employeesMap[presence.userid] = {
          userid: presence.userid,
          badgenumber: presence.badgenumber,
          name: presence.name,
          section: presence.section || "ADMINISTRATION",
          presences: {},
          hasPresence: false,
        };
      }

      const dateFormatted = formatDate(presence.date);
      if (dateFormatted) {
        employeesMap[presence.userid].presences[dateFormatted] = {
          ...presence,
          anomalie_id: presence.anomalie_id || null,
        };
        employeesMap[presence.userid].hasPresence = true;
      }
    });

    // Convertir en tableau et filtrer ceux qui ont au moins une présence
    let employeesArray = Object.values(employeesMap).filter(
      (emp) => emp.hasPresence,
    );

    // Appliquer le filtre de recherche locale
    if (searchFilter.trim()) {
      const query = searchFilter.toLowerCase().trim();
      employeesArray = employeesArray.filter((employee) => {
        // Recherche par badge number
        const badgeMatch =
          employee.badgenumber &&
          employee.badgenumber.toLowerCase().includes(query);

        // Recherche par nom
        const nameMatch =
          employee.name && employee.name.toLowerCase().includes(query);

        // Recherche par section
        const sectionMatch =
          employee.section && employee.section.toLowerCase().includes(query);

        return badgeMatch || nameMatch || sectionMatch;
      });
    }

    // Trier par badge number
    employeesArray.sort((a, b) => {
      if (a.badgenumber && b.badgenumber) {
        return a.badgenumber.localeCompare(b.badgenumber, undefined, {
          numeric: true,
        });
      }
      return 0;
    });

    return employeesArray;
  }, [presences, searchFilter]);

  const getAttendanceData = useCallback((employee, dateStr) => {
    const dateFormatted = formatDate(dateStr);
    if (!dateFormatted) return null;

    return employee.presences[dateFormatted] || null;
  }, []);

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

  if (loading) {
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-akj text-white px-6 py-3 font-bold text-lg">
                AKANJO
              </div>
              <h1 className="text-2xl font-bold uppercase">
                GESTION DES HORAIRES
              </h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHoraires(false)}
                className="px-4 py-1 border-2 border-gray-600 rounded hover:bg-gray-100"
              >
                ← Retour aux présences
              </button>
              <button
                onClick={() => {
                  setSelectedHoraire(null);
                  setShowHoraireModal(true);
                }}
                className="flex items-center gap-2 px-4 py-1 bg-akj text-white rounded"
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
            {/* Barre de recherche locale */}
            <div className="h-8 flex items-center min-w-[200px]">
              <div className="[&>*]:h-8 [&_input]:h-8 [&_input]:text-sm [&_input]:py-1 [&_button]:h-8 [&_button]:text-sm w-full">
                <LocalEmployeeSearch onFilter={setSearchFilter} />
              </div>
            </div>

            {/* Boutons existants - RÉTABLIS */}
            <button
              onClick={() => setShowHoraires(true)}
              className="flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded hover:bg-gray-700"
            >
              <Settings className="w-4 h-4" />
              Gérer les horaires
            </button>

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
              Anomalies
            </button>

            {/* BOUTONS RÉTABLIS POUR BASCULER entre heures brutes et rectifiées */}
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
                          attendance,
                        );
                        const { heureEntreeAffichee, heureSortieAffichee } =
                          getHeuresAffichees(attendance);
                        const backgroundColor =
                          getCellBackgroundColor(attendance);
                        const anomalieId = attendance?.anomalie_id || null;
                        const estModifieManuellement = anomalieId !== null;
                        const estCorrectionAuto = attendance?.est_correction_auto || false;

                        return (
                          <td
                            key={dayIdx}
                            className="border border-gray-600 p-0 text-center relative group"
                            style={{ backgroundColor }}
                          >
                            {estModifieManuellement && (
                              <div
                                className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full"
                                title="Heures modifiées manuellement"
                              ></div>
                            )}

                            {estCorrectionAuto && (
                              <div
                                className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full"
                                title="Correction automatique appliquée"
                              ></div>
                            )}

                            <div className="flex flex-col h-full">
                              <button
                                onClick={() =>
                                  modeHeures !== "brutes" &&
                                  handleHeureClick(
                                    employee,
                                    dateObj.date,
                                    attendance,
                                  )
                                }
                                disabled={modeHeures === "brutes"}
                                className={`border-b border-gray-300 px-1 py-0.5 min-h-[20px] w-full transition-colors relative group/entree print:hover:bg-transparent ${
                                  modeHeures === "brutes"
                                    ? ""
                                    : ""
                                }`}
                                title={
                                  modeHeures === "brutes"
                                    ? "Heures brutes non modifiables"
                                    : estModifieManuellement
                                    ? "Heures modifiées - Cliquer pour modifier"
                                    : "Cliquer pour modifier les heures"
                                }
                              >
                                {heureEntreeAffichee || (
                                  <span className="text-gray-400 italic text-xs"></span>
                                )}
                              </button>

                              <button
                                onClick={() =>
                                  handleEvenementClick(
                                    employee,
                                    dateObj.date,
                                    attendance,
                                  )
                                }
                                className={`print:text-[7pt] border-b border-gray-300 px-1 py-0.5 min-h-[21px] text-xs font-bold w-full hover:bg-gray-50 transition-colors print:hover:bg-transparent ${
                                  evenementType
                                    ? getEvenementTextColor(evenementType)
                                    : ""
                                }`}
                                title={
                                  evenementType
                                    ? `Modifier l'événement (${evenementType})`
                                    : "Ajouter un événement"
                                }
                              >
                                {evenementType}
                              </button>

                              <button
                                onClick={() =>
                                  modeHeures !== "brutes" &&
                                  handleHeureClick(
                                    employee,
                                    dateObj.date,
                                    attendance,
                                  )
                                }
                                disabled={modeHeures === "brutes"}
                                className={`px-1 py-0.5 min-h-[20px] w-full transition-colors relative group/sortie print:hover:bg-transparent ${
                                  modeHeures === "brutes"
                                    ? ""
                                    : ""
                                }`}
                                title={
                                  modeHeures === "brutes"
                                    ? "Heures brutes non modifiables"
                                    : estModifieManuellement
                                    ? "Heures modifiées - Cliquer pour modifier"
                                    : "Cliquer pour modifier les heures"
                                }
                              >
                                {heureSortieAffichee || (
                                  <span className="text-gray-400 italic text-xs"></span>
                                )}
                              </button>
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

      {/* Modal de modification des heures */}
      {showHeureModal && selectedHeureData && (
        <HeureModal
          employee={selectedHeureData.employee}
          date={selectedHeureData.date}
          attendance={selectedHeureData.attendance}
          onClose={() => {
            setShowHeureModal(false);
            setSelectedHeureData(null);
          }}
          onSave={() => {
            refreshData();
          }}
          onDelete={() => {
            refreshData();
          }}
        />
      )}

      {/* Modals existants */}
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