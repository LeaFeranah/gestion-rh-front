import React, { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Zap,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import {
  getEvolutionsPosteByEmploye,
  createEvolutionPoste,
  appliquerEvolutionPoste,
  changerStatutEvolutionPoste,
  deleteEvolutionPoste,
} from "../../services/employeeService";

const EvolutionPoste = ({ employeId, employeNom }) => {
  const [evolutions, setEvolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [applying, setApplying] = useState(false);
  const [filterStatut, setFilterStatut] = useState("TOUS");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    nouvelle_categorie: "",
    nouvelle_fonction: "",
    nouvelle_section: "",
    responsable: "",
    responsable_section: "",
    date_evolution: "",
    motif: "",
    commentaire: "",
  });

  const categories = [
    "M1",
    "M2",
    "0S1",
    "0S2",
    "0S3",
    "0P1A",
    "0P1B",
    "0P2A",
    "0P2B",
    "0P3",
    "H.C",
  ];

  // const loadEvolutions = useCallback(async () => {
  //   if (!employeId) return;

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getEvolutionsPosteByEmploye(employeId);
  //     setEvolutions(data.evolutions || []);
  //   } catch (err) {
  //     setError("Erreur lors du chargement des évolutions.");
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [employeId]);
  const loadEvolutions = useCallback(async () => {
  if (!employeId) return;

  try {
    setLoading(true);
    setError(null);
    const data = await getEvolutionsPosteByEmploye(employeId);
    
    // SEULE MODIFICATION NÉCESSAIRE :
    // Trier les évolutions par date de création décroissante
    const sortedEvolutions = (data.evolutions || []).sort((a, b) => {
      return new Date(b.created_at || b.date_evolution || 0) - 
             new Date(a.created_at || a.date_evolution || 0);
    });
    
    setEvolutions(sortedEvolutions); // ← Utiliser les données triées
  } catch (err) {
    setError("Erreur lors du chargement des évolutions.");
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [employeId]);



  useEffect(() => {
    loadEvolutions();
  }, [loadEvolutions]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const evolutionData = {
        employe: employeId,
        ...formData,
        nouveau_responsable: formData.responsable,
      };
      await createEvolutionPoste(evolutionData);
      setShowForm(false);
      setFormData({
        nouvelle_categorie: "",
        nouvelle_fonction: "",
        nouvelle_section: "",
        responsable: "",
        responsable_section: "",
        date_evolution: "",
        motif: "",
        commentaire: "",
      });
      loadEvolutions();
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors de la création.");
    }
  };

  const handleAppliquer = async (id) => {
    if (window.confirm("Appliquer cette évolution ?")) {
      try {
        setApplying(true);
        await appliquerEvolutionPoste(id);
        await loadEvolutions();
        window.location.reload();
        
        
      } catch (err) {
        console.error("Erreur:", err);
        alert("Erreur lors de l'application.");
      } finally {
        setApplying(false);
      }
    }
  };

  const handleChangerStatut = async (id, statut) => {
    try {
      await changerStatutEvolutionPoste(id, statut);
      loadEvolutions();
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur lors du changement de statut.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette évolution ?")) {
      try {
        await deleteEvolutionPoste(id);
        loadEvolutions();
      } catch (err) {
        console.error("Erreur:", err);
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "REALISEE":
        return "bg-green-100 text-green-800";
      case "APPROUVEE":
        return "bg-blue-100 text-blue-800";
      case "PROPOSEE":
        return "bg-yellow-100 text-yellow-800";
      case "ANNULEE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "REALISEE":
        return <CheckCircle className="w-4 h-4" />;
      case "APPROUVEE":
        return <Clock className="w-4 h-4" />;
      case "PROPOSEE":
        return <AlertCircle className="w-4 h-4" />;
      case "ANNULEE":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredEvolutions =
    filterStatut === "TOUS"
      ? evolutions
      : evolutions.filter((e) => e.statut === filterStatut);

  // Pagination
  const totalPages = Math.ceil(filteredEvolutions.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentItems = filteredEvolutions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400 mr-2" />
          <span className="text-gray-500">Chargement des évolutions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 mt-6">
        <div className="text-center py-4">
          <div className="text-red-500 text-sm mb-2">Erreur: {error}</div>
          <button
            onClick={loadEvolutions}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mt-6 -mx-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 pb-4 border-b border-gray-200 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Évolution de Poste
          </h3>
          <p className="text-sm text-gray-500">
            Employé : <span className="font-medium">{employeNom}</span>
            <span className="mx-2">•</span>
            {filteredEvolutions.length} évolution(s) sur {evolutions.length}{" "}
            enregistrement(s)
          </p>
        </div>

        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white"
          >
            <option value="TOUS">Tous les statuts</option>
            <option value="PROPOSEE">Proposée</option>
            <option value="APPROUVEE">Approuvée</option>
            <option value="REALISEE">Réalisée</option>
            <option value="ANNULEE">Annulée</option>
          </select>

          <button
            onClick={loadEvolutions}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 text-sm"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded hover:bg-gray-800 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nouvelle évolution
          </button>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="mb-6 mx-6 p-6 border border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Nouvelle évolution</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Fonction */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[180px]">
                  Fonction *
                </label>
                <input
                  type="text"
                  name="nouvelle_fonction"
                  placeholder="Ex: Chef d'équipe"
                  value={formData.nouvelle_fonction}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] w-full focus:ring-1 focus:outline-none focus:ring-gray-500"
                />
              </div>

              {/* Catégorie */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[180px]">
                  Catégorie *
                </label>
                <select
                  name="nouvelle_categorie"
                  value={formData.nouvelle_categorie}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                >
                  <option value="">Sélectionnez...</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section et Responsable - Côte à côte */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[180px]">
                  Section / Responsable
                </label>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {/* Section */}
                    <div className="flex-1">
                      <select
                        name="nouvelle_section"
                        value={formData.nouvelle_section}
                        onChange={handleChange}
                        required
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] w-full focus:ring-1 focus:outline-none focus:ring-gray-500"
                      >
                        <option value="">-- Sélectionnez une section --</option>
                        <option value="ADMINISTRATION">ADMINISTRATION</option>
                        <option value="BRODERIE MACHINE">
                          BRODERIE MACHINE
                        </option>
                        <option value="BRODERIE MAIN AK17">
                          BRODERIE MAIN AK17
                        </option>
                        <option value="BRODERIE MAIN DEV">
                          BRODERIE MAIN DEV
                        </option>
                        <option value="BUREAU DE METHODE">
                          BUREAU DE METHODE
                        </option>
                        <option value="CONTROLE QUALITE AS">
                          CONTROLE QUALITE AS
                        </option>
                        <option value="CHAINE 1">CHAINE 1</option>
                        <option value="CHAINE 2">CHAINE 2</option>
                        <option value="CHAINE 3">CHAINE 3</option>
                        <option value="CHAINE 4">CHAINE 4</option>
                        <option value="CHAINE 5">CHAINE 5</option>
                        <option value="CHAINE 6">CHAINE 6</option>
                        <option value="CHAINE 7">CHAINE 7</option>
                        <option value="CHAINE 8">CHAINE 8</option>
                        <option value="CHAINE 9">CHAINE 9</option>
                        <option value="CHAINE 10">CHAINE 10</option>
                        <option value="CHAINE 11">CHAINE 11</option>
                        <option value="CHAINE 12">CHAINE 12</option>
                        <option value="CHAINE CUIR">CHAINE CUIR</option>
                        <option value="COLLECTION">COLLECTION</option>
                        <option value="COUPE">COUPE</option>
                        <option value="COUPE COLLECTION">
                          COUPE COLLECTION
                        </option>
                        <option value="FINITION D">FINITION D</option>
                        <option value="FINITION M">FINITION M</option>
                        <option value="FINITION P">FINITION P</option>
                        <option value="FINITION Q">FINITION Q</option>
                        <option value="FINITION R">FINITION R</option>
                        <option value="LECTRA">LECTRA</option>
                        <option value="LEMARIE HVA">LEMARIE HVA</option>
                        <option value="MAINTENANCE">MAINTENANCE</option>
                        <option value="MAISON">MAISON</option>
                        <option value="PACKING/EXPEDITION">
                          PACKING/EXPEDITION
                        </option>
                        <option value="PLISSE">PLISSE</option>
                        <option value="POLE QUALITE 1">POLE QUALITE 1</option>
                        <option value="POLE QUALITE 2">POLE QUALITE 2</option>
                        <option value="RAPHIA 1">RAPHIA 1</option>
                        <option value="RAPHIA 2">RAPHIA 2</option>
                        <option value="RAPHIA 3">RAPHIA 3</option>
                        <option value="RAPHIA 4">RAPHIA 4</option>
                        <option value="RAPHIA 5">RAPHIA 5</option>
                        <option value="RAPHIA 6">RAPHIA 6</option>
                        <option value="RESPONSABLE 0">RESPONSABLE 0</option>
                        <option value="RESPONSABLE 1">RESPONSABLE 1</option>
                        <option value="RESPONSABLE 2">RESPONSABLE 2</option>
                        <option value="RESPONSABLE 3">RESPONSABLE 3</option>
                        <option value="RESPONSABLE RAPHIA">
                          RESPONSABLE RAPHIA
                        </option>
                        <option value="SECURITE">SECURITE</option>
                      </select>
                    </div>

                    <span className="text-gray-500">/</span>

                    {/* Responsable (select) */}
                    <div className="flex-1">
                      <select
                        name="responsable"
                        value={formData.responsable}
                        onChange={handleChange}
                        className="border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] w-full focus:ring-1 focus:outline-none focus:ring-gray-500"
                      >
                        <option value="">-- Sélectionnez responsable --</option>
                        <option value="RESPONSABLE 0">RESPONSABLE 0</option>
                        <option value="RESPONSABLE 1">RESPONSABLE 1</option>
                        <option value="RESPONSABLE 2">RESPONSABLE 2</option>
                        <option value="RESPONSABLE 3">RESPONSABLE 3</option>
                        <option value="RESPONSABLE RAPHIA">
                          RESPONSABLE RAPHIA
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date d'évolution */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[180px]">
                  Date d'évolution *
                </label>
                <input
                  type="date"
                  name="date_evolution"
                  value={formData.date_evolution}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-2 py-0.5 text-xs h-[25px] focus:ring-1 focus:outline-none focus:ring-gray-500"
                />
              </div>

              {/* Motif */}
              <div className="flex items-start gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[180px] pt-2">
                  Motif *
                </label>
                <textarea
                  name="motif"
                  placeholder="Raison du changement"
                  value={formData.motif}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full border border-gray-300 rounded px-2 py-0.5  h-[25px] text-xs focus:ring-1 focus:outline-none focus:ring-gray-500"
                />
              </div>

              {/* Commentaire */}
              <div className="flex items-start gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[180px] pt-2">
                  Commentaire
                </label>
                <textarea
                  name="commentaire"
                  placeholder="Informations supplémentaires"
                  value={formData.commentaire}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded px-2 py-0.5 h-[25px] text-xs focus:ring-1 focus:outline-none focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-gray-800"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des évolutions */}
      {filteredEvolutions.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            Aucune évolution de poste trouvée
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Les évolutions de poste apparaîtront ici
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Catégorie
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Fonction
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Section
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-300 border-t border-gray-300">
                    Responsable
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-t border-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((evolution, index) => {
                  const isExpanded = expandedId === evolution.id;
                  const statutColor = getStatutColor(evolution.statut);

                  return (
                    <React.Fragment key={evolution.id}>
                      {/* Ligne principale */}
                      <tr
                        className={`border-t border-gray-300 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition-colors`}
                      >
                        {/* Statut */}
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statutColor}`}
                          >
                            {getStatutIcon(evolution.statut)}
                            <span>
                              {evolution.statut_display || evolution.statut}
                            </span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(
                              evolution.date_evolution || evolution.created_at
                            )}
                          </div>
                        </td>

                        {/* Catégorie */}
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {evolution.nouvelle_categorie}
                            </div>
                            {evolution.ancienne_categorie && (
                              <div className="text-xs text-gray-500 line-through">
                                {evolution.ancienne_categorie}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Fonction */}
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {evolution.nouvelle_fonction}
                            </div>
                            {evolution.ancienne_fonction && (
                              <div className="text-xs text-gray-500 line-through">
                                {evolution.ancienne_fonction}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Section */}
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {evolution.nouvelle_section}
                            </div>
                            {evolution.ancienne_section && (
                              <div className="text-xs text-gray-500 line-through">
                                {evolution.ancienne_section}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Responsable */}
                        <td className="px-4 py-3 whitespace-nowrap border-r border-gray-300">
                          <div>
                            <div className="text-sm text-gray-900">
                              {evolution.nouveau_responsable || "-"}
                            </div>
                            {evolution.ancien_responsable && (
                              <div className="text-xs text-gray-500 line-through">
                                {evolution.ancien_responsable}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : evolution.id)
                              }
                              className={`p-1 rounded ${
                                isExpanded ? "bg-gray-200" : "hover:bg-gray-100"
                              }`}
                              title={
                                isExpanded
                                  ? "Masquer les détails"
                                  : "Voir les détails"
                              }
                            >
                              {isExpanded ? (
                                <EyeOff className="w-4 h-4 text-gray-600" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-600" />
                              )}
                            </button>

                            {evolution.statut === "APPROUVEE" && (
                              <button
                                onClick={() => handleAppliquer(evolution.id)}
                                disabled={applying}
                                className="p-1 hover:bg-green-50 rounded"
                                title="Appliquer"
                              >
                                <Zap className="w-4 h-4 text-green-500" />
                              </button>
                            )}

                            {evolution.statut !== "REALISEE" && (
                              <button
                                onClick={() => handleDelete(evolution.id)}
                                className="p-1 hover:bg-red-50 rounded"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Ligne de détails (expandable) */}
                      {isExpanded && (
                        <tr className="bg-gray-100">
                          <td
                            colSpan="7"
                            className="px-4 py-4 border-t border-gray-100"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-4">
                                  Détails
                                </h3>
                                <div className="space-y-4 text-sm">
                                  {/* Date d'évolution */}
                                  <div className="flex items-start gap-4">
                                    <div className="text-sm font-medium text-gray-700 min-w-[140px] pt-1">
                                      Date d'évolution
                                    </div>
                                    <div className="text-gray-900">
                                      {formatDate(evolution.date_evolution)}
                                    </div>
                                  </div>

                                  {/* Motif complet */}
                                  <div className="flex items-start gap-4">
                                    <div className="text-sm font-medium text-gray-700 min-w-[140px] pt-1">
                                      Motif complet
                                    </div>
                                    <div className="text-gray-900 ">
                                      {evolution.motif}
                                    </div>
                                  </div>

                                  {/* Commentaire (conditionnel) */}
                                  {evolution.commentaire && (
                                    <div className="flex items-start gap-4">
                                      <div className="text-sm font-medium text-gray-700 min-w-[140px] pt-1">
                                        Commentaire
                                      </div>
                                      <div className="text-gray-90">
                                        {evolution.commentaire}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                  Actions disponibles
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {evolution.statut === "PROPOSEE" && (
                                      <button
                                        onClick={() =>
                                          handleChangerStatut(
                                            evolution.id,
                                            "APPROUVEE"
                                          )
                                        }
                                        className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                                      >
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Approuver
                                      </button>
                                    )}

                                    {evolution.statut === "APPROUVEE" && (
                                      <button
                                        onClick={() =>
                                          handleAppliquer(evolution.id)
                                        }
                                        disabled={applying}
                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 disabled:opacity-50"
                                      >
                                        <Zap className="w-4 h-4 inline mr-1" />
                                        {applying
                                          ? "Application..."
                                          : "Appliquer"}
                                      </button>
                                    )}

                                    {evolution.statut !== "ANNULEE" &&
                                      evolution.statut !== "REALISEE" && (
                                        <button
                                          onClick={() =>
                                            handleChangerStatut(
                                              evolution.id,
                                              "ANNULEE"
                                            )
                                          }
                                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
                                        >
                                          <XCircle className="w-4 h-4 inline mr-1" />
                                          Annuler
                                        </button>
                                      )}

                                    {evolution.statut !== "REALISEE" && (
                                      <button
                                        onClick={() =>
                                          handleDelete(evolution.id)
                                        }
                                        className="px-3 py-1.5 border border-red-300 text-red-600 rounded text-sm font-medium hover:bg-red-50"
                                      >
                                        <Trash2 className="w-4 h-4 inline mr-1" />
                                        Supprimer
                                      </button>
                                    )}
                                  </div>

                                  <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <div className="text-gray-500">
                                          Créée le
                                        </div>
                                        <div>
                                          {formatDate(evolution.created_at)}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-gray-500">Par</div>
                                        <div>
                                          {evolution.modifie_par_nom || "-"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-300 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Affichage {startIndex + 1} à{" "}
                {Math.min(startIndex + itemsPerPage, filteredEvolutions.length)}
                sur {filteredEvolutions.length} évolutions
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 0))
                  }
                  disabled={currentPage === 0}
                  className={`p-2 rounded-md border border-gray-300 ${
                    currentPage === 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm text-gray-700">
                  Page {currentPage + 1} sur {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                  className={`p-2 rounded-md border border-gray-300 ${
                    currentPage >= totalPages - 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EvolutionPoste;
