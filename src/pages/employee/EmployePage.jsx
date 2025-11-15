// // // // import React, { useState, useEffect } from "react";
// // // // import "/src/styles/custom.css";
// // // // import {
// // // //   Search,
// // // //   Plus,
// // // //   Eye,
// // // //   Edit2,
// // // //   Trash2,
// // // //   ChevronLeft,
// // // //   ChevronRight,
// // // // } from "lucide-react";
// // // // import EmployeeBlock from "../../components/employee/EmployeeBlock";
// // // // import {
// // // //   getAllEmployees,
// // // //   createEmployee,
// // // //   updateEmployee,
// // // //   deleteEmployee,
// // // //   createBancaire,
// // // //   updateBancaire,
// // // //   createSalaire,
// // // //   updateSalaire,
// // // //   createFamiliale,
// // // //   updateFamiliale,
// // // // } from "../../services/employeeService";

// // // // const EmployeesPage = () => {
// // // //   // ========================================
// // // //   // ÉTATS LOCAUX
// // // //   // ========================================

// // // //   const [employees, setEmployees] = useState([]); // Liste de tous les employés
// // // //   const [selectedEmployee, setSelectedEmployee] = useState(null); // Employé sélectionné pour consultation/édition
// // // //   const [showForm, setShowForm] = useState(false); // Afficher le formulaire d'ajout
// // // //   const [editMode, setEditMode] = useState(false); // Mode édition actif ou non
// // // //   const [formData, setFormData] = useState({}); // Données du formulaire en cours
// // // //   const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche

// // // //   // ========================================
// // // //   // ÉTATS PAGINATION
// // // //   // ========================================
// // // //   const [currentPage, setCurrentPage] = useState(1);
// // // //   const [itemsPerPage, setItemsPerPage] = useState(10);

// // // //   // ========================================
// // // //   // CHARGEMENT INITIAL DES DONNÉES
// // // //   // ========================================

// // // //   useEffect(() => {
// // // //     fetchEmployees();
// // // //   }, []);

// // // //   /**
// // // //    * Récupère la liste de tous les employés depuis l'API
// // // //    * et les trie par ID croissant
// // // //    */
// // // //   const fetchEmployees = async () => {
// // // //     try {
// // // //       const data = await getAllEmployees();
// // // //       const sortedData = data.sort((a, b) => a.id - b.id);
// // // //       setEmployees(sortedData);
// // // //     } catch (error) {
// // // //       console.error("Erreur lors du chargement des employés :", error);
// // // //     }
// // // //   };

// // // //   // ========================================
// // // //   // CALCULS PAGINATION
// // // //   // ========================================

// // // //   /**
// // // //    * Filtre les employés selon le terme de recherche
// // // //    * Recherche dans : nom, prénoms, numéro matricule
// // // //    */
// // // //   const filteredEmployees = employees.filter(
// // // //     (emp) =>
// // // //       emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //       emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //       emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
// // // //   );

// // // //   // Calcul des données pour la pagination
// // // //   const indexOfLastItem = currentPage * itemsPerPage;
// // // //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// // // //   const currentItems = filteredEmployees.slice(
// // // //     indexOfFirstItem,
// // // //     indexOfLastItem
// // // //   );
// // // //   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

// // // //   // Réinitialiser à la première page quand la recherche change
// // // //   useEffect(() => {
// // // //     setCurrentPage(1);
// // // //   }, [searchTerm, itemsPerPage]);

// // // //   // Fonction pour changer de page
// // // //   const handlePageChange = (pageNumber) => {
// // // //     setCurrentPage(pageNumber);
// // // //   };

// // // //   // Générer les numéros de page à afficher
// // // //   const getPageNumbers = () => {
// // // //     const pageNumbers = [];
// // // //     const maxVisiblePages = 5;

// // // //     if (totalPages <= maxVisiblePages) {
// // // //       // Si moins de 5 pages, toutes les afficher
// // // //       for (let i = 1; i <= totalPages; i++) {
// // // //         pageNumbers.push(i);
// // // //       }
// // // //     } else {
// // // //       // Sinon, afficher les pages autour de la page courante
// // // //       const startPage = Math.max(1, currentPage - 2);
// // // //       const endPage = Math.min(totalPages, currentPage + 2);

// // // //       if (startPage > 1) {
// // // //         pageNumbers.push(1);
// // // //         if (startPage > 2) pageNumbers.push("...");
// // // //       }

// // // //       for (let i = startPage; i <= endPage; i++) {
// // // //         pageNumbers.push(i);
// // // //       }

// // // //       if (endPage < totalPages) {
// // // //         if (endPage < totalPages - 1) pageNumbers.push("...");
// // // //         pageNumbers.push(totalPages);
// // // //       }
// // // //     }

// // // //     return pageNumbers;
// // // //   };

// // // //   // ========================================
// // // //   // INITIALISATION DU FORMULAIRE
// // // //   // ========================================

// // // //   /**
// // // //    * Initialise les données du formulaire avec les valeurs de l'employé
// // // //    * ou des valeurs vides pour un nouvel employé
// // // //    * @param {object} emp - Objet employé
// // // //    * @returns {object} - Données formatées pour le formulaire
// // // //    */
// // // //   const initFormData = (emp) => ({
// // // //     ...emp,
// // // //     bancaire: emp.bancaire || {
// // // //       id: null,
// // // //       nom_banque: "",
// // // //       numero_compte: "",
// // // //       cle_rib: "",
// // // //       banque_beneficiaire: "",
// // // //     },
// // // //     // Initialisation de la section salaire
// // // //     salaire_personnel: emp.salaire_personnel || {
// // // //       id: null,
// // // //       date_embauche: "",
// // // //       fonction: "",
// // // //       categorie: "",
// // // //       salaire: "",
// // // //       section: "",
// // // //       responsable_section: "",
// // // //       prime_anciennete: "",
// // // //       indemnite_deplacement: "",
// // // //       dernier_aug_indice: "",
// // // //       pour_30: "",
// // // //       T1_17: "",
// // // //       T2_17: "",
// // // //       T3_17: "",
// // // //       T4_17: "",
// // // //       obs_prime: "",
// // // //     },
// // // //     // Initialisation de la section familiale
// // // //     familiale: emp.familiale || {
// // // //       id: null,
// // // //       epoux_nom: "",
// // // //       epoux_prenoms: "",
// // // //       epoux_date_naissance: "",
// // // //       epoux_lieu_naissance: "",
// // // //       epoux_societe: "",
// // // //       epoux_fonction: "",
// // // //       enfants: [],
// // // //     },
// // // //   });

// // // //   // ========================================
// // // //   // GESTION DE LA MISE À JOUR D'UN EMPLOYÉ
// // // //   // ========================================

// // // //   const handleUpdate = async () => {
// // // //     if (!selectedEmployee) return;

// // // //     try {
// // // //       // --- 1. Mise à jour des informations personnelles ---
// // // //       const persoDataToUpdate = {
// // // //         numero_matricule: formData.numero_matricule || "",
// // // //         nom: formData.nom || "",
// // // //         prenoms: formData.prenoms || "",
// // // //         sexe: formData.sexe || "",
// // // //         appellation: formData.appellation || "",
// // // //         fonction: formData.fonction || "",
// // // //         section: formData.section || "",
// // // //         date_naissance: formData.date_naissance || null,
// // // //         lieu_naissance: formData.lieu_naissance || "",
// // // //         CIN: formData.CIN || "",
// // // //         date_CIN: formData.date_CIN || null,
// // // //         lieu_CIN: formData.lieu_CIN || "",
// // // //         numero_cnaps: formData.numero_cnaps || "",
// // // //         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
// // // //         pere: formData.pere || "",
// // // //         mere: formData.mere || "",
// // // //         adresse: formData.adresse || "",
// // // //         quartier: formData.quartier || "",
// // // //         telephone: formData.telephone || "",
// // // //         email: formData.email || "",
// // // //       };

// // // //       await updateEmployee(selectedEmployee.id, persoDataToUpdate);

// // // //       // --- 2. Mise à jour ou création des informations bancaires ---
// // // //       if (formData.bancaire) {
// // // //         const bancaireData = {
// // // //           nom_banque: formData.bancaire.nom_banque || "",
// // // //           code_banque: formData.bancaire.code_banque || "",
// // // //           code_agence: formData.bancaire.code_agence || "",
// // // //           numero_compte: formData.bancaire.numero_compte || "",
// // // //           cle_rib: formData.bancaire.cle_rib || "",
// // // //           banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
// // // //           employe: selectedEmployee.id,
// // // //         };

// // // //         if (formData.bancaire.id) {
// // // //           await updateBancaire(formData.bancaire.id, bancaireData);
// // // //         } else if (bancaireData.nom_banque || bancaireData.numero_compte) {
// // // //           await createBancaire(bancaireData);
// // // //         }
// // // //       }

// // // //       // --- 3. Mise à jour ou création des informations de salaire ---
// // // //       if (formData.salaire_personnel) {
// // // //         const salaireData = {
// // // //           date_embauche: formData.salaire_personnel.date_embauche || null,
// // // //           fonction: formData.salaire_personnel.fonction || "",
// // // //           categorie: formData.salaire_personnel.categorie || "",
// // // //           salaire: formData.salaire_personnel.salaire || "",
// // // //           section: formData.salaire_personnel.section || "",
// // // //           responsable_section:
// // // //             formData.salaire_personnel.responsable_section || "",
// // // //           prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
// // // //           indemnite_deplacement:
// // // //             formData.salaire_personnel.indemnite_deplacement || "",
// // // //           dernier_aug_indice:
// // // //             formData.salaire_personnel.dernier_aug_indice || "",
// // // //           pour_30: formData.salaire_personnel.pour_30 || "",
// // // //           T1_17: formData.salaire_personnel.T1_17 || "",
// // // //           T2_17: formData.salaire_personnel.T2_17 || "",
// // // //           T3_17: formData.salaire_personnel.T3_17 || "",
// // // //           T4_17: formData.salaire_personnel.T4_17 || "",
// // // //           obs_prime: formData.salaire_personnel.obs_prime || "",
// // // //           employe: selectedEmployee.id,
// // // //         };

// // // //         if (formData.salaire_personnel.id) {
// // // //           await updateSalaire(formData.salaire_personnel.id, salaireData);
// // // //         } else if (salaireData.salaire || salaireData.fonction) {
// // // //           await createSalaire(salaireData);
// // // //         }
// // // //       }

// // // //       // --- 4. Mise à jour ou création des informations familiales ---
// // // //       if (formData.familiale) {
// // // //         // Gestion de la date de naissance du conjoint
// // // //         let epouxDateNaissance = formData.familiale.epoux_date_naissance;
// // // //         if (Array.isArray(epouxDateNaissance)) {
// // // //           epouxDateNaissance = epouxDateNaissance[0] || null;
// // // //         }

// // // //         const familialeData = {
// // // //           epoux_nom: formData.familiale.epoux_nom || "",
// // // //           epoux_prenoms: formData.familiale.epoux_prenoms || "",
// // // //           epoux_date_naissance: epouxDateNaissance,
// // // //           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
// // // //           epoux_societe: formData.familiale.epoux_societe || "",
// // // //           epoux_fonction: formData.familiale.epoux_fonction || "",
// // // //           enfants: formData.familiale.enfants || [],
// // // //           employe: selectedEmployee.id,
// // // //         };

// // // //         if (formData.familiale.id) {
// // // //           await updateFamiliale(formData.familiale.id, familialeData);
// // // //         } else if (
// // // //           familialeData.epoux_nom ||
// // // //           familialeData.enfants.length > 0
// // // //         ) {
// // // //           await createFamiliale(familialeData);
// // // //         }
// // // //       }

// // // //       // --- 5. Rafraîchir la liste et fermer le formulaire ---
// // // //       await fetchEmployees();
// // // //       setEditMode(false);
// // // //       setSelectedEmployee(null);
// // // //       resetForm();

// // // //       // Message de succès
// // // //       alert("Employé mis à jour avec succès !");
// // // //     } catch (error) {
// // // //       console.error(
// // // //         "Erreur lors de la mise à jour :",
// // // //         error.response?.data || error
// // // //       );
// // // //       alert(
// // // //         "Erreur lors de la mise à jour. Vérifiez les champs obligatoires !"
// // // //       );
// // // //     }
// // // //   };

// // // //   // ========================================
// // // //   // GESTION DE L'AJOUT D'UN NOUVEL EMPLOYÉ
// // // //   // ========================================

// // // //   const handleAdd = async () => {
// // // //     try {
// // // //       console.log("=== DÉBUT handleAdd ===");
// // // //       console.log("formData:", formData);

// // // //       // --- 1. Validation des champs obligatoires ---
// // // //       if (!formData.numero_matricule || !formData.nom || !formData.prenoms) {
// // // //         const missingFields = [];
// // // //         if (!formData.numero_matricule) missingFields.push("Matricule");
// // // //         if (!formData.nom) missingFields.push("Nom");
// // // //         if (!formData.prenoms) missingFields.push("Prénoms");

// // // //         alert(`Champs obligatoires manquants : ${missingFields.join(", ")}`);
// // // //         return;
// // // //       }

// // // //       // --- 2. Préparation des données personnelles ---
// // // //       const persoData = {
// // // //         numero_matricule: formData.numero_matricule,
// // // //         nom: formData.nom,
// // // //         prenoms: formData.prenoms,
// // // //         sexe: formData.sexe || "",
// // // //         appellation: formData.appellation || "",
// // // //         fonction: formData.fonction || "",
// // // //         section: formData.section || "",
// // // //         date_naissance: formData.date_naissance || null,
// // // //         lieu_naissance: formData.lieu_naissance || "",
// // // //         CIN: formData.CIN || "",
// // // //         date_CIN: formData.date_CIN || null,
// // // //         lieu_CIN: formData.lieu_CIN || "",
// // // //         numero_cnaps: formData.numero_cnaps || "",
// // // //         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
// // // //         pere: formData.pere || "",
// // // //         mere: formData.mere || "",
// // // //         adresse: formData.adresse || "",
// // // //         quartier: formData.quartier || "",
// // // //         telephone: formData.telephone || "",
// // // //         email: formData.email || "",
// // // //       };

// // // //       console.log("Données personnelles à envoyer:", persoData);

// // // //       // --- 3. Création de l'employé dans la base ---
// // // //       console.log("Appel à createEmployee...");
// // // //       const newEmp = await createEmployee(persoData);
// // // //       console.log("Employé créé avec succès:", newEmp);

// // // //       // --- 4. Création des informations bancaires (si renseignées) ---
// // // //       if (
// // // //         formData.bancaire &&
// // // //         (formData.bancaire.nom_banque || formData.bancaire.numero_compte)
// // // //       ) {
// // // //         try {
// // // //           console.log("Création informations bancaires...");
// // // //           await createBancaire({
// // // //             nom_banque: formData.bancaire.nom_banque || "",
// // // //             code_banque: formData.bancaire.code_banque || "",
// // // //             code_agence: formData.bancaire.code_agence || "",
// // // //             numero_compte: formData.bancaire.numero_compte || "",
// // // //             cle_rib: formData.bancaire.cle_rib || "",
// // // //             banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
// // // //             employe: newEmp.id,
// // // //           });
// // // //           console.log("Informations bancaires créées avec succès");
// // // //         } catch (bancaireError) {
// // // //           console.error("Erreur création bancaire:", bancaireError);
// // // //         }
// // // //       }

// // // //       // --- 5. Création des informations de salaire (si renseignées) ---
// // // //       if (formData.salaire_personnel) {
// // // //         try {
// // // //           console.log("Création informations salaire...");
// // // //           await createSalaire({
// // // //             date_embauche: formData.salaire_personnel.date_embauche || null,
// // // //             fonction: formData.salaire_personnel.fonction || "",
// // // //             categorie: formData.salaire_personnel.categorie || "",
// // // //             salaire: formData.salaire_personnel.salaire || "",
// // // //             section: formData.salaire_personnel.section || "",
// // // //             responsable_section:
// // // //               formData.salaire_personnel.responsable_section || "",
// // // //             prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
// // // //             indemnite_deplacement:
// // // //               formData.salaire_personnel.indemnite_deplacement || "",
// // // //             dernier_aug_indice:
// // // //               formData.salaire_personnel.dernier_aug_indice || "",
// // // //             pour_30: formData.salaire_personnel.pour_30 || "",
// // // //             T1_17: formData.salaire_personnel.T1_17 || "",
// // // //             T2_17: formData.salaire_personnel.T2_17 || "",
// // // //             T3_17: formData.salaire_personnel.T3_17 || "",
// // // //             T4_17: formData.salaire_personnel.T4_17 || "",
// // // //             obs_prime: formData.salaire_personnel.obs_prime || "",
// // // //             employe: newEmp.id,
// // // //           });
// // // //           console.log("Informations salaire créées avec succès");
// // // //         } catch (salaireError) {
// // // //           console.error("Erreur création salaire:", salaireError);
// // // //         }
// // // //       }

// // // //       // --- 6. Création des informations familiales (si renseignées) ---
// // // //       if (
// // // //         formData.familiale &&
// // // //         (formData.familiale.epoux_nom || formData.familiale.enfants?.length > 0)
// // // //       ) {
// // // //         try {
// // // //           console.log("Création informations familiales...");
// // // //           let epouxDateNaissance = formData.familiale.epoux_date_naissance;
// // // //           if (Array.isArray(epouxDateNaissance)) {
// // // //             epouxDateNaissance = epouxDateNaissance[0] || null;
// // // //           }

// // // //           await createFamiliale({
// // // //             epoux_nom: formData.familiale.epoux_nom || "",
// // // //             epoux_prenoms: formData.familiale.epoux_prenoms || "",
// // // //             epoux_date_naissance: epouxDateNaissance,
// // // //             epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
// // // //             epoux_societe: formData.familiale.epoux_societe || "",
// // // //             epoux_fonction: formData.familiale.epoux_fonction || "",
// // // //             enfants: formData.familiale.enfants || [],
// // // //             employe: newEmp.id,
// // // //           });
// // // //           console.log("Informations familiales créées avec succès");
// // // //         } catch (familialeError) {
// // // //           console.error("Erreur création familiale:", familialeError);
// // // //         }
// // // //       }

// // // //       // --- 7. Rafraîchir la liste et fermer le formulaire ---
// // // //       console.log("Rafraîchissement de la liste...");
// // // //       await fetchEmployees();
// // // //       setShowForm(false);
// // // //       setEditMode(false);
// // // //       resetForm();

// // // //       console.log("=== FIN handleAdd - SUCCÈS ===");
// // // //       alert("Employé créé avec succès !");
// // // //     } catch (error) {
// // // //       console.error("=== ERREUR handleAdd ===");
// // // //       console.error("Erreur complète:", error);
// // // //       console.error("Réponse API:", error.response?.data);
// // // //       console.error("Status:", error.response?.status);

// // // //       alert(
// // // //         `Erreur lors de la création: ${
// // // //           error.response?.data?.message || error.message || "Erreur inconnue"
// // // //         }`
// // // //       );
// // // //     }
// // // //   };

// // // //   const handleDelete = async (id) => {
// // // //     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
// // // //       try {
// // // //         await deleteEmployee(id);
// // // //         fetchEmployees();
// // // //         setSelectedEmployee(null);
// // // //       } catch (error) {
// // // //         console.error("Erreur lors de la suppression :", error);
// // // //       }
// // // //     }
// // // //   };

// // // //   // ========================================
// // // //   // RÉINITIALISATION DU FORMULAIRE
// // // //   // ========================================

// // // //   /**
// // // //    * Réinitialise toutes les données du formulaire
// // // //    */
// // // //   const resetForm = () => {
// // // //     setFormData({
// // // //       numero_matricule: "",
// // // //       nom: "",
// // // //       prenoms: "",
// // // //       sexe: "",
// // // //       appellation: "",
// // // //       fonction: "",
// // // //       section: "",
// // // //       date_naissance: "",
// // // //       lieu_naissance: "",
// // // //       CIN: "",
// // // //       date_CIN: "",
// // // //       lieu_CIN: "",
// // // //       numero_cnaps: "",
// // // //       ancien_numero_journaliere: "",
// // // //       pere: "",
// // // //       mere: "",
// // // //       quartier: "",
// // // //       adresse: "",
// // // //       telephone: "",
// // // //       email: "",
// // // //       bancaire: {
// // // //         id: null,
// // // //         nom_banque: "",
// // // //         code_banque: "",
// // // //         code_agence: "",
// // // //         numero_compte: "",
// // // //         cle_rib: "",
// // // //         banque_beneficiaire: "",
// // // //       },
// // // //       salaire_personnel: {
// // // //         id: null,
// // // //         date_embauche: "",
// // // //         fonction: "",
// // // //         categorie: "",
// // // //         salaire: "",
// // // //         section: "",
// // // //         responsable_section: "",
// // // //         prime_anciennete: "",
// // // //         indemnite_deplacement: "",
// // // //         dernier_aug_indice: "",
// // // //         pour_30: "",
// // // //         T1_17: "",
// // // //         T2_17: "",
// // // //         T3_17: "",
// // // //         T4_17: "",
// // // //         obs_prime: "",
// // // //       },
// // // //       familiale: {
// // // //         id: null,
// // // //         epoux_nom: "",
// // // //         epoux_prenoms: "",
// // // //         epoux_date_naissance: "",
// // // //         epoux_lieu_naissance: "",
// // // //         epoux_societe: "",
// // // //         epoux_fonction: "",
// // // //         enfants: [],
// // // //       },
// // // //     });
// // // //   };

// // // //   // ========================================
// // // //   // RENDU DE LA PAGE
// // // //   // ========================================

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-100">
// // // //       {/* ==========================================
// // // //           HEADER FIXE - TOUJOURS VISIBLE
// // // //           ========================================== */}
// // // //       <div className="bg-white border-b sticky top-0 z-10">
// // // //         <div className="px-6 py-4">
// // // //           <h1 className="text-2xl font-medium text-gray-800">
// // // //             Gestion des Employés
// // // //           </h1>
// // // //         </div>
// // // //       </div>

// // // //       <div className="p-6">
// // // //         {/* ==========================================
// // // //             LISTE DES EMPLOYÉS
// // // //             ========================================== */}
// // // //         {!selectedEmployee && !showForm && (
// // // //           <div className="bg-white rounded-lg shadow-sm">
// // // //             {/* ==========================================
// // // //                 EN-TÊTE : TITRE + RECHERCHE + BOUTON AJOUT
// // // //                 ========================================== */}
// // // //             <div className="flex items-center justify-between px-6 py-4">
// // // //               <h2 className="text-lg font-medium text-gray-800">
// // // //                 Liste des Employés
// // // //               </h2>

// // // //               {/* <div className="flex flex-col sm:flex-row gap-3 items-center"> */}
// // // //               {/* Barre de recherche */}
// // // //               {/* <div className="relative flex-1 w-full">
// // // //                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="Rechercher par nom, prénom ou matricule..."
// // // //                     value={searchTerm}
// // // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // // //                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
// // // //                   />
// // // //                 </div> */}
// // // //               <div className="flex items-center gap-3">
// // // //                 <div className="relative">
// // // //                   <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
// // // //                   <input
// // // //                     type="text"
// // // //                     placeholder="Rechercher..."
// // // //                     value={searchTerm}
// // // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // // //                     className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50"
// // // //                   />
// // // //                 </div>

// // // //                 {/* Bouton "Nouvel employé" */}
// // // //                 <button
// // // //                   onClick={() => {
// // // //                     setShowForm(true);
// // // //                     setEditMode(true);
// // // //                     setSelectedEmployee(null);
// // // //                     resetForm();
// // // //                   }}
// // // //                   className="flex items-center gap-2 px-5 py-2.5 bg-akj text-white rounded-md transition text-sm font-medium whitespace-nowrap w-full sm:w-auto justify-center"
// // // //                 >
// // // //                   <Plus className="w-4 h-4" />
// // // //                   Nouvel employé
// // // //                 </button>
// // // //               </div>
// // // //             </div>

// // // //             {/* ==========================================
// // // //                 TABLEAU DES EMPLOYÉS
// // // //                 ========================================== */}
// // // //             <div className="overflow-x-auto">
// // // //               {/* <table className="w-full"> */}
// // // //               <table className="w-full border-collapse">
// // // //                 {/* <thead className="bg-gray-50 border-b"> */}
// // // //                 <thead className="bg-[#f0f0f0] text-gray-600 text-sm">
// // // //                   <tr>
// // // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // // //                       N° Matricule
// // // //                     </th>
// // // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // // //                       Employé
// // // //                     </th>
// // // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // // //                       Appellation
// // // //                     </th>
// // // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // // //                       Fonction
// // // //                     </th>
// // // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // // //                       Section
// // // //                     </th>
// // // //                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // // //                       Actions
// // // //                     </th>
// // // //                   </tr>
// // // //                 </thead>

// // // //                 {/* <tbody className="bg-white divide-y divide-gray-200"> */}
// // // //                 <tbody className="text-sm divide-y divide-gray-100">
// // // //                   {currentItems.map((emp) => (
// // // //                     // <tr key={emp.id} className="hover:bg-gray-50 transition">
// // // //                     <tr
// // // //                       key={emp.id}
// // // //                       className="hover:bg-[#fafafa] transition cursor-pointer"
// // // //                     >
// // // //                       {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// // // //                         {emp.numero_matricule}
// // // //                       </td> */}
// // // //                       <td className="px-5 py-3">{emp.numero_matricule}</td>
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// // // //                         {emp.nom} {emp.prenoms}
// // // //                       </td>
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// // // //                         {emp.appellation || "-"}
// // // //                       </td>
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// // // //                         {emp.fonction || "-"}
// // // //                       </td>
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// // // //                         {emp.section || "-"}
// // // //                       </td>
// // // //                       <td className="px-6 py-4 whitespace-nowrap text-sm">
// // // //                         <div className="flex items-center gap-2">
// // // //                           <button
// // // //                             onClick={() => {
// // // //                               setSelectedEmployee(emp);
// // // //                               setFormData(initFormData(emp));
// // // //                               setEditMode(false);
// // // //                             }}
// // // //                             className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
// // // //                             title="Voir détails"
// // // //                           >
// // // //                             <Eye className="w-4 h-4" />
// // // //                           </button>
// // // //                           <button
// // // //                             onClick={() => {
// // // //                               setSelectedEmployee(emp);
// // // //                               setFormData(initFormData(emp));
// // // //                               setEditMode(true);
// // // //                             }}
// // // //                             className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
// // // //                             title="Éditer"
// // // //                           >
// // // //                             <Edit2 className="w-4 h-4" />
// // // //                           </button>
// // // //                           <button
// // // //                             onClick={() => handleDelete(emp.id)}
// // // //                             className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
// // // //                             title="Supprimer"
// // // //                           >
// // // //                             <Trash2 className="w-4 h-4" />
// // // //                           </button>
// // // //                         </div>
// // // //                       </td>
// // // //                     </tr>
// // // //                   ))}
// // // //                 </tbody>
// // // //               </table>
// // // //             </div>

// // // //             {/* ==========================================
// // // //                 PAGINATION
// // // //                 ========================================== */}
// // // //             {filteredEmployees.length > 0 && (
// // // //               <div className="px-6 py-4 border-t bg-gray-50">
// // // //                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
// // // //                   {/* Sélecteur d'éléments par page */}
// // // //                   <div className="flex items-center gap-2">
// // // //                     <span className="text-sm text-gray-600">Afficher</span>
// // // //                     <select
// // // //                       value={itemsPerPage}
// // // //                       onChange={(e) => {
// // // //                         setItemsPerPage(Number(e.target.value));
// // // //                         setCurrentPage(1);
// // // //                       }}
// // // //                       className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
// // // //                     >
// // // //                       <option value={5}>5</option>
// // // //                       <option value={10}>10</option>
// // // //                       <option value={20}>20</option>
// // // //                       <option value={50}>50</option>
// // // //                     </select>
// // // //                     <span className="text-sm text-gray-600">éléments</span>
// // // //                   </div>

// // // //                   {/* Informations de pagination */}
// // // //                   <div className="text-sm text-gray-600">
// // // //                     {indexOfFirstItem + 1}-
// // // //                     {Math.min(indexOfLastItem, filteredEmployees.length)}
// // // //                     sur {filteredEmployees.length} employé(s)
// // // //                   </div>

// // // //                   {/* Contrôles de pagination */}
// // // //                   <div className="flex items-center gap-1">
// // // //                     {/* Bouton Précédent */}
// // // //                     <button
// // // //                       onClick={() => handlePageChange(currentPage - 1)}
// // // //                       disabled={currentPage === 1}
// // // //                       className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
// // // //                       title="Page précédente"
// // // //                     >
// // // //                       <ChevronLeft className="w-4 h-4" />
// // // //                     </button>

// // // //                     {/* Numéros de page */}
// // // //                     {getPageNumbers().map((pageNumber, index) => (
// // // //                       <button
// // // //                         key={index}
// // // //                         onClick={() =>
// // // //                           typeof pageNumber === "number" &&
// // // //                           handlePageChange(pageNumber)
// // // //                         }
// // // //                         disabled={pageNumber === "..."}
// // // //                         className={`min-w-[40px] px-3 py-2 border text-sm rounded ${
// // // //                           pageNumber === currentPage
// // // //                             ? "bg-purple-600 text-white border-purple-600"
// // // //                             : pageNumber === "..."
// // // //                             ? "border-transparent text-gray-400 cursor-default"
// // // //                             : "border-gray-300 text-gray-700 hover:bg-gray-50"
// // // //                         }`}
// // // //                       >
// // // //                         {pageNumber}
// // // //                       </button>
// // // //                     ))}

// // // //                     {/* Bouton Suivant */}
// // // //                     <button
// // // //                       onClick={() => handlePageChange(currentPage + 1)}
// // // //                       disabled={currentPage === totalPages}
// // // //                       className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
// // // //                       title="Page suivante"
// // // //                     >
// // // //                       <ChevronRight className="w-4 h-4" />
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             {/* ==========================================
// // // //                 MESSAGE SI AUCUN RÉSULTAT
// // // //                 ========================================== */}
// // // //             {filteredEmployees.length === 0 && (
// // // //               <div className="text-center py-12">
// // // //                 <p className="text-gray-500 text-sm">
// // // //                   {searchTerm
// // // //                     ? "Aucun employé trouvé pour cette recherche"
// // // //                     : "Aucun employé dans la base de données"}
// // // //                 </p>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         )}

// // // //         {/* ==========================================
// // // //             AFFICHAGE DU BLOC EMPLOYÉ
// // // //             ========================================== */}
// // // //         {(selectedEmployee || showForm) && (
// // // //           <div className="bg-white rounded-lg shadow-sm">
// // // //             <EmployeeBlock
// // // //               employee={selectedEmployee}
// // // //               formData={formData}
// // // //               setFormData={setFormData}
// // // //               onSubmit={() => {
// // // //                 console.log("Bouton cliqué !");
// // // //                 if (editMode && selectedEmployee) {
// // // //                   handleUpdate();
// // // //                 } else {
// // // //                   handleAdd();
// // // //                 }
// // // //               }}
// // // //               onCancel={() => {
// // // //                 setShowForm(false);
// // // //                 setEditMode(false);
// // // //                 setSelectedEmployee(null);
// // // //                 resetForm();
// // // //               }}
// // // //               editMode={editMode}
// // // //             />
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default EmployeesPage;

// // // import React, { useState, useEffect } from "react";
// // // import "/src/styles/custom.css";
// // // import {
// // //   Search,
// // //   Plus,
// // //   Eye,
// // //   Edit2,
// // //   Trash2,
// // //   ChevronLeft,
// // //   ChevronRight,
// // //   Table,
// // //   Grid,
// // // } from "lucide-react";
// // // import EmployeeBlock from "../../components/employee/EmployeeBlock";
// // // import {
// // //   getAllEmployees,
// // //   createEmployee,
// // //   updateEmployee,
// // //   deleteEmployee,
// // //   createBancaire,
// // //   updateBancaire,
// // //   createSalaire,
// // //   updateSalaire,
// // //   createFamiliale,
// // //   updateFamiliale,
// // // } from "../../services/employeeService";

// // // const EmployeesPage = () => {
// // //   // ========================================
// // //   // ÉTATS LOCAUX
// // //   // ========================================

// // //   const [employees, setEmployees] = useState([]);
// // //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// // //   const [showForm, setShowForm] = useState(false);
// // //   const [editMode, setEditMode] = useState(false);
// // //   const [formData, setFormData] = useState({});
// // //   const [searchTerm, setSearchTerm] = useState("");
// // //   const [viewMode, setViewMode] = useState("table");

// // //   // ========================================
// // //   // ÉTATS PAGINATION
// // //   // ========================================
// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [itemsPerPage, setItemsPerPage] = useState(10);

// // //   // ========================================
// // //   // CHARGEMENT INITIAL DES DONNÉES
// // //   // ========================================

// // //   useEffect(() => {
// // //     fetchEmployees();
// // //   }, []);

// // //   const fetchEmployees = async () => {
// // //     try {
// // //       const data = await getAllEmployees();
// // //       const sortedData = data.sort((a, b) => a.id - b.id);
// // //       setEmployees(sortedData);
// // //     } catch (error) {
// // //       console.error("Erreur lors du chargement des employés :", error);
// // //     }
// // //   };

// // //   // ========================================
// // //   // CALCULS PAGINATION
// // //   // ========================================

// // //   const filteredEmployees = employees.filter(
// // //     (emp) =>
// // //       emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //       emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
// // //   );

// // //   const indexOfLastItem = currentPage * itemsPerPage;
// // //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// // //   const currentItems = filteredEmployees.slice(
// // //     indexOfFirstItem,
// // //     indexOfLastItem
// // //   );
// // //   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

// // //   useEffect(() => {
// // //     setCurrentPage(1);
// // //   }, [searchTerm, itemsPerPage]);

// // //   const handlePageChange = (pageNumber) => {
// // //     setCurrentPage(pageNumber);
// // //   };

// // //   const getPageNumbers = () => {
// // //     const pageNumbers = [];
// // //     const maxVisiblePages = 5;

// // //     if (totalPages <= maxVisiblePages) {
// // //       for (let i = 1; i <= totalPages; i++) {
// // //         pageNumbers.push(i);
// // //       }
// // //     } else {
// // //       const startPage = Math.max(1, currentPage - 2);
// // //       const endPage = Math.min(totalPages, currentPage + 2);

// // //       if (startPage > 1) {
// // //         pageNumbers.push(1);
// // //         if (startPage > 2) pageNumbers.push("...");
// // //       }

// // //       for (let i = startPage; i <= endPage; i++) {
// // //         pageNumbers.push(i);
// // //       }

// // //       if (endPage < totalPages) {
// // //         if (endPage < totalPages - 1) pageNumbers.push("...");
// // //         pageNumbers.push(totalPages);
// // //       }
// // //     }

// // //     return pageNumbers;
// // //   };

// // //   // ========================================
// // //   // INITIALISATION DU FORMULAIRE
// // //   // ========================================

// // //   const initFormData = (emp) => ({
// // //     ...emp,
// // //     bancaire: emp.bancaire || {
// // //       id: null,
// // //       nom_banque: "",
// // //       numero_compte: "",
// // //       cle_rib: "",
// // //       banque_beneficiaire: "",
// // //     },
// // //     salaire_personnel: emp.salaire_personnel || {
// // //       id: null,
// // //       date_embauche: "",
// // //       fonction: "",
// // //       categorie: "",
// // //       salaire: "",
// // //       section: "",
// // //       responsable_section: "",
// // //       prime_anciennete: "",
// // //       indemnite_deplacement: "",
// // //       dernier_aug_indice: "",
// // //       pour_30: "",
// // //       T1_17: "",
// // //       T2_17: "",
// // //       T3_17: "",
// // //       T4_17: "",
// // //       obs_prime: "",
// // //     },
// // //     familiale: emp.familiale || {
// // //       id: null,
// // //       epoux_nom: "",
// // //       epoux_prenoms: "",
// // //       epoux_date_naissance: "",
// // //       epoux_lieu_naissance: "",
// // //       epoux_societe: "",
// // //       epoux_fonction: "",
// // //       enfants: [],
// // //     },
// // //   });

// // //   // ========================================
// // //   // GESTION DES ACTIONS
// // //   // ========================================

// // //   const handleUpdate = async () => {
// // //     if (!selectedEmployee) return;

// // //     try {
// // //       const persoDataToUpdate = {
// // //         numero_matricule: formData.numero_matricule || "",
// // //         nom: formData.nom || "",
// // //         prenoms: formData.prenoms || "",
// // //         sexe: formData.sexe || "",
// // //         appellation: formData.appellation || "",
// // //         fonction: formData.fonction || "",
// // //         section: formData.section || "",
// // //         date_naissance: formData.date_naissance || null,
// // //         lieu_naissance: formData.lieu_naissance || "",
// // //         CIN: formData.CIN || "",
// // //         date_CIN: formData.date_CIN || null,
// // //         lieu_CIN: formData.lieu_CIN || "",
// // //         numero_cnaps: formData.numero_cnaps || "",
// // //         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
// // //         pere: formData.pere || "",
// // //         mere: formData.mere || "",
// // //         adresse: formData.adresse || "",
// // //         quartier: formData.quartier || "",
// // //         telephone: formData.telephone || "",
// // //         email: formData.email || "",
// // //       };

// // //       await updateEmployee(selectedEmployee.id, persoDataToUpdate);

// // //       if (formData.bancaire) {
// // //         const bancaireData = {
// // //           nom_banque: formData.bancaire.nom_banque || "",
// // //           code_banque: formData.bancaire.code_banque || "",
// // //           code_agence: formData.bancaire.code_agence || "",
// // //           numero_compte: formData.bancaire.numero_compte || "",
// // //           cle_rib: formData.bancaire.cle_rib || "",
// // //           banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
// // //           employe: selectedEmployee.id,
// // //         };

// // //         if (formData.bancaire.id) {
// // //           await updateBancaire(formData.bancaire.id, bancaireData);
// // //         } else if (bancaireData.nom_banque || bancaireData.numero_compte) {
// // //           await createBancaire(bancaireData);
// // //         }
// // //       }

// // //       if (formData.salaire_personnel) {
// // //         const salaireData = {
// // //           date_embauche: formData.salaire_personnel.date_embauche || null,
// // //           fonction: formData.salaire_personnel.fonction || "",
// // //           categorie: formData.salaire_personnel.categorie || "",
// // //           salaire: formData.salaire_personnel.salaire || "",
// // //           section: formData.salaire_personnel.section || "",
// // //           responsable_section:
// // //             formData.salaire_personnel.responsable_section || "",
// // //           prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
// // //           indemnite_deplacement:
// // //             formData.salaire_personnel.indemnite_deplacement || "",
// // //           dernier_aug_indice:
// // //             formData.salaire_personnel.dernier_aug_indice || "",
// // //           pour_30: formData.salaire_personnel.pour_30 || "",
// // //           T1_17: formData.salaire_personnel.T1_17 || "",
// // //           T2_17: formData.salaire_personnel.T2_17 || "",
// // //           T3_17: formData.salaire_personnel.T3_17 || "",
// // //           T4_17: formData.salaire_personnel.T4_17 || "",
// // //           obs_prime: formData.salaire_personnel.obs_prime || "",
// // //           employe: selectedEmployee.id,
// // //         };

// // //         if (formData.salaire_personnel.id) {
// // //           await updateSalaire(formData.salaire_personnel.id, salaireData);
// // //         } else if (salaireData.salaire || salaireData.fonction) {
// // //           await createSalaire(salaireData);
// // //         }
// // //       }

// // //       if (formData.familiale) {
// // //         let epouxDateNaissance = formData.familiale.epoux_date_naissance;
// // //         if (Array.isArray(epouxDateNaissance)) {
// // //           epouxDateNaissance = epouxDateNaissance[0] || null;
// // //         }

// // //         const familialeData = {
// // //           epoux_nom: formData.familiale.epoux_nom || "",
// // //           epoux_prenoms: formData.familiale.epoux_prenoms || "",
// // //           epoux_date_naissance: epouxDateNaissance,
// // //           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
// // //           epoux_societe: formData.familiale.epoux_societe || "",
// // //           epoux_fonction: formData.familiale.epoux_fonction || "",
// // //           enfants: formData.familiale.enfants || [],
// // //           employe: selectedEmployee.id,
// // //         };

// // //         if (formData.familiale.id) {
// // //           await updateFamiliale(formData.familiale.id, familialeData);
// // //         } else if (
// // //           familialeData.epoux_nom ||
// // //           familialeData.enfants.length > 0
// // //         ) {
// // //           await createFamiliale(familialeData);
// // //         }
// // //       }

// // //       await fetchEmployees();
// // //       setEditMode(false);
// // //       setSelectedEmployee(null);
// // //       resetForm();
// // //       alert("Employé mis à jour avec succès !");
// // //     } catch (error) {
// // //       console.error(
// // //         "Erreur lors de la mise à jour :",
// // //         error.response?.data || error
// // //       );
// // //       alert(
// // //         "Erreur lors de la mise à jour. Vérifiez les champs obligatoires !"
// // //       );
// // //     }
// // //   };

// // //   const handleAdd = async () => {
// // //     try {
// // //       if (!formData.numero_matricule || !formData.nom || !formData.prenoms) {
// // //         const missingFields = [];
// // //         if (!formData.numero_matricule) missingFields.push("Matricule");
// // //         if (!formData.nom) missingFields.push("Nom");
// // //         if (!formData.prenoms) missingFields.push("Prénoms");
// // //         alert(`Champs obligatoires manquants : ${missingFields.join(", ")}`);
// // //         return;
// // //       }

// // //       const persoData = {
// // //         numero_matricule: formData.numero_matricule,
// // //         nom: formData.nom,
// // //         prenoms: formData.prenoms,
// // //         sexe: formData.sexe || "",
// // //         appellation: formData.appellation || "",
// // //         fonction: formData.fonction || "",
// // //         section: formData.section || "",
// // //         date_naissance: formData.date_naissance || null,
// // //         lieu_naissance: formData.lieu_naissance || "",
// // //         CIN: formData.CIN || "",
// // //         date_CIN: formData.date_CIN || null,
// // //         lieu_CIN: formData.lieu_CIN || "",
// // //         numero_cnaps: formData.numero_cnaps || "",
// // //         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
// // //         pere: formData.pere || "",
// // //         mere: formData.mere || "",
// // //         adresse: formData.adresse || "",
// // //         quartier: formData.quartier || "",
// // //         telephone: formData.telephone || "",
// // //         email: formData.email || "",
// // //       };

// // //       const newEmp = await createEmployee(persoData);

// // //       if (
// // //         formData.bancaire &&
// // //         (formData.bancaire.nom_banque || formData.bancaire.numero_compte)
// // //       ) {
// // //         try {
// // //           await createBancaire({
// // //             nom_banque: formData.bancaire.nom_banque || "",
// // //             code_banque: formData.bancaire.code_banque || "",
// // //             code_agence: formData.bancaire.code_agence || "",
// // //             numero_compte: formData.bancaire.numero_compte || "",
// // //             cle_rib: formData.bancaire.cle_rib || "",
// // //             banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
// // //             employe: newEmp.id,
// // //           });
// // //         } catch (bancaireError) {
// // //           console.error("Erreur création bancaire:", bancaireError);
// // //         }
// // //       }

// // //       if (formData.salaire_personnel) {
// // //         try {
// // //           await createSalaire({
// // //             date_embauche: formData.salaire_personnel.date_embauche || null,
// // //             fonction: formData.salaire_personnel.fonction || "",
// // //             categorie: formData.salaire_personnel.categorie || "",
// // //             salaire: formData.salaire_personnel.salaire || "",
// // //             section: formData.salaire_personnel.section || "",
// // //             responsable_section:
// // //               formData.salaire_personnel.responsable_section || "",
// // //             prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
// // //             indemnite_deplacement:
// // //               formData.salaire_personnel.indemnite_deplacement || "",
// // //             dernier_aug_indice:
// // //               formData.salaire_personnel.dernier_aug_indice || "",
// // //             pour_30: formData.salaire_personnel.pour_30 || "",
// // //             T1_17: formData.salaire_personnel.T1_17 || "",
// // //             T2_17: formData.salaire_personnel.T2_17 || "",
// // //             T3_17: formData.salaire_personnel.T3_17 || "",
// // //             T4_17: formData.salaire_personnel.T4_17 || "",
// // //             obs_prime: formData.salaire_personnel.obs_prime || "",
// // //             employe: newEmp.id,
// // //           });
// // //         } catch (salaireError) {
// // //           console.error("Erreur création salaire:", salaireError);
// // //         }
// // //       }

// // //       if (
// // //         formData.familiale &&
// // //         (formData.familiale.epoux_nom || formData.familiale.enfants?.length > 0)
// // //       ) {
// // //         try {
// // //           let epouxDateNaissance = formData.familiale.epoux_date_naissance;
// // //           if (Array.isArray(epouxDateNaissance)) {
// // //             epouxDateNaissance = epouxDateNaissance[0] || null;
// // //           }

// // //           await createFamiliale({
// // //             epoux_nom: formData.familiale.epoux_nom || "",
// // //             epoux_prenoms: formData.familiale.epoux_prenoms || "",
// // //             epoux_date_naissance: epouxDateNaissance,
// // //             epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
// // //             epoux_societe: formData.familiale.epoux_societe || "",
// // //             epoux_fonction: formData.familiale.epoux_fonction || "",
// // //             enfants: formData.familiale.enfants || [],
// // //             employe: newEmp.id,
// // //           });
// // //         } catch (familialeError) {
// // //           console.error("Erreur création familiale:", familialeError);
// // //         }
// // //       }

// // //       await fetchEmployees();
// // //       setShowForm(false);
// // //       setEditMode(false);
// // //       resetForm();
// // //       alert("Employé créé avec succès !");
// // //     } catch (error) {
// // //       console.error("Erreur lors de la création :", error);
// // //       alert(
// // //         `Erreur lors de la création: ${
// // //           error.response?.data?.message || error.message || "Erreur inconnue"
// // //         }`
// // //       );
// // //     }
// // //   };

// // //   const handleDelete = async (id) => {
// // //     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
// // //       try {
// // //         await deleteEmployee(id);
// // //         fetchEmployees();
// // //         setSelectedEmployee(null);
// // //       } catch (error) {
// // //         console.error("Erreur lors de la suppression :", error);
// // //       }
// // //     }
// // //   };

// // //   const resetForm = () => {
// // //     setFormData({
// // //       numero_matricule: "",
// // //       nom: "",
// // //       prenoms: "",
// // //       sexe: "",
// // //       appellation: "",
// // //       fonction: "",
// // //       section: "",
// // //       date_naissance: "",
// // //       lieu_naissance: "",
// // //       CIN: "",
// // //       date_CIN: "",
// // //       lieu_CIN: "",
// // //       numero_cnaps: "",
// // //       ancien_numero_journaliere: "",
// // //       pere: "",
// // //       mere: "",
// // //       quartier: "",
// // //       adresse: "",
// // //       telephone: "",
// // //       email: "",
// // //       bancaire: {
// // //         id: null,
// // //         nom_banque: "",
// // //         code_banque: "",
// // //         code_agence: "",
// // //         numero_compte: "",
// // //         cle_rib: "",
// // //         banque_beneficiaire: "",
// // //       },
// // //       salaire_personnel: {
// // //         id: null,
// // //         date_embauche: "",
// // //         fonction: "",
// // //         categorie: "",
// // //         salaire: "",
// // //         section: "",
// // //         responsable_section: "",
// // //         prime_anciennete: "",
// // //         indemnite_deplacement: "",
// // //         dernier_aug_indice: "",
// // //         pour_30: "",
// // //         T1_17: "",
// // //         T2_17: "",
// // //         T3_17: "",
// // //         T4_17: "",
// // //         obs_prime: "",
// // //       },
// // //       familiale: {
// // //         id: null,
// // //         epoux_nom: "",
// // //         epoux_prenoms: "",
// // //         epoux_date_naissance: "",
// // //         epoux_lieu_naissance: "",
// // //         epoux_societe: "",
// // //         epoux_fonction: "",
// // //         enfants: [],
// // //       },
// // //     });
// // //   };

// // //   // ========================================
// // //   // RENDU DE LA PAGE
// // //   // ========================================

// // //   return (
// // //     <div className="min-h-screen bg-gray-100 p-6">
// // //       {/* HEADER FIXE */}

// // //       <h1 className="text-2xl font-bold mb-6 text-gray-800">
// // //         Gestion des Employés
// // //       </h1>

// // //       <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
// // //         {/* LISTE DES EMPLOYÉS */}
// // //         {!selectedEmployee && !showForm && (
// // //           <div className="bg-white rounded-lg shadow-sm">
// // //             {/* EN-TÊTE */}
// // //             <div className="flex items-center justify-between px-6 py-4">
// // //               <h2 className="text-lg font-medium text-gray-800">
// // //                 Liste des Employés
// // //               </h2>

// // //               <div className="flex items-center gap-3">
// // //                 {/* Sélecteur de vue */}
// // //                 <div className="flex bg-gray-100 rounded-md p-1">
// // //                   <button
// // //                     onClick={() => setViewMode("table")}
// // //                     className={`p-2 rounded ${
// // //                       viewMode === "table"
// // //                         ? "bg-white shadow-sm"
// // //                         : "text-gray-500 hover:text-gray-700"
// // //                     }`}
// // //                     title="Vue tableur"
// // //                   >
// // //                     <Table className="w-4 h-4" />
// // //                   </button>
// // //                   <button
// // //                     onClick={() => setViewMode("grid")}
// // //                     className={`p-2 rounded ${
// // //                       viewMode === "grid"
// // //                         ? "bg-white shadow-sm"
// // //                         : "text-gray-500 hover:text-gray-700"
// // //                     }`}
// // //                     title="Vue carte"
// // //                   >
// // //                     <Grid className="w-4 h-4" />
// // //                   </button>
// // //                 </div>

// // //                 {/* Barre de recherche */}
// // //                 <div className="relative">
// // //                   <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
// // //                   <input
// // //                     type="text"
// // //                     placeholder="Rechercher..."
// // //                     value={searchTerm}
// // //                     onChange={(e) => setSearchTerm(e.target.value)}
// // //                     className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50"
// // //                   />
// // //                 </div>

// // //                 {/* Bouton "Nouvel employé" */}
// // //                 <button
// // //                   onClick={() => {
// // //                     setShowForm(true);
// // //                     setEditMode(true);
// // //                     setSelectedEmployee(null);
// // //                     resetForm();
// // //                   }}
// // //                   className="flex items-center gap-2 px-5 py-2.5 bg-akj text-white rounded-md transition text-sm font-medium whitespace-nowrap w-full sm:w-auto justify-center"
// // //                 >
// // //                   <Plus className="w-4 h-4" />
// // //                   Nouvel employé
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             {/* VUE TABLEAU */}
// // //             {viewMode === "table" && (
// // //               <div className="overflow-x-auto">
// // //                 <table className="w-full border-collapse">
// // //                   <thead className="bg-[#f0f0f0] text-gray-600 text-sm">
// // //                     <tr>
// // //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                         N° Matricule
// // //                       </th>
// // //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                         Employé
// // //                       </th>
// // //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                         Appellation
// // //                       </th>
// // //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                         Fonction
// // //                       </th>
// // //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                         Section
// // //                       </th>
// // //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// // //                         Actions
// // //                       </th>
// // //                     </tr>
// // //                   </thead>

// // //                   <tbody className="text-sm divide-y divide-gray-100">
// // //                     {currentItems.map((emp) => (
// // //                       <tr
// // //                         key={emp.id}
// // //                         className="hover:bg-[#fafafa] transition cursor-pointer"
// // //                       >
// // //                         <td className="px-5 py-3">{emp.numero_matricule}</td>
// // //                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// // //                           {emp.nom} {emp.prenoms}
// // //                         </td>
// // //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// // //                           {emp.appellation || "-"}
// // //                         </td>
// // //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// // //                           {emp.fonction || "-"}
// // //                         </td>
// // //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// // //                           {emp.section || "-"}
// // //                         </td>
// // //                         <td className="px-6 py-4 whitespace-nowrap text-sm">
// // //                           <div className="flex items-center gap-2">
// // //                             <button
// // //                               onClick={() => {
// // //                                 setSelectedEmployee(emp);
// // //                                 setFormData(initFormData(emp));
// // //                                 setEditMode(false);
// // //                               }}
// // //                               className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
// // //                               title="Voir détails"
// // //                             >
// // //                               <Eye className="w-4 h-4" />
// // //                             </button>
// // //                             <button
// // //                               onClick={() => {
// // //                                 setSelectedEmployee(emp);
// // //                                 setFormData(initFormData(emp));
// // //                                 setEditMode(true);
// // //                               }}
// // //                               className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
// // //                               title="Éditer"
// // //                             >
// // //                               <Edit2 className="w-4 h-4" />
// // //                             </button>
// // //                             <button
// // //                               onClick={() => handleDelete(emp.id)}
// // //                               className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
// // //                               title="Supprimer"
// // //                             >
// // //                               <Trash2 className="w-4 h-4" />
// // //                             </button>
// // //                           </div>
// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>
// // //               </div>
// // //             )}

// // //             {/* VUE CARTES STYLE ODOO SIMPLIFIÉ */}
// // //             {viewMode === "grid" && (
// // //               <div className="p-6">
// // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// // //                   {currentItems.map((emp) => (
// // //                     <div
// // //                       key={emp.id}
// // //                       className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
// // //                     >
// // //                       {/* En-tête avec numéro matricule */}
// // //                       <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
// // //                         <div className="flex items-center justify-between">
// // //                           <span className="text-sm font-medium text-gray-700">
// // //                             {emp.numero_matricule}
// // //                           </span>
// // //                         </div>
// // //                       </div>

// // //                       {/* Corps de la carte */}
// // //                       <div className="p-4">
// // //                         {/* Nom et prénom */}
// // //                         <div className="mb-3">
// // //                           <h3 className="font-semibold text-gray-900 text-base">
// // //                             {emp.nom} {emp.prenoms}
// // //                           </h3>
// // //                         </div>

// // //                         {/* Section et fonction */}
// // //                         <div className="space-y-2">
// // //                           <div>
// // //                             <p className="text-xs text-gray-500">Section</p>
// // //                             <p className="text-sm text-gray-900 font-medium">
// // //                               {emp.section || "-"}
// // //                             </p>
// // //                           </div>
// // //                           <div>
// // //                             <p className="text-xs text-gray-500">Fonction</p>
// // //                             <p className="text-sm text-gray-900">
// // //                               {emp.fonction || "-"}
// // //                             </p>
// // //                           </div>
// // //                         </div>
// // //                       </div>

// // //                       {/* Actions */}
// // //                       <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
// // //                         <div className="flex items-center justify-between">
// // //                           <button
// // //                             onClick={() => {
// // //                               setSelectedEmployee(emp);
// // //                               setFormData(initFormData(emp));
// // //                               setEditMode(false);
// // //                             }}
// // //                             className="text-blue-600 hover:text-blue-800 text-sm font-medium"
// // //                           >
// // //                             Voir détails
// // //                           </button>
// // //                           <div className="flex items-center gap-2">
// // //                             <button
// // //                               onClick={() => {
// // //                                 setSelectedEmployee(emp);
// // //                                 setFormData(initFormData(emp));
// // //                                 setEditMode(true);
// // //                               }}
// // //                               className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
// // //                               title="Éditer"
// // //                             >
// // //                               <Edit2 className="w-4 h-4" />
// // //                             </button>
// // //                             <button
// // //                               onClick={() => handleDelete(emp.id)}
// // //                               className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
// // //                               title="Supprimer"
// // //                             >
// // //                               <Trash2 className="w-4 h-4" />
// // //                             </button>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* PAGINATION */}
// // //             {filteredEmployees.length > 0 && (
// // //               <div className="px-6 py-4 border-t bg-gray-50">
// // //                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
// // //                   <div className="flex items-center gap-2">
// // //                     <span className="text-sm text-gray-600">Afficher</span>
// // //                     <select
// // //                       value={itemsPerPage}
// // //                       onChange={(e) => {
// // //                         setItemsPerPage(Number(e.target.value));
// // //                         setCurrentPage(1);
// // //                       }}
// // //                       className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
// // //                     >
// // //                       <option value={5}>5</option>
// // //                       <option value={10}>10</option>
// // //                       <option value={20}>20</option>
// // //                       <option value={50}>50</option>
// // //                     </select>
// // //                     <span className="text-sm text-gray-600">éléments</span>
// // //                   </div>

// // //                   <div className="text-sm text-gray-600">
// // //                     {indexOfFirstItem + 1}-
// // //                     {Math.min(indexOfLastItem, filteredEmployees.length)}
// // //                     sur {filteredEmployees.length} employé(s)
// // //                   </div>

// // //                   <div className="flex items-center gap-1">
// // //                     <button
// // //                       onClick={() => handlePageChange(currentPage - 1)}
// // //                       disabled={currentPage === 1}
// // //                       className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
// // //                       title="Page précédente"
// // //                     >
// // //                       <ChevronLeft className="w-4 h-4" />
// // //                     </button>

// // //                     {getPageNumbers().map((pageNumber, index) => (
// // //                       <button
// // //                         key={index}
// // //                         onClick={() =>
// // //                           typeof pageNumber === "number" &&
// // //                           handlePageChange(pageNumber)
// // //                         }
// // //                         disabled={pageNumber === "..."}
// // //                         className={`min-w-[40px] px-3 py-2 border text-sm rounded ${
// // //                           pageNumber === currentPage
// // //                             ? "bg-akj text-white border-gray-600"
// // //                             : pageNumber === "..."
// // //                             ? "border-transparent text-gray-400 cursor-default"
// // //                             : "border-gray-300 text-gray-700 hover:bg-gray-50"
// // //                         }`}
// // //                       >
// // //                         {pageNumber}
// // //                       </button>
// // //                     ))}

// // //                     <button
// // //                       onClick={() => handlePageChange(currentPage + 1)}
// // //                       disabled={currentPage === totalPages}
// // //                       className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
// // //                       title="Page suivante"
// // //                     >
// // //                       <ChevronRight className="w-4 h-4" />
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* MESSAGE SI AUCUN RÉSULTAT */}
// // //             {filteredEmployees.length === 0 && (
// // //               <div className="text-center py-12">
// // //                 <p className="text-gray-500 text-sm">
// // //                   {searchTerm
// // //                     ? "Aucun employé trouvé pour cette recherche"
// // //                     : "Aucun employé dans la base de données"}
// // //                 </p>
// // //               </div>
// // //             )}
// // //           </div>
// // //         )}

// // //         {/* AFFICHAGE DU BLOC EMPLOYÉ */}
// // //         {(selectedEmployee || showForm) && (
// // //           <div className="bg-white rounded-lg shadow-sm">
// // //             <EmployeeBlock
// // //               employee={selectedEmployee}
// // //               formData={formData}
// // //               setFormData={setFormData}
// // //               onSubmit={() => {
// // //                 if (editMode && selectedEmployee) {
// // //                   handleUpdate();
// // //                 } else {
// // //                   handleAdd();
// // //                 }
// // //               }}
// // //               onCancel={() => {
// // //                 setShowForm(false);
// // //                 setEditMode(false);
// // //                 setSelectedEmployee(null);
// // //                 resetForm();
// // //               }}
// // //               editMode={editMode}
// // //             />
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default EmployeesPage;


// // import React, { useState, useEffect } from "react";
// // import "/src/styles/custom.css";
// // import {
// //   Search,
// //   Plus,
// //   Eye,
// //   Edit2,
// //   Trash2,
// //   ChevronLeft,
// //   ChevronRight,
// //   Table,
// //   Grid,
// //   User,
// // } from "lucide-react";
// // import EmployeeBlock from "../../components/employee/EmployeeBlock";
// // import {
// //   getAllEmployees,
// //   createEmployee,
// //   updateEmployee,
// //   deleteEmployee,
// //   createBancaire,
// //   updateBancaire,
// //   createSalaire,
// //   updateSalaire,
// //   createFamiliale,
// //   updateFamiliale,
// // } from "../../services/employeeService";

// // const EmployeesPage = () => {
// //   // ========================================
// //   // ÉTATS LOCAUX
// //   // ========================================

// //   const [employees, setEmployees] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [showForm, setShowForm] = useState(false);
// //   const [editMode, setEditMode] = useState(false);
// //   const [formData, setFormData] = useState({});
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [viewMode, setViewMode] = useState("table");
// //   const [loading, setLoading] = useState(false);

// //   // ========================================
// //   // ÉTATS PAGINATION
// //   // ========================================
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(10);

// //   // ========================================
// //   // CHARGEMENT INITIAL DES DONNÉES
// //   // ========================================

// //   useEffect(() => {
// //     fetchEmployees();
// //   }, []);

// //   const fetchEmployees = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getAllEmployees();
// //       const sortedData = data.sort((a, b) => a.id - b.id);
// //       setEmployees(sortedData);
// //     } catch (error) {
// //       console.error("Erreur lors du chargement des employés :", error);
// //       alert("Erreur lors du chargement des employés");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ========================================
// //   // CALCULS PAGINATION
// //   // ========================================

// //   const filteredEmployees = employees.filter(
// //     (emp) =>
// //       emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       emp.fonction?.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredEmployees.slice(
// //     indexOfFirstItem,
// //     indexOfLastItem
// //   );
// //   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [searchTerm, itemsPerPage]);

// //   const handlePageChange = (pageNumber) => {
// //     setCurrentPage(pageNumber);
// //   };

// //   const getPageNumbers = () => {
// //     const pageNumbers = [];
// //     const maxVisiblePages = 5;

// //     if (totalPages <= maxVisiblePages) {
// //       for (let i = 1; i <= totalPages; i++) {
// //         pageNumbers.push(i);
// //       }
// //     } else {
// //       const startPage = Math.max(1, currentPage - 2);
// //       const endPage = Math.min(totalPages, currentPage + 2);

// //       if (startPage > 1) {
// //         pageNumbers.push(1);
// //         if (startPage > 2) pageNumbers.push("...");
// //       }

// //       for (let i = startPage; i <= endPage; i++) {
// //         pageNumbers.push(i);
// //       }

// //       if (endPage < totalPages) {
// //         if (endPage < totalPages - 1) pageNumbers.push("...");
// //         pageNumbers.push(totalPages);
// //       }
// //     }

// //     return pageNumbers;
// //   };

// //   // ========================================
// //   // INITIALISATION DU FORMULAIRE
// //   // ========================================

// //   const initFormData = (emp) => ({
// //     ...emp,
// //     bancaire: emp.bancaire || {
// //       id: null,
// //       nom_banque: "",
// //       code_banque: "",
// //       code_agence: "",
// //       numero_compte: "",
// //       cle_rib: "",
// //       banque_beneficiaire: "",
// //     },
// //     salaire_personnel: emp.salaire_personnel || {
// //       id: null,
// //       date_embauche: "",
// //       fonction: "",
// //       categorie: "",
// //       salaire: "",
// //       section: "",
// //       responsable_section: "",
// //       prime_anciennete: "",
// //       indemnite_deplacement: "",
// //       dernier_aug_indice: "",
// //       pour_30: "",
// //       T1_17: "",
// //       T2_17: "",
// //       T3_17: "",
// //       T4_17: "",
// //       obs_prime: "",
// //     },
// //     familiale: emp.familiale || {
// //       id: null,
// //       epoux_nom: "",
// //       epoux_prenoms: "",
// //       epoux_date_naissance: "",
// //       epoux_lieu_naissance: "",
// //       epoux_societe: "",
// //       epoux_fonction: "",
// //       enfants: [],
// //     },
// //   });

// //   // ========================================
// //   // GESTION DES ACTIONS
// //   // ========================================

// //   const handleUpdate = async () => {
// //     if (!selectedEmployee) return;

// //     try {
// //       setLoading(true);

// //       // Préparer les données personnelles
// //       const persoDataToUpdate = new FormData();
      
// //       const personalFields = {
// //         numero_matricule: formData.numero_matricule || "",
// //         nom: formData.nom || "",
// //         prenoms: formData.prenoms || "",
// //         sexe: formData.sexe || "",
// //         appellation: formData.appellation || "",
// //         fonction: formData.fonction || "",
// //         section: formData.section || "",
// //         date_naissance: formData.date_naissance || null,
// //         lieu_naissance: formData.lieu_naissance || "",
// //         CIN: formData.CIN || "",
// //         date_CIN: formData.date_CIN || null,
// //         lieu_CIN: formData.lieu_CIN || "",
// //         numero_cnaps: formData.numero_cnaps || "",
// //         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
// //         pere: formData.pere || "",
// //         mere: formData.mere || "",
// //         adresse: formData.adresse || "",
// //         quartier: formData.quartier || "",
// //         telephone: formData.telephone || "",
// //         email: formData.email || "",
// //       };

// //       // Ajouter les champs texte
// //       Object.entries(personalFields).forEach(([key, value]) => {
// //         if (value !== null && value !== undefined) {
// //           persoDataToUpdate.append(key, value);
// //         }
// //       });

// //       // Ajouter la photo si elle a été modifiée
// //       if (formData.photo instanceof File) {
// //         persoDataToUpdate.append('photo', formData.photo);
// //       }

// //       await updateEmployee(selectedEmployee.id, persoDataToUpdate);

// //       // Mettre à jour les informations bancaires
// //       if (formData.bancaire) {
// //         const bancaireData = {
// //           nom_banque: formData.bancaire.nom_banque || "",
// //           code_banque: formData.bancaire.code_banque || "",
// //           code_agence: formData.bancaire.code_agence || "",
// //           numero_compte: formData.bancaire.numero_compte || "",
// //           cle_rib: formData.bancaire.cle_rib || "",
// //           banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
// //           employe: selectedEmployee.id,
// //         };

// //         if (formData.bancaire.id) {
// //           await updateBancaire(formData.bancaire.id, bancaireData);
// //         } else if (bancaireData.nom_banque || bancaireData.numero_compte) {
// //           await createBancaire(bancaireData);
// //         }
// //       }

// //       // Mettre à jour les informations de salaire
// //       if (formData.salaire_personnel) {
// //         const salaireData = {
// //           date_embauche: formData.salaire_personnel.date_embauche || null,
// //           fonction: formData.salaire_personnel.fonction || "",
// //           categorie: formData.salaire_personnel.categorie || "",
// //           salaire: formData.salaire_personnel.salaire || "",
// //           section: formData.salaire_personnel.section || "",
// //           responsable_section: formData.salaire_personnel.responsable_section || "",
// //           prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
// //           indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || "",
// //           dernier_aug_indice: formData.salaire_personnel.dernier_aug_indice || "",
// //           pour_30: formData.salaire_personnel.pour_30 || "",
// //           T1_17: formData.salaire_personnel.T1_17 || "",
// //           T2_17: formData.salaire_personnel.T2_17 || "",
// //           T3_17: formData.salaire_personnel.T3_17 || "",
// //           T4_17: formData.salaire_personnel.T4_17 || "",
// //           obs_prime: formData.salaire_personnel.obs_prime || "",
// //           employe: selectedEmployee.id,
// //         };

// //         if (formData.salaire_personnel.id) {
// //           await updateSalaire(formData.salaire_personnel.id, salaireData);
// //         } else if (salaireData.salaire || salaireData.fonction) {
// //           await createSalaire(salaireData);
// //         }
// //       }

// //       // Mettre à jour les informations familiales
// //       if (formData.familiale) {
// //         const familialeData = {
// //           epoux_nom: formData.familiale.epoux_nom || "",
// //           epoux_prenoms: formData.familiale.epoux_prenoms || "",
// //           epoux_date_naissance: formData.familiale.epoux_date_naissance || null,
// //           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
// //           epoux_societe: formData.familiale.epoux_societe || "",
// //           epoux_fonction: formData.familiale.epoux_fonction || "",
// //           employe: selectedEmployee.id,
// //         };

// //         if (formData.familiale.id) {
// //           await updateFamiliale(formData.familiale.id, familialeData);
// //         } else if (familialeData.epoux_nom || formData.familiale.enfants?.length > 0) {
// //           await createFamiliale(familialeData);
// //         }
// //       }

// //       await fetchEmployees();
// //       setEditMode(false);
// //       setSelectedEmployee(null);
// //       resetForm();
// //       alert("Employé mis à jour avec succès !");
// //     } catch (error) {
// //       console.error("Erreur lors de la mise à jour :", error.response?.data || error);
// //       alert("Erreur lors de la mise à jour. Vérifiez les champs obligatoires !");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAdd = async () => {
// //     try {
// //       setLoading(true);

// //       if (!formData.numero_matricule || !formData.nom || !formData.prenoms) {
// //         const missingFields = [];
// //         if (!formData.numero_matricule) missingFields.push("Matricule");
// //         if (!formData.nom) missingFields.push("Nom");
// //         if (!formData.prenoms) missingFields.push("Prénoms");
// //         alert(`Champs obligatoires manquants : ${missingFields.join(", ")}`);
// //         return;
// //       }

// //       const persoData = new FormData();
      
// //       // Ajouter les champs de base
// //       const baseFields = {
// //         numero_matricule: formData.numero_matricule,
// //         nom: formData.nom,
// //         prenoms: formData.prenoms,
// //         sexe: formData.sexe || "",
// //         appellation: formData.appellation || "",
// //         fonction: formData.fonction || "",
// //         section: formData.section || "",
// //         date_naissance: formData.date_naissance || null,
// //         lieu_naissance: formData.lieu_naissance || "",
// //         CIN: formData.CIN || "",
// //         date_CIN: formData.date_CIN || null,
// //         lieu_CIN: formData.lieu_CIN || "",
// //         numero_cnaps: formData.numero_cnaps || "",
// //         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
// //         pere: formData.pere || "",
// //         mere: formData.mere || "",
// //         adresse: formData.adresse || "",
// //         quartier: formData.quartier || "",
// //         telephone: formData.telephone || "",
// //         email: formData.email || "",
// //       };

// //       Object.entries(baseFields).forEach(([key, value]) => {
// //         if (value !== null && value !== undefined) {
// //           persoData.append(key, value);
// //         }
// //       });

// //       // Ajouter la photo si elle existe
// //       if (formData.photo instanceof File) {
// //         persoData.append('photo', formData.photo);
// //       }

// //       const newEmp = await createEmployee(persoData);

// //       // Créer les informations bancaires si nécessaire
// //       if (formData.bancaire && (formData.bancaire.nom_banque || formData.bancaire.numero_compte)) {
// //         try {
// //           await createBancaire({
// //             nom_banque: formData.bancaire.nom_banque || "",
// //             code_banque: formData.bancaire.code_banque || "",
// //             code_agence: formData.bancaire.code_agence || "",
// //             numero_compte: formData.bancaire.numero_compte || "",
// //             cle_rib: formData.bancaire.cle_rib || "",
// //             banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
// //             employe: newEmp.id,
// //           });
// //         } catch (bancaireError) {
// //           console.error("Erreur création bancaire:", bancaireError);
// //         }
// //       }

// //       // Créer les informations de salaire si nécessaire
// //       if (formData.salaire_personnel && (formData.salaire_personnel.salaire || formData.salaire_personnel.fonction)) {
// //         try {
// //           await createSalaire({
// //             date_embauche: formData.salaire_personnel.date_embauche || null,
// //             fonction: formData.salaire_personnel.fonction || "",
// //             categorie: formData.salaire_personnel.categorie || "",
// //             salaire: formData.salaire_personnel.salaire || "",
// //             section: formData.salaire_personnel.section || "",
// //             responsable_section: formData.salaire_personnel.responsable_section || "",
// //             prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
// //             indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || "",
// //             dernier_aug_indice: formData.salaire_personnel.dernier_aug_indice || "",
// //             pour_30: formData.salaire_personnel.pour_30 || "",
// //             T1_17: formData.salaire_personnel.T1_17 || "",
// //             T2_17: formData.salaire_personnel.T2_17 || "",
// //             T3_17: formData.salaire_personnel.T3_17 || "",
// //             T4_17: formData.salaire_personnel.T4_17 || "",
// //             obs_prime: formData.salaire_personnel.obs_prime || "",
// //             employe: newEmp.id,
// //           });
// //         } catch (salaireError) {
// //           console.error("Erreur création salaire:", salaireError);
// //         }
// //       }

// //       // Créer les informations familiales si nécessaire
// //       if (formData.familiale && (formData.familiale.epoux_nom || formData.familiale.enfants?.length > 0)) {
// //         try {
// //           await createFamiliale({
// //             epoux_nom: formData.familiale.epoux_nom || "",
// //             epoux_prenoms: formData.familiale.epoux_prenoms || "",
// //             epoux_date_naissance: formData.familiale.epoux_date_naissance || null,
// //             epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
// //             epoux_societe: formData.familiale.epoux_societe || "",
// //             epoux_fonction: formData.familiale.epoux_fonction || "",
// //             employe: newEmp.id,
// //           });
// //         } catch (familialeError) {
// //           console.error("Erreur création familiale:", familialeError);
// //         }
// //       }

// //       await fetchEmployees();
// //       setShowForm(false);
// //       setEditMode(false);
// //       resetForm();
// //       alert("Employé créé avec succès !");
// //     } catch (error) {
// //       console.error("Erreur lors de la création :", error);
// //       alert(`Erreur lors de la création: ${error.response?.data?.message || error.message || "Erreur inconnue"}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ? Cette action est irréversible.")) {
// //       try {
// //         setLoading(true);
// //         await deleteEmployee(id);
// //         await fetchEmployees();
// //         if (selectedEmployee?.id === id) {
// //           setSelectedEmployee(null);
// //         }
// //         alert("Employé supprimé avec succès !");
// //       } catch (error) {
// //         console.error("Erreur lors de la suppression :", error);
// //         alert("Erreur lors de la suppression de l'employé");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       numero_matricule: "",
// //       nom: "",
// //       prenoms: "",
// //       sexe: "",
// //       appellation: "",
// //       fonction: "",
// //       section: "",
// //       date_naissance: "",
// //       lieu_naissance: "",
// //       CIN: "",
// //       date_CIN: "",
// //       lieu_CIN: "",
// //       numero_cnaps: "",
// //       ancien_numero_journaliere: "",
// //       pere: "",
// //       mere: "",
// //       quartier: "",
// //       adresse: "",
// //       telephone: "",
// //       email: "",
// //       photo: null,
// //       bancaire: {
// //         id: null,
// //         nom_banque: "",
// //         code_banque: "",
// //         code_agence: "",
// //         numero_compte: "",
// //         cle_rib: "",
// //         banque_beneficiaire: "",
// //       },
// //       salaire_personnel: {
// //         id: null,
// //         date_embauche: "",
// //         fonction: "",
// //         categorie: "",
// //         salaire: "",
// //         section: "",
// //         responsable_section: "",
// //         prime_anciennete: "",
// //         indemnite_deplacement: "",
// //         dernier_aug_indice: "",
// //         pour_30: "",
// //         T1_17: "",
// //         T2_17: "",
// //         T3_17: "",
// //         T4_17: "",
// //         obs_prime: "",
// //       },
// //       familiale: {
// //         id: null,
// //         epoux_nom: "",
// //         epoux_prenoms: "",
// //         epoux_date_naissance: "",
// //         epoux_lieu_naissance: "",
// //         epoux_societe: "",
// //         epoux_fonction: "",
// //         enfants: [],
// //       },
// //     });
// //   };

// //   // ========================================
// //   // RENDU DE LA PAGE
// //   // ========================================

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* En-tête principal */}
// //         <div className="mb-6 sm:mb-8">
// //           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
// //             Gestion des Employés
// //           </h1>
// //           <p className="text-gray-600 text-sm sm:text-base">
// //             Gérez les informations personnelles et professionnelles de vos employés
// //           </p>
// //         </div>

// //         <div className="bg-white rounded-xl shadow-sm overflow-hidden">
// //           {/* LISTE DES EMPLOYÉS */}
// //           {!selectedEmployee && !showForm && (
// //             <div className="bg-white">
// //               {/* En-tête avec contrôles */}
// //               <div className="p-4 sm:p-6 border-b border-gray-200">
// //                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
// //                   <div className="flex items-center gap-4">
// //                     <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
// //                       Liste des Employés
// //                     </h2>
// //                     <span className="bg-akj text-white px-2.5 py-1 rounded-full text-xs font-medium">
// //                       {filteredEmployees.length}
// //                     </span>
// //                   </div>

// //                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
// //                     {/* Sélecteur de vue */}
// //                     <div className="flex bg-gray-100 rounded-lg p-1">
// //                       <button
// //                         onClick={() => setViewMode("table")}
// //                         className={`p-2 rounded-lg transition ${
// //                           viewMode === "table"
// //                             ? "bg-white shadow-sm text-gray-700"
// //                             : "text-gray-500 hover:text-gray-700"
// //                         }`}
// //                         title="Vue tableur"
// //                       >
// //                         <Table className="w-4 h-4" />
// //                       </button>
// //                       <button
// //                         onClick={() => setViewMode("grid")}
// //                         className={`p-2 rounded-lg transition ${
// //                           viewMode === "grid"
// //                             ? "bg-white shadow-sm text-gray-700"
// //                             : "text-gray-500 hover:text-gray-700"
// //                         }`}
// //                         title="Vue carte"
// //                       >
// //                         <Grid className="w-4 h-4" />
// //                       </button>
// //                     </div>

// //                     {/* Barre de recherche */}
// //                     <div className="relative flex-1 sm:w-64">
// //                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// //                       <input
// //                         type="text"
// //                         placeholder="Rechercher un employé..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-akj focus:border-transparent focus:outline-none bg-gray-50"
// //                       />
// //                     </div>

// //                     {/* Bouton "Nouvel employé" */}
// //                     <button
// //                       onClick={() => {
// //                         setShowForm(true);
// //                         setEditMode(true);
// //                         setSelectedEmployee(null);
// //                         resetForm();
// //                       }}
// //                       disabled={loading}
// //                       className="flex items-center justify-center gap-2 px-4 py-2.5 bg-akj text-white rounded-lg hover:bg-akj-dark transition text-sm font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
// //                     >
// //                       <Plus className="w-4 h-4" />
// //                       Nouvel employé
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Contenu */}
// //               {loading ? (
// //                 <div className="flex justify-center items-center py-12">
// //                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-akj"></div>
// //                 </div>
// //               ) : (
// //                 <>
// //                   {/* VUE TABLEAU */}
// //                   {viewMode === "table" && (
// //                     <div className="overflow-x-auto">
// //                       <table className="w-full">
// //                         <thead className="bg-gray-50 border-b border-gray-200">
// //                           <tr>
// //                             <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                               Employé
// //                             </th>
// //                             <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                               Matricule
// //                             </th>
// //                             <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                               Fonction
// //                             </th>
// //                             <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                               Section
// //                             </th>
// //                             <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                               Actions
// //                             </th>
// //                           </tr>
// //                         </thead>

// //                         <tbody className="bg-white divide-y divide-gray-200">
// //                           {currentItems.map((emp) => (
// //                             <tr
// //                               key={emp.id}
// //                               className="hover:bg-gray-50 transition cursor-pointer"
// //                               onClick={() => {
// //                                 setSelectedEmployee(emp);
// //                                 setFormData(initFormData(emp));
// //                                 setEditMode(false);
// //                               }}
// //                             >
// //                               <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
// //                                 <div className="flex items-center gap-3">
// //                                   <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
// //                                     {emp.photo ? (
// //                                       <img 
// //                                         src={emp.photo} 
// //                                         alt={`${emp.nom} ${emp.prenoms}`}
// //                                         className="w-full h-full object-cover"
// //                                       />
// //                                     ) : (
// //                                       <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                                         <User className="w-4 h-4 text-gray-400" />
// //                                       </div>
// //                                     )}
// //                                   </div>
// //                                   <div>
// //                                     <div className="text-sm font-medium text-gray-900">
// //                                       {emp.nom} {emp.prenoms}
// //                                     </div>
// //                                     <div className="text-sm text-gray-500">
// //                                       {emp.appellation || "-"}
// //                                     </div>
// //                                   </div>
// //                                 </div>
// //                               </td>
// //                               <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
// //                                 {emp.numero_matricule}
// //                               </td>
// //                               <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                                 {emp.fonction || "-"}
// //                               </td>
// //                               <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                                 {emp.section || "-"}
// //                               </td>
// //                               <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
// //                                 <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
// //                                   <button
// //                                     onClick={() => {
// //                                       setSelectedEmployee(emp);
// //                                       setFormData(initFormData(emp));
// //                                       setEditMode(false);
// //                                     }}
// //                                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
// //                                     title="Voir détails"
// //                                   >
// //                                     <Eye className="w-4 h-4" />
// //                                   </button>
// //                                   <button
// //                                     onClick={() => {
// //                                       setSelectedEmployee(emp);
// //                                       setFormData(initFormData(emp));
// //                                       setEditMode(true);
// //                                     }}
// //                                     className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
// //                                     title="Éditer"
// //                                   >
// //                                     <Edit2 className="w-4 h-4" />
// //                                   </button>
// //                                   <button
// //                                     onClick={() => handleDelete(emp.id)}
// //                                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
// //                                     title="Supprimer"
// //                                   >
// //                                     <Trash2 className="w-4 h-4" />
// //                                   </button>
// //                                 </div>
// //                               </td>
// //                             </tr>
// //                           ))}
// //                         </tbody>
// //                       </table>
// //                     </div>
// //                   )}

// //                   {/* VUE CARTES */}
// //                   {viewMode === "grid" && (
// //                     <div className="p-4 sm:p-6">
// //                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //                         {currentItems.map((emp) => (
// //                           <div
// //                             key={emp.id}
// //                             className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden"
// //                           >
// //                             {/* En-tête avec photo */}
// //                             <div className="relative">
// //                               <div className="h-32 bg-gradient-to-r from-akj to-akj-dark"></div>
// //                               <div className="absolute -bottom-6 left-4">
// //                                 <div className="w-12 h-12 rounded-full bg-white border-2 border-white shadow-lg overflow-hidden">
// //                                   {emp.photo ? (
// //                                     <img 
// //                                       src={emp.photo} 
// //                                       alt={`${emp.nom} ${emp.prenoms}`}
// //                                       className="w-full h-full object-cover"
// //                                     />
// //                                   ) : (
// //                                     <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                                       <User className="w-6 h-6 text-gray-400" />
// //                                     </div>
// //                                   )}
// //                                 </div>
// //                               </div>
// //                             </div>

// //                             {/* Corps de la carte */}
// //                             <div className="pt-8 pb-4 px-4">
// //                                 <h3 className="font-semibold text-gray-900 text-base mb-1">
// //                                   {emp.nom} {emp.prenoms}
// //                                 </h3>
// //                                 <p className="text-xs text-gray-500 mb-3">
// //                                   {emp.appellation || "Non spécifié"}
// //                                 </p>

// //                               <div className="space-y-2 text-sm">
// //                                 <div>
// //                                   <p className="text-xs text-gray-500">Matricule</p>
// //                                   <p className="text-gray-900 font-mono font-medium">
// //                                     {emp.numero_matricule}
// //                                   </p>
// //                                 </div>
// //                                 <div>
// //                                   <p className="text-xs text-gray-500">Fonction</p>
// //                                   <p className="text-gray-900">
// //                                     {emp.fonction || "-"}
// //                                   </p>
// //                                 </div>
// //                                 <div>
// //                                   <p className="text-xs text-gray-500">Section</p>
// //                                   <p className="text-gray-900">
// //                                     {emp.section || "-"}
// //                                   </p>
// //                                 </div>
// //                               </div>
// //                             </div>

// //                             {/* Actions */}
// //                             <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
// //                               <div className="flex items-center justify-between">
// //                                 <button
// //                                   onClick={() => {
// //                                     setSelectedEmployee(emp);
// //                                     setFormData(initFormData(emp));
// //                                     setEditMode(false);
// //                                   }}
// //                                   className="text-akj hover:text-akj-dark text-sm font-medium"
// //                                 >
// //                                   Voir détails
// //                                 </button>
// //                                 <div className="flex items-center gap-1">
// //                                   <button
// //                                     onClick={(e) => {
// //                                       e.stopPropagation();
// //                                       setSelectedEmployee(emp);
// //                                       setFormData(initFormData(emp));
// //                                       setEditMode(true);
// //                                     }}
// //                                     className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
// //                                     title="Éditer"
// //                                   >
// //                                     <Edit2 className="w-4 h-4" />
// //                                   </button>
// //                                   <button
// //                                     onClick={(e) => {
// //                                       e.stopPropagation();
// //                                       handleDelete(emp.id);
// //                                     }}
// //                                     className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
// //                                     title="Supprimer"
// //                                   >
// //                                     <Trash2 className="w-4 h-4" />
// //                                   </button>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* PAGINATION */}
// //                   {filteredEmployees.length > 0 && (
// //                     <div className="px-4 sm:px-6 py-4 border-t bg-gray-50">
// //                       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
// //                         <div className="flex items-center gap-2">
// //                           <span className="text-sm text-gray-600">Afficher</span>
// //                           <select
// //                             value={itemsPerPage}
// //                             onChange={(e) => {
// //                               setItemsPerPage(Number(e.target.value));
// //                               setCurrentPage(1);
// //                             }}
// //                             className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-akj"
// //                           >
// //                             <option value={5}>5</option>
// //                             <option value={10}>10</option>
// //                             <option value={20}>20</option>
// //                             <option value={50}>50</option>
// //                           </select>
// //                           <span className="text-sm text-gray-600">éléments</span>
// //                         </div>

// //                         <div className="text-sm text-gray-600">
// //                           {indexOfFirstItem + 1}-
// //                           {Math.min(indexOfLastItem, filteredEmployees.length)}
// //                           sur {filteredEmployees.length} employé(s)
// //                         </div>

// //                         <div className="flex items-center gap-1">
// //                           <button
// //                             onClick={() => handlePageChange(currentPage - 1)}
// //                             disabled={currentPage === 1}
// //                             className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
// //                             title="Page précédente"
// //                           >
// //                             <ChevronLeft className="w-4 h-4" />
// //                           </button>

// //                           {getPageNumbers().map((pageNumber, index) => (
// //                             <button
// //                               key={index}
// //                               onClick={() =>
// //                                 typeof pageNumber === "number" &&
// //                                 handlePageChange(pageNumber)
// //                               }
// //                               disabled={pageNumber === "..."}
// //                               className={`min-w-[40px] px-3 py-2 border text-sm rounded-lg ${
// //                                 pageNumber === currentPage
// //                                   ? "bg-akj text-white border-akj"
// //                                   : pageNumber === "..."
// //                                   ? "border-transparent text-gray-400 cursor-default"
// //                                   : "border-gray-300 text-gray-700 hover:bg-gray-50"
// //                               }`}
// //                             >
// //                               {pageNumber}
// //                             </button>
// //                           ))}

// //                           <button
// //                             onClick={() => handlePageChange(currentPage + 1)}
// //                             disabled={currentPage === totalPages}
// //                             className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
// //                             title="Page suivante"
// //                           >
// //                             <ChevronRight className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}

// //                   {/* MESSAGE SI AUCUN RÉSULTAT */}
// //                   {filteredEmployees.length === 0 && (
// //                     <div className="text-center py-12">
// //                       <div className="max-w-md mx-auto">
// //                         <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //                         <h3 className="text-lg font-medium text-gray-900 mb-2">
// //                           {searchTerm ? "Aucun employé trouvé" : "Aucun employé"}
// //                         </h3>
// //                         <p className="text-gray-500 text-sm mb-6">
// //                           {searchTerm
// //                             ? "Aucun employé ne correspond à votre recherche."
// //                             : "Commencez par ajouter votre premier employé."}
// //                         </p>
// //                         {!searchTerm && (
// //                           <button
// //                             onClick={() => {
// //                               setShowForm(true);
// //                               setEditMode(true);
// //                               resetForm();
// //                             }}
// //                             className="px-6 py-2.5 bg-akj text-white rounded-lg hover:bg-akj-dark transition text-sm font-medium"
// //                           >
// //                             <Plus className="w-4 h-4 inline mr-2" />
// //                             Ajouter le premier employé
// //                           </button>
// //                         )}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </>
// //               )}
// //             </div>
// //           )}

// //           {/* AFFICHAGE DU BLOC EMPLOYÉ */}
// //           {(selectedEmployee || showForm) && (
// //             <EmployeeBlock
// //               employee={selectedEmployee}
// //               formData={formData}
// //               setFormData={setFormData}
// //               onSubmit={() => {
// //                 if (editMode && selectedEmployee) {
// //                   handleUpdate();
// //                 } else {
// //                   handleAdd();
// //                 }
// //               }}
// //               onCancel={() => {
// //                 setShowForm(false);
// //                 setEditMode(false);
// //                 setSelectedEmployee(null);
// //                 resetForm();
// //               }}
// //               editMode={editMode}
// //             />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeesPage;


// // import React, { useState, useEffect } from "react";
// // import {
// //   Search,
// //   Plus,
// //   Eye,
// //   Edit2,
// //   Trash2,
// //   ChevronLeft,
// //   ChevronRight,
// //   Table,
// //   Grid,
// //   User,
// // } from "lucide-react";
// // import EmployeeBlock from "../../components/employee/EmployeeBlock";
// // import {
// //   getAllEmployees,
// //   createEmployee,
// //   updateEmployee,
// //   deleteEmployee,
// //   createBancaire,
// //   updateBancaire,
// //   createSalaire,
// //   updateSalaire,
// //   createFamiliale,
// //   updateFamiliale,
// // } from "../../services/employeeService";

// // const EmployeesPage = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [showForm, setShowForm] = useState(false);
// //   const [editMode, setEditMode] = useState(false);
// //   const [formData, setFormData] = useState({});
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [viewMode, setViewMode] = useState("table");
// //   const [loading, setLoading] = useState(false);

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(10);

// //   useEffect(() => {
// //     fetchEmployees();
// //   }, []);

// //   const fetchEmployees = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getAllEmployees();
// //       setEmployees(data);
// //     } catch (error) {
// //       console.error("Erreur:", error);
// //       alert("Erreur lors du chargement des employés");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Filtrage et pagination
// //   const filteredEmployees = employees.filter(
// //     (emp) =>
// //       emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

// //   // Initialisation formulaire
// //   const initFormData = (emp) => ({
// //     ...emp,
// //     bancaire: emp.bancaire || {},
// //     salaire_personnel: emp.salaire_personnel || {},
// //     familiale: emp.familiale || { enfants: [] },
// //   });

// //   // Validation des champs obligatoires
// //   const validateRequiredFields = () => {
// //     if (!formData.numero_matricule?.trim()) {
// //       alert("Le numéro matricule est obligatoire");
// //       return false;
// //     }
// //     if (!formData.nom?.trim()) {
// //       alert("Le nom est obligatoire");
// //       return false;
// //     }
// //     if (!formData.prenoms?.trim()) {
// //       alert("Les prénoms sont obligatoires");
// //       return false;
// //     }
// //     return true;
// //   };

// //   // ACTIONS CORRIGÉES
// //   const handleUpdate = async () => {
// //     if (!selectedEmployee) return;
    
// //     if (!validateRequiredFields()) return;

// //     try {
// //       setLoading(true);

// //       // Préparer FormData pour les informations personnelles
// //       const persoData = new FormData();
      
// //       // Ajouter uniquement les champs modifiés ou requis
// //       const fieldsToUpdate = {
// //         numero_matricule: formData.numero_matricule || '',
// //         nom: formData.nom || '',
// //         prenoms: formData.prenoms || '',
// //         sexe: formData.sexe || '',
// //         appellation: formData.appellation || '',
// //         fonction: formData.fonction || '',
// //         section: formData.section || '',
// //         date_naissance: formData.date_naissance || '',
// //         lieu_naissance: formData.lieu_naissance || '',
// //         CIN: formData.CIN || '',
// //         date_CIN: formData.date_CIN || '',
// //         lieu_CIN: formData.lieu_CIN || '',
// //         numero_cnaps: formData.numero_cnaps || '',
// //         ancien_numero_journaliere: formData.ancien_numero_journaliere || '',
// //         pere: formData.pere || '',
// //         mere: formData.mere || '',
// //         adresse: formData.adresse || '',
// //         quartier: formData.quartier || '',
// //         telephone: formData.telephone || '',
// //         email: formData.email || '',
// //       };

// //       // Ajouter les champs au FormData
// //       Object.entries(fieldsToUpdate).forEach(([key, value]) => {
// //         if (value !== null && value !== undefined) {
// //           persoData.append(key, value);
// //         }
// //       });

// //       // Ajouter la photo si elle a été modifiée
// //       if (formData.photo instanceof File) {
// //         persoData.append('photo', formData.photo);
// //       }

// //       console.log('Envoi des données de mise à jour...');
// //       await updateEmployee(selectedEmployee.id, persoData);

// //       // Mettre à jour les informations bancaires si elles existent
// //       if (formData.bancaire) {
// //         const bancaireData = {
// //           nom_banque: formData.bancaire.nom_banque || '',
// //           code_banque: formData.bancaire.code_banque || '',
// //           code_agence: formData.bancaire.code_agence || '',
// //           numero_compte: formData.bancaire.numero_compte || '',
// //           cle_rib: formData.bancaire.cle_rib || '',
// //           banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
// //           employe: selectedEmployee.id,
// //         };

// //         if (formData.bancaire.id) {
// //           await updateBancaire(formData.bancaire.id, bancaireData);
// //         } else if (bancaireData.nom_banque || bancaireData.numero_compte) {
// //           await createBancaire(bancaireData);
// //         }
// //       }

// //       // Mettre à jour les informations de salaire si elles existent
// //       if (formData.salaire_personnel) {
// //         const salaireData = {
// //           date_embauche: formData.salaire_personnel.date_embauche || '',
// //           fonction: formData.salaire_personnel.fonction || '',
// //           categorie: formData.salaire_personnel.categorie || '',
// //           salaire: formData.salaire_personnel.salaire || '',
// //           section: formData.salaire_personnel.section || '',
// //           responsable_section: formData.salaire_personnel.responsable_section || '',
// //           prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
// //           indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
// //           obs_prime: formData.salaire_personnel.obs_prime || '',
// //           employe: selectedEmployee.id,
// //         };

// //         if (formData.salaire_personnel.id) {
// //           await updateSalaire(formData.salaire_personnel.id, salaireData);
// //         } else if (salaireData.date_embauche || salaireData.fonction || salaireData.salaire) {
// //           await createSalaire(salaireData);
// //         }
// //       }

// //       // Mettre à jour les informations familiales si elles existent
// //       if (formData.familiale) {
// //         const familialeData = {
// //           epoux_nom: formData.familiale.epoux_nom || '',
// //           epoux_prenoms: formData.familiale.epoux_prenoms || '',
// //           epoux_date_naissance: formData.familiale.epoux_date_naissance || '',
// //           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || '',
// //           epoux_societe: formData.familiale.epoux_societe || '',
// //           epoux_fonction: formData.familiale.epoux_fonction || '',
// //           employe: selectedEmployee.id,
// //         };

// //         if (formData.familiale.id) {
// //           await updateFamiliale(formData.familiale.id, familialeData);
// //         } else if (familialeData.epoux_nom || familialeData.epoux_prenoms) {
// //           await createFamiliale(familialeData);
// //         }
// //       }

// //       await fetchEmployees();
// //       setEditMode(false);
// //       setSelectedEmployee(null);
// //       resetForm();
// //       alert("Employé mis à jour avec succès !");
// //     } catch (error) {
// //       console.error("Erreur détaillée:", error);
// //       console.error("Réponse du serveur:", error.response?.data);
// //       alert(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAdd = async () => {
// //     if (!validateRequiredFields()) return;

// //     try {
// //       setLoading(true);

// //       // Préparer FormData
// //       const persoData = new FormData();
      
// //       // Champs de base
// //       const baseFields = {
// //         numero_matricule: formData.numero_matricule,
// //         nom: formData.nom,
// //         prenoms: formData.prenoms,
// //         sexe: formData.sexe || '',
// //         appellation: formData.appellation || '',
// //         fonction: formData.fonction || '',
// //         section: formData.section || '',
// //         date_naissance: formData.date_naissance || '',
// //         lieu_naissance: formData.lieu_naissance || '',
// //         CIN: formData.CIN || '',
// //         date_CIN: formData.date_CIN || '',
// //         lieu_CIN: formData.lieu_CIN || '',
// //         numero_cnaps: formData.numero_cnaps || '',
// //         ancien_numero_journaliere: formData.ancien_numero_journaliere || '',
// //         pere: formData.pere || '',
// //         mere: formData.mere || '',
// //         adresse: formData.adresse || '',
// //         quartier: formData.quartier || '',
// //         telephone: formData.telephone || '',
// //         email: formData.email || '',
// //       };

// //       // Ajouter tous les champs au FormData
// //       Object.entries(baseFields).forEach(([key, value]) => {
// //         if (value !== null && value !== undefined && value !== '') {
// //           persoData.append(key, value);
// //         }
// //       });

// //       // Ajouter la photo si elle existe
// //       if (formData.photo instanceof File) {
// //         persoData.append('photo', formData.photo);
// //       }

// //       console.log('Création du nouvel employé...');
      
// //       // DEBUG: Afficher le contenu de FormData
// //       for (let pair of persoData.entries()) {
// //         console.log(pair[0] + ': ' + pair[1]);
// //       }

// //       const newEmp = await createEmployee(persoData);
// //       console.log('Employé créé:', newEmp);

// //       // Créer les informations bancaires si fournies
// //       if (formData.bancaire && (formData.bancaire.nom_banque || formData.bancaire.numero_compte)) {
// //         try {
// //           await createBancaire({
// //             nom_banque: formData.bancaire.nom_banque || '',
// //             code_banque: formData.bancaire.code_banque || '',
// //             code_agence: formData.bancaire.code_agence || '',
// //             numero_compte: formData.bancaire.numero_compte || '',
// //             cle_rib: formData.bancaire.cle_rib || '',
// //             banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
// //             employe: newEmp.id,
// //           });
// //         } catch (bancaireError) {
// //           console.warn("Erreur création bancaire:", bancaireError);
// //         }
// //       }

// //       // Créer les informations de salaire si fournies
// //       if (formData.salaire_personnel) {
// //         try {
// //           await createSalaire({
// //             date_embauche: formData.salaire_personnel.date_embauche || '',
// //             fonction: formData.salaire_personnel.fonction || '',
// //             categorie: formData.salaire_personnel.categorie || '',
// //             salaire: formData.salaire_personnel.salaire || '',
// //             section: formData.salaire_personnel.section || '',
// //             responsable_section: formData.salaire_personnel.responsable_section || '',
// //             prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
// //             indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
// //             obs_prime: formData.salaire_personnel.obs_prime || '',
// //             employe: newEmp.id,
// //           });
// //         } catch (salaireError) {
// //           console.warn("Erreur création salaire:", salaireError);
// //         }
// //       }

// //       // Créer les informations familiales si fournies
// //       if (formData.familiale) {
// //         try {
// //           await createFamiliale({
// //             epoux_nom: formData.familiale.epoux_nom || '',
// //             epoux_prenoms: formData.familiale.epoux_prenoms || '',
// //             epoux_date_naissance: formData.familiale.epoux_date_naissance || '',
// //             epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || '',
// //             epoux_societe: formData.familiale.epoux_societe || '',
// //             epoux_fonction: formData.familiale.epoux_fonction || '',
// //             employe: newEmp.id,
// //           });
// //         } catch (familialeError) {
// //           console.warn("Erreur création familiale:", familialeError);
// //         }
// //       }

// //       await fetchEmployees();
// //       setShowForm(false);
// //       setEditMode(false);
// //       resetForm();
// //       alert("Employé créé avec succès !");
      
// //     } catch (error) {
// //       console.error("Erreur complète:", error);
// //       console.error("Réponse du serveur:", error.response?.data);
      
// //       if (error.response?.data) {
// //         // Afficher les erreurs de validation du serveur
// //         const serverErrors = error.response.data;
// //         let errorMessage = "Erreurs de validation:\n";
        
// //         if (typeof serverErrors === 'object') {
// //           Object.keys(serverErrors).forEach(field => {
// //             if (Array.isArray(serverErrors[field])) {
// //               errorMessage += `- ${field}: ${serverErrors[field].join(', ')}\n`;
// //             } else {
// //               errorMessage += `- ${field}: ${serverErrors[field]}\n`;
// //             }
// //           });
// //         } else {
// //           errorMessage = serverErrors;
// //         }
        
// //         alert(errorMessage);
// //       } else {
// //         alert(`Erreur lors de la création: ${error.message}`);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
// //       try {
// //         await deleteEmployee(id);
// //         await fetchEmployees();
// //         if (selectedEmployee?.id === id) {
// //           setSelectedEmployee(null);
// //         }
// //         alert("Employé supprimé avec succès !");
// //       } catch (error) {
// //         console.error("Erreur:", error);
// //         alert("Erreur lors de la suppression");
// //       }
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       numero_matricule: "",
// //       nom: "",
// //       prenoms: "",
// //       sexe: "",
// //       appellation: "",
// //       fonction: "",
// //       section: "",
// //       date_naissance: "",
// //       lieu_naissance: "",
// //       CIN: "",
// //       date_CIN: "",
// //       lieu_CIN: "",
// //       numero_cnaps: "",
// //       ancien_numero_journaliere: "",
// //       pere: "",
// //       mere: "",
// //       adresse: "",
// //       quartier: "",
// //       telephone: "",
// //       email: "",
// //       photo: null,
// //       bancaire: {},
// //       salaire_personnel: {},
// //       familiale: { enfants: [] },
// //     });
// //   };

// //   // Rendu de la page (identique à avant)
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4">
// //       <div className="max-w-7xl mx-auto">
// //         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
// //           Gestion des Employés
// //         </h1>

// //         <div className="bg-white rounded-xl shadow-sm">
// //           {!selectedEmployee && !showForm && (
// //             <div>
// //               {/* En-tête et contenu identique à avant */}
// //               <div className="p-4 sm:p-6 border-b">
// //                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
// //                   <div className="flex items-center gap-4">
// //                     <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
// //                       Liste des Employés
// //                     </h2>
// //                     <span className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
// //                       {filteredEmployees.length}
// //                     </span>
// //                   </div>

// //                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
// //                     <div className="flex bg-gray-100 rounded-lg p-1">
// //                       <button
// //                         onClick={() => setViewMode("table")}
// //                         className={`p-2 rounded-lg transition ${
// //                           viewMode === "table" ? "bg-white shadow-sm text-gray-700" : "text-gray-500"
// //                         }`}
// //                       >
// //                         <Table className="w-4 h-4" />
// //                       </button>
// //                       <button
// //                         onClick={() => setViewMode("grid")}
// //                         className={`p-2 rounded-lg transition ${
// //                           viewMode === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-500"
// //                         }`}
// //                       >
// //                         <Grid className="w-4 h-4" />
// //                       </button>
// //                     </div>

// //                     <div className="relative flex-1 sm:w-64">
// //                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// //                       <input
// //                         type="text"
// //                         placeholder="Rechercher..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       />
// //                     </div>

// //                     <button
// //                       onClick={() => {
// //                         setShowForm(true);
// //                         setEditMode(true);
// //                         resetForm();
// //                       }}
// //                       disabled={loading}
// //                       className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
// //                     >
// //                       <Plus className="w-4 h-4" />
// //                       Nouvel employé
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //               {loading ? (
// //                 <div className="flex justify-center items-center py-12">
// //                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //                 </div>
// //               ) : viewMode === "table" ? (
// //                 <div className="overflow-x-auto">
// //                   <table className="w-full">
// //                     <thead className="bg-gray-50 border-b">
// //                       <tr>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fonction</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="bg-white divide-y divide-gray-200">
// //                       {currentItems.map((emp) => (
// //                         <tr key={emp.id} className="hover:bg-gray-50">
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
// //                             <div className="flex items-center gap-3">
// //                               <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
// //                                 {emp.photo ? (
// //                                   <img src={emp.photo} alt="" className="w-full h-full object-cover" />
// //                                 ) : (
// //                                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                                     <User className="w-4 h-4 text-gray-400" />
// //                                   </div>
// //                                 )}
// //                               </div>
// //                               <div>
// //                                 <div className="text-sm font-medium text-gray-900">
// //                                   {emp.nom} {emp.prenoms}
// //                                 </div>
// //                                 <div className="text-sm text-gray-500">
// //                                   {emp.appellation || "-"}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                             {emp.numero_matricule}
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                             {emp.fonction || "-"}
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                             {emp.section || "-"}
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
// //                             <div className="flex items-center gap-1">
// //                               <button
// //                                 onClick={() => {
// //                                   setSelectedEmployee(emp);
// //                                   setFormData(initFormData(emp));
// //                                 }}
// //                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
// //                               >
// //                                 <Eye className="w-4 h-4" />
// //                               </button>
// //                               <button
// //                                 onClick={() => {
// //                                   setSelectedEmployee(emp);
// //                                   setFormData(initFormData(emp));
// //                                   setEditMode(true);
// //                                 }}
// //                                 className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
// //                               >
// //                                 <Edit2 className="w-4 h-4" />
// //                               </button>
// //                               <button
// //                                 onClick={() => handleDelete(emp.id)}
// //                                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
// //                               >
// //                                 <Trash2 className="w-4 h-4" />
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               ) : (
// //                 <div className="p-4 sm:p-6">
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //                     {currentItems.map((emp) => (
// //                       <div key={emp.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all overflow-hidden">
// //                         <div className="p-4">
// //                           <div className="flex items-center gap-3 mb-3">
// //                             <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
// //                               {emp.photo ? (
// //                                 <img src={emp.photo} alt="" className="w-full h-full object-cover" />
// //                               ) : (
// //                                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                                   <User className="w-6 h-6 text-gray-400" />
// //                                 </div>
// //                               )}
// //                             </div>
// //                             <div className="min-w-0">
// //                               <h3 className="font-semibold text-gray-900 text-base truncate">
// //                                 {emp.nom} {emp.prenoms}
// //                               </h3>
// //                               <p className="text-sm text-gray-500 truncate">{emp.numero_matricule}</p>
// //                             </div>
// //                           </div>
                          
// //                           <div className="space-y-2 text-sm">
// //                             <div>
// //                               <p className="text-xs text-gray-500">Fonction</p>
// //                               <p className="text-gray-900">{emp.fonction || "-"}</p>
// //                             </div>
// //                             <div>
// //                               <p className="text-xs text-gray-500">Section</p>
// //                               <p className="text-gray-900">{emp.section || "-"}</p>
// //                             </div>
// //                           </div>
// //                         </div>

// //                         <div className="px-4 py-3 bg-gray-50 border-t">
// //                           <div className="flex items-center justify-between">
// //                             <button
// //                               onClick={() => {
// //                                 setSelectedEmployee(emp);
// //                                 setFormData(initFormData(emp));
// //                               }}
// //                               className="text-blue-600 hover:text-blue-800 text-sm font-medium"
// //                             >
// //                               Voir détails
// //                             </button>
// //                             <div className="flex items-center gap-1">
// //                               <button
// //                                 onClick={() => {
// //                                   setSelectedEmployee(emp);
// //                                   setFormData(initFormData(emp));
// //                                   setEditMode(true);
// //                                 }}
// //                                 className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
// //                               >
// //                                 <Edit2 className="w-4 h-4" />
// //                               </button>
// //                               <button
// //                                 onClick={() => handleDelete(emp.id)}
// //                                 className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
// //                               >
// //                                 <Trash2 className="w-4 h-4" />
// //                               </button>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Pagination */}
// //               {filteredEmployees.length > 0 && (
// //                 <div className="px-4 sm:px-6 py-4 border-t bg-gray-50">
// //                   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
// //                     <div className="flex items-center gap-2">
// //                       <span className="text-sm text-gray-600">Afficher</span>
// //                       <select
// //                         value={itemsPerPage}
// //                         onChange={(e) => {
// //                           setItemsPerPage(Number(e.target.value));
// //                           setCurrentPage(1);
// //                         }}
// //                         className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
// //                       >
// //                         <option value={10}>10</option>
// //                         <option value={20}>20</option>
// //                         <option value={50}>50</option>
// //                       </select>
// //                     </div>

// //                     <div className="text-sm text-gray-600">
// //                       {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} sur {filteredEmployees.length}
// //                     </div>

// //                     <div className="flex items-center gap-1">
// //                       <button
// //                         onClick={() => setCurrentPage(currentPage - 1)}
// //                         disabled={currentPage === 1}
// //                         className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
// //                       >
// //                         <ChevronLeft className="w-4 h-4" />
// //                       </button>

// //                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //                         <button
// //                           key={page}
// //                           onClick={() => setCurrentPage(page)}
// //                           className={`min-w-[40px] px-3 py-2 border text-sm rounded-lg ${
// //                             page === currentPage
// //                               ? "bg-blue-600 text-white border-blue-600"
// //                               : "border-gray-300 text-gray-700 hover:bg-gray-50"
// //                           }`}
// //                         >
// //                           {page}
// //                         </button>
// //                       ))}

// //                       <button
// //                         onClick={() => setCurrentPage(currentPage + 1)}
// //                         disabled={currentPage === totalPages}
// //                         className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
// //                       >
// //                         <ChevronRight className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {filteredEmployees.length === 0 && (
// //                 <div className="text-center py-12">
// //                   <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //                   <h3 className="text-lg font-medium text-gray-900 mb-2">
// //                     {searchTerm ? "Aucun employé trouvé" : "Aucun employé"}
// //                   </h3>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* Formulaire */}
// //           {(selectedEmployee || showForm) && (
// //             <EmployeeBlock
// //               employee={selectedEmployee}
// //               formData={formData}
// //               setFormData={setFormData}
// //               onSubmit={selectedEmployee ? handleUpdate : handleAdd}
// //               onCancel={() => {
// //                 setShowForm(false);
// //                 setEditMode(false);
// //                 setSelectedEmployee(null);
// //                 resetForm();
// //               }}
// //               editMode={editMode}
// //             />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeesPage;








// // import React, { useState, useEffect } from "react";
// // import {
// //   Search,
// //   Plus,
// //   Eye,
// //   Edit2,
// //   Trash2,
// //   ChevronLeft,
// //   ChevronRight,
// //   Table,
// //   Grid,
// //   User,
// // } from "lucide-react";
// // import EmployeeBlock from "../../components/employee/EmployeeBlock";
// // import {
// //   getAllEmployees,
// //   createEmployee,
// //   updateEmployee,
// //   deleteEmployee,
// //   createBancaire,
// //   updateBancaire,
// //   createSalaire,
// //   updateSalaire,
// //   createFamiliale,
// //   updateFamiliale,
// // } from "../../services/employeeService";

// // const EmployeesPage = () => {
// //   const [employees, setEmployees] = useState([]);
// //   const [selectedEmployee, setSelectedEmployee] = useState(null);
// //   const [showForm, setShowForm] = useState(false);
// //   const [editMode, setEditMode] = useState(false);
// //   const [formData, setFormData] = useState({});
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [viewMode, setViewMode] = useState("table");
// //   const [loading, setLoading] = useState(false);

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [itemsPerPage, setItemsPerPage] = useState(10);

// //   useEffect(() => {
// //     fetchEmployees();
// //   }, []);

// //   const fetchEmployees = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getAllEmployees();
// //       // Tri par ID croissant pour avoir les nouveaux en BAS
// //       const sortedData = data.sort((a, b) => a.id - b.id);
// //       setEmployees(sortedData);
// //     } catch (error) {
// //       console.error("Erreur:", error);
// //       alert("Erreur lors du chargement des employés");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Filtrage et pagination
// //   const filteredEmployees = employees.filter(
// //     (emp) =>
// //       emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //       emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
// //   );

// //   const indexOfLastItem = currentPage * itemsPerPage;
// //   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
// //   const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
// //   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

// //   // Initialisation formulaire
// //   const initFormData = (emp) => ({
// //     ...emp,
// //     bancaire: emp.bancaire || {},
// //     salaire_personnel: emp.salaire_personnel || {},
// //     familiale: emp.familiale || { enfants: [] },
// //   });

// //   // Validation des champs obligatoires SEULEMENT
// //   const validateRequiredFields = () => {
// //     const errors = [];
    
// //     if (!formData.numero_matricule?.trim()) {
// //       errors.push("Le numéro matricule est obligatoire");
// //     }
// //     if (!formData.nom?.trim()) {
// //       errors.push("Le nom est obligatoire");
// //     }
// //     if (!formData.prenoms?.trim()) {
// //       errors.push("Les prénoms sont obligatoires");
// //     }

// //     if (errors.length > 0) {
// //       alert(errors.join('\n'));
// //       return false;
// //     }
// //     return true;
// //   };

// //   // Fonction utilitaire pour vérifier si les données sont valides
// //   const hasValidData = (data) => {
// //     if (!data) return false;
    
// //     // Vérifier si au moins un champ a une valeur
// //     const hasAnyData = Object.values(data).some(value => 
// //       value && value.toString().trim() !== '' && !Array.isArray(value)
// //     );
    
// //     return hasAnyData;
// //   };

// //   // ACTIONS CORRIGÉES - AUCUN CHAMP OBLIGATOIRE SAUF LES BASIQUES
// //   const handleUpdate = async () => {
// //     if (!selectedEmployee) return;
    
// //     if (!validateRequiredFields()) return;

// //     try {
// //       setLoading(true);

// //       // Préparer FormData pour les informations personnelles
// //       const persoData = new FormData();
      
// //       // Ajouter tous les champs personnels - seulement ceux qui ont des valeurs
// //       const personalFields = {
// //         numero_matricule: formData.numero_matricule,
// //         nom: formData.nom,
// //         prenoms: formData.prenoms,
// //         sexe: formData.sexe,
// //         appellation: formData.appellation,
// //         fonction: formData.fonction,
// //         section: formData.section,
// //         date_naissance: formData.date_naissance,
// //         lieu_naissance: formData.lieu_naissance,
// //         CIN: formData.CIN,
// //         date_CIN: formData.date_CIN,
// //         lieu_CIN: formData.lieu_CIN,
// //         numero_cnaps: formData.numero_cnaps,
// //         ancien_numero_journaliere: formData.ancien_numero_journaliere,
// //         pere: formData.pere,
// //         mere: formData.mere,
// //         adresse: formData.adresse,
// //         quartier: formData.quartier,
// //         telephone: formData.telephone,
// //         email: formData.email,
// //       };

// //       // Ajouter les champs au FormData seulement s'ils ont des valeurs
// //       Object.entries(personalFields).forEach(([key, value]) => {
// //         if (value !== null && value !== undefined && value !== '') {
// //           persoData.append(key, value);
// //         }
// //       });

// //       // Ajouter la photo si elle a été modifiée
// //       if (formData.photo instanceof File) {
// //         persoData.append('photo', formData.photo);
// //       }

// //       console.log('Mise à jour employé...');
// //       await updateEmployee(selectedEmployee.id, persoData);

// //       // Mettre à jour les informations bancaires seulement si données
// //       if (formData.bancaire && hasValidData(formData.bancaire)) {
// //         const bancaireData = {
// //           nom_banque: formData.bancaire.nom_banque || '',
// //           code_banque: formData.bancaire.code_banque || '',
// //           code_agence: formData.bancaire.code_agence || '',
// //           numero_compte: formData.bancaire.numero_compte || '',
// //           cle_rib: formData.bancaire.cle_rib || '',
// //           banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
// //           employe: selectedEmployee.id,
// //         };

// //         // Nettoyer les champs vides
// //         Object.keys(bancaireData).forEach(key => {
// //           if (bancaireData[key] === '') {
// //             bancaireData[key] = null;
// //           }
// //         });

// //         if (formData.bancaire.id) {
// //           await updateBancaire(formData.bancaire.id, bancaireData);
// //         } else if (hasValidData(bancaireData)) {
// //           await createBancaire(bancaireData);
// //         }
// //       }

// //       // Mettre à jour les informations de salaire seulement si données
// //       if (formData.salaire_personnel && hasValidData(formData.salaire_personnel)) {
// //         const salaireData = {
// //           date_embauche: formData.salaire_personnel.date_embauche || '',
// //           fonction: formData.salaire_personnel.fonction || '',
// //           categorie: formData.salaire_personnel.categorie || '',
// //           salaire: formData.salaire_personnel.salaire || '',
// //           section: formData.salaire_personnel.section || '',
// //           responsable_section: formData.salaire_personnel.responsable_section || '',
// //           prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
// //           indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
// //           obs_prime: formData.salaire_personnel.obs_prime || '',
// //           employe: selectedEmployee.id,
// //         };

// //         // Nettoyer les champs vides
// //         Object.keys(salaireData).forEach(key => {
// //           if (salaireData[key] === '') {
// //             salaireData[key] = null;
// //           }
// //         });

// //         if (formData.salaire_personnel.id) {
// //           await updateSalaire(formData.salaire_personnel.id, salaireData);
// //         } else if (hasValidData(salaireData)) {
// //           await createSalaire(salaireData);
// //         }
// //       }

// //       // Mettre à jour les informations familiales seulement si données
// //       if (formData.familiale && hasValidData(formData.familiale)) {
// //         const familialeData = {
// //           epoux_nom: formData.familiale.epoux_nom || '',
// //           epoux_prenoms: formData.familiale.epoux_prenoms || '',
// //           epoux_date_naissance: formData.familiale.epoux_date_naissance || '',
// //           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || '',
// //           epoux_societe: formData.familiale.epoux_societe || '',
// //           epoux_fonction: formData.familiale.epoux_fonction || '',
// //           employe: selectedEmployee.id,
// //         };

// //         // Nettoyer les champs vides
// //         Object.keys(familialeData).forEach(key => {
// //           if (familialeData[key] === '') {
// //             familialeData[key] = null;
// //           }
// //         });

// //         if (formData.familiale.id) {
// //           await updateFamiliale(formData.familiale.id, familialeData);
// //         } else if (hasValidData(familialeData)) {
// //           await createFamiliale(familialeData);
// //         }
// //       }

// //       await fetchEmployees();
// //       setEditMode(false);
// //       setSelectedEmployee(null);
// //       resetForm();
// //       alert("Employé mis à jour avec succès !");
// //     } catch (error) {
// //       console.error("Erreur détaillée:", error);
// //       console.error("Réponse du serveur:", error.response?.data);
      
// //       let errorMessage = "Erreur lors de la mise à jour: ";
// //       if (error.response?.data) {
// //         const serverErrors = error.response.data;
// //         Object.keys(serverErrors).forEach(field => {
// //           const errors = serverErrors[field];
// //           if (Array.isArray(errors)) {
// //             errorMessage += `${field}: ${errors.join(', ')} `;
// //           } else {
// //             errorMessage += `${field}: ${errors} `;
// //           }
// //         });
// //       } else {
// //         errorMessage += error.message;
// //       }
      
// //       alert(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleAdd = async () => {
// //     if (!validateRequiredFields()) return;

// //     try {
// //       setLoading(true);

// //       // Préparer FormData
// //       const persoData = new FormData();
      
// //       // Ajouter les champs obligatoires
// //       persoData.append('numero_matricule', formData.numero_matricule?.trim() || '');
// //       persoData.append('nom', formData.nom?.trim() || '');
// //       persoData.append('prenoms', formData.prenoms?.trim() || '');

// //       // Ajouter les autres champs SEULEMENT s'ils ont des valeurs
// //       const optionalFields = {
// //         sexe: formData.sexe,
// //         appellation: formData.appellation,
// //         fonction: formData.fonction,
// //         section: formData.section,
// //         date_naissance: formData.date_naissance,
// //         lieu_naissance: formData.lieu_naissance,
// //         CIN: formData.CIN,
// //         date_CIN: formData.date_CIN,
// //         lieu_CIN: formData.lieu_CIN,
// //         numero_cnaps: formData.numero_cnaps,
// //         ancien_numero_journaliere: formData.ancien_numero_journaliere,
// //         pere: formData.pere,
// //         mere: formData.mere,
// //         adresse: formData.adresse,
// //         quartier: formData.quartier,
// //         telephone: formData.telephone,
// //         email: formData.email,
// //       };

// //       Object.entries(optionalFields).forEach(([key, value]) => {
// //         if (value && value.toString().trim() !== '') {
// //           persoData.append(key, value.toString().trim());
// //         }
// //       });

// //       // Ajouter la photo
// //       if (formData.photo instanceof File) {
// //         persoData.append('photo', formData.photo);
// //       }

// //       console.log('Création du nouvel employé...');
// //       const newEmp = await createEmployee(persoData);
// //       console.log('Employé créé avec succès:', newEmp);

// //       // Créer les informations bancaires seulement si données
// //       if (formData.bancaire && hasValidData(formData.bancaire)) {
// //         try {
// //           const bancaireData = {
// //             nom_banque: formData.bancaire.nom_banque || '',
// //             code_banque: formData.bancaire.code_banque || '',
// //             code_agence: formData.bancaire.code_agence || '',
// //             numero_compte: formData.bancaire.numero_compte || '',
// //             cle_rib: formData.bancaire.cle_rib || '',
// //             banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
// //             employe: newEmp.id,
// //           };

// //           // Nettoyer les champs vides
// //           Object.keys(bancaireData).forEach(key => {
// //             if (bancaireData[key] === '') {
// //               bancaireData[key] = null;
// //             }
// //           });

// //           if (hasValidData(bancaireData)) {
// //             await createBancaire(bancaireData);
// //           }
// //         } catch (bancaireError) {
// //           console.warn("Erreur création bancaire:", bancaireError);
// //         }
// //       }

// //       // Créer les informations de salaire seulement si données
// //       if (formData.salaire_personnel && hasValidData(formData.salaire_personnel)) {
// //         try {
// //           const salaireData = {
// //             date_embauche: formData.salaire_personnel.date_embauche || '',
// //             fonction: formData.salaire_personnel.fonction || '',
// //             categorie: formData.salaire_personnel.categorie || '',
// //             salaire: formData.salaire_personnel.salaire || '',
// //             section: formData.salaire_personnel.section || '',
// //             responsable_section: formData.salaire_personnel.responsable_section || '',
// //             prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
// //             indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
// //             obs_prime: formData.salaire_personnel.obs_prime || '',
// //             employe: newEmp.id,
// //           };

// //           // Nettoyer les champs vides
// //           Object.keys(salaireData).forEach(key => {
// //             if (salaireData[key] === '') {
// //               salaireData[key] = null;
// //             }
// //           });

// //           if (hasValidData(salaireData)) {
// //             await createSalaire(salaireData);
// //           }
// //         } catch (salaireError) {
// //           console.warn("Erreur création salaire:", salaireError);
// //         }
// //       }

// //       // Créer les informations familiales seulement si données
// //       if (formData.familiale && hasValidData(formData.familiale)) {
// //         try {
// //           const familialeData = {
// //             epoux_nom: formData.familiale.epoux_nom || '',
// //             epoux_prenoms: formData.familiale.epoux_prenoms || '',
// //             epoux_date_naissance: formData.familiale.epoux_date_naissance || '',
// //             epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || '',
// //             epoux_societe: formData.familiale.epoux_societe || '',
// //             epoux_fonction: formData.familiale.epoux_fonction || '',
// //             employe: newEmp.id,
// //           };

// //           // Nettoyer les champs vides
// //           Object.keys(familialeData).forEach(key => {
// //             if (familialeData[key] === '') {
// //               familialeData[key] = null;
// //             }
// //           });

// //           if (hasValidData(familialeData)) {
// //             await createFamiliale(familialeData);
// //           }
// //         } catch (familialeError) {
// //           console.warn("Erreur création familiale:", familialeError);
// //         }
// //       }

// //       await fetchEmployees();
// //       setShowForm(false);
// //       setEditMode(false);
// //       resetForm();
// //       alert("Employé créé avec succès !");
      
// //     } catch (error) {
// //       console.error("Erreur complète:", error);
      
// //       if (error.response?.data) {
// //         const serverErrors = error.response.data;
// //         let errorMessage = "Erreurs de validation:\n";
        
// //         Object.keys(serverErrors).forEach(field => {
// //           const errors = serverErrors[field];
// //           if (Array.isArray(errors)) {
// //             errorMessage += `• ${field}: ${errors.join(', ')}\n`;
// //           } else {
// //             errorMessage += `• ${field}: ${errors}\n`;
// //           }
// //         });
        
// //         alert(errorMessage);
// //       } else {
// //         alert(`Erreur lors de la création: ${error.message}`);
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
// //       try {
// //         await deleteEmployee(id);
// //         await fetchEmployees();
// //         if (selectedEmployee?.id === id) {
// //           setSelectedEmployee(null);
// //         }
// //         alert("Employé supprimé avec succès !");
// //       } catch (error) {
// //         console.error("Erreur:", error);
// //         alert("Erreur lors de la suppression");
// //       }
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       numero_matricule: "",
// //       nom: "",
// //       prenoms: "",
// //       sexe: "",
// //       appellation: "",
// //       fonction: "",
// //       section: "",
// //       date_naissance: "",
// //       lieu_naissance: "",
// //       CIN: "",
// //       date_CIN: "",
// //       lieu_CIN: "",
// //       numero_cnaps: "",
// //       ancien_numero_journaliere: "",
// //       pere: "",
// //       mere: "",
// //       adresse: "",
// //       quartier: "",
// //       telephone: "",
// //       email: "",
// //       photo: null,
// //       bancaire: {},
// //       salaire_personnel: {},
// //       familiale: { enfants: [] },
// //     });
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
// //           Gestion des Employés
// //         </h1>

// //         <div className="bg-white rounded-xl shadow-sm">
// //           {!selectedEmployee && !showForm && (
// //             <div>
// //               <div className="p-4 sm:p-6 border-b">
// //                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
// //                   <div className="flex items-center gap-4">
// //                     <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
// //                       Liste des Employés
// //                     </h2>
// //                     <span className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-xs font-medium">
// //                       {filteredEmployees.length}
// //                     </span>
// //                   </div>

// //                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
// //                     <div className="flex bg-gray-100 rounded-lg p-1">
// //                       <button
// //                         onClick={() => setViewMode("table")}
// //                         className={`p-2 rounded-lg transition ${
// //                           viewMode === "table" ? "bg-white shadow-sm text-gray-700" : "text-gray-500"
// //                         }`}
// //                       >
// //                         <Table className="w-4 h-4" />
// //                       </button>
// //                       <button
// //                         onClick={() => setViewMode("grid")}
// //                         className={`p-2 rounded-lg transition ${
// //                           viewMode === "grid" ? "bg-white shadow-sm text-gray-700" : "text-gray-500"
// //                         }`}
// //                       >
// //                         <Grid className="w-4 h-4" />
// //                       </button>
// //                     </div>

// //                     <div className="relative flex-1 sm:w-64">
// //                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
// //                       <input
// //                         type="text"
// //                         placeholder="Rechercher..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       />
// //                     </div>

// //                     <button
// //                       onClick={() => {
// //                         setShowForm(true);
// //                         setEditMode(true);
// //                         resetForm();
// //                       }}
// //                       disabled={loading}
// //                       className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
// //                     >
// //                       <Plus className="w-4 h-4" />
// //                       Nouvel employé
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>

// //               {loading ? (
// //                 <div className="flex justify-center items-center py-12">
// //                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
// //                 </div>
// //               ) : viewMode === "table" ? (
// //                 <div className="overflow-x-auto">
// //                   <table className="w-full">
// //                     <thead className="bg-gray-50 border-b">
// //                       <tr>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employé</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fonction</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
// //                         <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="bg-white divide-y divide-gray-200">
// //                       {currentItems.map((emp) => (
// //                         <tr key={emp.id} className="hover:bg-gray-50">
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
// //                             <div className="flex items-center gap-3">
// //                               <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
// //                                 {emp.photo ? (
// //                                   <img src={emp.photo} alt="" className="w-full h-full object-cover" />
// //                                 ) : (
// //                                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                                     <User className="w-4 h-4 text-gray-400" />
// //                                   </div>
// //                                 )}
// //                               </div>
// //                               <div>
// //                                 <div className="text-sm font-medium text-gray-900">
// //                                   {emp.nom} {emp.prenoms}
// //                                 </div>
// //                                 <div className="text-sm text-gray-500">
// //                                   {emp.appellation || "-"}
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
// //                             {emp.numero_matricule}
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                             {emp.fonction || "-"}
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
// //                             {emp.section || "-"}
// //                           </td>
// //                           <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
// //                             <div className="flex items-center gap-1">
// //                               <button
// //                                 onClick={() => {
// //                                   setSelectedEmployee(emp);
// //                                   setFormData(initFormData(emp));
// //                                 }}
// //                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
// //                               >
// //                                 <Eye className="w-4 h-4" />
// //                               </button>
// //                               <button
// //                                 onClick={() => {
// //                                   setSelectedEmployee(emp);
// //                                   setFormData(initFormData(emp));
// //                                   setEditMode(true);
// //                                 }}
// //                                 className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
// //                               >
// //                                 <Edit2 className="w-4 h-4" />
// //                               </button>
// //                               <button
// //                                 onClick={() => handleDelete(emp.id)}
// //                                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
// //                               >
// //                                 <Trash2 className="w-4 h-4" />
// //                               </button>
// //                             </div>
// //                           </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               ) : (
// //                 <div className="p-4 sm:p-6">
// //                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
// //                     {currentItems.map((emp) => (
// //                       <div key={emp.id} className="bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all overflow-hidden">
// //                         <div className="p-4">
// //                           <div className="flex items-center gap-3 mb-3">
// //                             <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
// //                               {emp.photo ? (
// //                                 <img src={emp.photo} alt="" className="w-full h-full object-cover" />
// //                               ) : (
// //                                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                                   <User className="w-6 h-6 text-gray-400" />
// //                                 </div>
// //                               )}
// //                             </div>
// //                             <div className="min-w-0">
// //                               <h3 className="font-semibold text-gray-900 text-base truncate">
// //                                 {emp.nom} {emp.prenoms}
// //                               </h3>
// //                               <p className="text-sm text-gray-500 truncate">{emp.numero_matricule}</p>
// //                             </div>
// //                           </div>
                          
// //                           <div className="space-y-2 text-sm">
// //                             <div>
// //                               <p className="text-xs text-gray-500">Fonction</p>
// //                               <p className="text-gray-900">{emp.fonction || "-"}</p>
// //                             </div>
// //                             <div>
// //                               <p className="text-xs text-gray-500">Section</p>
// //                               <p className="text-gray-900">{emp.section || "-"}</p>
// //                             </div>
// //                           </div>
// //                         </div>

// //                         <div className="px-4 py-3 bg-gray-50 border-t">
// //                           <div className="flex items-center justify-between">
// //                             <button
// //                               onClick={() => {
// //                                 setSelectedEmployee(emp);
// //                                 setFormData(initFormData(emp));
// //                               }}
// //                               className="text-blue-600 hover:text-blue-800 text-sm font-medium"
// //                             >
// //                               Voir détails
// //                             </button>
// //                             <div className="flex items-center gap-1">
// //                               <button
// //                                 onClick={() => {
// //                                   setSelectedEmployee(emp);
// //                                   setFormData(initFormData(emp));
// //                                   setEditMode(true);
// //                                 }}
// //                                 className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
// //                               >
// //                                 <Edit2 className="w-4 h-4" />
// //                               </button>
// //                               <button
// //                                 onClick={() => handleDelete(emp.id)}
// //                                 className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
// //                               >
// //                                 <Trash2 className="w-4 h-4" />
// //                               </button>
// //                             </div>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Pagination */}
// //               {filteredEmployees.length > 0 && (
// //                 <div className="px-4 sm:px-6 py-4 border-t bg-gray-50">
// //                   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
// //                     <div className="flex items-center gap-2">
// //                       <span className="text-sm text-gray-600">Afficher</span>
// //                       <select
// //                         value={itemsPerPage}
// //                         onChange={(e) => {
// //                           setItemsPerPage(Number(e.target.value));
// //                           setCurrentPage(1);
// //                         }}
// //                         className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
// //                       >
// //                         <option value={10}>10</option>
// //                         <option value={20}>20</option>
// //                         <option value={50}>50</option>
// //                       </select>
// //                     </div>

// //                     <div className="text-sm text-gray-600">
// //                       {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} sur {filteredEmployees.length}
// //                     </div>

// //                     <div className="flex items-center gap-1">
// //                       <button
// //                         onClick={() => setCurrentPage(currentPage - 1)}
// //                         disabled={currentPage === 1}
// //                         className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
// //                       >
// //                         <ChevronLeft className="w-4 h-4" />
// //                       </button>

// //                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //                         <button
// //                           key={page}
// //                           onClick={() => setCurrentPage(page)}
// //                           className={`min-w-[40px] px-3 py-2 border text-sm rounded-lg ${
// //                             page === currentPage
// //                               ? "bg-blue-600 text-white border-blue-600"
// //                               : "border-gray-300 text-gray-700 hover:bg-gray-50"
// //                           }`}
// //                         >
// //                           {page}
// //                         </button>
// //                       ))}

// //                       <button
// //                         onClick={() => setCurrentPage(currentPage + 1)}
// //                         disabled={currentPage === totalPages}
// //                         className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
// //                       >
// //                         <ChevronRight className="w-4 h-4" />
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {filteredEmployees.length === 0 && (
// //                 <div className="text-center py-12">
// //                   <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
// //                   <h3 className="text-lg font-medium text-gray-900 mb-2">
// //                     {searchTerm ? "Aucun employé trouvé" : "Aucun employé"}
// //                   </h3>
// //                 </div>
// //               )}
// //             </div>
// //           )}

// //           {/* Formulaire */}
// //           {(selectedEmployee || showForm) && (
// //             <EmployeeBlock
// //               employee={selectedEmployee}
// //               formData={formData}
// //               setFormData={setFormData}
// //               onSubmit={selectedEmployee ? handleUpdate : handleAdd}
// //               onCancel={() => {
// //                 setShowForm(false);
// //                 setEditMode(false);
// //                 setSelectedEmployee(null);
// //                 resetForm();
// //               }}
// //               editMode={editMode}
// //             />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EmployeesPage;




// import React, { useState, useEffect } from "react";
// import "/src/styles/custom.css";
// import {
//   Search,
//   Plus,
//   Eye,
//   Edit2,
//   Trash2,
//   ChevronLeft,
//   ChevronRight,
//   Table,
//   Grid,
//   User,
// } from "lucide-react";
// import EmployeeBlock from "../../components/employee/EmployeeBlock";
// import {
//   getAllEmployees,
//   createEmployee,
//   updateEmployee,
//   deleteEmployee,
//   createBancaire,
//   updateBancaire,
//   createSalaire,
//   updateSalaire,
//   createFamiliale,
//   updateFamiliale,
// } from "../../services/employeeService";

// const EmployeesPage = () => {
//   const [employees, setEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewMode, setViewMode] = useState("table");
//   const [loading, setLoading] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Fonction pour formater le nom en majuscules
//   const formatNom = (nom) => {
//     return nom ? nom.toUpperCase() : "";
//   };

//   // Fonction pour formater les prénoms (première lettre en majuscule)
//   const formatPrenoms = (prenoms) => {
//     if (!prenoms) return "";
//     return prenoms
//       .split(' ')
//       .map(prenom => prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase())
//       .join(' ');
//   };

//   // Fonction pour formater l'affichage complet
//   const formatDisplayName = (emp) => {
//     const nomFormatted = formatNom(emp.nom);
//     const prenomsFormatted = formatPrenoms(emp.prenoms);
//     return `${nomFormatted} ${prenomsFormatted}`;
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllEmployees();
//       const sortedData = data.sort((a, b) => a.id - b.id);
//       setEmployees(sortedData);
//     } catch (error) {
//       console.error("Erreur:", error);
//       alert("Erreur lors du chargement des employés");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filtrage et pagination
//   const filteredEmployees = employees.filter(
//     (emp) =>
//       emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

//   // Initialisation formulaire
//   const initFormData = (emp) => ({
//     ...emp,
//     bancaire: emp.bancaire || {},
//     salaire_personnel: emp.salaire_personnel || {},
//     familiale: emp.familiale || { enfants: [] },
//   });

//   // Validation des champs obligatoires
//   const validateRequiredFields = () => {
//     const errors = [];
    
//     if (!formData.numero_matricule?.trim()) {
//       errors.push("Le numéro matricule est obligatoire");
//     }
//     if (!formData.nom?.trim()) {
//       errors.push("Le nom est obligatoire");
//     }
//     if (!formData.prenoms?.trim()) {
//       errors.push("Les prénoms sont obligatoires");
//     }

//     if (errors.length > 0) {
//       alert(errors.join('\n'));
//       return false;
//     }
//     return true;
//   };

//   const hasValidData = (data) => {
//     if (!data) return false;
//     const hasAnyData = Object.values(data).some(value => 
//       value && value.toString().trim() !== '' && !Array.isArray(value)
//     );
//     return hasAnyData;
//   };

//   const handleUpdate = async () => {
//     if (!selectedEmployee) return;
//     if (!validateRequiredFields()) return;

//     try {
//       setLoading(true);
//       const persoData = new FormData();
      
//       // Formater les données avant envoi
//       const nomFormatted = formatNom(formData.nom);
//       const prenomsFormatted = formatPrenoms(formData.prenoms);

//       const personalFields = {
//         numero_matricule: formData.numero_matricule,
//         nom: nomFormatted,
//         prenoms: prenomsFormatted,
//         sexe: formData.sexe,
//         appellation: formData.appellation,
//         fonction: formData.fonction,
//         section: formData.section,
//         date_naissance: formData.date_naissance,
//         lieu_naissance: formData.lieu_naissance,
//         CIN: formData.CIN,
//         date_CIN: formData.date_CIN,
//         lieu_CIN: formData.lieu_CIN,
//         numero_cnaps: formData.numero_cnaps,
//         ancien_numero_journaliere: formData.ancien_numero_journaliere,
//         pere: formData.pere,
//         mere: formData.mere,
//         adresse: formData.adresse,
//         quartier: formData.quartier,
//         telephone: formData.telephone,
//         email: formData.email,
//       };

//       Object.entries(personalFields).forEach(([key, value]) => {
//         if (value !== null && value !== undefined && value !== '') {
//           persoData.append(key, value);
//         }
//       });

//       if (formData.photo instanceof File) {
//         persoData.append('photo', formData.photo);
//       }

//       await updateEmployee(selectedEmployee.id, persoData);

//       // Mise à jour des informations bancaires, salaire et familiale
//       if (formData.bancaire && hasValidData(formData.bancaire)) {
//         const bancaireData = {
//           nom_banque: formData.bancaire.nom_banque || '',
//           code_banque: formData.bancaire.code_banque || '',
//           code_agence: formData.bancaire.code_agence || '',
//           numero_compte: formData.bancaire.numero_compte || '',
//           cle_rib: formData.bancaire.cle_rib || '',
//           banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
//           employe: selectedEmployee.id,
//         };

//         Object.keys(bancaireData).forEach(key => {
//           if (bancaireData[key] === '') bancaireData[key] = null;
//         });

//         if (formData.bancaire.id) {
//           await updateBancaire(formData.bancaire.id, bancaireData);
//         } else if (hasValidData(bancaireData)) {
//           await createBancaire(bancaireData);
//         }
//       }

//       if (formData.salaire_personnel && hasValidData(formData.salaire_personnel)) {
//         const salaireData = {
//           date_embauche: formData.salaire_personnel.date_embauche || '',
//           fonction: formData.salaire_personnel.fonction || '',
//           categorie: formData.salaire_personnel.categorie || '',
//           salaire: formData.salaire_personnel.salaire || '',
//           section: formData.salaire_personnel.section || '',
//           responsable_section: formData.salaire_personnel.responsable_section || '',
//           prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
//           indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
//           obs_prime: formData.salaire_personnel.obs_prime || '',
//           employe: selectedEmployee.id,
//         };

//         Object.keys(salaireData).forEach(key => {
//           if (salaireData[key] === '') salaireData[key] = null;
//         });

//         if (formData.salaire_personnel.id) {
//           await updateSalaire(formData.salaire_personnel.id, salaireData);
//         } else if (hasValidData(salaireData)) {
//           await createSalaire(salaireData);
//         }
//       }

//       if (formData.familiale && hasValidData(formData.familiale)) {
//         const familialeData = {
//           epoux_nom: formData.familiale.epoux_nom || '',
//           epoux_prenoms: formData.familiale.epoux_prenoms || '',
//           epoux_date_naissance: formData.familiale.epoux_date_naissance || '',
//           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || '',
//           epoux_societe: formData.familiale.epoux_societe || '',
//           epoux_fonction: formData.familiale.epoux_fonction || '',
//           employe: selectedEmployee.id,
//         };

//         Object.keys(familialeData).forEach(key => {
//           if (familialeData[key] === '') familialeData[key] = null;
//         });

//         if (formData.familiale.id) {
//           await updateFamiliale(formData.familiale.id, familialeData);
//         } else if (hasValidData(familialeData)) {
//           await createFamiliale(familialeData);
//         }
//       }

//       await fetchEmployees();
//       setEditMode(false);
//       setSelectedEmployee(null);
//       resetForm();
//       alert("Employé mis à jour avec succès !");
//     } catch (error) {
//       console.error("Erreur détaillée:", error);
//       let errorMessage = "Erreur lors de la mise à jour: ";
//       if (error.response?.data) {
//         const serverErrors = error.response.data;
//         Object.keys(serverErrors).forEach(field => {
//           const errors = serverErrors[field];
//           if (Array.isArray(errors)) {
//             errorMessage += `${field}: ${errors.join(', ')} `;
//           } else {
//             errorMessage += `${field}: ${errors} `;
//           }
//         });
//       } else {
//         errorMessage += error.message;
//       }
//       alert(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAdd = async () => {
//     if (!validateRequiredFields()) return;

//     try {
//       setLoading(true);
//       const persoData = new FormData();
      
//       // Formater les données avant envoi
//       const nomFormatted = formatNom(formData.nom);
//       const prenomsFormatted = formatPrenoms(formData.prenoms);

//       persoData.append('numero_matricule', formData.numero_matricule?.trim() || '');
//       persoData.append('nom', nomFormatted);
//       persoData.append('prenoms', prenomsFormatted);

//       const optionalFields = {
//         sexe: formData.sexe,
//         appellation: formData.appellation,
//         fonction: formData.fonction,
//         section: formData.section,
//         date_naissance: formData.date_naissance,
//         lieu_naissance: formData.lieu_naissance,
//         CIN: formData.CIN,
//         date_CIN: formData.date_CIN,
//         lieu_CIN: formData.lieu_CIN,
//         numero_cnaps: formData.numero_cnaps,
//         ancien_numero_journaliere: formData.ancien_numero_journaliere,
//         pere: formData.pere,
//         mere: formData.mere,
//         adresse: formData.adresse,
//         quartier: formData.quartier,
//         telephone: formData.telephone,
//         email: formData.email,
//       };

//       Object.entries(optionalFields).forEach(([key, value]) => {
//         if (value && value.toString().trim() !== '') {
//           persoData.append(key, value.toString().trim());
//         }
//       });

//       if (formData.photo instanceof File) {
//         persoData.append('photo', formData.photo);
//       }

//       const newEmp = await createEmployee(persoData);

//       // Création des informations bancaires, salaire et familiale
//       if (formData.bancaire && hasValidData(formData.bancaire)) {
//         const bancaireData = {
//           nom_banque: formData.bancaire.nom_banque || '',
//           code_banque: formData.bancaire.code_banque || '',
//           code_agence: formData.bancaire.code_agence || '',
//           numero_compte: formData.bancaire.numero_compte || '',
//           cle_rib: formData.bancaire.cle_rib || '',
//           banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
//           employe: newEmp.id,
//         };

//         Object.keys(bancaireData).forEach(key => {
//           if (bancaireData[key] === '') bancaireData[key] = null;
//         });

//         if (hasValidData(bancaireData)) {
//           await createBancaire(bancaireData);
//         }
//       }

//       if (formData.salaire_personnel && hasValidData(formData.salaire_personnel)) {
//         const salaireData = {
//           date_embauche: formData.salaire_personnel.date_embauche || '',
//           fonction: formData.salaire_personnel.fonction || '',
//           categorie: formData.salaire_personnel.categorie || '',
//           salaire: formData.salaire_personnel.salaire || '',
//           section: formData.salaire_personnel.section || '',
//           responsable_section: formData.salaire_personnel.responsable_section || '',
//           prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
//           indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
//           obs_prime: formData.salaire_personnel.obs_prime || '',
//           employe: newEmp.id,
//         };

//         Object.keys(salaireData).forEach(key => {
//           if (salaireData[key] === '') salaireData[key] = null;
//         });

//         if (hasValidData(salaireData)) {
//           await createSalaire(salaireData);
//         }
//       }

//       if (formData.familiale && hasValidData(formData.familiale)) {
//         const familialeData = {
//           epoux_nom: formData.familiale.epoux_nom || '',
//           epoux_prenoms: formData.familiale.epoux_prenoms || '',
//           epoux_date_naissance: formData.familiale.epoux_date_naissance || '',
//           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || '',
//           epoux_societe: formData.familiale.epoux_societe || '',
//           epoux_fonction: formData.familiale.epoux_fonction || '',
//           employe: newEmp.id,
//         };

//         Object.keys(familialeData).forEach(key => {
//           if (familialeData[key] === '') familialeData[key] = null;
//         });

//         if (hasValidData(familialeData)) {
//           await createFamiliale(familialeData);
//         }
//       }

//       await fetchEmployees();
//       setShowForm(false);
//       setEditMode(false);
//       resetForm();
//       alert("Employé créé avec succès !");
      
//     } catch (error) {
//       console.error("Erreur complète:", error);
//       if (error.response?.data) {
//         const serverErrors = error.response.data;
//         let errorMessage = "Erreurs de validation:\n";
//         Object.keys(serverErrors).forEach(field => {
//           const errors = serverErrors[field];
//           if (Array.isArray(errors)) {
//             errorMessage += `• ${field}: ${errors.join(', ')}\n`;
//           } else {
//             errorMessage += `• ${field}: ${errors}\n`;
//           }
//         });
//         alert(errorMessage);
//       } else {
//         alert(`Erreur lors de la création: ${error.message}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
//       try {
//         await deleteEmployee(id);
//         await fetchEmployees();
//         if (selectedEmployee?.id === id) {
//           setSelectedEmployee(null);
//         }
//         alert("Employé supprimé avec succès !");
//       } catch (error) {
//         console.error("Erreur:", error);
//         alert("Erreur lors de la suppression");
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       numero_matricule: "",
//       nom: "",
//       prenoms: "",
//       sexe: "",
//       appellation: "",
//       fonction: "",
//       section: "",
//       date_naissance: "",
//       lieu_naissance: "",
//       CIN: "",
//       date_CIN: "",
//       lieu_CIN: "",
//       numero_cnaps: "",
//       ancien_numero_journaliere: "",
//       pere: "",
//       mere: "",
//       adresse: "",
//       quartier: "",
//       telephone: "",
//       email: "",
//       photo: null,
//       bancaire: {},
//       salaire_personnel: {},
//       familiale: { enfants: [] },
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="mx-auto">
//         {/* Header avec Statistiques */}
//         <div className="mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">
//                 Gestion des Employés
//               </h1>
//               <p className="text-gray-600">
//                 Gérez efficacement les informations de votre personnel
//               </p>
//             </div>
//           </div>

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Total Employés</p>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{employees.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
//                   <User className="w-6 h-6 text-blue-600" />
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{employees.length}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm font-medium text-gray-600">Page Actuelle</p>
//                   <p className="text-2xl font-bold text-gray-800 mt-1">{currentPage}/{totalPages || 1}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
//                   <Table className="w-6 h-6 text-purple-600" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {!selectedEmployee && !showForm && (
//             <div>
//               {/* Toolbar */}
//               <div className="p-6 border-b border-gray-200">
//                 <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <h2 className="text-xl font-semibold text-gray-800">
//                       Liste des Employés
//                     </h2>
//                   </div>

//                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
//                     {/* View Toggle */}
//                     <div className="flex bg-gray-100 rounded-lg p-1">
//                       <button
//                         onClick={() => setViewMode("table")}
//                         className={`p-2 rounded-md transition-all ${
//                           viewMode === "table" 
//                             ? "bg-white shadow-sm text-gray-700" 
//                             : "text-gray-500 hover:text-gray-700"
//                         }`}
//                       >
//                         <Table className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setViewMode("grid")}
//                         className={`p-2 rounded-md transition-all ${
//                           viewMode === "grid" 
//                             ? "bg-white shadow-sm text-gray-700" 
//                             : "text-gray-500 hover:text-gray-700"
//                         }`}
//                       >
//                         <Grid className="w-4 h-4" />
//                       </button>
//                     </div>

//                     {/* Search */}
//                     <div className="relative flex-1 sm:w-64">
//                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                       <input
//                         type="text"
//                         placeholder="Rechercher un employé..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
//                       />
//                     </div>

//                     {/* Add Employee Button */}
//                     <button
//                       onClick={() => {
//                         setShowForm(true);
//                         setEditMode(true);
//                         resetForm();
//                       }}
//                       disabled={loading}
//                       className="flex items-center justify-center gap-2 px-4 py-2.5 bg-akj text-white rounded-md transition-all text-sm font-medium disabled:opacity-50 shadow-sm"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Nouvel employé
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Loading State */}
//               {loading ? (
//                 <div className="flex justify-center items-center py-16">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                     <p className="text-gray-600 text-sm">Chargement des employés...</p>
//                   </div>
//                 </div>
//               ) : viewMode === "table" ? (
//                 /* Table View - Version Professionnelle */
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className="bg-gray-50 border-b border-gray-200">
//                       <tr>
//                         <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                           Employé
//                         </th>
//                         <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                           Matricule
//                         </th>
//                         <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                           Fonction
//                         </th>
//                         <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                           Section
//                         </th>
//                         <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {currentItems.map((emp) => (
//                         <tr key={emp.id} className="hover:bg-gray-50 transition-colors duration-150">
//                           {/* Colonne Employé */}
//                           <td className="w-1/5 px-6 py-4">
//                             <div className="flex items-center space-x-3">
//                               <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
//                                 {emp.photo ? (
//                                   <img src={emp.photo} alt="" className="w-10 h-10 rounded-lg object-cover" />
//                                 ) : (
//                                   <User className="w-5 h-5 text-gray-400" />
//                                 )}
//                               </div>
//                               <div className="min-w-0">
//                                 <p className="text-sm font-medium text-gray-900 truncate">
//                                   {formatDisplayName(emp)}
//                                 </p>
//                                 <p className="text-xs text-gray-500 truncate">
//                                   {emp.appellation || "Non spécifié"}
//                                 </p>
//                               </div>
//                             </div>
//                           </td>

//                           {/* Colonne Matricule */}
//                           <td className="w-1/5 px-6 py-4">
//                             <div className="flex items-center">
//                               <span className="text-sm font-bold text-gray-900">
//                                 {emp.numero_matricule}
//                               </span>
//                             </div>
//                           </td>

//                           {/* Colonne Fonction */}
//                           <td className="w-1/5 px-6 py-4">
//                             <div className="text-sm text-gray-900">
//                               {emp.fonction || "Non spécifié"}
//                             </div>
//                             {emp.categorie && (
//                               <div className="text-xs text-gray-500 mt-1">
//                                 {emp.categorie}
//                               </div>
//                             )}
//                           </td>

//                           {/* Colonne Section */}
//                           <td className="w-1/5 px-6 py-4">
//                             <div className="text-sm text-gray-900">
//                               {emp.section || "Non spécifié"}
//                             </div>
//                             {emp.responsable_section && (
//                               <div className="text-xs text-gray-500 mt-1">
//                                 {emp.responsable_section}
//                               </div>
//                             )}
//                           </td>

//                           {/* Colonne Actions */}
//                           <td className="w-1/5 px-6 py-4">
//                             <div className="flex items-center justify-start space-x-2">
//                               <button
//                                 onClick={() => {
//                                   setSelectedEmployee(emp);
//                                   setFormData(initFormData(emp));
//                                 }}
//                                 className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
//                                 title="Voir détails"
//                               >
//                                 <Eye className="w-3 h-3 mr-1" />
//                                 Voir
//                               </button>
//                               <button
//                                 onClick={() => {
//                                   setSelectedEmployee(emp);
//                                   setFormData(initFormData(emp));
//                                   setEditMode(true);
//                                 }}
//                                 className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200"
//                                 title="Modifier"
//                               >
//                                 <Edit2 className="w-3 h-3 mr-1" />
//                                 Éditer
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(emp.id)}
//                                 className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 border border-red-200"
//                                 title="Supprimer"
//                               >
//                                 <Trash2 className="w-3 h-3 mr-1" />
//                                 Supprimer
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 /* Grid View */
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                     {currentItems.map((emp) => (
//                       <div key={emp.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all overflow-hidden">
//                         <div className="p-5">
//                           <div className="flex items-center gap-4 mb-4">
//                             <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
//                               {emp.photo ? (
//                                 <img src={emp.photo} alt="" className="w-full h-full object-cover" />
//                               ) : (
//                                 <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                   <User className="w-8 h-8 text-gray-400" />
//                                 </div>
//                               )}
//                             </div>
//                             <div className="min-w-0 flex-1">
//                               <h3 className="font-bold text-gray-900 text-lg truncate">
//                                 {formatDisplayName(emp)}
//                               </h3>
//                               <p className="text-sm text-gray-500 truncate">{emp.appellation || "Non spécifié"}</p>
//                               <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
//                                 {emp.numero_matricule}
//                               </span>
//                             </div>
//                           </div>
                          
//                           <div className="space-y-2 text-sm">
//                             <div className="flex justify-between items-center">
//                               <span className="text-xs font-medium text-gray-500">Fonction</span>
//                               <span className="text-gray-900 text-right">{emp.fonction || "Non spécifié"}</span>
//                             </div>
//                             <div className="flex justify-between items-center">
//                               <span className="text-xs font-medium text-gray-500">Section</span>
//                               <span className="text-gray-900 text-right">{emp.section || "Non spécifié"}</span>
//                             </div>
//                             {emp.responsable_section && (
//                               <div className="flex justify-between items-center">
//                                 <span className="text-xs font-medium text-gray-500">Responsable</span>
//                                 <span className="text-gray-900 text-right">{emp.responsable_section}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>

//                         <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
//                           <div className="flex items-center justify-between">
//                             <button
//                               onClick={() => {
//                                 setSelectedEmployee(emp);
//                                 setFormData(initFormData(emp));
//                               }}
//                               className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
//                             >
//                               Voir détails
//                             </button>
//                             <div className="flex items-center gap-1">
//                               <button
//                                 onClick={() => {
//                                   setSelectedEmployee(emp);
//                                   setFormData(initFormData(emp));
//                                   setEditMode(true);
//                                 }}
//                                 className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors hover:text-green-600"
//                               >
//                                 <Edit2 className="w-4 h-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(emp.id)}
//                                 className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors hover:text-red-600"
//                                 >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Pagination */}
//               {filteredEmployees.length > 0 && (
//                 <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//                   <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                     <div className="flex items-center gap-2">
//                       <span className="text-sm text-gray-600">Afficher</span>
//                       <select
//                         value={itemsPerPage}
//                         onChange={(e) => {
//                           setItemsPerPage(Number(e.target.value));
//                           setCurrentPage(1);
//                         }}
//                         className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
//                       >
//                         <option value={10}>10</option>
//                         <option value={20}>20</option>
//                         <option value={50}>50</option>
//                       </select>
//                       <span className="text-sm text-gray-600">par page</span>
//                     </div>

//                     <div className="text-sm text-gray-600">
//                       {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} sur {filteredEmployees.length}
//                     </div>

//                     <div className="flex items-center gap-1">
//                       <button
//                         onClick={() => setCurrentPage(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
//                       >
//                         <ChevronLeft className="w-4 h-4" />
//                       </button>

//                       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                         <button
//                           key={page}
//                           onClick={() => setCurrentPage(page)}
//                           className={`min-w-[40px] px-3 py-2 border text-sm rounded-lg transition-colors ${
//                             page === currentPage
//                               ? "bg-blue-600 text-white border-blue-600"
//                               : "border-gray-300 text-gray-700 hover:bg-gray-50"
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       ))}

//                       <button
//                         onClick={() => setCurrentPage(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
//                       >
//                         <ChevronRight className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Empty State */}
//               {filteredEmployees.length === 0 && (
//                 <div className="text-center py-16">
//                   <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
//                     <User className="w-10 h-10 text-gray-400" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                     {searchTerm ? "Aucun employé trouvé" : "Aucun employé enregistré"}
//                   </h3>
//                   <p className="text-gray-600 mb-6 max-w-md mx-auto">
//                     {searchTerm 
//                       ? "Aucun employé ne correspond à votre recherche. Essayez d'autres termes."
//                       : "Commencez par ajouter votre premier employé à la base de données."
//                     }
//                   </p>
//                   {!searchTerm && (
//                     <button
//                       onClick={() => {
//                         setShowForm(true);
//                         setEditMode(true);
//                         resetForm();
//                       }}
//                       className="inline-flex items-center gap-2 px-6 py-3 bg-akj text-white rounded transition-colors font-medium"
//                     >
//                       <Plus className="w-5 h-5" />
//                       Ajouter le premier employé
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Formulaire */}
//           {(selectedEmployee || showForm) && (
//             <EmployeeBlock
//               employee={selectedEmployee}
//               formData={formData}
//               setFormData={setFormData}
//               onSubmit={selectedEmployee ? handleUpdate : handleAdd}
//               onCancel={() => {
//                 setShowForm(false);
//                 setEditMode(false);
//                 setSelectedEmployee(null);
//                 resetForm();
//               }}
//               editMode={editMode}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmployeesPage;



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

  // Fonction pour formater le nom en majuscules
  const formatNom = (nom) => {
    return nom ? nom.toUpperCase() : "";
  };

  // Fonction pour formater les prénoms (première lettre en majuscule)
  const formatPrenoms = (prenoms) => {
    if (!prenoms) return "";
    return prenoms
      .split(' ')
      .map(prenom => prenom.charAt(0).toUpperCase() + prenom.slice(1).toLowerCase())
      .join(' ');
  };

  // Fonction pour formater l'affichage complet
  const formatDisplayName = (emp) => {
    const nomFormatted = formatNom(emp.nom);
    const prenomsFormatted = formatPrenoms(emp.prenoms);
    return `${nomFormatted} ${prenomsFormatted}`;
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
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Initialisation des données avec les enfants
  const initFormData = async (emp) => {
    const baseData = {
      ...emp,
      bancaire: emp.bancaire || {},
      salaire_personnel: emp.salaire_personnel || {},
      familiale: emp.familiale || { enfants: [] },
    };

    // Charger les enfants si une familiale existe
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
    if (!formData.nom?.trim()) {
      errors.push("Le nom est obligatoire");
    }
    if (!formData.prenoms?.trim()) {
      errors.push("Les prénoms sont obligatoires");
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }
    return true;
  };

  const hasValidData = (data) => {
    if (!data) return false;
    const hasAnyData = Object.values(data).some(value => 
      value !== null && value !== undefined && value.toString().trim() !== '' && !Array.isArray(value)
    );
    return hasAnyData;
  };

  // Gestion des enfants
  // Dans handleSaveEnfants, remplacez toute la fonction par :

const handleSaveEnfants = async (familialeId, enfants) => {
  if (!familialeId) return;

  try {
    console.log("Enfants à sauvegarder:", enfants);
    
    // Récupérer les enfants existants
    const existingEnfants = await getEnfantsByFamiliale(familialeId);
    
    // IDs des enfants existants
    const existingIds = existingEnfants.map(enfant => enfant.id);
    
    // IDs des enfants dans le formulaire
    const formIds = enfants.filter(enfant => enfant.id).map(enfant => enfant.id);
    
    // Enfants à supprimer
    const toDelete = existingIds.filter(id => !formIds.includes(id));
    for (const id of toDelete) {
      await deleteEnfant(id);
    }
    
    // Enfants à créer ou mettre à jour
    for (const enfant of enfants) {
      // Vérifier que l'enfant a au moins un nom
      if (enfant.nom_prenoms && enfant.nom_prenoms.trim() !== '') {
        // Préparer les données
        const enfantData = {
          familiale: familialeId,
          nom_prenoms: enfant.nom_prenoms.trim(),
        };

        // Ajouter les champs optionnels
        if (enfant.sexe && enfant.sexe !== '') {
          enfantData.sexe = enfant.sexe;
        } else {
          enfantData.sexe = null; // Explicitement null si vide
        }
        
        if (enfant.date_naissance) {
          enfantData.date_naissance = enfant.date_naissance;
        } else {
          enfantData.date_naissance = null;
        }
        
        if (enfant.lieu_naissance && enfant.lieu_naissance.trim() !== '') {
          enfantData.lieu_naissance = enfant.lieu_naissance;
        } else {
          enfantData.lieu_naissance = null;
        }

        console.log("Données enfant à envoyer:", enfantData);

        if (enfant.id) {
          await updateEnfant(enfant.id, enfantData);
        } else {
          await createEnfant(enfantData);
        }
      }
    }
  } catch (error) {
    console.error("Erreur détaillée lors de la sauvegarde des enfants:", error.response?.data);
    throw error;
  }
};
  const handleUpdate = async () => {
    if (!selectedEmployee) return;
    if (!validateRequiredFields()) return;

    try {
      setLoading(true);
      const persoData = new FormData();
      
      // Formater les données avant envoi
      const nomFormatted = formatNom(formData.nom);
      const prenomsFormatted = formatPrenoms(formData.prenoms);

      const personalFields = {
        numero_matricule: formData.numero_matricule,
        nom: nomFormatted,
        prenoms: prenomsFormatted,
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
        if (value !== null && value !== undefined && value !== '') {
          persoData.append(key, value);
        }
      });

      if (formData.photo instanceof File) {
        persoData.append('photo', formData.photo);
      }

      await updateEmployee(selectedEmployee.id, persoData);

      // Mise à jour des informations bancaires
      if (formData.bancaire) {
        const bancaireData = {
          nom_banque: formData.bancaire.nom_banque || '',
          code_banque: formData.bancaire.code_banque || '',
          code_agence: formData.bancaire.code_agence || '',
          numero_compte: formData.bancaire.numero_compte || '',
          cle_rib: formData.bancaire.cle_rib || '',
          banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
          employe: selectedEmployee.id,
        };

        Object.keys(bancaireData).forEach(key => {
          if (bancaireData[key] === '') bancaireData[key] = null;
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
          date_embauche: formData.salaire_personnel.date_embauche || '',
          fonction: formData.salaire_personnel.fonction || '',
          categorie: formData.salaire_personnel.categorie || '',
          salaire: formData.salaire_personnel.salaire || '',
          section: formData.salaire_personnel.section || '',
          responsable_section: formData.salaire_personnel.responsable_section || '',
          prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
          indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
          obs_prime: formData.salaire_personnel.obs_prime || '',
          employe: selectedEmployee.id,
        };

        Object.keys(salaireData).forEach(key => {
          if (salaireData[key] === '') salaireData[key] = null;
        });

        if (formData.salaire_personnel.id) {
          await updateSalaire(formData.salaire_personnel.id, salaireData);
        } else if (hasValidData(salaireData)) {
          await createSalaire(salaireData);
        }
      }

      // Mise à jour des informations familiales et enfants
      let familialeId = formData.familiale?.id;

      // Vérifier s'il y a des données familiales (époux ou enfants)
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
          epoux_nom: formData.familiale?.epoux_nom || '',
          epoux_prenoms: formData.familiale?.epoux_prenoms || '',
          epoux_date_naissance: formData.familiale?.epoux_date_naissance || '',
          epoux_lieu_naissance: formData.familiale?.epoux_lieu_naissance || '',
          epoux_societe: formData.familiale?.epoux_societe || '',
          epoux_fonction: formData.familiale?.epoux_fonction || '',
          employe: selectedEmployee.id,
        };

        Object.keys(familialeData).forEach(key => {
          if (familialeData[key] === '') familialeData[key] = null;
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
      setSelectedEmployee(null);
      resetForm();
      alert("Employé mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      let errorMessage = "Erreur lors de la mise à jour: ";
      if (error.response?.data) {
        const serverErrors = error.response.data;
        Object.keys(serverErrors).forEach(field => {
          const errors = serverErrors[field];
          if (Array.isArray(errors)) {
            errorMessage += `${field}: ${errors.join(', ')} `;
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
      const nomFormatted = formatNom(formData.nom);
      const prenomsFormatted = formatPrenoms(formData.prenoms);

      persoData.append('numero_matricule', formData.numero_matricule?.trim() || '');
      persoData.append('nom', nomFormatted);
      persoData.append('prenoms', prenomsFormatted);

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
        if (value && value.toString().trim() !== '') {
          persoData.append(key, value.toString().trim());
        }
      });

      if (formData.photo instanceof File) {
        persoData.append('photo', formData.photo);
      }

      const newEmp = await createEmployee(persoData);

      // Création des informations bancaires
      if (formData.bancaire && hasValidData(formData.bancaire)) {
        const bancaireData = {
          nom_banque: formData.bancaire.nom_banque || '',
          code_banque: formData.bancaire.code_banque || '',
          code_agence: formData.bancaire.code_agence || '',
          numero_compte: formData.bancaire.numero_compte || '',
          cle_rib: formData.bancaire.cle_rib || '',
          banque_beneficiaire: formData.bancaire.banque_beneficiaire || '',
          employe: newEmp.id,
        };

        Object.keys(bancaireData).forEach(key => {
          if (bancaireData[key] === '') bancaireData[key] = null;
        });

        await createBancaire(bancaireData);
      }

      // Création des informations salaire
      if (formData.salaire_personnel && hasValidData(formData.salaire_personnel)) {
        const salaireData = {
          date_embauche: formData.salaire_personnel.date_embauche || '',
          fonction: formData.salaire_personnel.fonction || '',
          categorie: formData.salaire_personnel.categorie || '',
          salaire: formData.salaire_personnel.salaire || '',
          section: formData.salaire_personnel.section || '',
          responsable_section: formData.salaire_personnel.responsable_section || '',
          prime_anciennete: formData.salaire_personnel.prime_anciennete || '',
          indemnite_deplacement: formData.salaire_personnel.indemnite_deplacement || '',
          obs_prime: formData.salaire_personnel.obs_prime || '',
          employe: newEmp.id,
        };

        Object.keys(salaireData).forEach(key => {
          if (salaireData[key] === '') salaireData[key] = null;
        });

        await createSalaire(salaireData);
      }

      // Création des informations familiales et enfants
      let familialeId = null;

      // Vérifier s'il y a des données familiales (époux ou enfants)
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
          epoux_nom: formData.familiale?.epoux_nom || '',
          epoux_prenoms: formData.familiale?.epoux_prenoms || '',
          epoux_date_naissance: formData.familiale?.epoux_date_naissance || '',
          epoux_lieu_naissance: formData.familiale?.epoux_lieu_naissance || '',
          epoux_societe: formData.familiale?.epoux_societe || '',
          epoux_fonction: formData.familiale?.epoux_fonction || '',
          employe: newEmp.id,
        };

        Object.keys(familialeData).forEach(key => {
          if (familialeData[key] === '') familialeData[key] = null;
        });

        const newFamiliale = await createFamiliale(familialeData);
        familialeId = newFamiliale.id;

        // Gestion des enfants
        if (familialeId && formData.familiale?.enfants && formData.familiale.enfants.length > 0) {
          await handleSaveEnfants(familialeId, formData.familiale.enfants);
        }
      }

      await fetchEmployees();
      setShowForm(false);
      setEditMode(false);
      resetForm();
      alert("Employé créé avec succès !");
      
    } catch (error) {
      console.error("Erreur complète:", error);
      if (error.response?.data) {
        const serverErrors = error.response.data;
        let errorMessage = "Erreurs de validation:\n";
        Object.keys(serverErrors).forEach(field => {
          const errors = serverErrors[field];
          if (Array.isArray(errors)) {
            errorMessage += `• ${field}: ${errors.join(', ')}\n`;
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
      nom: "",
      prenoms: "",
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

  // Charger les données d'un employé
  const loadEmployeeData = async (emp) => {
    try {
      const data = await initFormData(emp);
      setFormData(data);
    } catch (error) {
      console.error("Erreur chargement données:", error);
      alert("Erreur lors du chargement des données de l'employé");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto">
        {/* Header avec Statistiques */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Gestion des Employés
              </h1>
              <p className="text-gray-600">
                Gérez efficacement les informations de votre personnel
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employés</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{employees.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Employés Actifs</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{employees.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Actuelle</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{currentPage}/{totalPages || 1}</p>
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
              {/* Toolbar */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Liste des Employés
                    </h2>
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

                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Rechercher un employé..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
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
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-akj text-white rounded-md transition-all text-sm font-medium disabled:opacity-50 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Nouvel employé
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 text-sm">Chargement des employés...</p>
                  </div>
                </div>
              ) : viewMode === "table" ? (
                /* Table View */
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Employé
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Matricule
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Fonction
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Section
                        </th>
                        <th className="w-1/5 px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.map((emp) => (
                        <tr key={emp.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="w-1/5 px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                {emp.photo ? (
                                  <img src={emp.photo} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                ) : (
                                  <User className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {formatDisplayName(emp)}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {emp.appellation || "Non spécifié"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="w-1/5 px-6 py-4">
                            <div className="flex items-center">
                              <span className="text-sm font-bold text-gray-900">
                                {emp.numero_matricule}
                              </span>
                            </div>
                          </td>

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

                          <td className="w-1/5 px-6 py-4">
                            <div className="flex items-center justify-start space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  loadEmployeeData(emp);
                                }}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                                title="Voir détails"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Voir
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  loadEmployeeData(emp);
                                  setEditMode(true);
                                }}
                                className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200"
                                title="Modifier"
                              >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Éditer
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
                /* Grid View */
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentItems.map((emp) => (
                      <div key={emp.id} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                              {emp.photo ? (
                                <img src={emp.photo} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <User className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-gray-900 text-lg truncate">
                                {formatDisplayName(emp)}
                              </h3>
                              <p className="text-sm text-gray-500 truncate">{emp.appellation || "Non spécifié"}</p>
                              <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                                {emp.numero_matricule}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500">Fonction</span>
                              <span className="text-gray-900 text-right">{emp.fonction || "Non spécifié"}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-500">Section</span>
                              <span className="text-gray-900 text-right">{emp.section || "Non spécifié"}</span>
                            </div>
                            {emp.responsable_section && (
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-500">Responsable</span>
                                <span className="text-gray-900 text-right">{emp.responsable_section}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => {
                                setSelectedEmployee(emp);
                                loadEmployeeData(emp);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                            >
                              Voir détails
                            </button>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setSelectedEmployee(emp);
                                  loadEmployeeData(emp);
                                  setEditMode(true);
                                }}
                                className="p-2 text-gray-600 hover:bg-white rounded-lg transition-colors hover:text-green-600"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Afficher</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                      <span className="text-sm text-gray-600">par page</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEmployees.length)} sur {filteredEmployees.length}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[40px] px-3 py-2 border text-sm rounded-lg transition-colors ${
                            page === currentPage
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

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

              {/* Empty State */}
              {filteredEmployees.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchTerm ? "Aucun employé trouvé" : "Aucun employé enregistré"}
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchTerm 
                      ? "Aucun employé ne correspond à votre recherche. Essayez d'autres termes."
                      : "Commencez par ajouter votre premier employé à la base de données."
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditMode(true);
                        resetForm();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-akj text-white rounded transition-colors font-medium"
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