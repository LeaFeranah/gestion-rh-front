import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Settings,
  Edit2,
  Plus,
  Save,
  X,
  Trash2,
  Clock,
  Search,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import presenceService from "../../services/presenceService";
import { useReactToPrint } from "react-to-print";
import "/src/styles/custom.css";

// ─── Utilitaires ────────────────────────────────────────────────────────────

const decimalToTime = (decimal) => {
  if (!decimal && decimal !== 0) return "00:00";
  const decimalNum = parseFloat(decimal);
  const hours = Math.floor(decimalNum);
  const minutes = Math.round((decimalNum - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const formatDate = (dateStr) => {
  if (typeof dateStr === "string" && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) { console.error("❌ Date invalide:", dateStr); return ""; }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Calcule le texte à afficher dans la grille pour un événement.
 * CP + commentaire "3" → "CP3"
 * CP + commentaire ""  → "CP"
 * AUT + commentaire "Formation" → "Formation"
 */
const computeDisplay = (type, commentaire) => {
  if (type === "AUT") return commentaire?.trim() || "Autre";
  if (type === "CP") {
    const num = commentaire?.trim();
    if (num && /^\d+$/.test(num)) return `CP${num}`;
    return "CP";
  }
  return type;
};

// ─── Couleurs événements ─────────────────────────────────────────────────────

const getEvenementColor = (type) => {
  const colors = {
    X:   "bg-green-50 text-green-700",
    RM:  "bg-blue-50 text-blue-700",
    HP:  "bg-purple-50 text-purple-700",
    RC:  "bg-yellow-50 text-yellow-700",
    ANO: "bg-gray-50 text-gray-700",
    CP:  "bg-teal-50 text-teal-700",
    EF:  "bg-pink-50 text-pink-700",
    F:   "bg-indigo-50 text-indigo-700",
    PS:  "bg-orange-50 text-orange-700",
    A:   "bg-red-50 text-red-700",
    AUT: "bg-amber-50 text-amber-700",
  };
  return colors[type] || "bg-gray-50 text-gray-700";
};

const getEvenementTextColor = (type) => {
  const textColors = {
    X:   "text-green-700",
    RM:  "text-blue-700",
    HP:  "text-purple-700",
    RC:  "text-yellow-700",
    ANO: "text-gray-700",
    CP:  "text-teal-700",
    EF:  "text-pink-700",
    F:   "text-indigo-700",
    PS:  "text-orange-700",
    A:   "text-red-700",
    AUT: "text-amber-700",
  };
  return textColors[type] || "text-gray-700";
};

// ─── Recherche locale ────────────────────────────────────────────────────────

const LocalEmployeeSearch = ({ onFilter }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) onFilter("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onFilter]);

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
    onFilter(e.target.value);
  };
  const handleClear = () => { setSearchQuery(""); onFilter(""); };

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
          <button onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Modal Modification des heures ──────────────────────────────────────────

const HeureModal = ({ employee, date, attendance, onClose, onSave, onDelete: _onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ heure_entree: "", heure_sortie: "", commentaire: "" });
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
          if (attendance.heure_entree_rectifiee) heureEntreeDefaut = attendance.heure_entree_rectifiee.slice(0, 5);
          else if (attendance.heure_entree_comptabilisee) heureEntreeDefaut = attendance.heure_entree_comptabilisee.slice(0, 5);
          if (attendance.heure_sortie_rectifiee) heureSortieDefaut = attendance.heure_sortie_rectifiee.slice(0, 5);
          else if (attendance.heure_sortie_comptabilisee) heureSortieDefaut = attendance.heure_sortie_comptabilisee.slice(0, 5);
        } else {
          heureEntreeDefaut = data.horaires_prevu?.entree?.slice(0, 5) || "";
          heureSortieDefaut = data.horaires_prevu?.sortie?.slice(0, 5) || "";
        }
        setFormData({ heure_entree: heureEntreeDefaut, heure_sortie: heureSortieDefaut, commentaire: data.anomalie?.commentaire || "" });
      } catch (error) {
        console.error("❌ Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [employee, date, attendance]);

  const handleSubmit = async () => {
    if (!formData.heure_entree && !formData.heure_sortie) { alert("Veuillez saisir au moins une heure"); return; }
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (formData.heure_entree && !timeRegex.test(formData.heure_entree)) { alert("Format heure entrée invalide. Utilisez HH:MM"); return; }
    if (formData.heure_sortie && !timeRegex.test(formData.heure_sortie)) { alert("Format heure sortie invalide. Utilisez HH:MM"); return; }
    setLoading(true);
    try {
      await presenceService.modifierHeuresManuellement({
        userid: employee.userid,
        date,
        heure_entree: formData.heure_entree ? `${formData.heure_entree}:00` : null,
        heure_sortie: formData.heure_sortie ? `${formData.heure_sortie}:00` : null,
        commentaire: formData.commentaire || "Ajouté manuellement",
      });
      alert("✅ Présence enregistrée avec succès !");
      onSave();
      onClose();
    } catch (error) {
      alert(`❌ Erreur: ${error.response?.data?.error || error.message}`);
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
    } catch (error) {
      alert(`❌ Erreur: ${error.response?.data?.error || error.message}`);
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
              <h3 className="text-xl font-bold">{attendance ? "Modifier la présence" : "Ajouter une présence"}</h3>
            </div>
            <button onClick={onClose} disabled={loading || deleting} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-bold text-gray-600">Employé:</span><div className="mt-1 font-semibold">{employee?.name}</div></div>
              <div><span className="font-bold text-gray-600">Badge:</span><div className="mt-1 font-semibold">{employee?.badgenumber}</div></div>
              <div className="col-span-2">
                <span className="font-bold text-gray-600">Date:</span>
                <div className="mt-1 font-semibold">
                  {new Date(date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
              {(attendance?.section || employee?.section) && (
                <div className="col-span-2"><span className="font-bold text-gray-600">Section:</span><div className="mt-1 font-semibold">{attendance?.section || employee?.section}</div></div>
              )}
            </div>
          </div>

          {horairesPrevus && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Horaires prévus:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-blue-700">Entrée:</span><span className="ml-2 font-semibold">{fmt(horairesPrevus.entree)}</span></div>
                <div><span className="text-blue-700">Sortie:</span><span className="ml-2 font-semibold">{fmt(horairesPrevus.sortie)}</span></div>
              </div>
            </div>
          )}

          {attendance && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700">Heures existantes:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-bold text-gray-600 mb-2">Brutes</div>
                  <div className="text-xs text-gray-500">Entrée</div>
                  <div className="font-medium">{fmt(attendance.heure_brute_entree)}</div>
                  <div className="text-xs text-gray-500 mt-2">Sortie</div>
                  <div className="font-medium">{fmt(attendance.heure_brute_sortie)}</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-700 mb-2">Prévues</div>
                  <div className="text-xs text-blue-600">Entrée</div>
                  <div className="font-medium text-blue-900">{fmt(attendance.heure_entree_prevue)}</div>
                  <div className="text-xs text-blue-600 mt-2">Sortie</div>
                  <div className="font-medium text-blue-900">{fmt(attendance.heure_sortie_prevue)}</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-700 mb-2">Rectifiées</div>
                  <div className="text-xs text-green-600">Entrée</div>
                  <div className="font-medium text-green-900">{fmt(attendance.heure_entree_rectifiee)}</div>
                  <div className="text-xs text-green-600 mt-2">Sortie</div>
                  <div className="font-medium text-green-900">{fmt(attendance.heure_sortie_rectifiee)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h4 className="font-bold text-gray-700">{attendance ? "Modifier les heures" : "Saisir les heures"}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Heure d'entrée</label>
                <input type="time" value={formData.heure_entree} onChange={(e) => setFormData({ ...formData, heure_entree: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none" disabled={loading || deleting} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Heure de sortie</label>
                <input type="time" value={formData.heure_sortie} onChange={(e) => setFormData({ ...formData, heure_sortie: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none" disabled={loading || deleting} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Commentaire</label>
              <textarea value={formData.commentaire} onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none"
                rows="2" placeholder="Ex: Oubli de pointage..." disabled={loading || deleting} />
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            {canDelete && (
              <button onClick={handleDelete} disabled={loading || deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center gap-2">
                {deleting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Suppression...</> : <><Trash2 className="w-4 h-4" />Supprimer</>}
              </button>
            )}
            <button onClick={onClose} disabled={loading || deleting} className="flex-1 px-4 py-3 border-2 border-gray-300 rounded hover:bg-gray-50">Annuler</button>
            <button onClick={handleSubmit} disabled={loading || deleting}
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
              {loading ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Enregistrement...</> : <><Save className="w-4 h-4" />Enregistrer</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Horaire ───────────────────────────────────────────────────────────

const HoraireModal = ({ horaire, onClose, onSave }) => {
  const [saving, setSaving] = useState(false);

  const timeToDecimal = (timeStr) => {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(":").map(Number);
    return parseFloat((hours + (minutes / 60 * 100) / 100).toFixed(2));
  };

  const decimalToTimeLocal = (decimal) => {
    if (!decimal && decimal !== 0) return "00:00";
    const decimalNum = parseFloat(decimal);
    const hours = Math.floor(decimalNum);
    const centiemes = (decimalNum - hours) * 100;
    const minutes = Math.round(centiemes * 0.6);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const [formData, setFormData] = useState({
    section: horaire?.section || "",
    heure_entree: horaire ? decimalToTimeLocal(horaire.heure_entree) : "07:30",
    heure_sortie: horaire ? decimalToTimeLocal(horaire.heure_sortie) : "17:50",
    sortie_samedi: horaire ? decimalToTimeLocal(horaire.sortie_samedi) : "15:30",
    sortie_vendredi_paiement: horaire ? decimalToTimeLocal(horaire.sortie_vendredi_paiement) : "17:33",
    sortie_samedi_paiement: horaire ? decimalToTimeLocal(horaire.sortie_samedi_paiement) : "13:00",
  });

  const handleSubmit = async () => {
    if (!formData.section) { alert("Veuillez entrer un nom de section"); return; }
    setSaving(true);
    try {
      await onSave({
        section: formData.section,
        heure_entree: timeToDecimal(formData.heure_entree),
        heure_sortie: timeToDecimal(formData.heure_sortie),
        sortie_samedi: timeToDecimal(formData.sortie_samedi),
        sortie_vendredi_paiement: timeToDecimal(formData.sortie_vendredi_paiement),
        sortie_samedi_paiement: timeToDecimal(formData.sortie_samedi_paiement),
      });
    } catch (err) {
      console.error("❌:", err);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800 sticky top-0 bg-white">
          <h3 className="text-xl font-bold">{horaire ? "Modifier" : "Ajouter"} un horaire</h3>
          <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Section *", key: "section", type: "text", disabled: !!horaire },
            { label: "Heure d'entrée *", key: "heure_entree", type: "time" },
            { label: "Sortie normale (lun-ven) *", key: "heure_sortie", type: "time" },
            { label: "Sortie samedi normal *", key: "sortie_samedi", type: "time" },
          ].map(({ label, key, type, disabled }) => (
            <div key={key}>
              <label className="block text-sm font-bold mb-1 text-gray-700">{label}</label>
              <input type={type} value={formData[key]}
                onChange={(e) => setFormData({ ...formData, [key]: type === "text" ? e.target.value.toUpperCase() : e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800 focus:outline-none"
                disabled={disabled} placeholder={type === "text" ? "Ex: BRODERIE MAIN DEV" : undefined} />
              {type === "time" && <p className="text-xs text-gray-500 mt-1">Décimal: {timeToDecimal(formData[key])}</p>}
            </div>
          ))}

          <div className="border-t-2 border-gray-300 pt-4">
            <h4 className="font-bold text-gray-700 mb-3"><span className="text-yellow-600">●</span> Jours de paiement (P)</h4>
            {[
              { label: "Sortie vendredi paiement *", key: "sortie_vendredi_paiement", border: "border-yellow-300 focus:border-yellow-600" },
              { label: "Sortie samedi paiement *", key: "sortie_samedi_paiement", border: "border-yellow-300 focus:border-yellow-600" },
            ].map(({ label, key, border }) => (
              <div key={key} className="mb-3">
                <label className="block text-sm font-bold mb-1 text-gray-700">{label}</label>
                <input type="time" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className={`w-full px-3 py-2 border-2 rounded focus:outline-none ${border}`} />
                <p className="text-xs text-gray-500 mt-1">Décimal: {timeToDecimal(formData[key])}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} disabled={saving} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Annuler</button>
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center justify-center gap-2 disabled:bg-gray-400">
              {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Enregistrement...</> : <><Save className="w-4 h-4" />Enregistrer</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Modal Événement ─────────────────────────────────────────────────────────

const EvenementModal = ({ evenement, onClose, onSave, onDelete, typesEvenement }) => {
  const [formData, setFormData] = useState({
    type_evenement: evenement?.type_evenement || "X",
    commentaire: evenement?.commentaire || "",
  });

  // CP : numéro de jours ("" = CP seul, "2".."7")
  const [cpJours, setCpJours] = useState(() => {
    if (evenement?.type_evenement !== "CP") return "";
    const c = evenement?.commentaire?.trim();
    return c && /^\d+$/.test(c) ? c : "";
  });

  // AUT : texte libre
  const [autreTexte, setAutreTexte] = useState(
    evenement?.type_evenement === "AUT" ? evenement?.commentaire || "" : ""
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isCP  = formData.type_evenement === "CP";
  const isAUT = formData.type_evenement === "AUT";

  const handleTypeChange = (newType) => {
    setFormData({ type_evenement: newType, commentaire: "" });
    if (newType === "CP")  setCpJours("");
    if (newType === "AUT") setAutreTexte("");
  };

  const buildPayload = () => {
    if (isCP)  return { type_evenement: "CP",  commentaire: cpJours };
    if (isAUT) return { type_evenement: "AUT", commentaire: autreTexte.trim() };
    return { type_evenement: formData.type_evenement, commentaire: formData.commentaire };
  };

  const handleSubmit = async () => {
    if (!formData.type_evenement) { alert("Choisissez un type d'événement"); return; }
    if (isAUT && !autreTexte.trim()) { alert("Saisissez le libellé de l'événement"); return; }
    setSaving(true);
    try { await onSave(buildPayload()); }
    catch (err) { console.error(err); alert("Erreur lors de l'enregistrement"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Réinitialiser cet événement à 'X' (Travail normal) ?")) return;
    setDeleting(true);
    try { await onDelete(); onClose(); }
    catch (err) { console.error(err); alert("Erreur lors de la suppression"); }
    finally { setDeleting(false); }
  };

  const canDelete = evenement && evenement.type_evenement !== "X";

  const displayTypes = [
    ...typesEvenement,
    ...(typesEvenement.some((t) => t.code === "AUT") ? [] : [{ code: "AUT", libelle: "Autre (saisie libre)" }]),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b-2 border-gray-800">
          <h3 className="text-xl font-bold">{evenement ? "Modifier" : "Ajouter"} un événement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Infos employé */}
          <div className="bg-gray-50 p-4 rounded text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="font-bold">Employé:</span><div>{evenement?.name}</div></div>
              <div><span className="font-bold">Badge:</span><div>{evenement?.badgenumber}</div></div>
              <div className="col-span-2"><span className="font-bold">Date:</span><div>{evenement?.date}</div></div>
            </div>
          </div>

          {/* Sélection du type */}
          <div>
            <label className="block text-sm font-bold mb-1">Type d'événement *</label>
            <select value={formData.type_evenement} onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800">
              {displayTypes.map((type) => (
                <option key={type.code} value={type.code}>{type.libelle} ({type.code})</option>
              ))}
            </select>
          </div>

          {/* ── CP : nombre de jours optionnel ── */}
          {isCP && (
            <div className="bg-teal-50 border border-teal-200 rounded p-4">
              <label className="block text-sm font-bold mb-2 text-teal-800">Nombre de jours (optionnel)</label>
              <select value={cpJours} onChange={(e) => setCpJours(e.target.value)}
                className="w-full px-3 py-2 border-2 border-teal-300 rounded focus:border-teal-600 font-semibold text-teal-900">
                <option value="">CP (sans nombre de jours)</option>
                {[2, 3, 4, 5, 6, 7].map((n) => (
                  <option key={n} value={String(n)}>CP{n} — {n} jours</option>
                ))}
              </select>
              <p className="text-xs text-teal-600 mt-1">
                Affiché dans la fiche : <strong>{cpJours ? `CP${cpJours}` : "CP"}</strong>
              </p>
            </div>
          )}

          {/* ── AUT : saisie libre ── */}
          {isAUT && (
            <div className="bg-orange-50 border border-orange-200 rounded p-4">
              <label className="block text-sm font-bold mb-2 text-orange-800">Libellé de l'événement *</label>
              <input type="text" value={autreTexte} onChange={(e) => setAutreTexte(e.target.value)}
                placeholder="Ex : Formation, Visite médicale..."
                className="w-full px-3 py-2 border-2 border-orange-300 rounded focus:border-orange-600 text-gray-900"
                maxLength={20} autoFocus />
              <p className="text-xs text-orange-600 mt-1">
                Affiché dans la fiche : <strong>{autreTexte.trim() || "…"}</strong>
                &nbsp;({autreTexte.length}/20)
              </p>
            </div>
          )}

          {/* Commentaire générique (pas pour CP ni AUT) */}
          {!isCP && !isAUT && (
            <div>
              <label className="block text-sm font-bold mb-1">Commentaire (optionnel)</label>
              <textarea value={formData.commentaire} onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
                rows="2" placeholder="Commentaire facultatif..." />
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            {canDelete && (
              <button onClick={handleDelete} disabled={saving || deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
                {deleting ? "Suppression..." : <><Trash2 className="w-4 h-4" />Supprimer</>}
              </button>
            )}
            <button onClick={onClose} disabled={saving || deleting} className="flex-1 px-4 py-2 border-2 border-gray-300 rounded hover:bg-gray-50">Annuler</button>
            <button onClick={handleSubmit} disabled={saving || deleting}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 flex items-center justify-center gap-2 disabled:bg-gray-400">
              {saving ? "Enregistrement..." : <><Save className="w-4 h-4" />Enregistrer</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Composant principal ─────────────────────────────────────────────────────

const AttendancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [presences, setPresences] = useState([]);
  const [periode, setPeriode] = useState(null);
  const [loading, setLoading] = useState(true);

  const locationState = React.useMemo(() => location.state || {}, [location.state]);

  const getInitialMonth = () => (locationState.month && locationState.returnFromAnomalies ? locationState.month : new Date().getMonth() + 1);
  const getInitialYear  = () => (locationState.year  && locationState.returnFromAnomalies ? locationState.year  : new Date().getFullYear());

  const [currentMonth, setCurrentMonth]   = useState(getInitialMonth);
  const [currentYear, setCurrentYear]     = useState(getInitialYear);
  const [selectedMonth, setSelectedMonth] = useState(getInitialMonth);
  const [selectedYear, setSelectedYear]   = useState(getInitialYear);
  const [filterChanged, setFilterChanged] = useState(false);
  const [searchFilter, setSearchFilter]   = useState("");

  const [dates, setDates]           = useState([]);
  const [showHoraires, setShowHoraires] = useState(false);
  const [horaires, setHoraires]     = useState([]);
  const [selectedHoraire, setSelectedHoraire] = useState(null);
  const [showHoraireModal, setShowHoraireModal] = useState(false);
  const [modeHeures, setModeHeures] = useState("rectifiees");
  const [forceRefresh, setForceRefresh] = useState(0);

  const [typesEvenement, setTypesEvenement]   = useState([]);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [showEvenementModal, setShowEvenementModal] = useState(false);
  // evenementsMap : key → { type, display, commentaire }
  const [evenementsMap, setEvenementsMap] = useState({});

  const [showHeureModal, setShowHeureModal]   = useState(false);
  const [selectedHeureData, setSelectedHeureData] = useState(null);

  const componentRef = useRef();

  // ── Retour depuis anomalies ──
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
        setForceRefresh((p) => p + 1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationState.returnFromAnomalies, locationState.month, locationState.year]);

  const handleMonthChange = (month) => { setSelectedMonth(month); setFilterChanged(month !== currentMonth || selectedYear !== currentYear); };
  const handleYearChange  = (year)  => { setSelectedYear(year);   setFilterChanged(selectedMonth !== currentMonth || year !== currentYear); };

  const applyFilters = () => {
    setCurrentMonth(selectedMonth);
    setCurrentYear(selectedYear);
    setFilterChanged(false);
    setForceRefresh((p) => p + 1);
  };

  const refreshData = useCallback(() => setForceRefresh((p) => p + 1), []);

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "F5") { e.preventDefault(); refreshData(); } };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [refreshData]);

  // ── Chargement événements ──
  const fetchEvenementsMois = useCallback(async (annee, mois) => {
    try {
      const evenementsData = await presenceService.getEvenements(annee, mois);
      const newMap = {};
      if (evenementsData.evenements?.length > 0) {
        evenementsData.evenements.forEach((e) => {
          const dateFormatted = formatDate(e.date);
          if (dateFormatted) {
            const key = `${e.userid}-${dateFormatted}`;
            newMap[key] = {
              type: e.type_evenement,
              display: computeDisplay(e.type_evenement, e.commentaire),
              commentaire: e.commentaire || "",
            };
          }
        });
        setEvenementsMap(newMap);
      }
    } catch (err) {
      console.error("Erreur chargement événements:", err);
    }
  }, []);

  // ── Chargement présences ──
  const fetchPresences = useCallback(async (annee, mois) => {
    try {
      setLoading(true);
      try { await presenceService.genererDates(annee, mois); } catch (error) { console.debug(error); }
      const datesData = await presenceService.getDates(annee, mois);
      setDates(datesData);
      const presencesData = await presenceService.getPresencesMoisCalculee(annee, mois, false);
      setPeriode(presencesData.periode);
      setPresences(presencesData.presences || []);
      await fetchEvenementsMois(annee, mois);
    } catch (err) {
      console.error("❌ Erreur chargement:", err);
      alert("Erreur lors du chargement des présences: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchEvenementsMois]);

  const fetchTypesEvenements = useCallback(async () => {
    try { const data = await presenceService.getTypesEvenements(); setTypesEvenement(data.types_evenements); }
    catch (err) { console.error("Erreur types événements:", err); }
  }, []);

  const fetchHoraires = useCallback(async () => {
    try { const data = await presenceService.getHorairesSection(); setHoraires(data.horaires); }
    catch (err) { console.error("Erreur horaires:", err); }
  }, []);

  useEffect(() => {
    fetchPresences(currentYear, currentMonth);
    fetchTypesEvenements();
    fetchHoraires();
  }, [currentYear, currentMonth, forceRefresh, fetchPresences, fetchTypesEvenements, fetchHoraires]);

  // ── Gestion heures ──
  const handleHeureClick = useCallback((employee, dateStr, attendance) => {
    if (modeHeures === "brutes") { alert("Les heures brutes ne sont pas modifiables."); return; }
    const dateFormatted = formatDate(dateStr);
    if (!dateFormatted) return;
    setSelectedHeureData({ employee, date: dateFormatted, attendance });
    setShowHeureModal(true);
  }, [modeHeures]);

  // ── Gestion événements ──

  // Retourne { type, display, commentaire } ou null
  const getEvenementForCell = useCallback((userId, dateStr, attendance) => {
    const dateFormatted = formatDate(dateStr);
    if (!dateFormatted) return null;
    const key = `${userId}-${dateFormatted}`;
    const ev = evenementsMap[key];
    if (!ev) return null;
    if (ev.type === "X" && !attendance?.present && !attendance?.est_anomalie_corrigee) return null;
    return ev;
  }, [evenementsMap]);

  const handleEvenementClick = useCallback((employee, dateStr, attendance) => {
    const dateFormatted = formatDate(dateStr);
    if (!dateFormatted) return;
    const key = `${employee.userid}-${dateFormatted}`;
    const current = evenementsMap[key] || { type: "X", display: "", commentaire: "" };
    setSelectedEvenement({
      userid: employee.userid,
      badgenumber: employee.badgenumber,
      name: employee.name,
      date: dateFormatted,
      type_evenement: current.type,
      commentaire: current.commentaire,
      attendance,
    });
    setShowEvenementModal(true);
  }, [evenementsMap]);

  const handleSaveEvenement = useCallback(async (formData) => {
    try {
      const { userid, date } = selectedEvenement;
      await presenceService.updateEvenementByUserDate(userid, date, formData.type_evenement, formData.commentaire || "");
      const key = `${userid}-${date}`;
      setEvenementsMap((prev) => ({
        ...prev,
        [key]: {
          type: formData.type_evenement,
          display: computeDisplay(formData.type_evenement, formData.commentaire),
          commentaire: formData.commentaire || "",
        },
      }));
      await fetchEvenementsMois(currentYear, currentMonth);
      setShowEvenementModal(false);
      setSelectedEvenement(null);
      refreshData();
    } catch (err) {
      console.error("❌ Erreur sauvegarde événement:", err);
      alert("Erreur lors de la sauvegarde.");
    }
  }, [selectedEvenement, currentYear, currentMonth, fetchEvenementsMois, refreshData]);

  const handleDeleteEvenement = useCallback(async () => {
    try {
      const { userid, date } = selectedEvenement;
      await presenceService.deleteEvenementByUserDate(userid, date);
      const key = `${userid}-${date}`;
      setEvenementsMap((prev) => ({ ...prev, [key]: { type: "X", display: "", commentaire: "" } }));
      await fetchEvenementsMois(currentYear, currentMonth);
      setShowEvenementModal(false);
      setSelectedEvenement(null);
      refreshData();
    } catch (err) {
      console.error("❌ Erreur suppression événement:", err);
      alert("Erreur lors de la suppression.");
    }
  }, [selectedEvenement, currentYear, currentMonth, fetchEvenementsMois, refreshData]);

  const handleSaveHoraire = useCallback(async (data) => {
    try {
      if (selectedHoraire) await presenceService.updateHoraireSection(selectedHoraire.section, data);
      else await presenceService.createHoraireSection(data);
      setShowHoraireModal(false);
      setSelectedHoraire(null);
      await fetchHoraires();
      alert("Horaire enregistré !");
      refreshData();
    } catch (err) {
      alert(`Erreur: ${err.response?.data?.message || err.message}`);
    }
  }, [selectedHoraire, fetchHoraires, refreshData]);

  // ── Affichage heures ──
  const getHeuresAffichees = useCallback((attendance) => {
    if (!attendance) return { heureEntreeAffichee: "", heureSortieAffichee: "" };
    if (modeHeures === "brutes") {
      return {
        heureEntreeAffichee: attendance.heure_brute_entree?.slice(0, 5) || "",
        heureSortieAffichee: attendance.heure_brute_sortie?.slice(0, 5) || "",
      };
    }
    return {
      heureEntreeAffichee: attendance.heure_entree_comptabilisee?.slice(0, 5) || "",
      heureSortieAffichee: attendance.heure_sortie_comptabilisee?.slice(0, 5) || "",
    };
  }, [modeHeures]);

  const getCellBackgroundColor = useCallback((attendance) => {
    if (!attendance) return "transparent";
    if (attendance.est_jour_paiement) return "";
    if (attendance.est_samedi) return "bg-gray-50";
    return "transparent";
  }, []);

  const getTimeAnomalyColor = useCallback((attendance) => {
    if (!attendance || attendance.est_anomalie_corrigee) return { entreeColor: "", sortieColor: "" };
    const hasEntree = !!(attendance.heure_brute_entree || attendance.heure_entree_reelle || attendance.heure_entree_comptabilisee || attendance.heure_entree_rectifiee);
    const hasSortie = !!(attendance.heure_brute_sortie || attendance.heure_sortie_reelle || attendance.heure_sortie_comptabilisee || attendance.heure_sortie_rectifiee);
    if (hasEntree && !hasSortie) return { entreeColor: "text-red-700", sortieColor: "" };
    if (!hasEntree && hasSortie) return { entreeColor: "", sortieColor: "text-red-700" };
    return { entreeColor: "", sortieColor: "" };
  }, []);

  // ── Données employés ──
  const getEmployeeData = useCallback(() => {
    const employeesMap = {};
    presences.forEach((presence) => {
      if (presence.hors_periode) return;
      if (!presence.present && !presence.est_anomalie_corrigee && presence.evenement === "X") return;
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
        employeesMap[presence.userid].presences[dateFormatted] = { ...presence, anomalie_id: presence.anomalie_id || null };
        employeesMap[presence.userid].hasPresence = true;
      }
    });

    let arr = Object.values(employeesMap).filter((e) => e.hasPresence);
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      arr = arr.filter((e) =>
        (e.badgenumber && e.badgenumber.toLowerCase().includes(q)) ||
        (e.name && e.name.toLowerCase().includes(q)) ||
        (e.section && e.section.toLowerCase().includes(q))
      );
    }
    arr.sort((a, b) => (a.badgenumber && b.badgenumber ? a.badgenumber.localeCompare(b.badgenumber, undefined, { numeric: true }) : 0));
    return arr;
  }, [presences, searchFilter]);

  const getAttendanceData = useCallback((employee, dateStr) => {
    const d = formatDate(dateStr);
    if (!d) return null;
    return employee.presences[d] || null;
  }, []);

  const groupDatesByWeek = useCallback(() => {
    const weeks = {};
    dates.filter((d) => !d.hors_periode).forEach((date) => {
      if (date.code_date?.length > 0) {
        const s = date.code_date[0];
        if (!weeks[s]) weeks[s] = [];
        weeks[s].push(date);
      }
    });
    return weeks;
  }, [dates]);

  const getMonthAbbreviation = useCallback((dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"][d.getMonth()];
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Fiche_Presence_${periode?.mois}_${periode?.annee}`,
  });

  const getVariableGroups = (array) => {
    if (!array?.length) return [];
    const groups = [array.slice(0, 7)];
    const rest = array.slice(7);
    for (let i = 0; i < rest.length; i += 10) groups.push(rest.slice(i, i + 10));
    return groups;
  };

  const employees     = getEmployeeData();
  const weeks         = groupDatesByWeek();
  const weekNumbers   = Object.keys(weeks).sort((a, b) => parseInt(a) - parseInt(b));
  const datesValides  = dates.filter((d) => !d.hors_periode);
  const employeeGroups = getVariableGroups(employees);

  // ─────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des présences...</p>
      </div>
    );
  }

  // ── Vue gestion horaires ──
  if (showHoraires) {
    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="bg-white border-2 border-gray-800 mb-4 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-akj text-white px-6 py-3 font-bold text-lg">AKANJO</div>
              <h1 className="text-2xl font-bold uppercase">GESTION DES HORAIRES</h1>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowHoraires(false)} className="px-4 py-1 border-2 border-gray-600 rounded hover:bg-gray-100">← Retour</button>
              <button onClick={() => { setSelectedHoraire(null); setShowHoraireModal(true); }}
                className="flex items-center gap-2 px-4 py-1 bg-akj text-white rounded">
                <Plus className="w-4 h-4" />Nouveau horaire
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-800 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["SECTION","HEURE ENTRÉE","SORTIE NORMALE","SORTIE SAMEDI NORMAL","SORTIE VENDREDI P","SORTIE SAMEDI P","ACTIONS"].map((h) => (
                  <th key={h} className="border-2 border-gray-800 p-3 font-bold text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horaires.map((horaire, idx) => (
                <tr key={idx} className="border-b-2 border-gray-800">
                  <td className="border-2 border-gray-800 p-3 font-semibold">{horaire.section}</td>
                  <td className="border-2 border-gray-800 p-3 text-center">{decimalToTime(horaire.heure_entree)}</td>
                  <td className="border-2 border-gray-800 p-3 text-center">{decimalToTime(horaire.heure_sortie)}</td>
                  <td className="border-2 border-gray-800 p-3 text-center">{decimalToTime(horaire.sortie_samedi)}</td>
                  <td className="border-2 border-gray-800 p-3 text-center">{decimalToTime(horaire.sortie_vendredi_paiement)}</td>
                  <td className="border-2 border-gray-800 p-3 text-center">{decimalToTime(horaire.sortie_samedi_paiement)}</td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <button onClick={() => { setSelectedHoraire(horaire); setShowHoraireModal(true); }}
                      className="p-2 border-2 border-gray-800 rounded hover:bg-gray-100">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showHoraireModal && (
          <HoraireModal horaire={selectedHoraire} onClose={() => { setShowHoraireModal(false); setSelectedHoraire(null); }} onSave={handleSaveHoraire} />
        )}
      </div>
    );
  }

  // ── Vue principale ──
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div ref={componentRef} className="print-container">

        {/* ── En-tête ── */}
        <div className="bg-white border-2 border-gray-800 mb-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-akj text-white px-6 py-3 font-bold text-lg">AKANJO</div>
              <h1 className="text-2xl font-bold uppercase">FICHE DE PRESENCE:</h1>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold mb-3">{periode?.mois} {periode?.annee}</h2>
              <div className="flex items-center gap-3 print:hidden">
                <div className="flex flex-col">
                  <label className="block text-xs text-gray-600 mb-1">Mois</label>
                  <select value={selectedMonth} onChange={(e) => handleMonthChange(parseInt(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm">
                    {["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"].map((m, i) => (
                      <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs text-gray-600 mb-1">Année</label>
                  <select value={selectedYear} onChange={(e) => handleYearChange(parseInt(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded text-sm">
                    {[...Array(11)].map((_, i) => { const y = 2020 + i; return <option key={y} value={y}>{y}</option>; })}
                  </select>
                </div>
                {filterChanged && (
                  <button onClick={applyFilters} className="flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded mt-5">Appliquer</button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-t-2 border-gray-800 pt-4">
            <div>
              <span className="font-bold italic">SECTION:</span>
              <span className="ml-4 font-semibold">{employees.length > 0 && employees[0].section ? employees[0].section : "ADMINISTRATION"}</span>
            </div>
            <div className="print:text-right">
              <span className="font-bold italic">Période du:</span>
              <span className="ml-2">{periode?.du}</span>
              <span className="mx-2 font-bold">au:</span>
              <span>{periode?.au}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 border-t-2 border-gray-800 pt-4 print:hidden">
            <div className="h-8 flex items-center min-w-[200px]">
              <div className="[&>*]:h-8 [&_input]:h-8 [&_input]:text-sm [&_input]:py-1 [&_button]:h-8 [&_button]:text-sm w-full">
                <LocalEmployeeSearch onFilter={setSearchFilter} />
              </div>
            </div>
            <button onClick={() => setShowHoraires(true)} className="flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded hover:bg-gray-700">
              <Settings className="w-4 h-4" />Gérer les horaires
            </button>
            <button onClick={() => navigate("/anomalies", { state: { month: currentMonth, year: currentYear } })}
              className="flex items-center gap-2 px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
              Anomalies
            </button>
            <button onClick={() => setModeHeures("brutes")}
              className={`px-4 py-1 text-sm rounded border focus:outline-none ${modeHeures === "brutes" ? "border-gray-400 bg-gray-50 text-gray-700 font-semibold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              Heures Brutes
            </button>
            <button onClick={() => setModeHeures("rectifiees")}
              className={`px-4 py-1 text-sm rounded border focus:outline-none ${modeHeures === "rectifiees" ? "border-gray-400 bg-gray-50 text-gray-700 font-semibold" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              Heures Rectifiées
            </button>
            <button onClick={() => handlePrint()} className="ml-auto flex items-center gap-2 px-4 py-1 text-sm bg-akj text-white rounded hover:bg-gray-700">
              Imprimer la fiche
            </button>
          </div>

          <div className="mt-4 border-t-2 border-gray-800 pt-4 print:hidden">
            <div className="text-sm font-bold mb-2">Légende des événements:</div>
            <div className="flex flex-wrap gap-2">
              {typesEvenement.map((type) => (
                <div key={type.code} className={`px-3 py-1 rounded text-xs font-medium ${getEvenementColor(type.code)}`}>
                  {type.code}: {type.libelle}
                </div>
              ))}
              <div className="px-3 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700">AUT: Autre (saisie libre)</div>
            </div>
          </div>
        </div>

        {/* ── Tableaux ── */}
        {employeeGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="bg-white border-x-2 border-b-2 border-gray-800 overflow-x-auto print:overflow-visible"
            style={{ pageBreakAfter: "always", borderTop: groupIdx === 0 ? "none" : "2px solid #1f2937", marginTop: groupIdx === 0 ? "0" : "20px" }}>
            <table className="w-full border-collapse text-xs print:text-[7.5pt] print:table-fixed">
              <thead>
                {/* Ligne 1 : Semaines */}
                <tr className="bg-gray-100">
                  <th className="border-2 border-gray-800 p-2 sticky left-0 bg-gray-100 z-10 print:w-[150px]" rowSpan="4">
                    <div className="font-bold text-sm w-32">N° / NOM</div>
                  </th>
                  {weekNumbers.map((weekNum) => (
                    <th key={weekNum} colSpan={weeks[weekNum].length} className="border border-gray-600 p-1 font-bold">Semaine {weekNum}</th>
                  ))}
                </tr>
                {/* Ligne 2 : Code affichage */}
                <tr className="bg-gray-100">
                  {datesValides.map((date, idx) => (
                    <th key={idx} className="border border-gray-600 p-1 min-w-10">
                      <div className="font-bold">{date.code_affichage}</div>
                    </th>
                  ))}
                </tr>
                {/* Ligne 3 : Jour + numéro */}
                <tr className="bg-gray-100">
                  {datesValides.map((date, idx) => (
                    <th key={idx} className="border border-gray-600 p-1">
                      <div className="text-xs">{new Date(date.date).toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                      <div className="text-xs text-gray-600">{new Date(date.date).getDate()}</div>
                    </th>
                  ))}
                </tr>
                {/* Ligne 4 : Mois */}
                <tr className="bg-gray-100">
                  {datesValides.map((date, idx) => (
                    <th key={idx} className="border border-gray-600 p-1">
                      <div className="text-xs font-bold text-gray-700">{getMonthAbbreviation(date.date)}</div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {group.map((employee, empIdx) => (
                  <React.Fragment key={empIdx}>
                    <tr className="border-b-2 border-gray-800">
                      {/* Nom / Badge */}
                      <td className="border-2 border-gray-800 p-2 sticky left-0 bg-white z-10">
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-sm">{employee.badgenumber}</span>
                          <span className="italic text-sm">{employee.name}</span>
                        </div>
                      </td>

                      {/* Cellules jours */}
                      {datesValides.map((dateObj, dayIdx) => {
                        const attendance = getAttendanceData(employee, dateObj.date);
                        // eventData = { type, display, commentaire } ou null
                        const eventData = getEvenementForCell(employee.userid, dateObj.date, attendance);
                        const evenementDisplay = eventData?.display || "";
                        const evenementType    = eventData?.type    || "";

                        const { heureEntreeAffichee, heureSortieAffichee } = getHeuresAffichees(attendance);
                        const backgroundColor = getCellBackgroundColor(attendance);
                        const estModifieManuellement = !!(attendance?.anomalie_id);
                        const estCorrectionAuto = attendance?.est_correction_auto || false;
                        const { entreeColor, sortieColor } = getTimeAnomalyColor(attendance);

                        return (
                          <td key={dayIdx} className={`border border-gray-600 p-0 text-center relative group ${backgroundColor}`}>
                            {estModifieManuellement && (
                              <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full" title="Heures modifiées manuellement"></div>
                            )}
                            {estCorrectionAuto && (
                              <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full" title="Correction automatique"></div>
                            )}

                            <div className="flex flex-col h-full">
                              {/* Entrée */}
                              <button
                                onClick={() => modeHeures !== "brutes" && handleHeureClick(employee, dateObj.date, attendance)}
                                disabled={modeHeures === "brutes"}
                                className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] w-full transition-colors print:hover:bg-transparent"
                                title={modeHeures === "brutes" ? "Heures brutes non modifiables" : "Cliquer pour modifier"}
                              >
                                {heureEntreeAffichee
                                  ? <span className={entreeColor}>{heureEntreeAffichee}</span>
                                  : <span className="text-gray-400 italic text-xs"></span>}
                              </button>

                              {/* Événement */}
                              <button
                                onClick={() => handleEvenementClick(employee, dateObj.date, attendance)}
                                className={`print:text-[7pt] border-b border-gray-300 px-1 py-0.5 min-h-[21px] text-xs font-bold w-full hover:bg-gray-50 transition-colors print:hover:bg-transparent ${evenementType ? getEvenementTextColor(evenementType) : ""}`}
                                title={evenementType ? `Modifier l'événement (${evenementType})` : "Ajouter un événement"}
                              >
                                {evenementDisplay}
                              </button>

                              {/* Sortie */}
                              <button
                                onClick={() => modeHeures !== "brutes" && handleHeureClick(employee, dateObj.date, attendance)}
                                disabled={modeHeures === "brutes"}
                                className="px-1 py-0.5 min-h-[20px] w-full transition-colors print:hover:bg-transparent"
                                title={modeHeures === "brutes" ? "Heures brutes non modifiables" : "Cliquer pour modifier"}
                              >
                                {heureSortieAffichee
                                  ? <span className={sortieColor}>{heureSortieAffichee}</span>
                                  : <span className="text-gray-400 italic text-xs"></span>}
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

      {/* ── Modals ── */}
      {showHeureModal && selectedHeureData && (
        <HeureModal
          employee={selectedHeureData.employee}
          date={selectedHeureData.date}
          attendance={selectedHeureData.attendance}
          onClose={() => { setShowHeureModal(false); setSelectedHeureData(null); }}
          onSave={refreshData}
          onDelete={refreshData}
        />
      )}

      {showEvenementModal && selectedEvenement && (
        <EvenementModal
          evenement={selectedEvenement}
          onClose={() => { setShowEvenementModal(false); setSelectedEvenement(null); }}
          onSave={handleSaveEvenement}
          onDelete={handleDeleteEvenement}
          typesEvenement={typesEvenement}
        />
      )}

      {showHoraireModal && (
        <HoraireModal
          horaire={selectedHoraire}
          onClose={() => { setShowHoraireModal(false); setSelectedHoraire(null); }}
          onSave={handleSaveHoraire}
        />
      )}
    </div>
  );
};

export default AttendancePage;