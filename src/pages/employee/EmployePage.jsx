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
//   // ========================================
//   // ÉTATS LOCAUX
//   // ========================================

//   const [employees, setEmployees] = useState([]); // Liste de tous les employés
//   const [selectedEmployee, setSelectedEmployee] = useState(null); // Employé sélectionné pour consultation/édition
//   const [showForm, setShowForm] = useState(false); // Afficher le formulaire d'ajout
//   const [editMode, setEditMode] = useState(false); // Mode édition actif ou non
//   const [formData, setFormData] = useState({}); // Données du formulaire en cours
//   const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche

//   // ========================================
//   // ÉTATS PAGINATION
//   // ========================================
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // ========================================
//   // CHARGEMENT INITIAL DES DONNÉES
//   // ========================================

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   /**
//    * Récupère la liste de tous les employés depuis l'API
//    * et les trie par ID croissant
//    */
//   const fetchEmployees = async () => {
//     try {
//       const data = await getAllEmployees();
//       const sortedData = data.sort((a, b) => a.id - b.id);
//       setEmployees(sortedData);
//     } catch (error) {
//       console.error("Erreur lors du chargement des employés :", error);
//     }
//   };

//   // ========================================
//   // CALCULS PAGINATION
//   // ========================================

//   /**
//    * Filtre les employés selon le terme de recherche
//    * Recherche dans : nom, prénoms, numéro matricule
//    */
//   const filteredEmployees = employees.filter(
//     (emp) =>
//       emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calcul des données pour la pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredEmployees.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );
//   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

//   // Réinitialiser à la première page quand la recherche change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, itemsPerPage]);

//   // Fonction pour changer de page
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Générer les numéros de page à afficher
//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxVisiblePages = 5;

//     if (totalPages <= maxVisiblePages) {
//       // Si moins de 5 pages, toutes les afficher
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       // Sinon, afficher les pages autour de la page courante
//       const startPage = Math.max(1, currentPage - 2);
//       const endPage = Math.min(totalPages, currentPage + 2);

//       if (startPage > 1) {
//         pageNumbers.push(1);
//         if (startPage > 2) pageNumbers.push("...");
//       }

//       for (let i = startPage; i <= endPage; i++) {
//         pageNumbers.push(i);
//       }

//       if (endPage < totalPages) {
//         if (endPage < totalPages - 1) pageNumbers.push("...");
//         pageNumbers.push(totalPages);
//       }
//     }

//     return pageNumbers;
//   };

//   // ========================================
//   // INITIALISATION DU FORMULAIRE
//   // ========================================

//   /**
//    * Initialise les données du formulaire avec les valeurs de l'employé
//    * ou des valeurs vides pour un nouvel employé
//    * @param {object} emp - Objet employé
//    * @returns {object} - Données formatées pour le formulaire
//    */
//   const initFormData = (emp) => ({
//     ...emp,
//     bancaire: emp.bancaire || {
//       id: null,
//       nom_banque: "",
//       numero_compte: "",
//       cle_rib: "",
//       banque_beneficiaire: "",
//     },
//     // Initialisation de la section salaire
//     salaire_personnel: emp.salaire_personnel || {
//       id: null,
//       date_embauche: "",
//       fonction: "",
//       categorie: "",
//       salaire: "",
//       section: "",
//       responsable_section: "",
//       prime_anciennete: "",
//       indemnite_deplacement: "",
//       dernier_aug_indice: "",
//       pour_30: "",
//       T1_17: "",
//       T2_17: "",
//       T3_17: "",
//       T4_17: "",
//       obs_prime: "",
//     },
//     // Initialisation de la section familiale
//     familiale: emp.familiale || {
//       id: null,
//       epoux_nom: "",
//       epoux_prenoms: "",
//       epoux_date_naissance: "",
//       epoux_lieu_naissance: "",
//       epoux_societe: "",
//       epoux_fonction: "",
//       enfants: [],
//     },
//   });

//   // ========================================
//   // GESTION DE LA MISE À JOUR D'UN EMPLOYÉ
//   // ========================================

//   const handleUpdate = async () => {
//     if (!selectedEmployee) return;

//     try {
//       // --- 1. Mise à jour des informations personnelles ---
//       const persoDataToUpdate = {
//         numero_matricule: formData.numero_matricule || "",
//         nom: formData.nom || "",
//         prenoms: formData.prenoms || "",
//         sexe: formData.sexe || "",
//         appellation: formData.appellation || "",
//         fonction: formData.fonction || "",
//         section: formData.section || "",
//         date_naissance: formData.date_naissance || null,
//         lieu_naissance: formData.lieu_naissance || "",
//         CIN: formData.CIN || "",
//         date_CIN: formData.date_CIN || null,
//         lieu_CIN: formData.lieu_CIN || "",
//         numero_cnaps: formData.numero_cnaps || "",
//         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
//         pere: formData.pere || "",
//         mere: formData.mere || "",
//         adresse: formData.adresse || "",
//         quartier: formData.quartier || "",
//         telephone: formData.telephone || "",
//         email: formData.email || "",
//       };

//       await updateEmployee(selectedEmployee.id, persoDataToUpdate);

//       // --- 2. Mise à jour ou création des informations bancaires ---
//       if (formData.bancaire) {
//         const bancaireData = {
//           nom_banque: formData.bancaire.nom_banque || "",
//           code_banque: formData.bancaire.code_banque || "",
//           code_agence: formData.bancaire.code_agence || "",
//           numero_compte: formData.bancaire.numero_compte || "",
//           cle_rib: formData.bancaire.cle_rib || "",
//           banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
//           employe: selectedEmployee.id,
//         };

//         if (formData.bancaire.id) {
//           await updateBancaire(formData.bancaire.id, bancaireData);
//         } else if (bancaireData.nom_banque || bancaireData.numero_compte) {
//           await createBancaire(bancaireData);
//         }
//       }

//       // --- 3. Mise à jour ou création des informations de salaire ---
//       if (formData.salaire_personnel) {
//         const salaireData = {
//           date_embauche: formData.salaire_personnel.date_embauche || null,
//           fonction: formData.salaire_personnel.fonction || "",
//           categorie: formData.salaire_personnel.categorie || "",
//           salaire: formData.salaire_personnel.salaire || "",
//           section: formData.salaire_personnel.section || "",
//           responsable_section:
//             formData.salaire_personnel.responsable_section || "",
//           prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
//           indemnite_deplacement:
//             formData.salaire_personnel.indemnite_deplacement || "",
//           dernier_aug_indice:
//             formData.salaire_personnel.dernier_aug_indice || "",
//           pour_30: formData.salaire_personnel.pour_30 || "",
//           T1_17: formData.salaire_personnel.T1_17 || "",
//           T2_17: formData.salaire_personnel.T2_17 || "",
//           T3_17: formData.salaire_personnel.T3_17 || "",
//           T4_17: formData.salaire_personnel.T4_17 || "",
//           obs_prime: formData.salaire_personnel.obs_prime || "",
//           employe: selectedEmployee.id,
//         };

//         if (formData.salaire_personnel.id) {
//           await updateSalaire(formData.salaire_personnel.id, salaireData);
//         } else if (salaireData.salaire || salaireData.fonction) {
//           await createSalaire(salaireData);
//         }
//       }

//       // --- 4. Mise à jour ou création des informations familiales ---
//       if (formData.familiale) {
//         // Gestion de la date de naissance du conjoint
//         let epouxDateNaissance = formData.familiale.epoux_date_naissance;
//         if (Array.isArray(epouxDateNaissance)) {
//           epouxDateNaissance = epouxDateNaissance[0] || null;
//         }

//         const familialeData = {
//           epoux_nom: formData.familiale.epoux_nom || "",
//           epoux_prenoms: formData.familiale.epoux_prenoms || "",
//           epoux_date_naissance: epouxDateNaissance,
//           epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
//           epoux_societe: formData.familiale.epoux_societe || "",
//           epoux_fonction: formData.familiale.epoux_fonction || "",
//           enfants: formData.familiale.enfants || [],
//           employe: selectedEmployee.id,
//         };

//         if (formData.familiale.id) {
//           await updateFamiliale(formData.familiale.id, familialeData);
//         } else if (
//           familialeData.epoux_nom ||
//           familialeData.enfants.length > 0
//         ) {
//           await createFamiliale(familialeData);
//         }
//       }

//       // --- 5. Rafraîchir la liste et fermer le formulaire ---
//       await fetchEmployees();
//       setEditMode(false);
//       setSelectedEmployee(null);
//       resetForm();

//       // Message de succès
//       alert("Employé mis à jour avec succès !");
//     } catch (error) {
//       console.error(
//         "Erreur lors de la mise à jour :",
//         error.response?.data || error
//       );
//       alert(
//         "Erreur lors de la mise à jour. Vérifiez les champs obligatoires !"
//       );
//     }
//   };

//   // ========================================
//   // GESTION DE L'AJOUT D'UN NOUVEL EMPLOYÉ
//   // ========================================

//   const handleAdd = async () => {
//     try {
//       console.log("=== DÉBUT handleAdd ===");
//       console.log("formData:", formData);

//       // --- 1. Validation des champs obligatoires ---
//       if (!formData.numero_matricule || !formData.nom || !formData.prenoms) {
//         const missingFields = [];
//         if (!formData.numero_matricule) missingFields.push("Matricule");
//         if (!formData.nom) missingFields.push("Nom");
//         if (!formData.prenoms) missingFields.push("Prénoms");

//         alert(`Champs obligatoires manquants : ${missingFields.join(", ")}`);
//         return;
//       }

//       // --- 2. Préparation des données personnelles ---
//       const persoData = {
//         numero_matricule: formData.numero_matricule,
//         nom: formData.nom,
//         prenoms: formData.prenoms,
//         sexe: formData.sexe || "",
//         appellation: formData.appellation || "",
//         fonction: formData.fonction || "",
//         section: formData.section || "",
//         date_naissance: formData.date_naissance || null,
//         lieu_naissance: formData.lieu_naissance || "",
//         CIN: formData.CIN || "",
//         date_CIN: formData.date_CIN || null,
//         lieu_CIN: formData.lieu_CIN || "",
//         numero_cnaps: formData.numero_cnaps || "",
//         ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
//         pere: formData.pere || "",
//         mere: formData.mere || "",
//         adresse: formData.adresse || "",
//         quartier: formData.quartier || "",
//         telephone: formData.telephone || "",
//         email: formData.email || "",
//       };

//       console.log("Données personnelles à envoyer:", persoData);

//       // --- 3. Création de l'employé dans la base ---
//       console.log("Appel à createEmployee...");
//       const newEmp = await createEmployee(persoData);
//       console.log("Employé créé avec succès:", newEmp);

//       // --- 4. Création des informations bancaires (si renseignées) ---
//       if (
//         formData.bancaire &&
//         (formData.bancaire.nom_banque || formData.bancaire.numero_compte)
//       ) {
//         try {
//           console.log("Création informations bancaires...");
//           await createBancaire({
//             nom_banque: formData.bancaire.nom_banque || "",
//             code_banque: formData.bancaire.code_banque || "",
//             code_agence: formData.bancaire.code_agence || "",
//             numero_compte: formData.bancaire.numero_compte || "",
//             cle_rib: formData.bancaire.cle_rib || "",
//             banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
//             employe: newEmp.id,
//           });
//           console.log("Informations bancaires créées avec succès");
//         } catch (bancaireError) {
//           console.error("Erreur création bancaire:", bancaireError);
//         }
//       }

//       // --- 5. Création des informations de salaire (si renseignées) ---
//       if (formData.salaire_personnel) {
//         try {
//           console.log("Création informations salaire...");
//           await createSalaire({
//             date_embauche: formData.salaire_personnel.date_embauche || null,
//             fonction: formData.salaire_personnel.fonction || "",
//             categorie: formData.salaire_personnel.categorie || "",
//             salaire: formData.salaire_personnel.salaire || "",
//             section: formData.salaire_personnel.section || "",
//             responsable_section:
//               formData.salaire_personnel.responsable_section || "",
//             prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
//             indemnite_deplacement:
//               formData.salaire_personnel.indemnite_deplacement || "",
//             dernier_aug_indice:
//               formData.salaire_personnel.dernier_aug_indice || "",
//             pour_30: formData.salaire_personnel.pour_30 || "",
//             T1_17: formData.salaire_personnel.T1_17 || "",
//             T2_17: formData.salaire_personnel.T2_17 || "",
//             T3_17: formData.salaire_personnel.T3_17 || "",
//             T4_17: formData.salaire_personnel.T4_17 || "",
//             obs_prime: formData.salaire_personnel.obs_prime || "",
//             employe: newEmp.id,
//           });
//           console.log("Informations salaire créées avec succès");
//         } catch (salaireError) {
//           console.error("Erreur création salaire:", salaireError);
//         }
//       }

//       // --- 6. Création des informations familiales (si renseignées) ---
//       if (
//         formData.familiale &&
//         (formData.familiale.epoux_nom || formData.familiale.enfants?.length > 0)
//       ) {
//         try {
//           console.log("Création informations familiales...");
//           let epouxDateNaissance = formData.familiale.epoux_date_naissance;
//           if (Array.isArray(epouxDateNaissance)) {
//             epouxDateNaissance = epouxDateNaissance[0] || null;
//           }

//           await createFamiliale({
//             epoux_nom: formData.familiale.epoux_nom || "",
//             epoux_prenoms: formData.familiale.epoux_prenoms || "",
//             epoux_date_naissance: epouxDateNaissance,
//             epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
//             epoux_societe: formData.familiale.epoux_societe || "",
//             epoux_fonction: formData.familiale.epoux_fonction || "",
//             enfants: formData.familiale.enfants || [],
//             employe: newEmp.id,
//           });
//           console.log("Informations familiales créées avec succès");
//         } catch (familialeError) {
//           console.error("Erreur création familiale:", familialeError);
//         }
//       }

//       // --- 7. Rafraîchir la liste et fermer le formulaire ---
//       console.log("Rafraîchissement de la liste...");
//       await fetchEmployees();
//       setShowForm(false);
//       setEditMode(false);
//       resetForm();

//       console.log("=== FIN handleAdd - SUCCÈS ===");
//       alert("Employé créé avec succès !");
//     } catch (error) {
//       console.error("=== ERREUR handleAdd ===");
//       console.error("Erreur complète:", error);
//       console.error("Réponse API:", error.response?.data);
//       console.error("Status:", error.response?.status);

//       alert(
//         `Erreur lors de la création: ${
//           error.response?.data?.message || error.message || "Erreur inconnue"
//         }`
//       );
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
//       try {
//         await deleteEmployee(id);
//         fetchEmployees();
//         setSelectedEmployee(null);
//       } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//       }
//     }
//   };

//   // ========================================
//   // RÉINITIALISATION DU FORMULAIRE
//   // ========================================

//   /**
//    * Réinitialise toutes les données du formulaire
//    */
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
//       quartier: "",
//       adresse: "",
//       telephone: "",
//       email: "",
//       bancaire: {
//         id: null,
//         nom_banque: "",
//         code_banque: "",
//         code_agence: "",
//         numero_compte: "",
//         cle_rib: "",
//         banque_beneficiaire: "",
//       },
//       salaire_personnel: {
//         id: null,
//         date_embauche: "",
//         fonction: "",
//         categorie: "",
//         salaire: "",
//         section: "",
//         responsable_section: "",
//         prime_anciennete: "",
//         indemnite_deplacement: "",
//         dernier_aug_indice: "",
//         pour_30: "",
//         T1_17: "",
//         T2_17: "",
//         T3_17: "",
//         T4_17: "",
//         obs_prime: "",
//       },
//       familiale: {
//         id: null,
//         epoux_nom: "",
//         epoux_prenoms: "",
//         epoux_date_naissance: "",
//         epoux_lieu_naissance: "",
//         epoux_societe: "",
//         epoux_fonction: "",
//         enfants: [],
//       },
//     });
//   };

//   // ========================================
//   // RENDU DE LA PAGE
//   // ========================================

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* ==========================================
//           HEADER FIXE - TOUJOURS VISIBLE
//           ========================================== */}
//       <div className="bg-white border-b sticky top-0 z-10">
//         <div className="px-6 py-4">
//           <h1 className="text-2xl font-medium text-gray-800">
//             Gestion des Employés
//           </h1>
//         </div>
//       </div>

//       <div className="p-6">
//         {/* ==========================================
//             LISTE DES EMPLOYÉS
//             ========================================== */}
//         {!selectedEmployee && !showForm && (
//           <div className="bg-white rounded-lg shadow-sm">
//             {/* ==========================================
//                 EN-TÊTE : TITRE + RECHERCHE + BOUTON AJOUT
//                 ========================================== */}
//             <div className="flex items-center justify-between px-6 py-4">
//               <h2 className="text-lg font-medium text-gray-800">
//                 Liste des Employés
//               </h2>

//               {/* <div className="flex flex-col sm:flex-row gap-3 items-center"> */}
//               {/* Barre de recherche */}
//               {/* <div className="relative flex-1 w-full">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Rechercher par nom, prénom ou matricule..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
//                   />
//                 </div> */}
//               <div className="flex items-center gap-3">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     placeholder="Rechercher..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50"
//                   />
//                 </div>

//                 {/* Bouton "Nouvel employé" */}
//                 <button
//                   onClick={() => {
//                     setShowForm(true);
//                     setEditMode(true);
//                     setSelectedEmployee(null);
//                     resetForm();
//                   }}
//                   className="flex items-center gap-2 px-5 py-2.5 bg-akj text-white rounded-md transition text-sm font-medium whitespace-nowrap w-full sm:w-auto justify-center"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Nouvel employé
//                 </button>
//               </div>
//             </div>

//             {/* ==========================================
//                 TABLEAU DES EMPLOYÉS
//                 ========================================== */}
//             <div className="overflow-x-auto">
//               {/* <table className="w-full"> */}
//               <table className="w-full border-collapse">
//                 {/* <thead className="bg-gray-50 border-b"> */}
//                 <thead className="bg-[#f0f0f0] text-gray-600 text-sm">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       N° Matricule
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Employé
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Appellation
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Fonction
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Section
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 {/* <tbody className="bg-white divide-y divide-gray-200"> */}
//                 <tbody className="text-sm divide-y divide-gray-100">
//                   {currentItems.map((emp) => (
//                     // <tr key={emp.id} className="hover:bg-gray-50 transition">
//                     <tr
//                       key={emp.id}
//                       className="hover:bg-[#fafafa] transition cursor-pointer"
//                     >
//                       {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {emp.numero_matricule}
//                       </td> */}
//                       <td className="px-5 py-3">{emp.numero_matricule}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {emp.nom} {emp.prenoms}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {emp.appellation || "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {emp.fonction || "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {emp.section || "-"}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex items-center gap-2">
//                           <button
//                             onClick={() => {
//                               setSelectedEmployee(emp);
//                               setFormData(initFormData(emp));
//                               setEditMode(false);
//                             }}
//                             className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
//                             title="Voir détails"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setSelectedEmployee(emp);
//                               setFormData(initFormData(emp));
//                               setEditMode(true);
//                             }}
//                             className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
//                             title="Éditer"
//                           >
//                             <Edit2 className="w-4 h-4" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(emp.id)}
//                             className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
//                             title="Supprimer"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* ==========================================
//                 PAGINATION
//                 ========================================== */}
//             {filteredEmployees.length > 0 && (
//               <div className="px-6 py-4 border-t bg-gray-50">
//                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                   {/* Sélecteur d'éléments par page */}
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-600">Afficher</span>
//                     <select
//                       value={itemsPerPage}
//                       onChange={(e) => {
//                         setItemsPerPage(Number(e.target.value));
//                         setCurrentPage(1);
//                       }}
//                       className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
//                     >
//                       <option value={5}>5</option>
//                       <option value={10}>10</option>
//                       <option value={20}>20</option>
//                       <option value={50}>50</option>
//                     </select>
//                     <span className="text-sm text-gray-600">éléments</span>
//                   </div>

//                   {/* Informations de pagination */}
//                   <div className="text-sm text-gray-600">
//                     {indexOfFirstItem + 1}-
//                     {Math.min(indexOfLastItem, filteredEmployees.length)}
//                     sur {filteredEmployees.length} employé(s)
//                   </div>

//                   {/* Contrôles de pagination */}
//                   <div className="flex items-center gap-1">
//                     {/* Bouton Précédent */}
//                     <button
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//                       title="Page précédente"
//                     >
//                       <ChevronLeft className="w-4 h-4" />
//                     </button>

//                     {/* Numéros de page */}
//                     {getPageNumbers().map((pageNumber, index) => (
//                       <button
//                         key={index}
//                         onClick={() =>
//                           typeof pageNumber === "number" &&
//                           handlePageChange(pageNumber)
//                         }
//                         disabled={pageNumber === "..."}
//                         className={`min-w-[40px] px-3 py-2 border text-sm rounded ${
//                           pageNumber === currentPage
//                             ? "bg-purple-600 text-white border-purple-600"
//                             : pageNumber === "..."
//                             ? "border-transparent text-gray-400 cursor-default"
//                             : "border-gray-300 text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     ))}

//                     {/* Bouton Suivant */}
//                     <button
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//                       title="Page suivante"
//                     >
//                       <ChevronRight className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ==========================================
//                 MESSAGE SI AUCUN RÉSULTAT
//                 ========================================== */}
//             {filteredEmployees.length === 0 && (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-sm">
//                   {searchTerm
//                     ? "Aucun employé trouvé pour cette recherche"
//                     : "Aucun employé dans la base de données"}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ==========================================
//             AFFICHAGE DU BLOC EMPLOYÉ
//             ========================================== */}
//         {(selectedEmployee || showForm) && (
//           <div className="bg-white rounded-lg shadow-sm">
//             <EmployeeBlock
//               employee={selectedEmployee}
//               formData={formData}
//               setFormData={setFormData}
//               onSubmit={() => {
//                 console.log("Bouton cliqué !");
//                 if (editMode && selectedEmployee) {
//                   handleUpdate();
//                 } else {
//                   handleAdd();
//                 }
//               }}
//               onCancel={() => {
//                 setShowForm(false);
//                 setEditMode(false);
//                 setSelectedEmployee(null);
//                 resetForm();
//               }}
//               editMode={editMode}
//             />
//           </div>
//         )}
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
} from "../../services/employeeService";

const EmployeesPage = () => {
  // ========================================
  // ÉTATS LOCAUX
  // ========================================

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table");

  // ========================================
  // ÉTATS PAGINATION
  // ========================================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ========================================
  // CHARGEMENT INITIAL DES DONNÉES
  // ========================================

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setEmployees(sortedData);
    } catch (error) {
      console.error("Erreur lors du chargement des employés :", error);
    }
  };

  // ========================================
  // CALCULS PAGINATION
  // ========================================

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.prenoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.numero_matricule?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // ========================================
  // INITIALISATION DU FORMULAIRE
  // ========================================

  const initFormData = (emp) => ({
    ...emp,
    bancaire: emp.bancaire || {
      id: null,
      nom_banque: "",
      numero_compte: "",
      cle_rib: "",
      banque_beneficiaire: "",
    },
    salaire_personnel: emp.salaire_personnel || {
      id: null,
      date_embauche: "",
      fonction: "",
      categorie: "",
      salaire: "",
      section: "",
      responsable_section: "",
      prime_anciennete: "",
      indemnite_deplacement: "",
      dernier_aug_indice: "",
      pour_30: "",
      T1_17: "",
      T2_17: "",
      T3_17: "",
      T4_17: "",
      obs_prime: "",
    },
    familiale: emp.familiale || {
      id: null,
      epoux_nom: "",
      epoux_prenoms: "",
      epoux_date_naissance: "",
      epoux_lieu_naissance: "",
      epoux_societe: "",
      epoux_fonction: "",
      enfants: [],
    },
  });

  // ========================================
  // GESTION DES ACTIONS
  // ========================================

  const handleUpdate = async () => {
    if (!selectedEmployee) return;

    try {
      const persoDataToUpdate = {
        numero_matricule: formData.numero_matricule || "",
        nom: formData.nom || "",
        prenoms: formData.prenoms || "",
        sexe: formData.sexe || "",
        appellation: formData.appellation || "",
        fonction: formData.fonction || "",
        section: formData.section || "",
        date_naissance: formData.date_naissance || null,
        lieu_naissance: formData.lieu_naissance || "",
        CIN: formData.CIN || "",
        date_CIN: formData.date_CIN || null,
        lieu_CIN: formData.lieu_CIN || "",
        numero_cnaps: formData.numero_cnaps || "",
        ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
        pere: formData.pere || "",
        mere: formData.mere || "",
        adresse: formData.adresse || "",
        quartier: formData.quartier || "",
        telephone: formData.telephone || "",
        email: formData.email || "",
      };

      await updateEmployee(selectedEmployee.id, persoDataToUpdate);

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

        if (formData.bancaire.id) {
          await updateBancaire(formData.bancaire.id, bancaireData);
        } else if (bancaireData.nom_banque || bancaireData.numero_compte) {
          await createBancaire(bancaireData);
        }
      }

      if (formData.salaire_personnel) {
        const salaireData = {
          date_embauche: formData.salaire_personnel.date_embauche || null,
          fonction: formData.salaire_personnel.fonction || "",
          categorie: formData.salaire_personnel.categorie || "",
          salaire: formData.salaire_personnel.salaire || "",
          section: formData.salaire_personnel.section || "",
          responsable_section:
            formData.salaire_personnel.responsable_section || "",
          prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
          indemnite_deplacement:
            formData.salaire_personnel.indemnite_deplacement || "",
          dernier_aug_indice:
            formData.salaire_personnel.dernier_aug_indice || "",
          pour_30: formData.salaire_personnel.pour_30 || "",
          T1_17: formData.salaire_personnel.T1_17 || "",
          T2_17: formData.salaire_personnel.T2_17 || "",
          T3_17: formData.salaire_personnel.T3_17 || "",
          T4_17: formData.salaire_personnel.T4_17 || "",
          obs_prime: formData.salaire_personnel.obs_prime || "",
          employe: selectedEmployee.id,
        };

        if (formData.salaire_personnel.id) {
          await updateSalaire(formData.salaire_personnel.id, salaireData);
        } else if (salaireData.salaire || salaireData.fonction) {
          await createSalaire(salaireData);
        }
      }

      if (formData.familiale) {
        let epouxDateNaissance = formData.familiale.epoux_date_naissance;
        if (Array.isArray(epouxDateNaissance)) {
          epouxDateNaissance = epouxDateNaissance[0] || null;
        }

        const familialeData = {
          epoux_nom: formData.familiale.epoux_nom || "",
          epoux_prenoms: formData.familiale.epoux_prenoms || "",
          epoux_date_naissance: epouxDateNaissance,
          epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
          epoux_societe: formData.familiale.epoux_societe || "",
          epoux_fonction: formData.familiale.epoux_fonction || "",
          enfants: formData.familiale.enfants || [],
          employe: selectedEmployee.id,
        };

        if (formData.familiale.id) {
          await updateFamiliale(formData.familiale.id, familialeData);
        } else if (
          familialeData.epoux_nom ||
          familialeData.enfants.length > 0
        ) {
          await createFamiliale(familialeData);
        }
      }

      await fetchEmployees();
      setEditMode(false);
      setSelectedEmployee(null);
      resetForm();
      alert("Employé mis à jour avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour :",
        error.response?.data || error
      );
      alert(
        "Erreur lors de la mise à jour. Vérifiez les champs obligatoires !"
      );
    }
  };

  const handleAdd = async () => {
    try {
      if (!formData.numero_matricule || !formData.nom || !formData.prenoms) {
        const missingFields = [];
        if (!formData.numero_matricule) missingFields.push("Matricule");
        if (!formData.nom) missingFields.push("Nom");
        if (!formData.prenoms) missingFields.push("Prénoms");
        alert(`Champs obligatoires manquants : ${missingFields.join(", ")}`);
        return;
      }

      const persoData = {
        numero_matricule: formData.numero_matricule,
        nom: formData.nom,
        prenoms: formData.prenoms,
        sexe: formData.sexe || "",
        appellation: formData.appellation || "",
        fonction: formData.fonction || "",
        section: formData.section || "",
        date_naissance: formData.date_naissance || null,
        lieu_naissance: formData.lieu_naissance || "",
        CIN: formData.CIN || "",
        date_CIN: formData.date_CIN || null,
        lieu_CIN: formData.lieu_CIN || "",
        numero_cnaps: formData.numero_cnaps || "",
        ancien_numero_journaliere: formData.ancien_numero_journaliere || "",
        pere: formData.pere || "",
        mere: formData.mere || "",
        adresse: formData.adresse || "",
        quartier: formData.quartier || "",
        telephone: formData.telephone || "",
        email: formData.email || "",
      };

      const newEmp = await createEmployee(persoData);

      if (
        formData.bancaire &&
        (formData.bancaire.nom_banque || formData.bancaire.numero_compte)
      ) {
        try {
          await createBancaire({
            nom_banque: formData.bancaire.nom_banque || "",
            code_banque: formData.bancaire.code_banque || "",
            code_agence: formData.bancaire.code_agence || "",
            numero_compte: formData.bancaire.numero_compte || "",
            cle_rib: formData.bancaire.cle_rib || "",
            banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
            employe: newEmp.id,
          });
        } catch (bancaireError) {
          console.error("Erreur création bancaire:", bancaireError);
        }
      }

      if (formData.salaire_personnel) {
        try {
          await createSalaire({
            date_embauche: formData.salaire_personnel.date_embauche || null,
            fonction: formData.salaire_personnel.fonction || "",
            categorie: formData.salaire_personnel.categorie || "",
            salaire: formData.salaire_personnel.salaire || "",
            section: formData.salaire_personnel.section || "",
            responsable_section:
              formData.salaire_personnel.responsable_section || "",
            prime_anciennete: formData.salaire_personnel.prime_anciennete || "",
            indemnite_deplacement:
              formData.salaire_personnel.indemnite_deplacement || "",
            dernier_aug_indice:
              formData.salaire_personnel.dernier_aug_indice || "",
            pour_30: formData.salaire_personnel.pour_30 || "",
            T1_17: formData.salaire_personnel.T1_17 || "",
            T2_17: formData.salaire_personnel.T2_17 || "",
            T3_17: formData.salaire_personnel.T3_17 || "",
            T4_17: formData.salaire_personnel.T4_17 || "",
            obs_prime: formData.salaire_personnel.obs_prime || "",
            employe: newEmp.id,
          });
        } catch (salaireError) {
          console.error("Erreur création salaire:", salaireError);
        }
      }

      if (
        formData.familiale &&
        (formData.familiale.epoux_nom || formData.familiale.enfants?.length > 0)
      ) {
        try {
          let epouxDateNaissance = formData.familiale.epoux_date_naissance;
          if (Array.isArray(epouxDateNaissance)) {
            epouxDateNaissance = epouxDateNaissance[0] || null;
          }

          await createFamiliale({
            epoux_nom: formData.familiale.epoux_nom || "",
            epoux_prenoms: formData.familiale.epoux_prenoms || "",
            epoux_date_naissance: epouxDateNaissance,
            epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
            epoux_societe: formData.familiale.epoux_societe || "",
            epoux_fonction: formData.familiale.epoux_fonction || "",
            enfants: formData.familiale.enfants || [],
            employe: newEmp.id,
          });
        } catch (familialeError) {
          console.error("Erreur création familiale:", familialeError);
        }
      }

      await fetchEmployees();
      setShowForm(false);
      setEditMode(false);
      resetForm();
      alert("Employé créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      alert(
        `Erreur lors de la création: ${
          error.response?.data?.message || error.message || "Erreur inconnue"
        }`
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
        setSelectedEmployee(null);
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
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
      quartier: "",
      adresse: "",
      telephone: "",
      email: "",
      bancaire: {
        id: null,
        nom_banque: "",
        code_banque: "",
        code_agence: "",
        numero_compte: "",
        cle_rib: "",
        banque_beneficiaire: "",
      },
      salaire_personnel: {
        id: null,
        date_embauche: "",
        fonction: "",
        categorie: "",
        salaire: "",
        section: "",
        responsable_section: "",
        prime_anciennete: "",
        indemnite_deplacement: "",
        dernier_aug_indice: "",
        pour_30: "",
        T1_17: "",
        T2_17: "",
        T3_17: "",
        T4_17: "",
        obs_prime: "",
      },
      familiale: {
        id: null,
        epoux_nom: "",
        epoux_prenoms: "",
        epoux_date_naissance: "",
        epoux_lieu_naissance: "",
        epoux_societe: "",
        epoux_fonction: "",
        enfants: [],
      },
    });
  };

  // ========================================
  // RENDU DE LA PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER FIXE */}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Gestion des Employés
      </h1>

      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        {/* LISTE DES EMPLOYÉS */}
        {!selectedEmployee && !showForm && (
          <div className="bg-white rounded-lg shadow-sm">
            {/* EN-TÊTE */}
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-medium text-gray-800">
                Liste des Employés
              </h2>

              <div className="flex items-center gap-3">
                {/* Sélecteur de vue */}
                <div className="flex bg-gray-100 rounded-md p-1">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded ${
                      viewMode === "table"
                        ? "bg-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="Vue tableur"
                  >
                    <Table className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    title="Vue carte"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>

                {/* Barre de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-400 focus:outline-none bg-gray-50"
                  />
                </div>

                {/* Bouton "Nouvel employé" */}
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditMode(true);
                    setSelectedEmployee(null);
                    resetForm();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-akj text-white rounded-md transition text-sm font-medium whitespace-nowrap w-full sm:w-auto justify-center"
                >
                  <Plus className="w-4 h-4" />
                  Nouvel employé
                </button>
              </div>
            </div>

            {/* VUE TABLEAU */}
            {viewMode === "table" && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-[#f0f0f0] text-gray-600 text-sm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N° Matricule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appellation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fonction
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Section
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="text-sm divide-y divide-gray-100">
                    {currentItems.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-[#fafafa] transition cursor-pointer"
                      >
                        <td className="px-5 py-3">{emp.numero_matricule}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {emp.nom} {emp.prenoms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {emp.appellation || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {emp.fonction || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {emp.section || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setFormData(initFormData(emp));
                                setEditMode(false);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Voir détails"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setFormData(initFormData(emp));
                                setEditMode(true);
                              }}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition"
                              title="Éditer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VUE CARTES STYLE ODOO SIMPLIFIÉ */}
            {viewMode === "grid" && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentItems.map((emp) => (
                    <div
                      key={emp.id}
                      className="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200"
                    >
                      {/* En-tête avec numéro matricule */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {emp.numero_matricule}
                          </span>
                        </div>
                      </div>

                      {/* Corps de la carte */}
                      <div className="p-4">
                        {/* Nom et prénom */}
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {emp.nom} {emp.prenoms}
                          </h3>
                        </div>

                        {/* Section et fonction */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-gray-500">Section</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {emp.section || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Fonction</p>
                            <p className="text-sm text-gray-900">
                              {emp.fonction || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setFormData(initFormData(emp));
                              setEditMode(false);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Voir détails
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedEmployee(emp);
                                setFormData(initFormData(emp));
                                setEditMode(true);
                              }}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                              title="Éditer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(emp.id)}
                              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition"
                              title="Supprimer"
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

            {/* PAGINATION */}
            {filteredEmployees.length > 0 && (
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Afficher</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">éléments</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, filteredEmployees.length)}
                    sur {filteredEmployees.length} employé(s)
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      title="Page précédente"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {getPageNumbers().map((pageNumber, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof pageNumber === "number" &&
                          handlePageChange(pageNumber)
                        }
                        disabled={pageNumber === "..."}
                        className={`min-w-[40px] px-3 py-2 border text-sm rounded ${
                          pageNumber === currentPage
                            ? "bg-akj text-white border-gray-600"
                            : pageNumber === "..."
                            ? "border-transparent text-gray-400 cursor-default"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      title="Page suivante"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MESSAGE SI AUCUN RÉSULTAT */}
            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">
                  {searchTerm
                    ? "Aucun employé trouvé pour cette recherche"
                    : "Aucun employé dans la base de données"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* AFFICHAGE DU BLOC EMPLOYÉ */}
        {(selectedEmployee || showForm) && (
          <div className="bg-white rounded-lg shadow-sm">
            <EmployeeBlock
              employee={selectedEmployee}
              formData={formData}
              setFormData={setFormData}
              onSubmit={() => {
                if (editMode && selectedEmployee) {
                  handleUpdate();
                } else {
                  handleAdd();
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditMode(false);
                setSelectedEmployee(null);
                resetForm();
              }}
              editMode={editMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
