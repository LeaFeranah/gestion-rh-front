import React, { useState, useEffect } from "react";
import "/src/styles/custom.css";
import PageHeader from "../../components/headers/PageHeader";
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
  getEmployeeById,
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
  createInformationProfessionnelle,
  updateInformationProfessionnelle,
} from "../../services/employeeService";
import AppFooter from "../../components/layout/AppFooter";

// Fonction de normalisation du sexe
const normalizeSexe = (sexe) => {
  if (!sexe) return "";
  const str = sexe
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (str === "masculin" || str === "m") return "Masculin";
  if (str === "feminin" || str === "f") return "Féminin";
  return sexe;
};

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
    statut: "", // Ajout du filtre statut
  });
  const [availableSections, setAvailableSections] = useState([]);

  // Fonction pour formater le nom complet
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

  // const getEffectiveSection = (emp) => {
  //   const section = emp.information_professionnelle?.section?.trim() || "";
  //   const responsableSection =
  //     emp.information_professionnelle?.responsable_section?.trim() || "";

  //   const upperSection = section.toUpperCase();

  //   const isResponsableSection =
  //     upperSection === "RESPONSABLE" ||
  //     upperSection === "RESPONSABLE 0" ||
  //     upperSection === "RESPONSABLE 1" ||
  //     upperSection === "RESPONSABLE 2" ||
  //     upperSection === "RESPONSABLE 3" ||
  //     upperSection === "RESPONSABLE RAPHIA" ||
  //     upperSection.startsWith("RESPONSABLE ");

  //   if (isResponsableSection) {
  //     return responsableSection || section;
  //   }

  //   if (!responsableSection) {
  //     return section;
  //   }

  //   return section;
  // };
  const getEffectiveSection = (emp) => {
    // Récupérer section : d'abord dans info pro, sinon à la racine
    const section = (
      emp.information_professionnelle?.section?.trim() ||
      emp.section?.trim() ||
      ""
    ).toUpperCase();
    // Récupérer responsable_section : d'abord dans info pro, sinon à la racine
    const responsableSection =
      emp.information_professionnelle?.responsable_section?.trim() ||
      emp.responsable_section?.trim() ||
      "";

    const isResponsableSection =
      section === "RESPONSABLE" ||
      section === "RESPONSABLE 0" ||
      section === "RESPONSABLE 1" ||
      section === "RESPONSABLE 2" ||
      section === "RESPONSABLE 3" ||
      section === "RESPONSABLE RAPHIA" ||
      section.startsWith("RESPONSABLE ");

    if (isResponsableSection) {
      return responsableSection || section; // si responsableSection vide, on garde section (ex: "RESPONSABLE")
    }

    // Sinon, la section effective est la section courante
    return (
      emp.information_professionnelle?.section?.trim() ||
      emp.section?.trim() ||
      ""
    );
  };
  useEffect(() => {
    if (employees.length > 0) {
      const sections = employees
        .map((emp) => getEffectiveSection(emp))
        .filter((section) => section && section.trim() !== "");

      const uniqueSections = [...new Set(sections)].sort();
      setAvailableSections(uniqueSections);
    } else {
      setAvailableSections([]);
    }
  }, [employees]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      //const data = await getAllEmployees();
      const data = await getAllEmployees(1, 100);
      // Tri croissant par numero_matricule (version robuste)
      const sortedData = data.sort((a, b) => {
        const matA = a.numero_matricule || "";
        const matB = b.numero_matricule || "";
        return matA.localeCompare(matB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });
      setEmployees(sortedData);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du chargement des employés");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const nomComplet = emp.nom_complet || "";
    const numeroMatricule = emp.numero_matricule || "";

    const matchesSearch =
      nomComplet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      numeroMatricule.toLowerCase().includes(searchTerm.toLowerCase());

    const isActif = !emp.depart || emp.depart === "0";
    const isDepart = emp.depart === "1" || emp.depart === "-1";

    const effectiveSection = getEffectiveSection(emp);
    const empFonction =
      emp.information_professionnelle?.fonction || emp.fonction || "";

    const matchesFilters =
      (!filters.section || effectiveSection === filters.section) &&
      (!filters.fonction || empFonction === filters.fonction) &&
      (!filters.sexe || normalizeSexe(emp.sexe) === filters.sexe) &&
      (!filters.statut ||
        (filters.statut === "actif" && isActif) ||
        (filters.statut === "depart" && isDepart));

    return matchesSearch && matchesFilters;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const initFormData = async (emp) => {
    const baseData = {
      ...emp,
      bancaire: emp.bancaire || {},
      salaire_personnel: emp.salaire_personnel || {},
      information_professionnelle: emp.information_professionnelle || {},
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

  const validateRequiredFields = () => {
    const errors = [];

    if (!formData.numero_matricule?.trim()) {
      errors.push("Le numéro matricule est obligatoire");
    }
    if (!formData.nom_complet?.trim()) {
      errors.push("Le nom complet est obligatoire");
    }

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
        !Array.isArray(value),
    );
    return hasAnyData;
  };

  const handleSaveEnfants = async (familialeId, enfants) => {
    if (!familialeId) return;

    try {
      console.log("Enfants à sauvegarder:", enfants);

      const existingEnfants = await getEnfantsByFamiliale(familialeId);
      const existingIds = existingEnfants.map((enfant) => enfant.id);
      const formIds = enfants
        .filter((enfant) => enfant.id)
        .map((enfant) => enfant.id);

      const toDelete = existingIds.filter((id) => !formIds.includes(id));
      for (const id of toDelete) {
        await deleteEnfant(id);
      }

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
        error.response?.data,
      );
      throw error;
    }
  };

  const handleViewDetails = async (emp) => {
    try {
      setLoading(true);

      // ✅ Appel l'endpoint détail qui retourne TOUT (bancaire, familiale, etc.)
      const fullEmp = await getEmployeeById(emp.id);
      const data = await initFormData(fullEmp);

      setFormData(data);
      setSelectedEmployee(fullEmp);
      setEditMode(false);
    } catch (error) {
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      console.error("URL:", error.config?.url);
      alert("Erreur " + (error.response?.status || error.message));
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

      const nomCompletFormatted = formatNomComplet(formData.nom_complet);

      const personalFields = {
        numero_matricule: formData.numero_matricule,
        nom_complet: nomCompletFormatted,
        sexe: normalizeSexe(formData.sexe),
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
        date_duplicata: formData.date_duplicata,
        lieu_duplicata: formData.lieu_duplicata,
        code_pays_passport: formData.code_pays_passport,
        type_passport: formData.type_passport,
        numero_passport: formData.numero_passport,
        date_expiration_passport: formData.date_expiration_passport,
        permis_categorie_a: formData.permis_categorie_a,
        permis_categorie_b: formData.permis_categorie_b,
        permis_categorie_c: formData.permis_categorie_c,
        permis_categorie_d: formData.permis_categorie_d,
        permis_categorie_e: formData.permis_categorie_e,
        permis_categorie_f: formData.permis_categorie_f,
        depart: formData.depart, // Ajout du champ depart
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

      if (formData.information_professionnelle) {
        const professionnelleData = {
          date_embauche:
            formData.information_professionnelle.date_embauche || "",
          fonction: formData.information_professionnelle.fonction || "",
          categorie: formData.information_professionnelle.categorie || "",
          section: formData.information_professionnelle.section || "",
          responsable_section:
            formData.information_professionnelle.responsable_section || "",
          numero_cnaps: formData.information_professionnelle.numero_cnaps || "",
          numero_ostie: formData.information_professionnelle.numero_ostie || "",
          employe: selectedEmployee.id,
        };

        Object.keys(professionnelleData).forEach((key) => {
          if (professionnelleData[key] === "") professionnelleData[key] = null;
        });

        if (formData.information_professionnelle.id) {
          await updateInformationProfessionnelle(
            formData.information_professionnelle.id,
            professionnelleData,
          );
        } else if (hasValidData(professionnelleData)) {
          await createInformationProfessionnelle(professionnelleData);
        }
      }

      if (formData.salaire_personnel) {
        const salaireData = {
          date_embauche: formData.salaire_personnel.date_embauche || "",
          indice: formData.salaire_personnel.indice || "",
          taux_horaire: formData.salaire_personnel.taux_horaire || "",
          salaire_base: formData.salaire_personnel.salaire_base || "",
          autre_indemnite: formData.salaire_personnel.autre_indemnite || "",
          responsable_section:
            formData.salaire_personnel.responsable_section || "",
          prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
          indemnite_deplacement:
            formData.salaire_personnel.indemnite_deplacement || "",
          dernier_aug_indice:
            formData.salaire_personnel.dernier_aug_indice || "",
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

        if (familialeId && formData.familiale?.enfants) {
          await handleSaveEnfants(familialeId, formData.familiale.enfants);
        }
      }

      await fetchEmployees();
      setEditMode(false);
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

      const nomCompletFormatted = formatNomComplet(formData.nom_complet);

      persoData.append(
        "numero_matricule",
        formData.numero_matricule?.trim() || "",
      );
      persoData.append("nom_complet", nomCompletFormatted);
      persoData.append("sexe", normalizeSexe(formData.sexe));

      const optionalFields = {
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
        date_duplicata: formData.date_duplicata,
        lieu_duplicata: formData.lieu_duplicata,
        code_pays_passport: formData.code_pays_passport,
        type_passport: formData.type_passport,
        numero_passport: formData.numero_passport,
        date_expiration_passport: formData.date_expiration_passport,
        permis_categorie_a: formData.permis_categorie_a,
        permis_categorie_b: formData.permis_categorie_b,
        permis_categorie_c: formData.permis_categorie_c,
        permis_categorie_d: formData.permis_categorie_d,
        permis_categorie_e: formData.permis_categorie_e,
        permis_categorie_f: formData.permis_categorie_f,
        depart: formData.depart || "0", // Valeur par défaut actif
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

      if (
        formData.information_professionnelle &&
        hasValidData(formData.information_professionnelle)
      ) {
        const professionnelleData = {
          date_embauche:
            formData.information_professionnelle?.date_embauche || "",
          fonction: formData.information_professionnelle?.fonction || "",
          categorie: formData.information_professionnelle?.categorie || "",
          section: formData.information_professionnelle?.section || "",
          responsable_section:
            formData.information_professionnelle?.responsable_section || "",
          numero_cnaps:
            formData.information_professionnelle?.numero_cnaps || "",
          numero_ostie:
            formData.information_professionnelle?.numero_ostie || "",
          employe: newEmp.id,
        };

        Object.keys(professionnelleData).forEach((key) => {
          if (professionnelleData[key] === "") professionnelleData[key] = null;
        });

        await createInformationProfessionnelle(professionnelleData);
      }

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

      if (
        formData.salaire_personnel &&
        hasValidData(formData.salaire_personnel)
      ) {
        const salaireData = {
          date_embauche: formData.salaire_personnel?.date_embauche || "",
          responsable_section:
            formData.salaire_personnel?.responsable_section || "",
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

        if (
          familialeId &&
          formData.familiale?.enfants &&
          formData.familiale.enfants.length > 0
        ) {
          await handleSaveEnfants(familialeId, formData.familiale.enfants);
        }
      }

      await fetchEmployees();

      const totalItemsAfterAdd = employees.length + 1;
      const lastPage = Math.ceil(totalItemsAfterAdd / itemsPerPage);
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
      date_duplicata: "",
      lieu_duplicata: "",
      code_pays_passport: "",
      type_passport: "",
      numero_passport: "",
      date_expiration_passport: "",
      permis_categorie_a: "",
      permis_categorie_b: "",
      permis_categorie_c: "",
      permis_categorie_d: "",
      permis_categorie_e: "",
      permis_categorie_f: "",
      depart: "0", // Par défaut actif
      photo: null,
      bancaire: {},
      information_professionnelle: {},
      salaire_personnel: {},
      familiale: { enfants: [] },
    });
  };

  // const fonctions = [
  //   ...new Set(
  //     employees
  //       .map((emp) => emp.information_professionnelle?.fonction)
  //       .filter(Boolean),
  //   ),
  // ].sort((a, b) => a.localeCompare(b));
  const fonctions = [
    ...new Set(
      employees
        .map((emp) => emp.information_professionnelle?.fonction || emp.fonction)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header avec Statistiques */}
        <PageHeader
          pageTag="Gestion des employés"
          title="Gestion des Employés"
          subtitle="Gérez efficacement les informations de votre personnel"
          kpis={[
            {
              label: "Total Employés",
              value: employees.length,
              dotColor: "#3b82f6",
            },
            {
              label: "Hommes",
              value: employees.filter(
                (e) => normalizeSexe(e.sexe) === "Masculin",
              ).length,
              dotColor: "#3b82f6",
            },
            {
              label: "Femmes",
              value: employees.filter(
                (e) => normalizeSexe(e.sexe) === "Féminin",
              ).length,
              dotColor: "#ec4899",
            },
            {
              label: "Affichage",
              value: `${currentItems.length}/${filteredEmployees.length}`,
              sub: "page courante",
              dotColor: "#a855f7",
            },
          ]}
        />

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
                    <div className="flex bg-gray-100 rounded p-0.5">
                      <button
                        onClick={() => setViewMode("table")}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === "table"
                            ? "bg-white shadow-sm text-gray-700"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Table className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-md transition-all ${
                          viewMode === "grid"
                            ? "bg-white shadow-sm text-gray-700"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <Grid className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Filtres */}
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`flex items-center gap-2 px-2 py-0.5 rounded border transition-colors ${
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
                        className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
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
                      className="flex items-center justify-center gap-2 px-2 py-1 bg-akj text-white rounded transition-all text-sm font-medium disabled:opacity-50 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Nouvel employé
                    </button>
                  </div>
                </div>

                {/* Filtres avancés */}
                {showFilters && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section
                        </label>
                        <select
                          value={filters.section}
                          onChange={(e) =>
                            setFilters({ ...filters, section: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                        >
                          <option value="">Toutes les sections</option>
                          {availableSections.map((section) => (
                            <option key={section} value={section}>
                              {section === "RESPONSABLE"
                                ? "Responsable"
                                : section}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fonction
                        </label>
                        <select
                          value={filters.fonction}
                          onChange={(e) =>
                            setFilters({ ...filters, fonction: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                        >
                          <option value="">Toutes les fonctions</option>
                          {fonctions.map((fonction) => (
                            <option key={fonction} value={fonction}>
                              {fonction}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sexe
                        </label>
                        <select
                          value={filters.sexe}
                          onChange={(e) =>
                            setFilters({ ...filters, sexe: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                        >
                          <option value="">Tous</option>
                          <option value="Masculin">Masculin</option>
                          <option value="Féminin">Féminin</option>
                        </select>
                      </div>

                      {/* Nouveau filtre statut */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Statut
                        </label>
                        <select
                          value={filters.statut}
                          onChange={(e) =>
                            setFilters({ ...filters, statut: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-0.5 text-sm focus:ring-1 focus:outline-none focus:ring-gray-500"
                        >
                          <option value="">Tous</option>
                          <option value="actif">Actif</option>
                          <option value="depart">Départ</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          setFilters({
                            section: "",
                            fonction: "",
                            sexe: "",
                            statut: "",
                          })
                        }
                        className="px-2 py-0.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Employé
                        </th>
                        <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Fonction
                        </th>
                        <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Section
                        </th>
                        <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="w-1/6 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                          <td className="px-6">
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
                                  {emp.nom_complet || "Nom non spécifié"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {emp.appellation || "Non spécifié"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6">
                            <div className="flex items-center">
                              <span className="text-sm font-bold text-gray-900 px-2 py-1 rounded">
                                {emp.numero_matricule}
                              </span>
                            </div>
                          </td>
                          <td className="px-6">
                            <div className="text-sm text-gray-900">
                              {emp.information_professionnelle?.fonction ||
                                emp.fonction ||
                                "Non spécifié"}
                            </div>
                          </td>
                          <td className="px-6">
                            <div className="text-sm text-gray-900">
                              {emp.information_professionnelle
                                ?.responsable_section ||
                                emp.information_professionnelle?.section ||
                                emp.section ||
                                "Non spécifié"}
                            </div>
                          </td>
                          <td className="px-6">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                                !emp.depart || emp.depart === "0"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {!emp.depart || emp.depart === "0"
                                ? "Actif"
                                : "Départ"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-start space-x-2">
                              <button
                                onClick={() => handleViewDetails(emp)}
                                className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-700 rounded hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
                                title="Voir détails"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Détails
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
                                {emp.nom_complet || "Nom non spécifié"}
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
                                {emp.information_professionnelle?.fonction ||
                                  emp.fonction ||
                                  "Non spécifié"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500">
                                Section
                              </span>
                              <span className="text-gray-900 text-right">
                                {emp.information_professionnelle
                                  ?.responsable_section ||
                                  emp.information_professionnelle?.section ||
                                  emp.section ||
                                  "Non spécifié"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500">
                                Statut
                              </span>
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  !emp.depart || emp.depart === "0"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {!emp.depart || emp.depart === "0"
                                  ? "Actif"
                                  : "Départ"}
                              </span>
                            </div>
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

              {/* Pagination */}
              {filteredEmployees.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Items par page */}
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
                        <option value={100}>100</option>
                      </select>
                      <span className="text-sm text-gray-600">par page</span>
                    </div>

                    {/* Info */}
                    <div className="text-sm text-gray-600">
                      {indexOfFirstItem + 1}–
                      {Math.min(indexOfLastItem, filteredEmployees.length)} sur{" "}
                      {filteredEmployees.length}
                    </div>

                    {/* Boutons pagination intelligente */}
                    <div className="flex items-center gap-1">
                      {/* Précédent */}
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-2 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors text-xs"
                        title="Première page"
                      >
                        «
                      </button>
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Numéros de pages intelligents */}
                      {(() => {
                        const pages = [];
                        const delta = 2; // pages autour de la page courante

                        const left = Math.max(2, currentPage - delta);
                        const right = Math.min(
                          totalPages - 1,
                          currentPage + delta,
                        );

                        // Toujours page 1
                        pages.push(
                          <button
                            key={1}
                            onClick={() => setCurrentPage(1)}
                            className={`min-w-[36px] px-3 py-2 border text-sm rounded-lg transition-colors ${
                              currentPage === 1
                                ? "bg-akj text-white border-akj"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            1
                          </button>,
                        );

                        // "..." gauche
                        if (left > 2) {
                          pages.push(
                            <span
                              key="left-dots"
                              className="px-2 text-gray-400 text-sm"
                            >
                              ...
                            </span>,
                          );
                        }

                        // Pages du milieu
                        for (let i = left; i <= right; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`min-w-[36px] px-3 py-2 border text-sm rounded-lg transition-colors ${
                                currentPage === i
                                  ? "bg-akj text-white border-akj"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {i}
                            </button>,
                          );
                        }

                        // "..." droite
                        if (right < totalPages - 1) {
                          pages.push(
                            <span
                              key="right-dots"
                              className="px-2 text-gray-400 text-sm"
                            >
                              ...
                            </span>,
                          );
                        }

                        // Toujours dernière page
                        if (totalPages > 1) {
                          pages.push(
                            <button
                              key={totalPages}
                              onClick={() => setCurrentPage(totalPages)}
                              className={`min-w-[36px] px-3 py-2 border text-sm rounded-lg transition-colors ${
                                currentPage === totalPages
                                  ? "bg-akj text-white border-akj"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {totalPages}
                            </button>,
                          );
                        }

                        return pages;
                      })()}

                      {/* Suivant */}
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-2 py-2 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors text-xs"
                        title="Dernière page"
                      >
                        »
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
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

          {/* Formulaire */}
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
              availableSections={availableSections}
            />
          )}
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default EmployeesPage;
