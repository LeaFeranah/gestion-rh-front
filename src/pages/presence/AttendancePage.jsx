import React, { useState, useEffect, useCallback } from "react";
import { Settings, Edit2, Plus, Save, X, Clock, RefreshCw } from "lucide-react";
import presenceService from "../../services/presenceService";

// Utilitaires pour conversion heures
const decimalToTime = (decimal) => {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const timeToDecimal = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
};

// ✅ FONCTION POUR FORMATER LA DATE CORRECTEMENT
const formatDate = (dateStr) => {
  // Si la date est déjà au bon format YYYY-MM-DD
  if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  // Si c'est un objet Date
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

// Modal de gestion des horaires
const HoraireModal = ({ horaire, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    section: horaire?.section || "",
    heure_entree: horaire ? decimalToTime(horaire.heure_entree) : "07:30",
    heure_sortie: horaire ? decimalToTime(horaire.heure_sortie) : "17:50",
    sortie_samedi: horaire ? decimalToTime(horaire.sortie_samedi) : "15:30",
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
            <label className="block text-sm font-bold mb-1">Heure de sortie *</label>
            <input
              type="time"
              value={formData.heure_sortie}
              onChange={(e) => setFormData({ ...formData, heure_sortie: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Sortie samedi *</label>
            <input
              type="time"
              value={formData.sortie_samedi}
              onChange={(e) => setFormData({ ...formData, sortie_samedi: e.target.value })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-gray-800"
            />
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

// Modal de gestion des événements
const EvenementModal = ({ evenement, onClose, onSave, typesEvenement }) => {
  const [formData, setFormData] = useState({
    type_evenement: evenement?.type_evenement || "X",
    commentaire: evenement?.commentaire || "",
  });
  const [saving, setSaving] = useState(false);

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
  const [afficherHeuresReelles, setAfficherHeuresReelles] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [typesEvenement, setTypesEvenement] = useState([]);
  const [selectedEvenement, setSelectedEvenement] = useState(null);
  const [showEvenementModal, setShowEvenementModal] = useState(false);
  const [evenementsMap, setEvenementsMap] = useState({});

  // ✅ FONCTION POUR RECHARGER LES ÉVÉNEMENTS DEPUIS LE SERVEUR
  const fetchEvenementsMois = useCallback(async (annee, mois) => {
    try {
      console.log('🔄 Chargement des événements pour:', { annee, mois });
      
      const evenementsData = await presenceService.getEvenements(annee, mois);
      
      // ✅ CONSTRUIRE UNE MAP COMPLÈTE DES ÉVÉNEMENTS
      const newEvenementsMap = {};
      
      if (evenementsData.evenements && evenementsData.evenements.length > 0) {
        evenementsData.evenements.forEach((e) => {
          const dateFormatted = formatDate(e.date);
          if (dateFormatted) {
            const key = `${e.userid}-${dateFormatted}`;
            newEvenementsMap[key] = e.type_evenement;
          }
        });
        
        console.log('✅ Événements chargés depuis serveur:', Object.keys(newEvenementsMap).length);
        setEvenementsMap(newEvenementsMap);
      }
      
    } catch (err) {
      console.error("❌ Erreur chargement événements:", err);
    }
  }, []);

  // ✅ FONCTION DE CHARGEMENT DES PRÉSENCES AMÉLIORÉE
  const fetchPresences = useCallback(async (annee, mois) => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des présences pour:', { annee, mois });

      // 1. Générer les dates (cela créera aussi les événements par défaut)
      try {
        const generationResult = await presenceService.genererDates(annee, mois);
        console.log('✅ Génération:', generationResult);
      } catch (genErr) {
        console.log('ℹ️ Génération des dates déjà effectuée:', genErr.message);
      }

      // 2. Récupérer les dates
      const datesData = await presenceService.getDates(annee, mois);
      setDates(datesData);

      // 3. Récupérer les présences calculées
      const presencesData = await presenceService.getPresencesMoisCalculee(annee, mois, false);

      setPeriode(presencesData.periode);
      setPresences(presencesData.presences || []);

      // 4. ✅ RECHARGER TOUS LES ÉVÉNEMENTS DU MOIS
      await fetchEvenementsMois(annee, mois);
      
    } catch (err) {
      console.error("❌ Erreur lors du chargement:", err);
      alert("Erreur lors du chargement des présences: " + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchEvenementsMois]);

  // ✅ FONCTION DE RAFRAÎCHISSEMENT
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPresences(currentYear, currentMonth);
  }, [fetchPresences, currentYear, currentMonth]);

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

  // ✅ GESTION DU CLIC SUR UN ÉVÉNEMENT
  const handleEvenementClick = useCallback((employee, dateStr, attendance) => {
    // ✅ FORMATER LA DATE CORRECTEMENT
    const dateFormatted = formatDate(dateStr);
    
    if (!dateFormatted) {
      console.error('❌ Date invalide:', dateStr);
      return;
    }
    
    console.log('📝 Clic événement:', {
      employee,
      dateOriginal: dateStr,
      dateFormatted,
      attendance
    });

    // ✅ RÉCUPÉRER L'ÉVÉNEMENT ACTUEL DEPUIS LA MAP
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

  // ✅ SAUVEGARDE D'UN ÉVÉNEMENT AVEC RECHARGEMENT
  const handleSaveEvenement = useCallback(async (formData) => {
    try {
      const { userid, date } = selectedEvenement;

      console.log('💾 Sauvegarde événement:', {
        userid,
        date,
        type: formData.type_evenement
      });

      // 1. Sauvegarder dans la base
      const response = await presenceService.updateEvenementByUserDate(
        userid,
        date,
        formData.type_evenement,
        formData.commentaire || ""
      );

      console.log('✅ Réponse serveur:', response);

      // 2. ✅ METTRE À JOUR LA MAP LOCALE IMMÉDIATEMENT
      const key = `${userid}-${date}`;
      setEvenementsMap(prev => ({
        ...prev,
        [key]: formData.type_evenement
      }));

      // 3. ✅ RECHARGER LES ÉVÉNEMENTS DU MOIS POUR SYNCHRONISER
      await fetchEvenementsMois(currentYear, currentMonth);

      // 4. Mettre à jour les présences localement
      setPresences(prev => prev.map(presence => {
        const presenceDate = formatDate(presence.date);
        if (presence.userid === userid && presenceDate === date) {
          return {
            ...presence,
            evenement: formData.type_evenement
          };
        }
        return presence;
      }));

      setShowEvenementModal(false);
      setSelectedEvenement(null);

      console.log('✅ Événement mis à jour et rechargé');
      
    } catch (err) {
      console.error("❌ Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde. Veuillez réessayer.");
      throw err;
    }
  }, [selectedEvenement, currentYear, currentMonth, fetchEvenementsMois]);

  const handleSaveHoraire = useCallback(async (data) => {
    if (selectedHoraire) {
      await presenceService.updateHoraireSection(selectedHoraire.section, data);
    } else {
      await presenceService.createHoraireSection(data);
    }
    setShowHoraireModal(false);
    setSelectedHoraire(null);
    await fetchHoraires();
  }, [selectedHoraire, fetchHoraires]);

  useEffect(() => {
    fetchPresences(currentYear, currentMonth);
    fetchTypesEvenements();

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
          presences: {},
        };
      }
      // ✅ UTILISER LA DATE FORMATÉE COMME CLÉ
      const dateFormatted = formatDate(presence.date);
      if (dateFormatted) {
        employees[presence.userid].presences[dateFormatted] = presence;
      }
    });
    return Object.values(employees);
  }, [presences]);

  const getAttendanceData = useCallback((employee, dateStr) => {
    // ✅ FORMATER LA DATE AVANT DE CHERCHER
    const dateFormatted = formatDate(dateStr);
    return dateFormatted ? employee.presences[dateFormatted] || null : null;
  }, []);

  const getEvenementForCell = useCallback((userId, dateStr) => {
    // ✅ FORMATER LA DATE AVANT DE CHERCHER
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

  const employees = getEmployeeData();
  const weeks = groupDatesByWeek();
  const weekNumbers = Object.keys(weeks).sort();

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Chargement des présences...</p>
      </div>
    );
  }

  // ===== VUE GESTION DES HORAIRES =====
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

        <div className="bg-white border-2 border-gray-800">
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
                  HEURE SORTIE
                </th>
                <th className="border-2 border-gray-800 p-3 font-bold">
                  SORTIE SAMEDI
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
                      <Clock className="w-4 h-4" />
                      {decimalToTime(horaire.heure_entree)}
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      {decimalToTime(horaire.heure_sortie)}
                    </div>
                  </td>
                  <td className="border-2 border-gray-800 p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4" />
                      {decimalToTime(horaire.sortie_samedi)}
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

  // ===== VUE PRÉSENCES PRINCIPALE =====
  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* En-tête */}
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
            <div className="flex gap-3">
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
          <div>
            <span className="font-bold italic">Période du:</span>
            <span className="ml-2">{periode?.du}</span>
            <span className="mx-2 font-bold">au:</span>
            <span>{periode?.au}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4 border-t-2 border-gray-800 pt-4">
          <button
            onClick={() => setShowHoraires(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
            Gérer les horaires
          </button>
          <button
            onClick={() => setAfficherHeuresReelles(!afficherHeuresReelles)}
            className="px-4 py-2 border-2 border-gray-800 rounded hover:bg-gray-100"
          >
            {afficherHeuresReelles
              ? "📊 Afficher heures rectifiées"
              : "⏰ Afficher heures brutes"}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-800 rounded hover:bg-gray-100 disabled:bg-gray-100"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? "Rafraîchissement..." : "🔄 Rafraîchir"}
          </button>
        </div>

        <div className="mt-4 border-t-2 border-gray-800 pt-4">
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

      {/* Tableau calendrier */}
      <div className="bg-white border-2 border-gray-800 overflow-x-auto">
        <table className="w-full border-collapse text-xs">
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

                    return (
                      <td
                        key={dayIdx}
                        className="border border-gray-600 p-0 text-center"
                      >
                        <div className="flex flex-col h-full">
                          <div className="border-b border-gray-300 px-1 py-0.5 min-h-[20px] text-xs font-medium">
                            {attendance
                              ? afficherHeuresReelles
                                ? (attendance.heure_entree_reelle?.slice(0, 5) || "")
                                : (attendance.heure_entree_comptabilisee?.slice(0, 5) || "")
                              : ""}
                          </div>

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

                          <div className="px-1 py-0.5 min-h-[20px] text-xs font-medium">
                            {attendance
                              ? afficherHeuresReelles
                                ? (attendance.heure_sortie_reelle?.slice(0, 5) || "")
                                : (attendance.heure_sortie_comptabilisee?.slice(0, 5) || "")
                              : ""}
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

      {showEvenementModal && selectedEvenement && (
        <EvenementModal
          evenement={selectedEvenement}
          onClose={() => {
            setShowEvenementModal(false);
            setSelectedEvenement(null);
          }}
          onSave={handleSaveEvenement}
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