import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  Settings,
  Edit2,
  Plus,
  Save,
  X,
  Trash2,
  Search,
  ChevronDown,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import presenceService from "../../services/presenceService";
import { useReactToPrint } from "react-to-print";
import "/src/styles/custom.css";

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const decimalToTime = (decimal) => {
  if (!decimal && decimal !== 0) return "00:00";
  const decimalNum = parseFloat(decimal);
  const hours = Math.floor(decimalNum);
  const minutes = Math.round((decimalNum - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const formatDate = (dateStr) => {
  if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2}$/))
    return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const computeDisplay = (type, commentaire) => {
  if (type === "AUT") return commentaire?.trim() || "Autre";
  if (type === "CP") {
    const num = commentaire?.trim();
    if (num && /^\d+$/.test(num)) return `CP${num}`;
    return "CP";
  }
  return type;
};

// const getEvenementColor = (type) => {
//   const colors = {
//     X: "bg-green-50 text-green-700",
//     RM: "bg-blue-50 text-blue-700",
//     HP: "bg-purple-50 text-purple-700",
//     RC: "bg-yellow-50 text-yellow-700",
//     ANO: "bg-gray-50 text-gray-700",
//     CP: "bg-teal-50 text-teal-700",
//     EF: "bg-pink-50 text-pink-700",
//     F: "bg-indigo-50 text-indigo-700",
//     PS: "bg-orange-50 text-orange-700",
//     A: "bg-red-50 text-red-700",
//     AUT: "bg-amber-50 text-amber-700",
//   };
//   return colors[type] || "bg-gray-50 text-gray-700";
// };

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
    AUT: "text-amber-700",
  };
  return textColors[type] || "text-gray-700";
};

// ─── Recherche locale ─────────────────────────────────────────────────────────

const LocalEmployeeSearch = ({ value, onFilter }) => {
  const searchRef = useRef(null);
  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onFilter(e.target.value)}
          placeholder="Rechercher un badge ou nom..."
          className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none"
        />
        {value && (
          <button
            onClick={() => onFilter("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Section Selector ─────────────────────────────────────────────────────────

const SectionSelector = ({ sections, selectedSection, onChange }) => (
  <div className="flex items-center gap-2">
    <label className="text-sm font-bold text-gray-700 whitespace-nowrap">
      Section :
    </label>
    <div className="relative">
      <select
        value={selectedSection}
        onChange={(e) => onChange(e.target.value)}
        className="pl-3 pr-8 py-2 border-2 border-gray-300 rounded-lg focus:border-akj focus:outline-none text-sm appearance-none bg-white min-w-[200px]"
      >
        <option value="">— Toutes les sections —</option>
        {sections.map((s) => (
          <option key={s.section_id} value={s.nom_section}>
            {s.nom_section} ({s.nb_employes})
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

// ─── Modal Modification des heures ───────────────────────────────────────────

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

  useEffect(() => {
    const loadData = async () => {
      if (!employee || !date) return;
      setLoading(true);
      try {
        const data = await presenceService.getHeuresJour(employee.userid, date);
        setHorairesPrevus(data.horaires_prevu);

        let heureEntreeDefaut = "";
        let heureSortieDefaut = "";

        if (attendance) {
          if (attendance.heure_entree_rectifiee)
            heureEntreeDefaut = attendance.heure_entree_rectifiee.slice(0, 5);
          else if (attendance.heure_entree_comptabilisee)
            heureEntreeDefaut = attendance.heure_entree_comptabilisee.slice(
              0,
              5,
            );
          if (attendance.heure_sortie_rectifiee)
            heureSortieDefaut = attendance.heure_sortie_rectifiee.slice(0, 5);
          else if (attendance.heure_sortie_comptabilisee)
            heureSortieDefaut = attendance.heure_sortie_comptabilisee.slice(
              0,
              5,
            );
        } else {
          heureEntreeDefaut = data.horaires_prevu?.entree?.slice(0, 5) || "";
          heureSortieDefaut = data.horaires_prevu?.sortie?.slice(0, 5) || "";
        }

        setFormData({
          heure_entree: heureEntreeDefaut,
          heure_sortie: heureSortieDefaut,
          commentaire: data.anomalie?.commentaire || "",
        });
      } catch (err) {
        console.error("❌ Erreur chargement données:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [employee, date, attendance]);

  const handleSubmit = async () => {
    if (!formData.heure_entree && !formData.heure_sortie) {
      alert("Veuillez saisir au moins une heure");
      return;
    }
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (formData.heure_entree && !timeRegex.test(formData.heure_entree)) {
      alert("Format heure entrée invalide. Utilisez HH:MM");
      return;
    }
    if (formData.heure_sortie && !timeRegex.test(formData.heure_sortie)) {
      alert("Format heure sortie invalide. Utilisez HH:MM");
      return;
    }

    setLoading(true);
    try {
      await presenceService.modifierHeuresManuellement({
        userid: employee.userid,
        date,
        heure_entree: formData.heure_entree
          ? `${formData.heure_entree}:00`
          : null,
        heure_sortie: formData.heure_sortie
          ? `${formData.heure_sortie}:00`
          : null,
        commentaire: formData.commentaire || "Ajouté manuellement",
      });
      alert("✅ Présence enregistrée avec succès !");
      onSave();
      onClose();
    } catch (err) {
      alert(`❌ Erreur: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cette présence ?")) return;
    setDeleting(true);
    try {
      await presenceService.supprimerHeuresManuellement(employee.userid, date);
      alert("✅ Présence supprimée !");
      if (_onDelete) _onDelete();
      onClose();
    } catch (err) {
      alert(`❌ Erreur: ${err.response?.data?.error || err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const fmt = (t) => (!t ? "Non renseigné" : t.length > 5 ? t.slice(0, 5) : t);
  const canDelete = attendance !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
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
              disabled={loading || deleting}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
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

          {horairesPrevus && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Horaires prévus:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Entrée:</span>
                  <span className="ml-2 font-semibold">
                    {fmt(horairesPrevus.entree)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Sortie:</span>
                  <span className="ml-2 font-semibold">
                    {fmt(horairesPrevus.sortie)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {attendance && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700">Heures existantes:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {[
                  {
                    label: "Brutes",
                    bg: "bg-gray-50",
                    color: "text-gray-600",
                    e: attendance.heure_brute_entree,
                    s: attendance.heure_brute_sortie,
                  },
                  {
                    label: "Prévues",
                    bg: "bg-blue-50",
                    color: "text-blue-700",
                    e: attendance.heure_entree_prevue,
                    s: attendance.heure_sortie_prevue,
                  },
                  {
                    label: "Rectifiées",
                    bg: "bg-green-50",
                    color: "text-green-700",
                    e: attendance.heure_entree_rectifiee,
                    s: attendance.heure_sortie_rectifiee,
                  },
                ].map(({ label, bg, color, e, s }) => (
                  <div key={label} className={`text-center p-2 ${bg} rounded`}>
                    <div className={`font-bold ${color} mb-2`}>{label}</div>
                    <div className="text-xs text-gray-500">Entrée</div>
                    <div className="font-medium">{fmt(e)}</div>
                    <div className="text-xs text-gray-500 mt-2">Sortie</div>
                    <div className="font-medium">{fmt(s)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-bold text-gray-700">
              {attendance ? "Modifier les heures" : "Saisir les heures"}
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Heure d'entrée", key: "heure_entree" },
                { label: "Heure de sortie", key: "heure_sortie" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    {label}
                  </label>
                  <input
                    type="time"
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none"
                    disabled={loading || deleting}
                  />
                </div>
              ))}
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none"
                rows="2"
                placeholder="Ex: Oubli de pointage..."
                disabled={loading || deleting}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={loading || deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center gap-2"
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
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || deleting}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
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

// ─── Modal Horaire ────────────────────────────────────────────────────────────

const HoraireModal = ({ horaire, onClose, onSave }) => {
  const [saving, setSaving] = useState(false);

  const timeToDecimal = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return parseFloat((h + ((m / 60) * 100) / 100).toFixed(2));
  };

  const decimalToTimeLocal = (d) => {
    if (!d && d !== 0) return "00:00";
    const h = Math.floor(d);
    const min = Math.round((d - h) * 100 * 0.6);
    return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

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

  const handleSubmit = async () => {
    if (!formData.section) {
      alert("Veuillez entrer un nom de section");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        section: formData.section,
        heure_entree: timeToDecimal(formData.heure_entree),
        heure_sortie: timeToDecimal(formData.heure_sortie),
        sortie_samedi: timeToDecimal(formData.sortie_samedi),
        sortie_vendredi_paiement: timeToDecimal(
          formData.sortie_vendredi_paiement,
        ),
        sortie_samedi_paiement: timeToDecimal(formData.sortie_samedi_paiement),
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800 sticky top-0 bg-white">
          <h3 className="text-xl font-bold">
            {horaire ? "Modifier" : "Ajouter"} un horaire
          </h3>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {[
            {
              label: "Section *",
              key: "section",
              type: "text",
              disabled: !!horaire,
            },
            { label: "Heure d'entrée *", key: "heure_entree", type: "time" },
            {
              label: "Sortie normale (lun-ven)*",
              key: "heure_sortie",
              type: "time",
            },
            {
              label: "Sortie samedi normal *",
              key: "sortie_samedi",
              type: "time",
            },
          ].map(({ label, key, type, disabled }) => (
            <div key={key}>
              <label className="block text-sm font-bold mb-1 text-gray-700">
                {label}
              </label>
              <input
                type={type}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [key]:
                      type === "text"
                        ? e.target.value.toUpperCase()
                        : e.target.value,
                  })
                }
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none"
                disabled={disabled}
                placeholder={
                  type === "text" ? "Ex: BRODERIE MAIN DEV" : undefined
                }
              />
              {type === "time" && (
                <p className="text-xs text-gray-500 mt-1">
                  Décimal: {timeToDecimal(formData[key])}
                </p>
              )}
            </div>
          ))}

          <div className="border-t-2 border-gray-300 pt-4">
            <h4 className="font-bold text-gray-700 mb-3">
              <span className="text-yellow-600">●</span> Jours de paiement (P)
            </h4>
            {[
              {
                label: "Sortie vendredi paiement *",
                key: "sortie_vendredi_paiement",
              },
              {
                label: "Sortie samedi paiement *",
                key: "sortie_samedi_paiement",
              },
            ].map(({ label, key }) => (
              <div key={key} className="mb-3">
                <label className="block text-sm font-bold mb-1 text-gray-700">
                  {label}
                </label>
                <input
                  type="time"
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="w-full px-3 py-2 border-2 border-yellow-300 rounded focus:border-yellow-600 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Décimal: {timeToDecimal(formData[key])}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center justify-center gap-2 disabled:bg-gray-400"
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

// ─── Modal Événement ──────────────────────────────────────────────────────────

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

  const [cpJours, setCpJours] = useState(() => {
    if (evenement?.type_evenement !== "CP") return "";
    const c = evenement?.commentaire?.trim();
    return c && /^\d+$/.test(c) ? c : "";
  });

  const [autreTexte, setAutreTexte] = useState(
    evenement?.type_evenement === "AUT" ? evenement?.commentaire || "" : "",
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isCP = formData.type_evenement === "CP";
  const isAUT = formData.type_evenement === "AUT";

  const handleTypeChange = (t) => {
    setFormData({ type_evenement: t, commentaire: "" });
    if (t === "CP") setCpJours("");
    if (t === "AUT") setAutreTexte("");
  };

  const buildPayload = () => {
    if (isCP) return { type_evenement: "CP", commentaire: cpJours };
    if (isAUT) return { type_evenement: "AUT", commentaire: autreTexte.trim() };
    return {
      type_evenement: formData.type_evenement,
      commentaire: formData.commentaire,
    };
  };

  const handleSubmit = async () => {
    if (!formData.type_evenement) {
      alert("Choisissez un type d'événement");
      return;
    }
    if (isAUT && !autreTexte.trim()) {
      alert("Saisissez le libellé de l'événement");
      return;
    }
    setSaving(true);
    try {
      await onSave(buildPayload());
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Réinitialiser cet événement à 'X' (Travail normal) ?"))
      return;
    setDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
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
          <div className="bg-gray-50 p-4 rounded text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-bold">Employé:</span>
                <div>{evenement?.name}</div>
              </div>
              <div>
                <span className="font-bold">Badge:</span>
                <div>{evenement?.badgenumber}</div>
              </div>
              <div className="col-span-2">
                <span className="font-bold">Date:</span>
                <div>{evenement?.date}</div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              Type d'événement *
            </label>
            <select
              value={formData.type_evenement}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            >
              {typesEvenement.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.libelle} ({t.code})
                </option>
              ))}
            </select>
          </div>

          {isCP && (
            <div className="bg-teal-50 border border-teal-200 rounded p-4">
              <label className="block text-sm font-bold mb-2 text-teal-800">
                Nombre de jours (optionnel)
              </label>
              <select
                value={cpJours}
                onChange={(e) => setCpJours(e.target.value)}
                className="w-full px-3 py-2 border-2 border-teal-300 rounded focus:border-teal-600 font-semibold text-teal-900"
              >
                <option value="">CP (sans nombre de jours)</option>
                {[2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={String(n)}>
                    CP{n} — {n} jours
                  </option>
                ))}
              </select>
              <p className="text-xs text-teal-600 mt-1">
                Affiché : <strong>{cpJours ? `CP${cpJours}` : "CP"}</strong>
              </p>
            </div>
          )}

          {isAUT && (
            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <label className="block text-sm font-bold mb-2 text-orange-800">
                Libellé de l'événement *
              </label>
              <input
                type="text"
                value={autreTexte}
                onChange={(e) => setAutreTexte(e.target.value)}
                placeholder="Ex : Formation, Visite médicale..."
                className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-600 text-gray-900"
                maxLength={20}
                autoFocus
              />
              <p className="text-xs text-orange-600 mt-1">
                Affiché : <strong>{autreTexte.trim() || "…"}</strong> (
                {autreTexte.length}/20)
              </p>
            </div>
          )}

          {!isCP && !isAUT && (
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
          )}

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
              disabled={saving || deleting}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50"
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

// ─── Composant principal ──────────────────────────────────────────────────────

const AttendancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [presences, setPresences] = useState([]);
  const [periode, setPeriode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 50,
    total_employees: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false,
  });

  const locationState = React.useMemo(
    () => location.state || {},
    [location.state],
  );

  const getInitialMonth = () =>
    locationState.month ? locationState.month : new Date().getMonth() + 1;
  const getInitialYear = () =>
    locationState.year ? locationState.year : new Date().getFullYear();

  const [currentMonth, setCurrentMonth] = useState(getInitialMonth);
  const [currentYear, setCurrentYear] = useState(getInitialYear);
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth);
  const [selectedYear, setSelectedYear] = useState(getInitialYear);
  const [filterChanged, setFilterChanged] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [forceRefresh, setForceRefresh] = useState(0);

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");

  // Permet au dashboard (ou autres pages) de pré-filtrer la section
  useEffect(() => {
    if (locationState.section) {
      setSelectedSection(locationState.section);
      setSearchFilter("");
      setPage(0);
      setForceRefresh((p) => p + 1);
    }
  }, [locationState.section]); // volontairement uniquement la section

  const [dates, setDates] = useState([]);
  const [showHoraires, setShowHoraires] = useState(false);
  const [horaires, setHoraires] = useState([]);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showHoraireModal, setShowHoraireModal] = useState(false);
  const [modeHeures, setModeHeures] = useState("rectifiees");

  const [typesEvenement, setTypesEvenement] = useState([]);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [showEvenementModal, setShowEvenementModal] = useState(false);
  const [evenementsMap, setEvenementsMap] = useState({});

  const [showHeureModal, setShowHeureModal] = useState(false);
  const [selectedHeureData, setSelectedHeureData] = useState(null);

  const [page, setPage] = useState(0);
  const rowsPerPage = 50;

  const componentRef = useRef();
  const isFirstLoad = useRef(true);

  // ─── Debounce recherche ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchFilter.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchFilter]);

  useEffect(() => {
    const state = locationState;
    if (state.returnFromAnomalies) {
      window.history.replaceState({}, document.title);
      // On ne change pas le mois, on rafraîchit juste les données
      setForceRefresh((p) => p + 1);
    }
  }, [locationState]); // plus besoin de currentMonth/currentYear

  const handleMonthChange = (m) => {
    setSelectedMonth(m);
    setFilterChanged(m !== currentMonth || selectedYear !== currentYear);
  };
  const handleYearChange = (y) => {
    setSelectedYear(y);
    setFilterChanged(selectedMonth !== currentMonth || y !== currentYear);
  };

  const applyFilters = () => {
    setCurrentMonth(selectedMonth);
    setCurrentYear(selectedYear);
    setFilterChanged(false);
    setPage(0);
    setForceRefresh((p) => p + 1);
  };

  const refreshData = useCallback(() => setForceRefresh((p) => p + 1), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F5") {
        e.preventDefault();
        refreshData();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [refreshData]);

  // ─── Fetch sections / types / horaires (une seule fois) ───────────────────
  const fetchSections = useCallback(async () => {
    try {
      const d = await presenceService.getSections();
      setSections(d.sections || []);
    } catch (err) {
      console.error("Erreur sections:", err);
    }
  }, []);

  const fetchTypesEvenements = useCallback(async () => {
    try {
      const d = await presenceService.getTypesEvenements();
      setTypesEvenement(d.types_evenements || []);
    } catch (err) {
      console.error("Erreur types événements:", err);
    }
  }, []);

  const fetchHoraires = useCallback(async () => {
    try {
      const d = await presenceService.getHorairesSection();
      setHoraires(d.horaires || []);
    } catch (err) {
      console.error("Erreur horaires:", err);
    }
  }, []);

  // ─── Fonction principale de chargement ─────────────────────────────────────
  const fetchPresences = useCallback(
    async (annee, mois) => {
      // Gestion du spinner : premier chargement → loading, sinon refreshing
      if (isFirstLoad.current) {
        setLoading(true);
        isFirstLoad.current = false;
      } else {
        setRefreshing(true);
      }

      try {
        // Étape 1 : récupérer toutes les dates du mois de référence
        let datesData = await presenceService.getDates(annee, mois);

        // Fonction utilitaire pour obtenir le nombre de jours d'un mois
        const getDaysInMonth = (year, month) =>
          new Date(year, month, 0).getDate();

        // Nombre de jours attendus dans la période (jours du mois précédent)
        const expectedDays = getDaysInMonth(annee, mois - 1);

        // Filtrer pour ne garder que les dates de la période (hors_periode = false)
        const periodeDates = datesData
          ? datesData.filter((d) => !d.hors_periode)
          : [];

        // Si le nombre de dates de la période est insuffisant → génération
        if (periodeDates.length < expectedDays) {
          console.log(
            `Génération des dates pour ${mois}/${annee} (attendues: ${expectedDays}, reçues: ${periodeDates.length})`,
          );
          await presenceService.genererDates(annee, mois);
          // Recharger les dates après génération
          datesData = await presenceService.getDates(annee, mois);
        }

        // Étape 2 : charger les présences avec les filtres (section, recherche, pagination)
        const presencesData = await presenceService.getPresencesMoisCalculee(
          annee,
          mois,
          false,
          selectedSection,
          page + 1,
          rowsPerPage,
          debouncedSearch,
        );

        // Mettre à jour les states
        setDates(datesData || []);
        setPeriode(presencesData.periode || null);
        setPresences(presencesData.presences || []);
        setPagination(
          presencesData.pagination || {
            page: 1,
            page_size: rowsPerPage,
            total_employees: 0,
            total_pages: 0,
          },
        );

        // Construire la map des événements
        const newMap = {};
        (presencesData.presences || []).forEach((p) => {
          const d = formatDate(p.date);
          if (!d || !p.evenement) return;
          newMap[`${p.userid}-${d}`] = {
            type: p.evenement,
            display: computeDisplay(p.evenement, p.evenement_commentaire),
            commentaire: p.evenement_commentaire || "",
          };
        });
        setEvenementsMap(newMap);
      } catch (err) {
        console.error("❌ Erreur chargement:", err);
        alert("Erreur lors du chargement des présences: " + err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedSection, page, debouncedSearch],
  ); // ← plus de dépendance à presences

  useEffect(() => {
    fetchTypesEvenements();
    fetchHoraires();
    fetchSections();
  }, [fetchTypesEvenements, fetchHoraires, fetchSections]);

  useEffect(() => {
    fetchPresences(currentYear, currentMonth);
  }, [
    currentYear,
    currentMonth,
    selectedSection,
    page,
    debouncedSearch,
    forceRefresh,
    fetchPresences,
  ]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleHeureClick = useCallback(
    (employee, dateStr, attendance) => {
      if (modeHeures === "brutes") {
        alert("Les heures brutes ne sont pas modifiables.");
        return;
      }
      const d = formatDate(dateStr);
      if (!d) return;
      setSelectedHeureData({ employee, date: d, attendance });
      setShowHeureModal(true);
    },
    [modeHeures],
  );

  const getEvenementForCell = useCallback(
    (userId, dateStr, attendance) => {
      const d = formatDate(dateStr);
      if (!d) return null;
      const ev = evenementsMap[`${userId}-${d}`];
      if (!ev) return null;
      if (
        ev.type === "X" &&
        !attendance?.present &&
        !attendance?.est_anomalie_corrigee
      )
        return null;
      return ev;
    },
    [evenementsMap],
  );

  const handleEvenementClick = useCallback(
    (employee, dateStr, attendance) => {
      const d = formatDate(dateStr);
      if (!d) return;
      const current = evenementsMap[`${employee.userid}-${d}`] || {
        type: "X",
        display: "",
        commentaire: "",
      };
      setSelectedEvenement({
        userid: employee.userid,
        badgenumber: employee.badgenumber,
        name: employee.name,
        date: d,
        type_evenement: current.type,
        commentaire: current.commentaire,
        attendance,
      });
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
        setEvenementsMap((prev) => ({
          ...prev,
          [`${userid}-${date}`]: {
            type: formData.type_evenement,
            display: computeDisplay(
              formData.type_evenement,
              formData.commentaire,
            ),
            commentaire: formData.commentaire || "",
          },
        }));
        setShowEvenementModal(false);
        setSelectedEvenement(null);
        refreshData();
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la sauvegarde.");
      }
    },
    [selectedEvenement, refreshData],
  );

  const handleDeleteEvenement = useCallback(async () => {
    try {
      const { userid, date } = selectedEvenement;
      await presenceService.deleteEvenementByUserDate(userid, date);
      setEvenementsMap((prev) => ({
        ...prev,
        [`${userid}-${date}`]: { type: "X", display: "", commentaire: "" },
      }));
      setShowEvenementModal(false);
      setSelectedEvenement(null);
      refreshData();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    }
  }, [selectedEvenement, refreshData]);

  const handleSaveHoraire = useCallback(
    async (data) => {
      try {
        if (selectedHoraire)
          await presenceService.updateHoraireSection(
            selectedHoraire.section,
            data,
          );
        else await presenceService.createHoraireSection(data);
        setShowHoraireModal(false);
        setSelectedHoraire(null);
        await fetchHoraires();
        alert("Horaire enregistré !");
        refreshData();
      } catch (err) {
        alert(`Erreur: ${err.response?.data?.message || err.message}`);
      }
    },
    [selectedHoraire, fetchHoraires, refreshData],
  );

  // ─── Données dérivées ──────────────────────────────────────────────────────

  const datesValides = useMemo(
    () => dates.filter((d) => !d.hors_periode),
    [dates],
  );

  const weeks = useMemo(() => {
    const w = {};
    datesValides.forEach((date) => {
      const s = date.code_date?.[0];
      if (s) {
        if (!w[s]) w[s] = [];
        w[s].push(date);
      }
    });
    return w;
  }, [datesValides]);

  const employees = useMemo(() => {
    const map = {};
    presences.forEach((p) => {
      if (p.hors_periode) return;
      if (!map[p.userid]) {
        map[p.userid] = {
          userid: p.userid,
          badgenumber: p.badgenumber,
          name: p.name,
          section: p.section || "ADMINISTRATION",
          presences: {},
          hasPresence: false,
        };
      }
      const d = formatDate(p.date);
      if (d) {
        map[p.userid].presences[d] = p;
        map[p.userid].hasPresence = true;
      }
    });
    return Object.values(map)
      .filter((e) => e.hasPresence)
      .sort(
        (a, b) =>
          a.badgenumber?.localeCompare(b.badgenumber, undefined, {
            numeric: true,
          }) || 0,
      );
  }, [presences]);

  const weekNumbers = useMemo(
    () => Object.keys(weeks).sort((a, b) => parseInt(a) - parseInt(b)),
    [weeks],
  );

  const totalPages = pagination.total_pages || 0;

  const getHeuresAffichees = useCallback(
    (attendance) => {
      if (!attendance)
        return { heureEntreeAffichee: "", heureSortieAffichee: "" };
      if (modeHeures === "brutes") {
        return {
          heureEntreeAffichee: attendance.heure_brute_entree?.slice(0, 5) || "",
          heureSortieAffichee: attendance.heure_brute_sortie?.slice(0, 5) || "",
        };
      }
      return {
        heureEntreeAffichee:
          attendance.heure_entree_comptabilisee?.slice(0, 5) || "",
        heureSortieAffichee:
          attendance.heure_sortie_comptabilisee?.slice(0, 5) || "",
      };
    },
    [modeHeures],
  );

  const getCellBackgroundColor = useCallback((attendance) => {
    if (!attendance) return "transparent";
    if (attendance.est_jour_paiement) return "";
    if (attendance.est_samedi) return "bg-gray-50";
    return "transparent";
  }, []);

  const getTimeAnomalyColor = useCallback((attendance) => {
    if (!attendance || attendance.est_anomalie_corrigee)
      return { entreeColor: "", sortieColor: "" };
    const hasE = !!(
      attendance.heure_brute_entree || attendance.heure_entree_comptabilisee
    );
    const hasS = !!(
      attendance.heure_brute_sortie || attendance.heure_sortie_comptabilisee
    );
    if (hasE && !hasS) return { entreeColor: "text-red-700", sortieColor: "" };
    if (!hasE && hasS) return { entreeColor: "", sortieColor: "text-red-700" };
    return { entreeColor: "", sortieColor: "" };
  }, []);

  const getAttendanceData = useCallback((employee, dateStr) => {
    const d = formatDate(dateStr);
    if (!d) return null;
    return employee.presences[d] || null;
  }, []);

  const getMonthAbbreviation = useCallback((dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return [
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
    ][d.getMonth()];
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Fiche_Presence_${periode?.mois}_${periode?.annee}${selectedSection ? `_${selectedSection}` : ""}`,
  });

  // ─── Rendu : spinner plein écran uniquement au premier chargement ──────────
  if (loading && presences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des présences...</p>
      </div>
    );
  }

  // ─── Vue Horaires ─────────────────────────────────────────────────────────
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
                ← Retour
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
                {[
                  "SECTION",
                  "HEURE ENTRÉE",
                  "SORTIE NORMALE",
                  "SORTIE SAMEDI NORMAL",
                  "SORTIE VENDREDI P",
                  "SORTIE SAMEDI P",
                  "ACTIONS",
                ].map((h) => (
                  <th
                    key={h}
                    className="border-2 border-gray-800 p-3 font-bold text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horaires.map((horaire, idx) => (
                <tr key={idx} className="border-b-2 border-gray-800">
                  <td className="border-2 border-gray-800 p-3 font-semibold">
                    {horaire.section}
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    {decimalToTime(horaire.heure_entree)}
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    {decimalToTime(horaire.heure_sortie)}
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    {decimalToTime(horaire.sortie_samedi)}
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    {decimalToTime(horaire.sortie_vendredi_paiement)}
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    {decimalToTime(horaire.sortie_samedi_paiement)}
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

  // ─── Vue principale ───────────────────────────────────────────────────────
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* ── Spinner discret lors des rechargements ── */}
      {refreshing && (
        <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-50 border border-gray-200">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm text-gray-600 font-medium">
            Mise à jour...
          </span>
        </div>
      )}

      <div ref={componentRef} className="print-container">
        {/* ── En-tête ── */}
        <div className="bg-white border-2 border-gray-800 mb-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-akj text-white px-6 py-3 font-bold text-lg">
                AKANJO
              </div>
              <h1 className="text-2xl font-bold uppercase">
                FICHE DE PRESENCE
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
                    className="px-3 py-0.5 border border-gray-300 rounded text-sm   w-full focus:ring-1 focus:outline-none focus:ring-gray-500"
                  >
                    {[
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
                    ].map((m, i) => (
                      <option key={i + 1} value={i + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs text-gray-600 mb-1">
                    Année
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(parseInt(e.target.value))}
                    className="px-3 py-0.5 border border-gray-300 rounded text-sm  w-full focus:ring-1 focus:outline-none focus:ring-gray-500"
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
                </div>
                {filterChanged && (
                  <button
                    onClick={applyFilters}
                    className="flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded mt-5"
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
                {selectedSection ||
                  (employees.length > 0
                    ? employees[0].section
                    : "TOUTES LES SECTIONS")}
              </span>
            </div>
            <div className="print:text-right">
              <span className="font-bold italic">Période du:</span>
              <span className="ml-2">{periode?.du}</span>
              <span className="mx-2 font-bold">au:</span>
              <span>{periode?.au}</span>
            </div>
          </div>

          {/* ── Barre d'outils ── */}
          <div className="flex flex-wrap gap-2 mt-4 border-t-2 border-gray-800 pt-3 print:hidden items-center">
            <div className="h-7 flex items-center min-w-[200px] [&_input]:h-7 [&_input]:py-0 [&_input]:text-sm">
              <LocalEmployeeSearch
                value={searchFilter}
                onFilter={setSearchFilter}
              />
            </div>

            <div className="h-7 flex items-center [&_select]:h-7 [&_select]:py-0 [&_select]:text-sm [&>div]:h-7">
              <SectionSelector
                sections={sections}
                selectedSection={selectedSection}
                onChange={(s) => {
                  setSelectedSection(s);
                  setSearchFilter("");
                  setPage(0);
                }}
              />
            </div>

            <div className="flex items-center px-3 h-7 bg-gray-100 rounded text-sm text-gray-600 border border-gray-300">
              <span className="font-semibold text-gray-800">
                {pagination.total_employees || 0}
              </span>
              <span className="ml-1">
                employé{(pagination.total_employees || 0) > 1 ? "s" : ""}
              </span>
            </div>

            <button
              onClick={() => setShowHoraires(true)}
              className="flex items-center gap-2 px-3 h-7 text-sm bg-akj text-white rounded hover:bg-gray-700"
            >
              Horaires
            </button>

            <button
              onClick={() =>
                navigate("/anomalies", {
                  state: {
                    month: currentMonth,
                    year: currentYear,
                    returnFromAnomalies: true,
                  },
                })
              }
              className="flex items-center gap-2 px-3 h-7 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Anomalies
            </button>

            <button
              onClick={() => setModeHeures("brutes")}
              className={`px-3 h-7 text-sm rounded border focus:outline-none ${modeHeures === "brutes" ? "border-gray-400 bg-gray-50 text-gray-700 font-semibold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Heures Brutes
            </button>

            <button
              onClick={() => setModeHeures("rectifiees")}
              className={`px-3 h-7 text-sm rounded border focus:outline-none ${modeHeures === "rectifiees" ? "border-gray-400 bg-gray-50 text-gray-700 font-semibold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
            >
              Heures Rectifiées
            </button>

            <button
              onClick={() => handlePrint()}
              className="ml-auto flex items-center gap-2 px-3 h-7 text-sm bg-akj text-white rounded hover:bg-gray-700"
            >
              Imprimer
            </button>
          </div>

          {/* ── Légende ── */}
          {/* <div className="mt-4 border-t-2 border-gray-800 pt-4 print:hidden">
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
          </div> */}
        </div>

        {/* ── Message vide ── */}
        {employees.length === 0 && !loading && !refreshing && (
          <div className="bg-white border-2 border-gray-300 rounded p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">👥</div>
            <div className="text-gray-600 font-semibold text-lg">
              {selectedSection
                ? `Aucune présence trouvée pour la section "${selectedSection}"`
                : "Aucune présence trouvée pour cette période"}
            </div>
            {selectedSection && (
              <button
                onClick={() => {
                  setSelectedSection("");
                  setPage(0);
                }}
                className="mt-4 px-4 py-2 bg-akj text-white rounded hover:bg-gray-700 text-sm"
              >
                Voir toutes les sections
              </button>
            )}
          </div>
        )}

        {/* ── Tableau ── */}
        {employees.length > 0 && (
          <div className="bg-white border-x-2 border-b-2 border-gray-800 overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse text-xs print:text-[7.5pt] print:table-fixed">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10 print:w-[120px] print:max-w-[120px]"
                    rowSpan="4"
                  >
                    <div className="font-bold text-sm w-32 print:w-full">
                      N° / NOM
                    </div>
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
                {employees.map((employee, empIdx) => (
                  <React.Fragment key={empIdx}>
                    <tr className="border-b-2 border-gray-800">
                      <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10 print:w-[120px] print:max-w-[120px]">
                        <div className="flex items-baseline gap-2 print:flex-col print:gap-0">
                          <span className="font-bold text-sm shrink-0">
                            {employee.badgenumber}
                          </span>
                          <span className="italic text-sm print:text-[7pt] print:leading-tight print:break-words print:overflow-hidden print:line-clamp-2">
                            {employee.name}
                          </span>
                        </div>
                        {!selectedSection && (
                          <div className="text-xs text-gray-400 mt-0.5 print:hidden">
                            {employee.section}
                          </div>
                        )}
                      </td>

                      {datesValides.map((dateObj, dayIdx) => {
                        const attendance = getAttendanceData(
                          employee,
                          dateObj.date,
                        );
                        const eventData = getEvenementForCell(
                          employee.userid,
                          dateObj.date,
                          attendance,
                        );
                        const { heureEntreeAffichee, heureSortieAffichee } =
                          getHeuresAffichees(attendance);
                        const backgroundColor =
                          getCellBackgroundColor(attendance);
                        const { entreeColor, sortieColor } =
                          getTimeAnomalyColor(attendance);
                        const estModifieManuellement =
                          !!attendance?.anomalie_id;
                        const estCorrectionAuto =
                          !!attendance?.est_correction_auto;

                        return (
                          <td
                            key={dayIdx}
                            className={`border border-gray-600 p-0 text-center relative group ${backgroundColor}`}
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
                                title="Correction automatique"
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
                                className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] w-full transition-colors print:hover:bg-transparent"
                                title={
                                  modeHeures === "brutes"
                                    ? "Non modifiable"
                                    : "Modifier"
                                }
                              >
                                {heureEntreeAffichee ? (
                                  <span className={entreeColor}>
                                    {heureEntreeAffichee}
                                  </span>
                                ) : (
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
                                className={`print:text-[7pt] border-b border-gray-300 px-1 py-0.5 min-h-[21px] text-xs font-bold w-full hover:bg-gray-50 transition-colors print:hover:bg-transparent ${eventData?.type ? getEvenementTextColor(eventData.type) : ""}`}
                                title={
                                  eventData?.type
                                    ? `Événement: ${eventData.type}`
                                    : "Ajouter un événement"
                                }
                              >
                                {eventData?.display || ""}
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
                                className="px-1 py-0.5 min-h-[20px] w-full transition-colors print:hover:bg-transparent"
                                title={
                                  modeHeures === "brutes"
                                    ? "Non modifiable"
                                    : "Modifier"
                                }
                              >
                                {heureSortieAffichee ? (
                                  <span className={sortieColor}>
                                    {heureSortieAffichee}
                                  </span>
                                ) : (
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
        )}
        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-4 mt-4 print:hidden">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={!pagination.has_previous}
              className="flex items-center gap-1 px-3 py-0.5 border border-gray-300 rounded text-sm focus:ring-1 focus : outline-none focus:ring-gray-500 disabled:opacity-50 "
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>
            <span className="text-sm">
              Page {pagination.page || 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.has_next}
              className="flex items-center gap-1 px-3 py-0.5 border border-gray-300 rounded text-sm  focus:ring-1 focus : outline-none focus:ring-gray-500 disabled:opacity-50"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showHeureModal && selectedHeureData && (
        <HeureModal
          employee={selectedHeureData.employee}
          date={selectedHeureData.date}
          attendance={selectedHeureData.attendance}
          onClose={() => {
            setShowHeureModal(false);
            setSelectedHeureData(null);
          }}
          onSave={refreshData}
          onDelete={refreshData}
        />
      )}

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
