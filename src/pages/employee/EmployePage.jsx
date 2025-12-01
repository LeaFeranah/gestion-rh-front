import React, { useState, useEffect } from "react";
import "/src/styles/custom.css";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Table,
  Grid,
  User,
  Download,
  Filter,
} from "lucide-react";
import EmployeeBlock from "../../components/employee/EmployeeBlock";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  createBancaire,
  updateBancaire,
  createSalaire,
  updateSalaire,
  createFamiliale,
  updateFamiliale,
  getEnfantsByFamiliale,
  createEnfant,
  updateEnfant,
  deleteEnfant,
} from "../../services/employeeService";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    section: "",
    fonction: "",
    sexe: "",
  });

  // NOUVELLE fonction pour formater le nom complet
  const formatNomComplet = (nomComplet) => {
    if (!nomComplet) return "";
    return nomComplet
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getAllEmployees();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setEmployees(sortedData);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement des employés");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage et pagination
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      //emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (!filters.section || emp.section === filters.section) &&
      (!filters.fonction || emp.fonction === filters.fonction) &&
      (!filters.sexe || emp.sexe === filters.sexe);

    return matchesSearch && matchesFilters;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Initialisation des données avec les enfants
  const initFormData = async (emp) => {
    const baseData = {
      ...emp,
      bancaire: emp.bancaire || {},
      salaire_personnel: emp.salaire_personnel || {},
      familiale: emp.familiale || { enfants: [] },
    };

    if (emp.familiale?.id) {
      try {
        const enfants = await getEnfantsByFamiliale(emp.familiale.id);
        baseData.familiale.enfants = enfants;
      } catch (error) {
        console.error("Erreur chargement enfants:", error);
        baseData.familiale.enfants = [];
      }
    }

    return baseData;
  };

  // Validation des champs obligatoires
  const validateRequiredFields = () => {
    const errors = [];

    if (!formData.numero_matricule?.trim()) {
      errors.push("Le numéro matricule est obligatoire");
    }
    if (!formData.nom_complet?.trim()) {
      errors.push("Le nom complet est obligatoire");
    }
    // if (!formData.prenoms?.trim()) {
    //   errors.push("Les prénoms sont obligatoires");
    // }

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return false;
    }
    return true;
  };

  const hasValidData = (data) => {
    if (!data) return false;
    const hasAnyData = Object.values(data).some(
      (value) =>
        value !== null &&
        value !== undefined &&
        value.toString().trim() !== "" &&
        !Array.isArray(value)
    );
    return hasAnyData;
  };

  // Gestion des enfants
  const handleSaveEnfants = async (familialeId, enfants) => {
    if (!familialeId) return;

    try {
      console.log("Enfants à sauvegarder:", enfants);

      const existingEnfants = await getEnfantsByFamiliale(familialeId);
      const existingIds = existingEnfants.map((enfant) => enfant.id);
      const formIds = enfants
        .filter((enfant) => enfant.id)
        .map((enfant) => enfant.id);

      // Enfants à supprimer
      const toDelete = existingIds.filter((id) => !formIds.includes(id));
      for (const id of toDelete) {
        await deleteEnfant(id);
      }

      // Enfants à créer ou mettre à jour
      for (const enfant of enfants) {
        if (enfant.nom_prenoms && enfant.nom_prenoms.trim() !== "") {
          const enfantData = {
            familiale: familialeId,
            nom_prenoms: enfant.nom_prenoms.trim(),
            sexe: enfant.sexe && enfant.sexe !== "" ? enfant.sexe : null,
            date_naissance: enfant.date_naissance || null,
            lieu_naissance:
              enfant.lieu_naissance && enfant.lieu_naissance.trim() !== ""
                ? enfant.lieu_naissance
                : null,
          };

          console.log("Données enfant à envoyer:", enfantData);

          if (enfant.id) {
            await updateEnfant(enfant.id, enfantData);
          } else {
            await createEnfant(enfantData);
          }
        }
      }
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la sauvegarde des enfants:",
        error.response?.data
      );
      throw error;
    }
  };

  // Gestion des actions
  const handleViewDetails = async (emp) => {
    try {
      setLoading(true);
      const data = await initFormData(emp);
      setFormData(data);
      setSelectedEmployee(emp);
      setEditMode(false); // Mode visualisation par défaut
    } catch (error) {
      console.error("Erreur chargement données:", error);
      alert("Erreur lors du chargement des données de l'employé");
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployee = () => {
    setEditMode(true);
  };

  const handleUpdate = async () => {
    if (!selectedEmployee) return;
    if (!validateRequiredFields()) return;

    try {
      setLoading(true);
      const persoData = new FormData();

      // Formater les données avant envoi
      const nomCompletFormatted = formatNomComplet(formData.nom_complet);
      //const prenomsFormatted = formatPrenoms(formData.prenoms);

      const personalFields = {
        numero_matricule: formData.numero_matricule,
        nom_complet: nomCompletFormatted,
        //prenoms: prenomsFormatted,
        sexe: formData.sexe,
        appellation: formData.appellation,
        fonction: formData.fonction,
        section: formData.section,
        date_naissance: formData.date_naissance,
        lieu_naissance: formData.lieu_naissance,
        CIN: formData.CIN,
        date_CIN: formData.date_CIN,
        lieu_CIN: formData.lieu_CIN,
        numero_cnaps: formData.numero_cnaps,
        ancien_numero_journaliere: formData.ancien_numero_journaliere,
        pere: formData.pere,
        mere: formData.mere,
        adresse: formData.adresse,
        quartier: formData.quartier,
        telephone: formData.telephone,
        email: formData.email,
      };

      Object.entries(personalFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          persoData.append(key, value);
        }
      });

      if (formData.photo instanceof File) {
        persoData.append("photo", formData.photo);
      }

      await updateEmployee(selectedEmployee.id, persoData);

      // Mise à jour des informations bancaires
      if (formData.bancaire) {
        const bancaireData = {
          nom_banque: formData.bancaire.nom_banque || "",
          code_banque: formData.bancaire.code_banque || "",
          code_agence: formData.bancaire.code_agence || "",
          numero_compte: formData.bancaire.numero_compte || "",
          cle_rib: formData.bancaire.cle_rib || "",
          banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
          employe: selectedEmployee.id,
        };

        Object.keys(bancaireData).forEach((key) => {
          if (bancaireData[key] === "") bancaireData[key] = null;
        });

        if (formData.bancaire.id) {
          await updateBancaire(formData.bancaire.id, bancaireData);
        } else if (hasValidData(bancaireData)) {
          await createBancaire(bancaireData);
        }
      }

      // Mise à jour des informations salaire
      if (formData.salaire_personnel) {
        const salaireData = {
          date_embauche: formData.salaire_personnel.date_embauche || "",
          //fonction: formData.salaire_personnel.fonction || "",
          categorie: formData.salaire_personnel.categorie || "",
          indice: formData.salaire_personnel.indice || "",
          taux_horaire: formData.salaire_personnel.taux_horaire || "",
          salaire_base: formData.salaire_personnel.salaire_base || "",
          autre_indemnite: formData.salaire_personnel.autre_indemnite || "",
          //section: formData.salaire_personnel.section || "",
          responsable_section:
            formData.salaire_personnel.responsable_section || "",
          prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
          indemnite_deplacement:
            formData.salaire_personnel.indemnite_deplacement || "",
          dernier_aug_indice:
            formData.salaire_personnel.dernier_aug_indice || "",
          //obs_prime: formData.salaire_personnel.obs_prime || "",
          salaire_total: formData.salaire_personnel.salaire_total || "",
          employe: selectedEmployee.id,
        };

        Object.keys(salaireData).forEach((key) => {
          if (salaireData[key] === "") salaireData[key] = null;
        });

        if (formData.salaire_personnel.id) {
          await updateSalaire(formData.salaire_personnel.id, salaireData);
        } else if (hasValidData(salaireData)) {
          await createSalaire(salaireData);
        }
      }

      // Mise à jour des informations familiales et enfants
      let familialeId = formData.familiale?.id;

      const hasFamilialeData =
        hasValidData({
          epoux_nom: formData.familiale?.epoux_nom,
          epoux_prenoms: formData.familiale?.epoux_prenoms,
          epoux_date_naissance: formData.familiale?.epoux_date_naissance,
          epoux_lieu_naissance: formData.familiale?.epoux_lieu_naissance,
          epoux_societe: formData.familiale?.epoux_societe,
          epoux_fonction: formData.familiale?.epoux_fonction,
        }) ||
        (formData.familiale?.enfants && formData.familiale.enfants.length > 0);

      if (hasFamilialeData) {
        const familialeData = {
          epoux_nom: formData.familiale?.epoux_nom || "",
          epoux_prenoms: formData.familiale?.epoux_prenoms || "",
          epoux_date_naissance: formData.familiale?.epoux_date_naissance || "",
          epoux_lieu_naissance: formData.familiale?.epoux_lieu_naissance || "",
          epoux_societe: formData.familiale?.epoux_societe || "",
          epoux_fonction: formData.familiale?.epoux_fonction || "",
          employe: selectedEmployee.id,
        };

        Object.keys(familialeData).forEach((key) => {
          if (familialeData[key] === "") familialeData[key] = null;
        });

        if (formData.familiale?.id) {
          await updateFamiliale(formData.familiale.id, familialeData);
          familialeId = formData.familiale.id;
        } else {
          const newFamiliale = await createFamiliale(familialeData);
          familialeId = newFamiliale.id;
        }

        // Gestion des enfants
        if (familialeId && formData.familiale?.enfants) {
          await handleSaveEnfants(familialeId, formData.familiale.enfants);
        }
      }

      await fetchEmployees();
      setEditMode(false);
      //setSelectedEmployee(null);
      // resetForm();
      
      alert("Employé mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      let errorMessage = "Erreur lors de la mise à jour: ";
      if (error.response?.data) {
        const serverErrors = error.response.data;
        Object.keys(serverErrors).forEach((field) => {
          const errors = serverErrors[field];
          if (Array.isArray(errors)) {
            errorMessage += `${field}: ${errors.join(", ")} `;
          } else {
            errorMessage += `${field}: ${errors} `;
          }
        });
      } else {
        errorMessage += error.message;
      }
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!validateRequiredFields()) return;

    try {
      setLoading(true);
      const persoData = new FormData();

      // Formater les données avant envoi
      const nomCompletFormatted = formatNomComplet(formData.nom_complet);
      //const prenomsFormatted = formatPrenoms(formData.prenoms);

      persoData.append(
        "numero_matricule",
        formData.numero_matricule?.trim() || ""
      );
      persoData.append("nom_complet", nomCompletFormatted);
      //persoData.append("prenoms", prenomsFormatted);

      const optionalFields = {
        sexe: formData.sexe,
        appellation: formData.appellation,
        fonction: formData.fonction,
        section: formData.section,
        date_naissance: formData.date_naissance,
        lieu_naissance: formData.lieu_naissance,
        CIN: formData.CIN,
        date_CIN: formData.date_CIN,
        lieu_CIN: formData.lieu_CIN,
        numero_cnaps: formData.numero_cnaps,
        ancien_numero_journaliere: formData.ancien_numero_journaliere,
        pere: formData.pere,
        mere: formData.mere,
        adresse: formData.adresse,
        quartier: formData.quartier,
        telephone: formData.telephone,
        email: formData.email,
      };

      Object.entries(optionalFields).forEach(([key, value]) => {
        if (value && value.toString().trim() !== "") {
          persoData.append(key, value.toString().trim());
        }
      });

      if (formData.photo instanceof File) {
        persoData.append("photo", formData.photo);
      }

      const newEmp = await createEmployee(persoData);

      // Création des informations bancaires
      if (formData.bancaire && hasValidData(formData.bancaire)) {
        const bancaireData = {
          nom_banque: formData.bancaire.nom_banque || "",
          code_banque: formData.bancaire.code_banque || "",
          code_agence: formData.bancaire.code_agence || "",
          numero_compte: formData.bancaire.numero_compte || "",
          cle_rib: formData.bancaire.cle_rib || "",
          banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
          employe: newEmp.id,
        };

        Object.keys(bancaireData).forEach((key) => {
          if (bancaireData[key] === "") bancaireData[key] = null;
        });

        await createBancaire(bancaireData);
      }

      // Création des informations salaire
      if (
        formData.salaire_personnel &&
        hasValidData(formData.salaire_personnel)
      ) {
        const salaireData = {
          date_embauche: formData.salaire_personnel?.date_embauche || "",
          responsable_section:
            formData.salaire_personnel?.responsable_section || "",
          categorie: formData.salaire_personnel?.categorie || "",
          indice: formData.salaire_personnel?.indice || "",
          taux_horaire: formData.salaire_personnel?.taux_horaire || "",
          salaire_base: formData.salaire_personnel?.salaire_base || "",
          autre_indemnite: formData.salaire_personnel?.autre_indemnite || "",
          prime_anciennete: formData.salaire_personnel?.prime_anciennete || "",
          indemnite_deplacement:
            formData.salaire_personnel?.indemnite_deplacement || "",
          dernier_aug_indice:
            formData.salaire_personnel?.dernier_aug_indice || "",
          salaire_total: formData.salaire_personnel?.salaire_total || "",
          employe: newEmp.id,
        };

        Object.keys(salaireData).forEach((key) => {
          if (salaireData[key] === "") salaireData[key] = null;
        });

        await createSalaire(salaireData);
      }

      // Création des informations familiales et enfants
      let familialeId = null;

      const hasFamilialeData =
        hasValidData({
          epoux_nom: formData.familiale?.epoux_nom,
          epoux_prenoms: formData.familiale?.epoux_prenoms,
          epoux_date_naissance: formData.familiale?.epoux_date_naissance,
          epoux_lieu_naissance: formData.familiale?.epoux_lieu_naissance,
          epoux_societe: formData.familiale?.epoux_societe,
          epoux_fonction: formData.familiale?.epoux_fonction,
        }) ||
        (formData.familiale?.enfants && formData.familiale.enfants.length > 0);

      if (hasFamilialeData) {
        const familialeData = {
          epoux_nom: formData.familiale?.epoux_nom || "",
          epoux_prenoms: formData.familiale?.epoux_prenoms || "",
          epoux_date_naissance: formData.familiale?.epoux_date_naissance || "",
          epoux_lieu_naissance: formData.familiale?.epoux_lieu_naissance || "",
          epoux_societe: formData.familiale?.epoux_societe || "",
          epoux_fonction: formData.familiale?.epoux_fonction || "",
          employe: newEmp.id,
        };

        Object.keys(familialeData).forEach((key) => {
          if (familialeData[key] === "") familialeData[key] = null;
        });

        const newFamiliale = await createFamiliale(familialeData);
        familialeId = newFamiliale.id;

        // Gestion des enfants
        if (
          familialeId &&
          formData.familiale?.enfants &&
          formData.familiale.enfants.length > 0
        ) {
          await handleSaveEnfants(familialeId, formData.familiale.enfants);
        }
      }

      await fetchEmployees();

          // NOUVEAU : Calculer la dernière page pour le nouvel employé
    const totalItemsAfterAdd = employees.length + 1; // +1 car l'employé vient d'être ajouté
    const lastPage = Math.ceil(totalItemsAfterAdd / itemsPerPage);

     // Aller à la dernière page
    setCurrentPage(lastPage);


      setShowForm(false);
      setEditMode(false);
      resetForm();
      alert("Employé créé avec succès !");
    } catch (error) {
      console.error("Erreur complète:", error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        let errorMessage = "Erreurs de validation:\n";
        Object.keys(serverErrors).forEach((field) => {
          const errors = serverErrors[field];
          if (Array.isArray(errors)) {
            errorMessage += `• ${field}: ${errors.join(", ")}\n`;
          } else {
            errorMessage += `• ${field}: ${errors}\n`;
          }
        });
        alert(errorMessage);
      } else {
        alert(`Erreur lors de la création: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await deleteEmployee(id);
        await fetchEmployees();
        if (selectedEmployee?.id === id) {
          setSelectedEmployee(null);
        }
        alert("Employé supprimé avec succès !");
      } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      numero_matricule: "",
      nom_complet: "",
      sexe: "",
      appellation: "",
      fonction: "",
      section: "",
      date_naissance: "",
      lieu_naissance: "",
      CIN: "",
      date_CIN: "",
      lieu_CIN: "",
      numero_cnaps: "",
      ancien_numero_journaliere: "",
      pere: "",
      mere: "",
      adresse: "",
      quartier: "",
      telephone: "",
      email: "",
      photo: null,
      bancaire: {},
      salaire_personnel: {},
      familiale: { enfants: [] },
    });
  };

  // Options pour les filtres
  //const sections = [...new Set(employees.map(emp => emp.section).filter(Boolean))];
  const fonctions = [
    ...new Set(employees.map((emp) => emp.fonction).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header avec Statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestion des Employés
              </h1>
              <p className="text-gray-600">
                Gérez efficacement les informations de votre personnel
              </p>
            </div>

            {/* <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exporter
            </button> */}
          </div>

          {/* Stats Cards améliorées */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Employés
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {employees.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hommes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {employees.filter((emp) => emp.sexe === "Masculin").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">♂</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Femmes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {employees.filter((emp) => emp.sexe === "Féminin").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center">
                  <span className="text-pink-600 font-semibold">♀</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Affichage</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {currentItems.length}/{filteredEmployees.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Table className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {!selectedEmployee && !showForm && (
            <div>
              {/* Toolbar améliorée */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Liste des Employés
                    </h2>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      {filteredEmployees.length} résultat(s)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === "table"
                            ? "bg-white shadow-sm text-gray-700"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Table className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === "grid"
                            ? "bg-white shadow-sm text-gray-700"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Filtres */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        showFilters
                          ? "bg-gray-300 border-gray-200 text-gray-700"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Filter className="w-4 h-4" />
                      Filtres
                    </button>

                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Rechercher un employé..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                      />
                    </div>

                    {/* Add Employee Button */}
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditMode(true);
                        resetForm();
                      }}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-akj text-white rounded-lg transition-all text-sm font-medium disabled:opacity-50 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Nouvel employé
                    </button>
                  </div>
                </div>

           
                {/* Filtres avancés */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Section avec toutes les options prédéfinies */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section
                        </label>
                        <select
                          value={filters.section}
                          onChange={(e) =>
                            setFilters({ ...filters, section: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                        >
                          <option value="">Toutes les sections</option>
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

                      {/* Fonction (dynamique depuis les données) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fonction
                        </label>
                        <select
                          value={filters.fonction}
                          onChange={(e) =>
                            setFilters({ ...filters, fonction: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                        >
                          <option value="">Toutes les fonctions</option>
                          {fonctions.map((fonction) => (
                            <option key={fonction} value={fonction}>
                              {fonction}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sexe */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sexe
                        </label>
                        <select
                          value={filters.sexe}
                          onChange={(e) =>
                            setFilters({ ...filters, sexe: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                        >
                          <option value="">Tous</option>
                          <option value="Masculin">Masculin</option>
                          <option value="Féminin">Féminin</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          setFilters({ section: "", fonction: "", sexe: "" })
                        }
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-sm">
                      Chargement des employés...
                    </p>
                  </div>
                </div>
              ) : viewMode === "table" ? (
                /* Table View MODIFIÉE - 5 colonnes égales sans sexe et contact */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Employé
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Fonction
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Section
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((emp) => (
                        <tr
                          key={emp.id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* Colonne Employé */}
                          <td className="w-1/5 px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border">
                                {emp.photo ? (
                                  <img
                                    src={emp.photo}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <User className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {emp.nom_complet || "Nom non spécifié"}{" "}
                                  {/* CHANGEMENT ICI */}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {emp.appellation || "Non spécifié"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Colonne Matricule */}
                          <td className="w-1/5 px-6 py-4">
                            <div className="flex items-center">
                              <span className="text-sm font-bold text-gray-900 px-2 py-1 rounded">
                                {emp.numero_matricule}
                              </span>
                            </div>
                          </td>

                          {/* Colonne Fonction */}
                          <td className="w-1/5 px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {emp.fonction || "Non spécifié"}
                            </div>
                            {emp.categorie && (
                              <div className="text-xs text-gray-500 mt-1">
                                {emp.categorie}
                              </div>
                            )}
                          </td>

                          {/* Colonne Section */}
                          <td className="w-1/5 px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {emp.section || "Non spécifié"}
                            </div>
                            {emp.responsable_section && (
                              <div className="text-xs text-gray-500 mt-1">
                                {emp.responsable_section}
                              </div>
                            )}
                          </td>

                          {/* Colonne Actions */}
                          <td className="w-1/5 px-6 py-4">
                            <div className="flex items-center justify-start space-x-2">
                              <button
                                onClick={() => handleViewDetails(emp)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                                title="Voir détails"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Détails
                              </button>
                              <button
                                onClick={() => handleDelete(emp.id)}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Grid View MODIFIÉE  */
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentItems.map((emp) => (
                      <div
                        key={emp.id}
                        className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                              {emp.photo ? (
                                <img
                                  src={emp.photo}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <User className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-900 text-lg truncate">
                                {emp.nom_complet || "Nom non spécifié"}{" "}
                                {/* CHANGEMENT ICI */}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">
                                {emp.appellation || "Non spécifié"}
                              </p>
                              <span className="text-gray-700 text-xs font-medium">
                                {emp.numero_matricule}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500">
                                Fonction
                              </span>
                              <span className="text-gray-900 text-right">
                                {emp.fonction || "Non spécifié"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500">
                                Section
                              </span>
                              <span className="text-gray-900 text-right">
                                {emp.section || "Non spécifié"}
                              </span>
                            </div>
                            {emp.responsable_section && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-500">
                                  Responsable
                                </span>
                                <span className="text-gray-900 text-right">
                                  {emp.responsable_section}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-gray-200 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleViewDetails(emp)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              Voir détails
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(emp.id)}
                                className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pagination améliorée */}
              {filteredEmployees.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Afficher</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-600">par page</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredEmployees.length)} sur{" "}
                      {filteredEmployees.length}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[40px] px-3 py-2 border text-sm rounded-lg transition-colors ${
                              page === currentPage
                                ? "bg-akj text-white"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State amélioré */}
              {filteredEmployees.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm || Object.values(filters).some((f) => f)
                      ? "Aucun employé trouvé"
                      : "Aucun employé enregistré"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm || Object.values(filters).some((f) => f)
                      ? "Aucun employé ne correspond à vos critères de recherche. Essayez d'autres termes ou modifiez les filtres."
                      : "Commencez par ajouter votre premier employé à la base de données."}
                  </p>
                  {!searchTerm && !Object.values(filters).some((f) => f) && (
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditMode(true);
                        resetForm();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors font-medium hover:bg-blue-700"
                    >
                      <Plus className="w-5 h-5" />
                      Ajouter le premier employé
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Formulaire avec bouton Modifier dans le header */}
          {(selectedEmployee || showForm) && (
            <EmployeeBlock
              employee={selectedEmployee}
              formData={formData}
              setFormData={setFormData}
              onSubmit={selectedEmployee ? handleUpdate : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditMode(false);
                setSelectedEmployee(null);
                resetForm();
              }}
              onEdit={handleEditEmployee}
              editMode={editMode}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
