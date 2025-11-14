// // // import React, { useState } from "react";
// // // import "/src/styles/custom.css";
// // // import { ArrowLeft, User, Briefcase, CreditCard, Users } from "lucide-react";

// // // const EmployeeBlock = ({
// // //   employee,
// // //   formData,
// // //   setFormData,
// // //   onSubmit,
// // //   onCancel,
// // //   editMode,
// // // }) => {
// // //   const [activeTab, setActiveTab] = useState("personnel");

// // //   const tabs = [
// // //     { id: "personnel", label: "Informations Personnelles", icon: User },
// // //     { id: "salaire", label: "Informations Salaire", icon: Briefcase },
// // //     { id: "bancaire", label: "Informations Bancaires", icon: CreditCard },
// // //     { id: "familiale", label: "Informations Familiales", icon: Users },
// // //   ];

// // //   const data = formData || employee || {};

// // //   // Fonctions de gestion des changements
// // //   const handleSectionChange = (section, field, value) => {
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [section]: {
// // //         ...(prev?.[section] || {}),
// // //         [field]: value,
// // //       },
// // //     }));
// // //   };

// // //   const handlePersonalChange = (field, value) => {
// // //     setFormData((prev) => ({
// // //       ...prev,
// // //       [field]: value,
// // //     }));
// // //   };

// // //   const isViewMode = !editMode && employee;
// // //   // NOUVEAU : Mode ajout = afficher tout en une page
// // //   const isAddMode = editMode && !employee;

// // //   return (
// // //     <div className="bg-white">
// // //       {/* En-tête */}
// // //       {isViewMode ? (
// // //         <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
// // //           <button
// // //             type="button"
// // //             onClick={onCancel}
// // //             className="p-2 hover:bg-gray-100 rounded-full transition"
// // //           >
// // //             <ArrowLeft className="w-5 h-5 text-gray-600" />
// // //           </button>
// // //           <div>
// // //             <h2 className="text-xl font-medium text-gray-800">
// // //               {data.nom || ""} {data.prenoms || ""}
// // //             </h2>
// // //             <p className="text-sm text-gray-500">
// // //               N° {data.numero_matricule || ""}
// // //             </p>
// // //           </div>
// // //         </div>
// // //       ) : (
// // //         <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
// // //           <button
// // //             type="button"
// // //             onClick={onCancel}
// // //             className="p-2 hover:bg-gray-100 rounded-full transition"
// // //           >
// // //             <ArrowLeft className="w-5 h-5 text-gray-600" />
// // //           </button>
// // //           <div>
// // //             <h2 className="text-xl font-medium text-gray-800">
// // //               {employee ? "Modifier l'employé" : "Nouvel employé"}
// // //             </h2>
// // //             {employee && (
// // //               <p className="text-sm text-gray-500">
// // //                 {data.nom || ""} {data.prenoms || ""} - N°{" "}
// // //                 {data.numero_matricule || ""}
// // //               </p>
// // //             )}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Navigation par onglets - MASQUÉE EN MODE AJOUT */}
// // //       {!isAddMode && (
// // //         <div className="border-b bg-gray-100">
// // //           <div className="grid grid-cols-4">
// // //             {tabs.map((tab) => {
// // //               const Icon = tab.icon;
// // //               return (
// // //                 <button
// // //                   key={tab.id}
// // //                   type="button"
// // //                   onClick={() => setActiveTab(tab.id)}
// // //                   className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
// // //                     activeTab === tab.id
// // //                       ? "border-gray-600 text-gray-600 bg-white"
// // //                       : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
// // //                   }`}
// // //                 >
// // //                   <Icon className="w-4 h-4" />
// // //                   <span className="text-sm font-medium">{tab.label}</span>
// // //                 </button>
// // //               );
// // //             })}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Contenu - EN MODE AJOUT, TOUT EST VISIBLE */}
// // //       <div className="p-6 space-y-8">
// // //         {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
// // //         {(isAddMode || activeTab === "personnel") && (
// // //           <div className="bg-gray-100 p-6 m-4 rounded-lg shadow-sm">
// // //             {isAddMode && (
// // //               <div className="flex items-center gap-2 mb-4 pb-3 border-b">
// // //                 <User className="w-5 h-5 text-gray-600" />
// // //                 <h3 className="text-lg font-medium text-gray-800">
// // //                   Informations Personnelles
// // //                 </h3>
// // //               </div>
// // //             )}
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //               {/* Colonne 1 */}
// // //               <div className="space-y-4">
// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     N° Matricule *
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.numero_matricule || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("numero_matricule", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.numero_matricule || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Nom *
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.nom || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("nom", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.nom || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Prénoms *
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.prenoms || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("prenoms", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.prenoms || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Sexe
// // //                   </label>
// // //                   {editMode ? (
// // //                     <select
// // //                       value={data.sexe || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("sexe", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     >
// // //                       <option value="">-- Sélectionnez --</option>
// // //                       <option value="Masculin">Masculin</option>
// // //                       <option value="Féminin">Féminin</option>
// // //                     </select>
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.sexe || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Appellation
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.appellation || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("appellation", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.appellation || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Date de naissance
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="date"
// // //                       value={data.date_naissance || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("date_naissance", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.date_naissance || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Lieu de naissance
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.lieu_naissance || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("lieu_naissance", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.lieu_naissance || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Colonne 2 */}
// // //               <div className="space-y-4">
// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     CIN
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.CIN || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("CIN", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.CIN || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Date CIN
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="date"
// // //                       value={data.date_CIN || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("date_CIN", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.date_CIN || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Lieu CIN
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.lieu_CIN || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("lieu_CIN", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.lieu_CIN || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     N° CNAPS
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.numero_cnaps || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("numero_cnaps", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.numero_cnaps || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Fonction
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.fonction || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("fonction", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.fonction || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Section
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.section || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("section", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.section || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Ancien N° Journalière
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.ancien_numero_journaliere || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange(
// // //                           "ancien_numero_journaliere",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.ancien_numero_journaliere || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Colonne pleine largeur */}

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Père
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.pere || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("pere", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.pere || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Mère
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.mere || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("mere", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.mere || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Téléphone
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.telephone || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("telephone", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.telephone || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Email
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="email"
// // //                       value={data.email || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("email", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.email || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Adresse
// // //                   </label>
// // //                   {editMode ? (
// // //                     <textarea
// // //                       value={data.adresse || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("adresse", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-[40px] resize-none"
// // //                       rows={3}
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
// // //                       {data.adresse || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Quartier
// // //                   </label>
// // //                   {editMode ? (
// // //                     <textarea
// // //                       value={data.quartier || ""}
// // //                       onChange={(e) =>
// // //                         handlePersonalChange("quartier", e.target.value)
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-[40px] resize-none"
// // //                       rows={2}
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
// // //                       {data.quartier || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* SECTION 2 : INFORMATIONS SALAIRE */}
// // //         {(isAddMode || activeTab === "salaire") && (
// // //           <div className="bg-gray-100 p-6 m-4 rounded-lg shadow-sm">
// // //             {isAddMode && (
// // //               <div className="flex items-center gap-2 mb-4 pb-3 border-b">
// // //                 <Briefcase className="w-5 h-5 text-gray-600" />
// // //                 <h3 className="text-lg font-medium text-gray-800">
// // //                   Informations Salaire
// // //                 </h3>
// // //               </div>
// // //             )}
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //               <div className="space-y-4">
// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Date d'embauche
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="date"
// // //                       value={data.salaire_personnel?.date_embauche || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "date_embauche",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.date_embauche || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Fonction
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.salaire_personnel?.fonction || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "fonction",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.fonction || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Catégorie
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.salaire_personnel?.categorie || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "categorie",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.categorie || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Salaire
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="number"
// // //                       value={data.salaire_personnel?.salaire || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "salaire",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.salaire || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               <div className="space-y-4">
// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Section
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.salaire_personnel?.section || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "section",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.section || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Responsable section
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.salaire_personnel?.responsable_section || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "responsable_section",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.responsable_section || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Prime ancienneté
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="number"
// // //                       value={data.salaire_personnel?.prime_anciennete || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "prime_anciennete",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.prime_anciennete || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Indemnité déplacement
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="number"
// // //                       value={
// // //                         data.salaire_personnel?.indemnite_deplacement || ""
// // //                       }
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "salaire_personnel",
// // //                           "indemnite_deplacement",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.salaire_personnel?.indemnite_deplacement || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               <div className="md:col-span-2 flex flex-col">
// // //                 <label className="text-xs font-medium text-gray-600 mb-1">
// // //                   Obs. Prime
// // //                 </label>
// // //                 {editMode ? (
// // //                   <textarea
// // //                     value={data.salaire_personnel?.obs_prime || ""}
// // //                     onChange={(e) =>
// // //                       handleSectionChange(
// // //                         "salaire_personnel",
// // //                         "obs_prime",
// // //                         e.target.value
// // //                       )
// // //                     }
// // //                     className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     rows={3}
// // //                   />
// // //                 ) : (
// // //                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
// // //                     {data.salaire_personnel?.obs_prime || "-"}
// // //                   </span>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* SECTION 3 : INFORMATIONS BANCAIRES */}
// // //         {(isAddMode || activeTab === "bancaire") && (
// // //           <div className="bg-gray-100 p-6 m-4 rounded-lg shadow-sm">
// // //             {isAddMode && (
// // //               <div className="flex items-center gap-2 mb-4 pb-3 border-b">
// // //                 <CreditCard className="w-5 h-5 text-gray-600" />
// // //                 <h3 className="text-lg font-medium text-gray-800">
// // //                   Informations Bancaires
// // //                 </h3>
// // //               </div>
// // //             )}
// // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //               <div className="flex flex-col">
// // //                 <label className="text-xs font-medium text-gray-600 mb-1">
// // //                   Nom de la banque
// // //                 </label>
// // //                 {editMode ? (
// // //                   <input
// // //                     type="text"
// // //                     value={data.bancaire?.nom_banque || ""}
// // //                     onChange={(e) =>
// // //                       handleSectionChange(
// // //                         "bancaire",
// // //                         "nom_banque",
// // //                         e.target.value
// // //                       )
// // //                     }
// // //                     className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                   />
// // //                 ) : (
// // //                   <span className="text-sm text-gray-800 py-2">
// // //                     {data.bancaire?.nom_banque || "-"}
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               <div className="flex flex-col">
// // //                 <label className="text-xs font-medium text-gray-600 mb-1">
// // //                   Code banque
// // //                 </label>
// // //                 {editMode ? (
// // //                   <input
// // //                     type="text"
// // //                     value={data.bancaire?.code_banque || ""}
// // //                     onChange={(e) =>
// // //                       handleSectionChange(
// // //                         "bancaire",
// // //                         "code_banque",
// // //                         e.target.value
// // //                       )
// // //                     }
// // //                     className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                   />
// // //                 ) : (
// // //                   <span className="text-sm text-gray-800 py-2">
// // //                     {data.bancaire?.code_banque || "-"}
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               <div className="flex flex-col">
// // //                 <label className="text-xs font-medium text-gray-600 mb-1">
// // //                   Code agence
// // //                 </label>
// // //                 {editMode ? (
// // //                   <input
// // //                     type="text"
// // //                     value={data.bancaire?.code_agence || ""}
// // //                     onChange={(e) =>
// // //                       handleSectionChange(
// // //                         "bancaire",
// // //                         "code_agence",
// // //                         e.target.value
// // //                       )
// // //                     }
// // //                     className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                   />
// // //                 ) : (
// // //                   <span className="text-sm text-gray-800 py-2">
// // //                     {data.bancaire?.code_agence || "-"}
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               <div className="flex flex-col">
// // //                 <label className="text-xs font-medium text-gray-600 mb-1">
// // //                   N° de compte
// // //                 </label>
// // //                 {editMode ? (
// // //                   <input
// // //                     type="text"
// // //                     value={data.bancaire?.numero_compte || ""}
// // //                     onChange={(e) =>
// // //                       handleSectionChange(
// // //                         "bancaire",
// // //                         "numero_compte",
// // //                         e.target.value
// // //                       )
// // //                     }
// // //                     className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                   />
// // //                 ) : (
// // //                   <span className="text-sm text-gray-800 py-2">
// // //                     {data.bancaire?.numero_compte || "-"}
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               <div className="flex flex-col">
// // //                 <label className="text-xs font-medium text-gray-600 mb-1">
// // //                   Clé RIB
// // //                 </label>
// // //                 {editMode ? (
// // //                   <input
// // //                     type="text"
// // //                     value={data.bancaire?.cle_rib || ""}
// // //                     onChange={(e) =>
// // //                       handleSectionChange("bancaire", "cle_rib", e.target.value)
// // //                     }
// // //                     className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                   />
// // //                 ) : (
// // //                   <span className="text-sm text-gray-800 py-2">
// // //                     {data.bancaire?.cle_rib || "-"}
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               <div className="flex flex-col">
// // //                 <label className="text-xs font-medium text-gray-600 mb-1">
// // //                   Banque bénéficiaire
// // //                 </label>
// // //                 {editMode ? (
// // //                   <input
// // //                     type="text"
// // //                     value={data.bancaire?.banque_beneficiaire || ""}
// // //                     onChange={(e) =>
// // //                       handleSectionChange(
// // //                         "bancaire",
// // //                         "banque_beneficiaire",
// // //                         e.target.value
// // //                       )
// // //                     }
// // //                     className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                   />
// // //                 ) : (
// // //                   <span className="text-sm text-gray-800 py-2">
// // //                     {data.bancaire?.banque_beneficiaire || "-"}
// // //                   </span>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {/* SECTION 4 : INFORMATIONS FAMILIALES */}
// // //         {(isAddMode || activeTab === "familiale") && (
// // //           <div className="bg-gray-100 p-6 m-4 rounded-lg shadow-sm">
// // //             {isAddMode && (
// // //               <div className="flex items-center gap-2 mb-4 pb-3 border-b">
// // //                 <Users className="w-5 h-5 text-gray-600" />
// // //                 <h3 className="text-lg font-medium text-gray-800">
// // //                   Informations Familiales
// // //                 </h3>
// // //               </div>
// // //             )}
// // //             <div className="space-y-6">
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Nom époux/épouse
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.familiale?.epoux_nom || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "familiale",
// // //                           "epoux_nom",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.familiale?.epoux_nom || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Prénoms époux/épouse
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.familiale?.epoux_prenoms || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "familiale",
// // //                           "epoux_prenoms",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.familiale?.epoux_prenoms || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Date naissance
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="date"
// // //                       value={data.familiale?.epoux_date_naissance || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "familiale",
// // //                           "epoux_date_naissance",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.familiale?.epoux_date_naissance || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Lieu naissance
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.familiale?.epoux_lieu_naissance || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "familiale",
// // //                           "epoux_lieu_naissance",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.familiale?.epoux_lieu_naissance || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Société
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.familiale?.epoux_societe || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "familiale",
// // //                           "epoux_societe",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.familiale?.epoux_societe || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>

// // //                 <div className="flex flex-col">
// // //                   <label className="text-xs font-medium text-gray-600 mb-1">
// // //                     Fonction
// // //                   </label>
// // //                   {editMode ? (
// // //                     <input
// // //                       type="text"
// // //                       value={data.familiale?.epoux_fonction || ""}
// // //                       onChange={(e) =>
// // //                         handleSectionChange(
// // //                           "familiale",
// // //                           "epoux_fonction",
// // //                           e.target.value
// // //                         )
// // //                       }
// // //                       className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
// // //                     />
// // //                   ) : (
// // //                     <span className="text-sm text-gray-800 py-2">
// // //                       {data.familiale?.epoux_fonction || "-"}
// // //                     </span>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Enfants - Affichage en mode consultation */}
// // //               {!editMode && (
// // //                 <>
// // //                   {data.enfants && data.enfants.length > 0 ? (
// // //                     <div>
// // //                       <h4 className="text-sm font-medium text-gray-700 mb-3">
// // //                         Enfants
// // //                       </h4>
// // //                       <div className="space-y-2">
// // //                         {data.enfants.map((enfant, idx) => (
// // //                           <div
// // //                             key={idx}
// // //                             className="flex items-center gap-4 p-3 bg-gray-50 rounded"
// // //                           >
// // //                             <span className="text-sm text-gray-800">
// // //                               {enfant.nom_prenoms || "Non renseigné"} -{" "}
// // //                               {enfant.sexe || "Non renseigné"} -{" "}
// // //                               {enfant.date_naissance || "Non renseigné"}
// // //                             </span>
// // //                           </div>
// // //                         ))}
// // //                       </div>
// // //                     </div>
// // //                   ) : (
// // //                     <div className="text-center py-8">
// // //                       <span className="text-sm text-gray-500">
// // //                         Aucun enfant enregistré
// // //                       </span>
// // //                     </div>
// // //                   )}
// // //                 </>
// // //               )}
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Boutons d'action - SEULEMENT EN MODE ÉDITION/AJOUT */}
// // //       {editMode && (
// // //         <div className="border-t bg-gray-50 px-6 py-4 flex gap-3 justify-end sticky bottom-0">
// // //           <button
// // //             type="button"
// // //             onClick={onCancel}
// // //             className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition text-sm"
// // //           >
// // //             Annuler
// // //           </button>

// // //           <button
// // //             type="button"
// // //             onClick={onSubmit}
// // //             className="px-4 py-2 bg-akj text-white rounded transition text-sm font-medium"
// // //           >
// // //             {employee ? "Modifier l'employé" : "Créer l'employé"}
// // //           </button>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeBlock;

// // import React, { useState, useRef } from "react";
// // import "/src/styles/custom.css";
// // import {
// //   ArrowLeft,
// //   User,
// //   Briefcase,
// //   CreditCard,
// //   Users,
// //   Camera,
// //   Plus,
// //   Trash2
// // } from "lucide-react";

// // const EmployeeBlock = ({
// //   employee,
// //   formData,
// //   setFormData,
// //   onSubmit,
// //   onCancel,
// //   editMode,
// // }) => {
// //   const [activeTab, setActiveTab] = useState("personnel");
// //   const fileInputRef = useRef(null);

// //   const tabs = [
// //     { id: "personnel", label: "Informations Personnelles", icon: User },
// //     { id: "salaire", label: "Informations Salaire", icon: Briefcase },
// //     { id: "bancaire", label: "Informations Bancaires", icon: CreditCard },
// //     { id: "familiale", label: "Informations Familiales", icon: Users },
// //   ];

// //   const data = formData || employee || {};

// //   // Fonctions de gestion des changements
// //   const handleSectionChange = (section, field, value) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [section]: {
// //         ...(prev?.[section] || {}),
// //         [field]: value,
// //       },
// //     }));
// //   };

// //   const handlePersonalChange = (field, value) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       [field]: value,
// //     }));
// //   };

// //   // Gestion de la photo
// //   const handlePhotoChange = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       if (file.size > 5 * 1024 * 1024) {
// //         alert("La photo ne doit pas dépasser 5MB");
// //         return;
// //       }

// //       const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
// //       if (!validTypes.includes(file.type)) {
// //         alert("Format de fichier non supporté. Utilisez JPG, JPEG ou PNG.");
// //         return;
// //       }

// //       setFormData((prev) => ({
// //         ...prev,
// //         photo: file,
// //       }));
// //     }
// //   };

// //   const handleRemovePhoto = () => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       photo: null,
// //     }));
// //     if (fileInputRef.current) {
// //       fileInputRef.current.value = '';
// //     }
// //   };

// //   const triggerFileInput = () => {
// //     if (fileInputRef.current) {
// //       fileInputRef.current.click();
// //     }
// //   };

// //   // Gestion des enfants
// //   const handleAddChild = () => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       familiale: {
// //         ...prev.familiale,
// //         enfants: [
// //           ...(prev.familiale?.enfants || []),
// //           {
// //             nom_prenoms: "",
// //             sexe: "",
// //             date_naissance: "",
// //             lieu_naissance: ""
// //           }
// //         ]
// //       }
// //     }));
// //   };

// //   const handleChildChange = (index, field, value) => {
// //     setFormData((prev) => {
// //       const newEnfants = [...(prev.familiale?.enfants || [])];
// //       if (newEnfants[index]) {
// //         newEnfants[index] = {
// //           ...newEnfants[index],
// //           [field]: value
// //         };
// //       }

// //       return {
// //         ...prev,
// //         familiale: {
// //           ...prev.familiale,
// //           enfants: newEnfants
// //         }
// //       };
// //     });
// //   };

// //   const handleRemoveChild = (index) => {
// //     setFormData((prev) => {
// //       const newEnfants = [...(prev.familiale?.enfants || [])];
// //       newEnfants.splice(index, 1);

// //       return {
// //         ...prev,
// //         familiale: {
// //           ...prev.familiale,
// //           enfants: newEnfants
// //         }
// //       };
// //     });
// //   };

// //   // SUPPRIMÉ: const isViewMode = !editMode && employee; // Cette variable n'est pas utilisée
// //   const isAddMode = editMode && !employee;

// //   // URL de la photo pour l'affichage
// //   const photoUrl = data.photo instanceof File
// //     ? URL.createObjectURL(data.photo)
// //     : data.photo;

// //   return (
// //     <div className="bg-white min-h-screen">
// //       {/* En-tête avec photo */}
// //       <div className="bg-white border-b px-4 sm:px-6 py-4">
// //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
// //           <button
// //             type="button"
// //             onClick={onCancel}
// //             className="p-2 hover:bg-gray-100 rounded-full transition self-start sm:self-center"
// //           >
// //             <ArrowLeft className="w-5 h-5 text-gray-600" />
// //           </button>

// //           {/* Photo de profil */}
// //           <div className="flex items-center gap-4 flex-1 w-full">
// //             <div className="relative">
// //               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
// //                 {photoUrl ? (
// //                   <img
// //                     src={photoUrl}
// //                     alt="Photo de profil"
// //                     className="w-full h-full object-cover"
// //                   />
// //                 ) : (
// //                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
// //                     <User className="w-8 h-8 text-gray-400" />
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Badge modification photo en mode édition */}
// //               {editMode && (
// //                 <div className="absolute -bottom-1 -right-1">
// //                   <button
// //                     type="button"
// //                     onClick={triggerFileInput}
// //                     className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition"
// //                   >
// //                     <Camera className="w-3 h-3" />
// //                   </button>
// //                   <input
// //                     type="file"
// //                     ref={fileInputRef}
// //                     onChange={handlePhotoChange}
// //                     accept="image/jpeg,image/jpg,image/png"
// //                     className="hidden"
// //                   />
// //                 </div>
// //               )}
// //             </div>

// //             {/* Informations de base */}
// //             <div className="flex-1 min-w-0">
// //               <h2 className="text-xl font-semibold text-gray-800 truncate">
// //                 {data.nom || ""} {data.prenoms || ""}
// //               </h2>
// //               <p className="text-sm text-gray-500">
// //                 N° {data.numero_matricule || ""}
// //               </p>
// //               <p className="text-sm text-gray-600">
// //                 {data.fonction || "Aucune fonction définie"}
// //               </p>
// //             </div>
// //           </div>

// //           {/* Bouton suppression photo en mode édition */}
// //           {editMode && photoUrl && (
// //             <button
// //               type="button"
// //               onClick={handleRemovePhoto}
// //               className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 transition self-start sm:self-center"
// //             >
// //               Supprimer photo
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {/* Navigation par onglets - MASQUÉE EN MODE AJOUT */}
// //       {!isAddMode && (
// //         <div className="border-b bg-gray-50 overflow-x-auto">
// //           <div className="flex min-w-max">
// //             {tabs.map((tab) => {
// //               const Icon = tab.icon;
// //               return (
// //                 <button
// //                   key={tab.id}
// //                   type="button"
// //                   onClick={() => setActiveTab(tab.id)}
// //                   className={`flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap text-sm flex-1 min-w-0 ${
// //                     activeTab === tab.id
// //                       ? "border-blue-600 text-blue-600 bg-white"
// //                       : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
// //                   }`}
// //                 >
// //                   <Icon className="w-4 h-4 flex-shrink-0" />
// //                   <span className="font-medium truncate">{tab.label}</span>
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       )}

// //       {/* Contenu */}
// //       <div className="p-4 sm:p-6 space-y-6">
// //         {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
// //         {(isAddMode || activeTab === "personnel") && (
// //           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
// //             {isAddMode && (
// //               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
// //                 <User className="w-5 h-5 text-gray-600" />
// //                 <h3 className="text-lg font-semibold text-gray-800">
// //                   Informations Personnelles
// //                 </h3>
// //               </div>
// //             )}

// //             {/* Upload photo en mode ajout */}
// //             {isAddMode && (
// //               <div className="mb-6 p-4 bg-white rounded-lg border">
// //                 <label className="block text-sm font-medium text-gray-700 mb-3">
// //                   Photo de profil
// //                 </label>
// //                 <div className="flex flex-col sm:flex-row items-center gap-4">
// //                   <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
// //                     {photoUrl ? (
// //                       <img
// //                         src={photoUrl}
// //                         alt="Aperçu photo"
// //                         className="w-full h-full object-cover"
// //                       />
// //                     ) : (
// //                       <Camera className="w-8 h-8 text-gray-400" />
// //                     )}
// //                   </div>
// //                   <div className="flex-1 min-w-0">
// //                     <div className="space-y-2">
// //                       <button
// //                         type="button"
// //                         onClick={triggerFileInput}
// //                         className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
// //                       >
// //                         Choisir une photo
// //                       </button>
// //                       <input
// //                         type="file"
// //                         ref={fileInputRef}
// //                         onChange={handlePhotoChange}
// //                         accept="image/jpeg,image/jpg,image/png"
// //                         className="hidden"
// //                       />
// //                       <p className="text-xs text-gray-500">
// //                         Formats supportés: JPG, JPEG, PNG (max. 5MB)
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}

// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
// //               {/* Colonne 1 */}
// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     N° Matricule *
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.numero_matricule || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("numero_matricule", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       placeholder="Entrez le numéro matricule"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.numero_matricule || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Nom *
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.nom || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("nom", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       placeholder="Entrez le nom"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.nom || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Prénoms *
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.prenoms || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("prenoms", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       placeholder="Entrez les prénoms"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.prenoms || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Sexe
// //                   </label>
// //                   {editMode ? (
// //                     <select
// //                       value={data.sexe || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("sexe", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     >
// //                       <option value="">-- Sélectionnez --</option>
// //                       <option value="Masculin">Masculin</option>
// //                       <option value="Féminin">Féminin</option>
// //                     </select>
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.sexe || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Appellation
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.appellation || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("appellation", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       placeholder="Ex: Monsieur, Madame"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.appellation || "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Colonne 2 */}
// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Date de naissance
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="date"
// //                       value={data.date_naissance || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("date_naissance", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.date_naissance || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Lieu de naissance
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.lieu_naissance || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("lieu_naissance", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       placeholder="Lieu de naissance"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.lieu_naissance || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     CIN
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.CIN || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("CIN", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       placeholder="Numéro CIN"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.CIN || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Date CIN
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="date"
// //                       value={data.date_CIN || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("date_CIN", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.date_CIN || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Lieu CIN
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.lieu_CIN || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("lieu_CIN", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.lieu_CIN || "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Deuxième ligne */}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     N° CNAPS
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.numero_cnaps || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("numero_cnaps", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.numero_cnaps || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Fonction
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.fonction || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("fonction", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.fonction || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Section
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.section || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("section", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.section || "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Ancien N° Journalière
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.ancien_numero_journaliere || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange(
// //                           "ancien_numero_journaliere",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.ancien_numero_journaliere || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Téléphone
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.telephone || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("telephone", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.telephone || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Email
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="email"
// //                       value={data.email || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("email", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.email || "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Troisième ligne */}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Père
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.pere || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("pere", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.pere || "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Mère
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.mere || ""}
// //                       onChange={(e) =>
// //                         handlePersonalChange("mere", e.target.value)
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.mere || "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Adresse et quartier */}
// //             <div className="mt-6 space-y-4">
// //               <div className="flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Adresse
// //                 </label>
// //                 {editMode ? (
// //                   <textarea
// //                     value={data.adresse || ""}
// //                     onChange={(e) =>
// //                       handlePersonalChange("adresse", e.target.value)
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[80px]"
// //                     rows={3}
// //                     placeholder="Adresse complète"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
// //                     {data.adresse || "-"}
// //                   </span>
// //                 )}
// //               </div>

// //               <div className="flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Quartier
// //                 </label>
// //                 {editMode ? (
// //                   <textarea
// //                     value={data.quartier || ""}
// //                     onChange={(e) =>
// //                       handlePersonalChange("quartier", e.target.value)
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[60px]"
// //                     rows={2}
// //                     placeholder="Quartier"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
// //                     {data.quartier || "-"}
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* SECTION 2 : INFORMATIONS SALAIRE */}
// //         {(isAddMode || activeTab === "salaire") && (
// //           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
// //             {isAddMode && (
// //               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
// //                 <Briefcase className="w-5 h-5 text-gray-600" />
// //                 <h3 className="text-lg font-semibold text-gray-800">
// //                   Informations Salaire
// //                 </h3>
// //               </div>
// //             )}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Date d'embauche
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="date"
// //                       value={data.salaire_personnel?.date_embauche || ""}
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "date_embauche",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.date_embauche || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Fonction
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.salaire_personnel?.fonction || ""}
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "fonction",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.fonction || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Catégorie
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.salaire_personnel?.categorie || ""}
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "categorie",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.categorie || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Salaire
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="number"
// //                       step="0.01"
// //                       value={data.salaire_personnel?.salaire || ""}
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "salaire",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.salaire
// //                         ? `${parseFloat(data.salaire_personnel.salaire).toLocaleString('fr-FR')} Ar`
// //                         : "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="space-y-4">
// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Section
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.salaire_personnel?.section || ""}
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "section",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.section || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Responsable section
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="text"
// //                       value={data.salaire_personnel?.responsable_section || ""}
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "responsable_section",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.responsable_section || "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Prime ancienneté
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="number"
// //                       step="0.01"
// //                       value={data.salaire_personnel?.prime_anciennete || ""}
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "prime_anciennete",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.prime_anciennete
// //                         ? `${parseFloat(data.salaire_personnel.prime_anciennete).toLocaleString('fr-FR')} Ar`
// //                         : "-"}
// //                     </span>
// //                   )}
// //                 </div>

// //                 <div className="flex flex-col">
// //                   <label className="text-sm font-medium text-gray-700 mb-2">
// //                     Indemnité déplacement
// //                   </label>
// //                   {editMode ? (
// //                     <input
// //                       type="number"
// //                       step="0.01"
// //                       value={
// //                         data.salaire_personnel?.indemnite_deplacement || ""
// //                       }
// //                       onChange={(e) =>
// //                         handleSectionChange(
// //                           "salaire_personnel",
// //                           "indemnite_deplacement",
// //                           e.target.value
// //                         )
// //                       }
// //                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     />
// //                   ) : (
// //                     <span className="text-sm text-gray-800 py-2">
// //                       {data.salaire_personnel?.indemnite_deplacement
// //                         ? `${parseFloat(data.salaire_personnel.indemnite_deplacement).toLocaleString('fr-FR')} Ar`
// //                         : "-"}
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="lg:col-span-2 flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Observations sur les primes
// //                 </label>
// //                 {editMode ? (
// //                   <textarea
// //                     value={data.salaire_personnel?.obs_prime || ""}
// //                     onChange={(e) =>
// //                       handleSectionChange(
// //                         "salaire_personnel",
// //                         "obs_prime",
// //                         e.target.value
// //                       )
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical min-h-[80px]"
// //                     rows={3}
// //                     placeholder="Notes supplémentaires sur les primes..."
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
// //                     {data.salaire_personnel?.obs_prime || "-"}
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* SECTION 3 : INFORMATIONS BANCAIRES */}
// //         {(isAddMode || activeTab === "bancaire") && (
// //           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
// //             {isAddMode && (
// //               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
// //                 <CreditCard className="w-5 h-5 text-gray-600" />
// //                 <h3 className="text-lg font-semibold text-gray-800">
// //                   Informations Bancaires
// //                 </h3>
// //               </div>
// //             )}
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
// //               <div className="flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Nom de la banque
// //                 </label>
// //                 {editMode ? (
// //                   <input
// //                     type="text"
// //                     value={data.bancaire?.nom_banque || ""}
// //                     onChange={(e) =>
// //                       handleSectionChange(
// //                         "bancaire",
// //                         "nom_banque",
// //                         e.target.value
// //                       )
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                     placeholder="Ex: BNI, BOA, BFV"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2">
// //                     {data.bancaire?.nom_banque || "-"}
// //                   </span>
// //                 )}
// //               </div>

// //               <div className="flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Code banque
// //                 </label>
// //                 {editMode ? (
// //                   <input
// //                     type="text"
// //                     value={data.bancaire?.code_banque || ""}
// //                     onChange={(e) =>
// //                       handleSectionChange(
// //                         "bancaire",
// //                         "code_banque",
// //                         e.target.value
// //                       )
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2">
// //                     {data.bancaire?.code_banque || "-"}
// //                   </span>
// //                 )}
// //               </div>

// //               <div className="flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Code agence
// //                 </label>
// //                 {editMode ? (
// //                   <input
// //                     type="text"
// //                     value={data.bancaire?.code_agence || ""}
// //                     onChange={(e) =>
// //                       handleSectionChange(
// //                         "bancaire",
// //                         "code_agence",
// //                         e.target.value
// //                       )
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2">
// //                     {data.bancaire?.code_agence || "-"}
// //                   </span>
// //                 )}
// //               </div>

// //               <div className="flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   N° de compte
// //                 </label>
// //                 {editMode ? (
// //                   <input
// //                     type="text"
// //                     value={data.bancaire?.numero_compte || ""}
// //                     onChange={(e) =>
// //                       handleSectionChange(
// //                         "bancaire",
// //                         "numero_compte",
// //                         e.target.value
// //                       )
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2">
// //                     {data.bancaire?.numero_compte || "-"}
// //                   </span>
// //                 )}
// //               </div>

// //               <div className="flex flex-col">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Clé RIB
// //                 </label>
// //                 {editMode ? (
// //                   <input
// //                     type="text"
// //                     value={data.bancaire?.cle_rib || ""}
// //                     onChange={(e) =>
// //                       handleSectionChange("bancaire", "cle_rib", e.target.value)
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2">
// //                     {data.bancaire?.cle_rib || "-"}
// //                   </span>
// //                 )}
// //               </div>

// //               <div className="flex flex-col md:col-span-2 lg:col-span-1">
// //                 <label className="text-sm font-medium text-gray-700 mb-2">
// //                   Banque bénéficiaire
// //                 </label>
// //                 {editMode ? (
// //                   <input
// //                     type="text"
// //                     value={data.bancaire?.banque_beneficiaire || ""}
// //                     onChange={(e) =>
// //                       handleSectionChange(
// //                         "bancaire",
// //                         "banque_beneficiaire",
// //                         e.target.value
// //                       )
// //                     }
// //                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                   />
// //                 ) : (
// //                   <span className="text-sm text-gray-800 py-2">
// //                     {data.bancaire?.banque_beneficiaire || "-"}
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* SECTION 4 : INFORMATIONS FAMILIALES */}
// //         {(isAddMode || activeTab === "familiale") && (
// //           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
// //             {isAddMode && (
// //               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
// //                 <Users className="w-5 h-5 text-gray-600" />
// //                 <h3 className="text-lg font-semibold text-gray-800">
// //                   Informations Familiales
// //                 </h3>
// //               </div>
// //             )}

// //             <div className="space-y-8">
// //               {/* Sous-section Époux(se) */}
// //               <div>
// //                 <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b">
// //                   Époux(se)
// //                 </h4>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
// //                   <div className="flex flex-col">
// //                     <label className="text-sm font-medium text-gray-700 mb-2">
// //                       Nom époux/épouse
// //                     </label>
// //                     {editMode ? (
// //                       <input
// //                         type="text"
// //                         value={data.familiale?.epoux_nom || ""}
// //                         onChange={(e) =>
// //                           handleSectionChange(
// //                             "familiale",
// //                             "epoux_nom",
// //                             e.target.value
// //                           )
// //                         }
// //                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                         placeholder="Nom de l'époux(se)"
// //                       />
// //                     ) : (
// //                       <span className="text-sm text-gray-800 py-2">
// //                         {data.familiale?.epoux_nom || "-"}
// //                       </span>
// //                     )}
// //                   </div>

// //                   <div className="flex flex-col">
// //                     <label className="text-sm font-medium text-gray-700 mb-2">
// //                       Prénoms époux/épouse
// //                     </label>
// //                     {editMode ? (
// //                       <input
// //                         type="text"
// //                         value={data.familiale?.epoux_prenoms || ""}
// //                         onChange={(e) =>
// //                           handleSectionChange(
// //                             "familiale",
// //                             "epoux_prenoms",
// //                             e.target.value
// //                           )
// //                         }
// //                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                         placeholder="Prénoms de l'époux(se)"
// //                       />
// //                     ) : (
// //                       <span className="text-sm text-gray-800 py-2">
// //                         {data.familiale?.epoux_prenoms || "-"}
// //                       </span>
// //                     )}
// //                   </div>

// //                   <div className="flex flex-col">
// //                     <label className="text-sm font-medium text-gray-700 mb-2">
// //                       Date naissance
// //                     </label>
// //                     {editMode ? (
// //                       <input
// //                         type="date"
// //                         value={data.familiale?.epoux_date_naissance || ""}
// //                         onChange={(e) =>
// //                           handleSectionChange(
// //                             "familiale",
// //                             "epoux_date_naissance",
// //                             e.target.value
// //                           )
// //                         }
// //                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                       />
// //                     ) : (
// //                       <span className="text-sm text-gray-800 py-2">
// //                         {data.familiale?.epoux_date_naissance || "-"}
// //                       </span>
// //                     )}
// //                   </div>

// //                   <div className="flex flex-col">
// //                     <label className="text-sm font-medium text-gray-700 mb-2">
// //                       Lieu naissance
// //                     </label>
// //                     {editMode ? (
// //                       <input
// //                         type="text"
// //                         value={data.familiale?.epoux_lieu_naissance || ""}
// //                         onChange={(e) =>
// //                           handleSectionChange(
// //                             "familiale",
// //                             "epoux_lieu_naissance",
// //                             e.target.value
// //                           )
// //                         }
// //                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                         placeholder="Lieu de naissance"
// //                       />
// //                     ) : (
// //                       <span className="text-sm text-gray-800 py-2">
// //                         {data.familiale?.epoux_lieu_naissance || "-"}
// //                       </span>
// //                     )}
// //                   </div>

// //                   <div className="flex flex-col">
// //                     <label className="text-sm font-medium text-gray-700 mb-2">
// //                       Société
// //                     </label>
// //                     {editMode ? (
// //                       <input
// //                         type="text"
// //                         value={data.familiale?.epoux_societe || ""}
// //                         onChange={(e) =>
// //                           handleSectionChange(
// //                             "familiale",
// //                             "epoux_societe",
// //                             e.target.value
// //                           )
// //                         }
// //                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                         placeholder="Société/Entreprise"
// //                       />
// //                     ) : (
// //                       <span className="text-sm text-gray-800 py-2">
// //                         {data.familiale?.epoux_societe || "-"}
// //                       </span>
// //                     )}
// //                   </div>

// //                   <div className="flex flex-col">
// //                     <label className="text-sm font-medium text-gray-700 mb-2">
// //                       Fonction
// //                     </label>
// //                     {editMode ? (
// //                       <input
// //                         type="text"
// //                         value={data.familiale?.epoux_fonction || ""}
// //                         onChange={(e) =>
// //                           handleSectionChange(
// //                             "familiale",
// //                             "epoux_fonction",
// //                             e.target.value
// //                           )
// //                         }
// //                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                         placeholder="Fonction/profession"
// //                       />
// //                     ) : (
// //                       <span className="text-sm text-gray-800 py-2">
// //                         {data.familiale?.epoux_fonction || "-"}
// //                       </span>
// //                     )}
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Sous-section Enfants */}
// //               <div>
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-2 border-b">
// //                   <h4 className="text-md font-semibold text-gray-800">
// //                     Enfants
// //                   </h4>
// //                   {editMode && (
// //                     <button
// //                       type="button"
// //                       onClick={handleAddChild}
// //                       className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition w-full sm:w-auto"
// //                     >
// //                       <Plus className="w-4 h-4" />
// //                       Ajouter un enfant
// //                     </button>
// //                   )}
// //                 </div>

// //                 {/* Liste des enfants */}
// //                 <div className="space-y-4">
// //                   {/* Mode édition - Formulaire pour enfants */}
// //                   {editMode && (
// //                     <div className="space-y-4">
// //                       {(data.familiale?.enfants || []).map((enfant, index) => (
// //                         <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
// //                           <div className="flex items-center justify-between mb-4">
// //                             <h5 className="text-sm font-medium text-gray-700">
// //                               Enfant {index + 1}
// //                             </h5>
// //                             <button
// //                               type="button"
// //                               onClick={() => handleRemoveChild(index)}
// //                               className="p-1 text-red-600 hover:bg-red-50 rounded transition"
// //                               title="Supprimer cet enfant"
// //                             >
// //                               <Trash2 className="w-4 h-4" />
// //                             </button>
// //                           </div>

// //                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //                             <div className="flex flex-col">
// //                               <label className="text-xs font-medium text-gray-600 mb-1">
// //                                 Nom et prénoms
// //                               </label>
// //                               <input
// //                                 type="text"
// //                                 value={enfant.nom_prenoms || ""}
// //                                 onChange={(e) =>
// //                                   handleChildChange(index, "nom_prenoms", e.target.value)
// //                                 }
// //                                 className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
// //                                 placeholder="Nom complet"
// //                               />
// //                             </div>

// //                             <div className="flex flex-col">
// //                               <label className="text-xs font-medium text-gray-600 mb-1">
// //                                 Sexe
// //                               </label>
// //                               <select
// //                                 value={enfant.sexe || ""}
// //                                 onChange={(e) =>
// //                                   handleChildChange(index, "sexe", e.target.value)
// //                                 }
// //                                 className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
// //                               >
// //                                 <option value="">-- Sélectionnez --</option>
// //                                 <option value="Masculin">Masculin</option>
// //                                 <option value="Féminin">Féminin</option>
// //                               </select>
// //                             </div>

// //                             <div className="flex flex-col">
// //                               <label className="text-xs font-medium text-gray-600 mb-1">
// //                                 Date naissance
// //                               </label>
// //                               <input
// //                                 type="date"
// //                                 value={enfant.date_naissance || ""}
// //                                 onChange={(e) =>
// //                                   handleChildChange(index, "date_naissance", e.target.value)
// //                                 }
// //                                 className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
// //                               />
// //                             </div>

// //                             <div className="flex flex-col">
// //                               <label className="text-xs font-medium text-gray-600 mb-1">
// //                                 Lieu naissance
// //                               </label>
// //                               <input
// //                                 type="text"
// //                                 value={enfant.lieu_naissance || ""}
// //                                 onChange={(e) =>
// //                                   handleChildChange(index, "lieu_naissance", e.target.value)
// //                                 }
// //                                 className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
// //                                 placeholder="Lieu de naissance"
// //                               />
// //                             </div>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}

// //                   {/* Mode consultation - Affichage des enfants */}
// //                   {!editMode && (
// //                     <>
// //                       {data.familiale?.enfants && data.familiale.enfants.length > 0 ? (
// //                         <div className="space-y-3">
// //                           {data.familiale.enfants.map((enfant, index) => (
// //                             <div
// //                               key={index}
// //                               className="bg-white p-4 rounded-lg border border-gray-200"
// //                             >
// //                               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
// //                                 <div>
// //                                   <span className="text-xs text-gray-500 block">Nom et prénoms</span>
// //                                   <span className="font-medium text-gray-800">
// //                                     {enfant.nom_prenoms || "-"}
// //                                   </span>
// //                                 </div>
// //                                 <div>
// //                                   <span className="text-xs text-gray-500 block">Sexe</span>
// //                                   <span className="text-gray-800">{enfant.sexe || "-"}</span>
// //                                 </div>
// //                                 <div>
// //                                   <span className="text-xs text-gray-500 block">Date naissance</span>
// //                                   <span className="text-gray-800">{enfant.date_naissance || "-"}</span>
// //                                 </div>
// //                                 <div>
// //                                   <span className="text-xs text-gray-500 block">Lieu naissance</span>
// //                                   <span className="text-gray-800">{enfant.lieu_naissance || "-"}</span>
// //                                 </div>
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       ) : (
// //                         <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
// //                           <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
// //                           <p className="text-gray-500 text-sm">
// //                             Aucun enfant enregistré
// //                           </p>
// //                         </div>
// //                       )}
// //                     </>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Boutons d'action - SEULEMENT EN MODE ÉDITION/AJOUT */}
// //       {editMode && (
// //         <div className="border-t bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
// //           <button
// //             type="button"
// //             onClick={onCancel}
// //             className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium order-2 sm:order-1"
// //           >
// //             Annuler
// //           </button>

// //           <button
// //             type="button"
// //             onClick={onSubmit}
// //             className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium order-1 sm:order-2"
// //           >
// //             {employee ? "Modifier l'employé" : "Créer l'employé"}
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default EmployeeBlock;

// import React, { useState, useRef } from "react";
// import {
//   ArrowLeft,
//   User,
//   Briefcase,
//   CreditCard,
//   Users,
//   Camera,
//   Plus,
//   Trash2
// } from "lucide-react";

// const EmployeeBlock = ({
//   employee,
//   formData,
//   setFormData,
//   onSubmit,
//   onCancel,
//   editMode,
// }) => {
//   const [activeTab, setActiveTab] = useState("personnel");
//   const fileInputRef = useRef(null);

//   const tabs = [
//     { id: "personnel", label: "Informations Personnelles", icon: User },
//     { id: "salaire", label: "Informations Salaire", icon: Briefcase },
//     { id: "bancaire", label: "Informations Bancaires", icon: CreditCard },
//     { id: "familiale", label: "Informations Familiales", icon: Users },
//   ];

//   const data = formData || employee || {};

//   // Fonctions de gestion des changements
//   const handleSectionChange = (section, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...(prev?.[section] || {}),
//         [field]: value,
//       },
//     }));
//   };

//   const handlePersonalChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Gestion de la photo
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({
//         ...prev,
//         photo: file,
//       }));
//     }
//   };

//   const handleRemovePhoto = () => {
//     setFormData((prev) => ({
//       ...prev,
//       photo: null,
//     }));
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   // Gestion des enfants
//   const handleAddChild = () => {
//     setFormData((prev) => ({
//       ...prev,
//       familiale: {
//         ...prev.familiale,
//         enfants: [
//           ...(prev.familiale?.enfants || []),
//           {
//             nom_prenoms: "",
//             sexe: "",
//             date_naissance: "",
//             lieu_naissance: ""
//           }
//         ]
//       }
//     }));
//   };

//   const handleChildChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newEnfants = [...(prev.familiale?.enfants || [])];
//       newEnfants[index] = {
//         ...newEnfants[index],
//         [field]: value
//       };
//       return {
//         ...prev,
//         familiale: {
//           ...prev.familiale,
//           enfants: newEnfants
//         }
//       };
//     });
//   };

//   const handleRemoveChild = (index) => {
//     setFormData((prev) => {
//       const newEnfants = [...(prev.familiale?.enfants || [])];
//       newEnfants.splice(index, 1);
//       return {
//         ...prev,
//         familiale: {
//           ...prev.familiale,
//           enfants: newEnfants
//         }
//       };
//     });
//   };

//   const isAddMode = editMode && !employee;

//   // URL de la photo pour l'affichage
//   const photoUrl = data.photo instanceof File
//     ? URL.createObjectURL(data.photo)
//     : data.photo;

//   return (
//     <div className="bg-white min-h-screen">
//       {/* En-tête avec photo */}
//       <div className="bg-white border-b px-4 sm:px-6 py-4">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="p-2 hover:bg-gray-100 rounded-full transition self-start sm:self-center"
//           >
//             <ArrowLeft className="w-5 h-5 text-gray-600" />
//           </button>

//           {/* Photo de profil */}
//           <div className="flex items-center gap-4 flex-1 w-full">
//             <div className="relative">
//               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
//                 {photoUrl ? (
//                   <img
//                     src={photoUrl}
//                     alt="Photo de profil"
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                     <User className="w-8 h-8 text-gray-400" />
//                   </div>
//                 )}
//               </div>

//               {editMode && (
//                 <div className="absolute -bottom-1 -right-1">
//                   <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition"
//                   >
//                     <Camera className="w-3 h-3" />
//                   </button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handlePhotoChange}
//                     accept="image/jpeg,image/jpg,image/png"
//                     className="hidden"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 min-w-0">
//               <h2 className="text-xl font-semibold text-gray-800 truncate">
//                 {data.nom || ""} {data.prenoms || ""}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 N° {data.numero_matricule || ""}
//               </p>
//               <p className="text-sm text-gray-600">
//                 {data.fonction || "Aucune fonction définie"}
//               </p>
//             </div>
//           </div>

//           {editMode && photoUrl && (
//             <button
//               type="button"
//               onClick={handleRemovePhoto}
//               className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 transition self-start sm:self-center"
//             >
//               Supprimer photo
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Navigation par onglets */}
//       {!isAddMode && (
//         <div className="border-b bg-gray-50 overflow-x-auto">
//           <div className="flex min-w-max">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap text-sm flex-1 min-w-0 ${
//                     activeTab === tab.id
//                       ? "border-blue-600 text-blue-600 bg-white"
//                       : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4 flex-shrink-0" />
//                   <span className="font-medium truncate">{tab.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Contenu */}
//       <div className="p-4 sm:p-6 space-y-6">
//         {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
//         {(isAddMode || activeTab === "personnel") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <User className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Personnelles
//                 </h3>
//               </div>
//             )}

//             {isAddMode && (
//               <div className="mb-6 p-4 bg-white rounded-lg border">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Photo de profil
//                 </label>
//                 <div className="flex flex-col sm:flex-row items-center gap-4">
//                   <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//                     {photoUrl ? (
//                       <img
//                         src={photoUrl}
//                         alt="Aperçu photo"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <Camera className="w-8 h-8 text-gray-400" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="space-y-2">
//                       <button
//                         type="button"
//                         onClick={triggerFileInput}
//                         className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
//                       >
//                         Choisir une photo
//                       </button>
//                       <p className="text-xs text-gray-500">
//                         Formats supportés: JPG, JPEG, PNG
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//               {/* Colonne 1 */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     N° Matricule *
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.numero_matricule || ""}
//                       onChange={(e) => handlePersonalChange("numero_matricule", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.numero_matricule || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Nom *
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.nom || ""}
//                       onChange={(e) => handlePersonalChange("nom", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.nom || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Prénoms *
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.prenoms || ""}
//                       onChange={(e) => handlePersonalChange("prenoms", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.prenoms || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Sexe
//                   </label>
//                   {editMode ? (
//                     <select
//                       value={data.sexe || ""}
//                       onChange={(e) => handlePersonalChange("sexe", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">-- Sélectionnez --</option>
//                       <option value="Masculin">Masculin</option>
//                       <option value="Féminin">Féminin</option>
//                     </select>
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.sexe || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Appellation
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.appellation || ""}
//                       onChange={(e) => handlePersonalChange("appellation", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.appellation || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Date de naissance
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="date"
//                       value={data.date_naissance || ""}
//                       onChange={(e) => handlePersonalChange("date_naissance", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.date_naissance || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Lieu de naissance
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.lieu_naissance || ""}
//                       onChange={(e) => handlePersonalChange("lieu_naissance", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.lieu_naissance || "-"}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Colonne 2 */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     CIN
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.CIN || ""}
//                       onChange={(e) => handlePersonalChange("CIN", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.CIN || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Date CIN
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="date"
//                       value={data.date_CIN || ""}
//                       onChange={(e) => handlePersonalChange("date_CIN", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.date_CIN || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Lieu CIN
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.lieu_CIN || ""}
//                       onChange={(e) => handlePersonalChange("lieu_CIN", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.lieu_CIN || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     N° CNAPS
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.numero_cnaps || ""}
//                       onChange={(e) => handlePersonalChange("numero_cnaps", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.numero_cnaps || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Fonction
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.fonction || ""}
//                       onChange={(e) => handlePersonalChange("fonction", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.fonction || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Section
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.section || ""}
//                       onChange={(e) => handlePersonalChange("section", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.section || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Ancien N° Journalière
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.ancien_numero_journaliere || ""}
//                       onChange={(e) => handlePersonalChange("ancien_numero_journaliere", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.ancien_numero_journaliere || "-"}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Ligne supplémentaire */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Père
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.pere || ""}
//                       onChange={(e) => handlePersonalChange("pere", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.pere || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Mère
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.mere || ""}
//                       onChange={(e) => handlePersonalChange("mere", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.mere || "-"}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Téléphone
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.telephone || ""}
//                       onChange={(e) => handlePersonalChange("telephone", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.telephone || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Email
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="email"
//                       value={data.email || ""}
//                       onChange={(e) => handlePersonalChange("email", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.email || "-"}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Adresse et quartier */}
//             <div className="mt-6 space-y-4">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Adresse
//                 </label>
//                 {editMode ? (
//                   <textarea
//                     value={data.adresse || ""}
//                     onChange={(e) => handlePersonalChange("adresse", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.adresse || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Quartier
//                 </label>
//                 {editMode ? (
//                   <textarea
//                     value={data.quartier || ""}
//                     onChange={(e) => handlePersonalChange("quartier", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.quartier || "-"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION 2 : INFORMATIONS SALAIRE */}
//         {(isAddMode || activeTab === "salaire") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <Briefcase className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Salaire
//                 </h3>
//               </div>
//             )}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Date d'embauche
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="date"
//                       value={data.salaire_personnel?.date_embauche || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "date_embauche", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.date_embauche || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Fonction
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.fonction || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "fonction", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.fonction || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Catégorie
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.categorie || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "categorie", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.categorie || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Salaire
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={data.salaire_personnel?.salaire || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "salaire", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">
//                       {data.salaire_personnel?.salaire ? `${data.salaire_personnel.salaire} Ar` : "-"}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Section
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.section || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "section", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.section || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Responsable section
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.responsable_section || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "responsable_section", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.responsable_section || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Prime ancienneté
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={data.salaire_personnel?.prime_anciennete || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "prime_anciennete", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">
//                       {data.salaire_personnel?.prime_anciennete ? `${data.salaire_personnel.prime_anciennete} Ar` : "-"}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Indemnité déplacement
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={data.salaire_personnel?.indemnite_deplacement || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "indemnite_deplacement", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">
//                       {data.salaire_personnel?.indemnite_deplacement ? `${data.salaire_personnel.indemnite_deplacement} Ar` : "-"}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="lg:col-span-2 flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Observations sur les primes
//                 </label>
//                 {editMode ? (
//                   <textarea
//                     value={data.salaire_personnel?.obs_prime || ""}
//                     onChange={(e) => handleSectionChange("salaire_personnel", "obs_prime", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.salaire_personnel?.obs_prime || "-"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION 3 : INFORMATIONS BANCAIRES */}
//         {(isAddMode || activeTab === "bancaire") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <CreditCard className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Bancaires
//                 </h3>
//               </div>
//             )}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Nom de la banque
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.nom_banque || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "nom_banque", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.nom_banque || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Code banque
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.code_banque || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "code_banque", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.code_banque || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Code agence
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.code_agence || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "code_agence", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.code_agence || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   N° de compte
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.numero_compte || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "numero_compte", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.numero_compte || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Clé RIB
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.cle_rib || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "cle_rib", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.cle_rib || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col md:col-span-2 lg:col-span-1">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Banque bénéficiaire
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.banque_beneficiaire || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "banque_beneficiaire", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.banque_beneficiaire || "-"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION 4 : INFORMATIONS FAMILIALES */}
//         {(isAddMode || activeTab === "familiale") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <Users className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Familiales
//                 </h3>
//               </div>
//             )}

//             <div className="space-y-8">
//               {/* Sous-section Époux(se) */}
//               <div>
//                 <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b">
//                   Époux(se)
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Nom époux/épouse
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_nom || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_nom", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_nom || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Prénoms époux/épouse
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_prenoms || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_prenoms", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_prenoms || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Date naissance
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="date"
//                         value={data.familiale?.epoux_date_naissance || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_date_naissance", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_date_naissance || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Lieu naissance
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_lieu_naissance || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_lieu_naissance", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_lieu_naissance || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Société
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_societe || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_societe", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_societe || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Fonction
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_fonction || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_fonction", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_fonction || "-"}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Sous-section Enfants */}
//               <div>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-2 border-b">
//                   <h4 className="text-md font-semibold text-gray-800">
//                     Enfants
//                   </h4>
//                   {editMode && (
//                     <button
//                       type="button"
//                       onClick={handleAddChild}
//                       className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition w-full sm:w-auto"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Ajouter un enfant
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {editMode ? (
//                     (data.familiale?.enfants || []).map((enfant, index) => (
//                       <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
//                         <div className="flex items-center justify-between mb-4">
//                           <h5 className="text-sm font-medium text-gray-700">
//                             Enfant {index + 1}
//                           </h5>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveChild(index)}
//                             className="p-1 text-red-600 hover:bg-red-50 rounded transition"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Nom et prénoms
//                             </label>
//                             <input
//                               type="text"
//                               value={enfant.nom_prenoms || ""}
//                               onChange={(e) => handleChildChange(index, "nom_prenoms", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             />
//                           </div>

//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Sexe
//                             </label>
//                             <select
//                               value={enfant.sexe || ""}
//                               onChange={(e) => handleChildChange(index, "sexe", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             >
//                               <option value="">-- Sélectionnez --</option>
//                               <option value="Masculin">Masculin</option>
//                               <option value="Féminin">Féminin</option>
//                             </select>
//                           </div>

//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Date naissance
//                             </label>
//                             <input
//                               type="date"
//                               value={enfant.date_naissance || ""}
//                               onChange={(e) => handleChildChange(index, "date_naissance", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             />
//                           </div>

//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Lieu naissance
//                             </label>
//                             <input
//                               type="text"
//                               value={enfant.lieu_naissance || ""}
//                               onChange={(e) => handleChildChange(index, "lieu_naissance", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     data.familiale?.enfants && data.familiale.enfants.length > 0 ? (
//                       data.familiale.enfants.map((enfant, index) => (
//                         <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
//                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//                             <div>
//                               <span className="text-xs text-gray-500 block">Nom et prénoms</span>
//                               <span className="font-medium text-gray-800">{enfant.nom_prenoms || "-"}</span>
//                             </div>
//                             <div>
//                               <span className="text-xs text-gray-500 block">Sexe</span>
//                               <span className="text-gray-800">{enfant.sexe || "-"}</span>
//                             </div>
//                             <div>
//                               <span className="text-xs text-gray-500 block">Date naissance</span>
//                               <span className="text-gray-800">{enfant.date_naissance || "-"}</span>
//                             </div>
//                             <div>
//                               <span className="text-xs text-gray-500 block">Lieu naissance</span>
//                               <span className="text-gray-800">{enfant.lieu_naissance || "-"}</span>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
//                         <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                         <p className="text-gray-500 text-sm">
//                           Aucun enfant enregistré
//                         </p>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Boutons d'action */}
//       {editMode && (
//         <div className="border-t bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium order-2 sm:order-1"
//           >
//             Annuler
//           </button>

//           <button
//             type="button"
//             onClick={onSubmit}
//             className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium order-1 sm:order-2"
//           >
//             {employee ? "Modifier l'employé" : "Créer l'employé"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeBlock;

// import React, { useState, useRef } from "react";
// import {
//   ArrowLeft,
//   User,
//   Briefcase,
//   CreditCard,
//   Users,
//   Camera,
//   Plus,
//   Trash2
// } from "lucide-react";

// const EmployeeBlock = ({
//   employee,
//   formData,
//   setFormData,
//   onSubmit,
//   onCancel,
//   editMode,
// }) => {
//   const [activeTab, setActiveTab] = useState("personnel");
//   const fileInputRef = useRef(null);

//   const tabs = [
//     { id: "personnel", label: "Informations Personnelles", icon: User },
//     { id: "salaire", label: "Informations Salaire", icon: Briefcase },
//     { id: "bancaire", label: "Informations Bancaires", icon: CreditCard },
//     { id: "familiale", label: "Informations Familiales", icon: Users },
//   ];

//   const data = formData || employee || {};

//   // Fonctions de gestion des changements
//   const handleSectionChange = (section, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [section]: {
//         ...(prev?.[section] || {}),
//         [field]: value,
//       },
//     }));
//   };

//   const handlePersonalChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Gestion de la photo
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({
//         ...prev,
//         photo: file,
//       }));
//     }
//   };

//   const handleRemovePhoto = () => {
//     setFormData((prev) => ({
//       ...prev,
//       photo: null,
//     }));
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   // Gestion des enfants - CORRECTION COMPLÈTE
//   const handleAddChild = () => {
//     setFormData((prev) => ({
//       ...prev,
//       familiale: {
//         ...prev.familiale,
//         enfants: [
//           ...(prev.familiale?.enfants || []),
//           {
//             nom_prenoms: "",
//             sexe: "",
//             date_naissance: "",
//             lieu_naissance: ""
//           }
//         ]
//       }
//     }));
//   };

//   const handleChildChange = (index, field, value) => {
//     setFormData((prev) => {
//       const newEnfants = [...(prev.familiale?.enfants || [])];
//       // S'assurer que l'objet enfant existe
//       if (!newEnfants[index]) {
//         newEnfants[index] = {};
//       }
//       newEnfants[index] = {
//         ...newEnfants[index],
//         [field]: value
//       };
//       return {
//         ...prev,
//         familiale: {
//           ...prev.familiale,
//           enfants: newEnfants
//         }
//       };
//     });
//   };

//   const handleRemoveChild = (index) => {
//     setFormData((prev) => {
//       const newEnfants = [...(prev.familiale?.enfants || [])];
//       newEnfants.splice(index, 1);
//       return {
//         ...prev,
//         familiale: {
//           ...prev.familiale,
//           enfants: newEnfants
//         }
//       };
//     });
//   };

//   const isAddMode = editMode && !employee;

//   // URL de la photo pour l'affichage
//   const photoUrl = data.photo instanceof File
//     ? URL.createObjectURL(data.photo)
//     : data.photo;

//   return (
//     <div className="bg-white min-h-screen">
//       {/* En-tête avec photo */}
//       <div className="bg-white border-b px-4 sm:px-6 py-4">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="p-2 hover:bg-gray-100 rounded-full transition self-start sm:self-center"
//           >
//             <ArrowLeft className="w-5 h-5 text-gray-600" />
//           </button>

//           {/* Photo de profil */}
//           <div className="flex items-center gap-4 flex-1 w-full">
//             <div className="relative">
//               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
//                 {photoUrl ? (
//                   <img
//                     src={photoUrl}
//                     alt="Photo de profil"
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                     <User className="w-8 h-8 text-gray-400" />
//                   </div>
//                 )}
//               </div>

//               {editMode && (
//                 <div className="absolute -bottom-1 -right-1">
//                   <button
//                     type="button"
//                     onClick={triggerFileInput}
//                     className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition"
//                   >
//                     <Camera className="w-3 h-3" />
//                   </button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handlePhotoChange}
//                     accept="image/jpeg,image/jpg,image/png"
//                     className="hidden"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="flex-1 min-w-0">
//               <h2 className="text-xl font-semibold text-gray-800 truncate">
//                 {data.nom || ""} {data.prenoms || ""}
//               </h2>
//               <p className="text-sm text-gray-500">
//                 N° {data.numero_matricule || ""}
//               </p>
//               <p className="text-sm text-gray-600">
//                 {data.fonction || "Aucune fonction définie"}
//               </p>
//             </div>
//           </div>

//           {editMode && photoUrl && (
//             <button
//               type="button"
//               onClick={handleRemovePhoto}
//               className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 transition self-start sm:self-center"
//             >
//               Supprimer photo
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Navigation par onglets */}
//       {!isAddMode && (
//         <div className="border-b bg-gray-50 overflow-x-auto">
//           <div className="flex min-w-max">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   type="button"
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap text-sm flex-1 min-w-0 ${
//                     activeTab === tab.id
//                       ? "border-blue-600 text-blue-600 bg-white"
//                       : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4 flex-shrink-0" />
//                   <span className="font-medium truncate">{tab.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {/* Contenu */}
//       <div className="p-4 sm:p-6 space-y-6">
//         {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
//         {(isAddMode || activeTab === "personnel") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <User className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Personnelles
//                 </h3>
//               </div>
//             )}

//             {isAddMode && (
//               <div className="mb-6 p-4 bg-white rounded-lg border">
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Photo de profil
//                 </label>
//                 <div className="flex flex-col sm:flex-row items-center gap-4">
//                   <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
//                     {photoUrl ? (
//                       <img
//                         src={photoUrl}
//                         alt="Aperçu photo"
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <Camera className="w-8 h-8 text-gray-400" />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="space-y-2">
//                       <button
//                         type="button"
//                         onClick={triggerFileInput}
//                         className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
//                       >
//                         Choisir une photo
//                       </button>
//                       <p className="text-xs text-gray-500">
//                         Formats supportés: JPG, JPEG, PNG
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//               {/* Colonne 1 */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     N° Matricule *
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.numero_matricule || ""}
//                       onChange={(e) => handlePersonalChange("numero_matricule", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.numero_matricule || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Nom *
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.nom || ""}
//                       onChange={(e) => handlePersonalChange("nom", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.nom || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Prénoms *
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.prenoms || ""}
//                       onChange={(e) => handlePersonalChange("prenoms", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       required
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.prenoms || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Sexe
//                   </label>
//                   {editMode ? (
//                     <select
//                       value={data.sexe || ""}
//                       onChange={(e) => handlePersonalChange("sexe", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">-- Sélectionnez --</option>
//                       <option value="Masculin">Masculin</option>
//                       <option value="Féminin">Féminin</option>
//                     </select>
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.sexe || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Appellation
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.appellation || ""}
//                       onChange={(e) => handlePersonalChange("appellation", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.appellation || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Date de naissance
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="date"
//                       value={data.date_naissance || ""}
//                       onChange={(e) => handlePersonalChange("date_naissance", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.date_naissance || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Lieu de naissance
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.lieu_naissance || ""}
//                       onChange={(e) => handlePersonalChange("lieu_naissance", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.lieu_naissance || "-"}</span>
//                   )}
//                 </div>
//               </div>

//               {/* Colonne 2 */}
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     CIN
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.CIN || ""}
//                       onChange={(e) => handlePersonalChange("CIN", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.CIN || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Date CIN
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="date"
//                       value={data.date_CIN || ""}
//                       onChange={(e) => handlePersonalChange("date_CIN", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.date_CIN || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Lieu CIN
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.lieu_CIN || ""}
//                       onChange={(e) => handlePersonalChange("lieu_CIN", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.lieu_CIN || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     N° CNAPS
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.numero_cnaps || ""}
//                       onChange={(e) => handlePersonalChange("numero_cnaps", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.numero_cnaps || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Fonction
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.fonction || ""}
//                       onChange={(e) => handlePersonalChange("fonction", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.fonction || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Section
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.section || ""}
//                       onChange={(e) => handlePersonalChange("section", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.section || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Ancien N° Journalière
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.ancien_numero_journaliere || ""}
//                       onChange={(e) => handlePersonalChange("ancien_numero_journaliere", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.ancien_numero_journaliere || "-"}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Ligne supplémentaire */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Père
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.pere || ""}
//                       onChange={(e) => handlePersonalChange("pere", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.pere || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Mère
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.mere || ""}
//                       onChange={(e) => handlePersonalChange("mere", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.mere || "-"}</span>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Téléphone
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.telephone || ""}
//                       onChange={(e) => handlePersonalChange("telephone", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.telephone || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Email
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="email"
//                       value={data.email || ""}
//                       onChange={(e) => handlePersonalChange("email", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.email || "-"}</span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Adresse et quartier */}
//             <div className="mt-6 space-y-4">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Adresse
//                 </label>
//                 {editMode ? (
//                   <textarea
//                     value={data.adresse || ""}
//                     onChange={(e) => handlePersonalChange("adresse", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.adresse || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Quartier
//                 </label>
//                 {editMode ? (
//                   <textarea
//                     value={data.quartier || ""}
//                     onChange={(e) => handlePersonalChange("quartier", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.quartier || "-"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION 2 : INFORMATIONS SALAIRE */}
//         {(isAddMode || activeTab === "salaire") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <Briefcase className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Salaire
//                 </h3>
//               </div>
//             )}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Date d'embauche
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="date"
//                       value={data.salaire_personnel?.date_embauche || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "date_embauche", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.date_embauche || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Fonction
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.fonction || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "fonction", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.fonction || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Catégorie
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.categorie || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "categorie", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.categorie || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Salaire
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={data.salaire_personnel?.salaire || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "salaire", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">
//                       {data.salaire_personnel?.salaire ? `${data.salaire_personnel.salaire} Ar` : "-"}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Section
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.section || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "section", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.section || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Responsable section
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       value={data.salaire_personnel?.responsable_section || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "responsable_section", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.responsable_section || "-"}</span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Prime ancienneté
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={data.salaire_personnel?.prime_anciennete || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "prime_anciennete", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">
//                       {data.salaire_personnel?.prime_anciennete ? `${data.salaire_personnel.prime_anciennete} Ar` : "-"}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex flex-col">
//                   <label className="text-sm font-medium text-gray-700 mb-2">
//                     Indemnité déplacement
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={data.salaire_personnel?.indemnite_deplacement || ""}
//                       onChange={(e) => handleSectionChange("salaire_personnel", "indemnite_deplacement", e.target.value)}
//                       className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   ) : (
//                     <span className="text-sm text-gray-800 py-2">
//                       {data.salaire_personnel?.indemnite_deplacement ? `${data.salaire_personnel.indemnite_deplacement} Ar` : "-"}
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="lg:col-span-2 flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Observations sur les primes
//                 </label>
//                 {editMode ? (
//                   <textarea
//                     value={data.salaire_personnel?.obs_prime || ""}
//                     onChange={(e) => handleSectionChange("salaire_personnel", "obs_prime", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.salaire_personnel?.obs_prime || "-"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION 3 : INFORMATIONS BANCAIRES */}
//         {(isAddMode || activeTab === "bancaire") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <CreditCard className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Bancaires
//                 </h3>
//               </div>
//             )}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Nom de la banque
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.nom_banque || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "nom_banque", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.nom_banque || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Code banque
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.code_banque || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "code_banque", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.code_banque || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Code agence
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.code_agence || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "code_agence", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.code_agence || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   N° de compte
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.numero_compte || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "numero_compte", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.numero_compte || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Clé RIB
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.cle_rib || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "cle_rib", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.cle_rib || "-"}</span>
//                 )}
//               </div>

//               <div className="flex flex-col md:col-span-2 lg:col-span-1">
//                 <label className="text-sm font-medium text-gray-700 mb-2">
//                   Banque bénéficiaire
//                 </label>
//                 {editMode ? (
//                   <input
//                     type="text"
//                     value={data.bancaire?.banque_beneficiaire || ""}
//                     onChange={(e) => handleSectionChange("bancaire", "banque_beneficiaire", e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 ) : (
//                   <span className="text-sm text-gray-800 py-2">{data.bancaire?.banque_beneficiaire || "-"}</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* SECTION 4 : INFORMATIONS FAMILIALES */}
//         {(isAddMode || activeTab === "familiale") && (
//           <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
//             {isAddMode && (
//               <div className="flex items-center gap-2 mb-6 pb-3 border-b">
//                 <Users className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Informations Familiales
//                 </h3>
//               </div>
//             )}

//             <div className="space-y-8">
//               {/* Sous-section Époux(se) */}
//               <div>
//                 <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b">
//                   Époux(se)
//                 </h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Nom époux/épouse
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_nom || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_nom", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_nom || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Prénoms époux/épouse
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_prenoms || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_prenoms", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_prenoms || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Date naissance
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="date"
//                         value={data.familiale?.epoux_date_naissance || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_date_naissance", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_date_naissance || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Lieu naissance
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_lieu_naissance || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_lieu_naissance", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_lieu_naissance || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Société
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_societe || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_societe", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_societe || "-"}</span>
//                     )}
//                   </div>

//                   <div className="flex flex-col">
//                     <label className="text-sm font-medium text-gray-700 mb-2">
//                       Fonction
//                     </label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={data.familiale?.epoux_fonction || ""}
//                         onChange={(e) => handleSectionChange("familiale", "epoux_fonction", e.target.value)}
//                         className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       />
//                     ) : (
//                       <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_fonction || "-"}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Sous-section Enfants - CORRECTION DÉFINITIVE */}
//               <div>
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-2 border-b">
//                   <h4 className="text-md font-semibold text-gray-800">
//                     Enfants
//                   </h4>
//                   {editMode && (
//                     <button
//                       type="button"
//                       onClick={handleAddChild}
//                       className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition w-full sm:w-auto"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Ajouter un enfant
//                     </button>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   {editMode ? (
//                     (data.familiale?.enfants || []).map((enfant, index) => (
//                       <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
//                         <div className="flex items-center justify-between mb-4">
//                           <h5 className="text-sm font-medium text-gray-700">
//                             Enfant {index + 1}
//                           </h5>
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveChild(index)}
//                             className="p-1 text-red-600 hover:bg-red-50 rounded transition"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Nom et prénoms
//                             </label>
//                             <input
//                               type="text"
//                               value={enfant.nom_prenoms || ""}
//                               onChange={(e) => handleChildChange(index, "nom_prenoms", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                               placeholder="Nom et prénoms"
//                             />
//                           </div>

//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Sexe
//                             </label>
//                             <select
//                               value={enfant.sexe || ""}
//                               onChange={(e) => handleChildChange(index, "sexe", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             >
//                               <option value="">-- Sélectionnez --</option>
//                               <option value="Masculin">Masculin</option>
//                               <option value="Féminin">Féminin</option>
//                             </select>
//                           </div>

//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Date naissance
//                             </label>
//                             <input
//                               type="date"
//                               value={enfant.date_naissance || ""}
//                               onChange={(e) => handleChildChange(index, "date_naissance", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             />
//                           </div>

//                           <div className="flex flex-col">
//                             <label className="text-xs font-medium text-gray-600 mb-1">
//                               Lieu naissance
//                             </label>
//                             <input
//                               type="text"
//                               value={enfant.lieu_naissance || ""}
//                               onChange={(e) => handleChildChange(index, "lieu_naissance", e.target.value)}
//                               className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                               placeholder="Lieu de naissance"
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     data.familiale?.enfants && data.familiale.enfants.length > 0 ? (
//                       data.familiale.enfants.map((enfant, index) => (
//                         <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
//                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//                             <div>
//                               <span className="text-xs text-gray-500 block">Nom et prénoms</span>
//                               <span className="font-medium text-gray-800">{enfant.nom_prenoms || "-"}</span>
//                             </div>
//                             <div>
//                               <span className="text-xs text-gray-500 block">Sexe</span>
//                               <span className="text-gray-800">{enfant.sexe || "-"}</span>
//                             </div>
//                             <div>
//                               <span className="text-xs text-gray-500 block">Date naissance</span>
//                               <span className="text-gray-800">{enfant.date_naissance || "-"}</span>
//                             </div>
//                             <div>
//                               <span className="text-xs text-gray-500 block">Lieu naissance</span>
//                               <span className="text-gray-800">{enfant.lieu_naissance || "-"}</span>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
//                         <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                         <p className="text-gray-500 text-sm">
//                           Aucun enfant enregistré
//                         </p>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Boutons d'action */}
//       {editMode && (
//         <div className="border-t bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium order-2 sm:order-1"
//           >
//             Annuler
//           </button>

//           <button
//             type="button"
//             onClick={onSubmit}
//             className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium order-1 sm:order-2"
//           >
//             {employee ? "Modifier l'employé" : "Créer l'employé"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmployeeBlock;

import React, { useState, useRef } from "react";
import "/src/styles/custom.css";
import {
  ArrowLeft,
  User,
  Briefcase,
  CreditCard,
  Users,
  Camera,
  Plus,
  Trash2,
} from "lucide-react";

const EmployeeBlock = ({
  employee,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editMode,
  loading,
}) => {
  const [activeTab, setActiveTab] = useState("personnel");
  const fileInputRef = useRef(null);

  const tabs = [
    { id: "personnel", label: "Informations Personnelles", icon: User },
    { id: "salaire", label: "Informations Salaire", icon: Briefcase },
    { id: "bancaire", label: "Informations Bancaires", icon: CreditCard },
    { id: "familiale", label: "Informations Familiales", icon: Users },
  ];

  const data = formData || {};

  // Fonctions de gestion des changements
  const handleSectionChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Gestion de la photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photo: null,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Gestion des enfants
  const handleAddChild = () => {
    setFormData((prev) => ({
      ...prev,
      familiale: {
        ...prev.familiale,
        enfants: [
          ...(prev.familiale?.enfants || []),
          {
            id: null,
            nom_prenoms: "",
            sexe: "",
            date_naissance: "",
            lieu_naissance: "",
          },
        ],
      },
    }));
  };

  const handleChildChange = (index, field, value) => {
    setFormData((prev) => {
      const newEnfants = [...(prev.familiale?.enfants || [])];
      if (!newEnfants[index]) {
        newEnfants[index] = {};
      }
      newEnfants[index] = {
        ...newEnfants[index],
        [field]: value,
      };
      return {
        ...prev,
        familiale: {
          ...prev.familiale,
          enfants: newEnfants,
        },
      };
    });
  };

  const handleRemoveChild = (index) => {
    setFormData((prev) => {
      const newEnfants = [...(prev.familiale?.enfants || [])];
      newEnfants.splice(index, 1);
      return {
        ...prev,
        familiale: {
          ...prev.familiale,
          enfants: newEnfants,
        },
      };
    });
  };

  const isAddMode = editMode && !employee;

  // URL de la photo pour l'affichage
  const photoUrl =
    data.photo instanceof File ? URL.createObjectURL(data.photo) : data.photo;

  return (
    <div className="bg-white min-h-screen">
      {/* En-tête avec photo */}
      <div className="bg-white border-b px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition self-start sm:self-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Photo de profil */}
          <div className="flex items-center gap-4 flex-1 w-full">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {editMode && (
                <div className="absolute -bottom-1 -right-1">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="bg-blue-600 text-white p-1.5 rounded-full shadow-lg hover:bg-blue-700 transition"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-800 truncate">
                {data.nom || ""} {data.prenoms || ""}
              </h2>
              <p className="text-sm text-gray-500">
                N° {data.numero_matricule || ""}
              </p>
              <p className="text-sm text-gray-600">
                {data.fonction || "Aucune fonction définie"}
              </p>
            </div>
          </div>

          {editMode && photoUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 transition self-start sm:self-center"
            >
              Supprimer photo
            </button>
          )}
        </div>
      </div>

      {/* Navigation par onglets */}
      {!isAddMode && (
        <div className="border-b bg-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap text-sm flex-1 min-w-0 ${
                    activeTab === tab.id
                      ? "border-gray-600 text-gray-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenu */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
        {(isAddMode || activeTab === "personnel") && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
            {isAddMode && (
              <div className="flex items-center gap-2 mb-6 pb-3 border-b">
                <User className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Informations Personnelles
                </h3>
              </div>
            )}

            {/* {isAddMode && (
              <div className="mb-6 p-4 bg-white rounded-lg border">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Photo de profil
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {photoUrl ? (
                      <img 
                        src={photoUrl} 
                        alt="Aperçu photo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Choisir une photo
                      </button>
                      <p className="text-xs text-gray-500">
                        Formats supportés: JPG, JPEG, PNG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )} */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Colonne 1 */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    N° Matricule *
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.numero_matricule || ""}
                      onChange={(e) =>
                        handlePersonalChange("numero_matricule", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      required
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.numero_matricule || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.nom || ""}
                      onChange={(e) =>
                        handlePersonalChange("nom", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      required
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.nom || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Prénoms *
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.prenoms || ""}
                      onChange={(e) =>
                        handlePersonalChange("prenoms", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      required
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.prenoms || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Sexe
                  </label>
                  {editMode ? (
                    <select
                      value={data.sexe || ""}
                      onChange={(e) =>
                        handlePersonalChange("sexe", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="">-- Sélectionnez --</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.sexe || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Appellation
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.appellation || ""}
                      onChange={(e) =>
                        handlePersonalChange("appellation", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.appellation || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.date_naissance || ""}
                      onChange={(e) =>
                        handlePersonalChange("date_naissance", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.date_naissance || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Lieu de naissance
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.lieu_naissance || ""}
                      onChange={(e) =>
                        handlePersonalChange("lieu_naissance", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.lieu_naissance || "-"}
                    </span>
                  )}
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    CIN
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.CIN || ""}
                      onChange={(e) =>
                        handlePersonalChange("CIN", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.CIN || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Date CIN
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.date_CIN || ""}
                      onChange={(e) =>
                        handlePersonalChange("date_CIN", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.date_CIN || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Lieu CIN
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.lieu_CIN || ""}
                      onChange={(e) =>
                        handlePersonalChange("lieu_CIN", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.lieu_CIN || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    N° CNAPS
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.numero_cnaps || ""}
                      onChange={(e) =>
                        handlePersonalChange("numero_cnaps", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.numero_cnaps || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Fonction
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.fonction || ""}
                      onChange={(e) =>
                        handlePersonalChange("fonction", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.fonction || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.section || ""}
                      onChange={(e) =>
                        handlePersonalChange("section", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.section || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Ancien N° Journalière
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.ancien_numero_journaliere || ""}
                      onChange={(e) =>
                        handlePersonalChange(
                          "ancien_numero_journaliere",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.ancien_numero_journaliere || "-"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ligne supplémentaire */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Père
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.pere || ""}
                      onChange={(e) =>
                        handlePersonalChange("pere", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.pere || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Mère
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.mere || ""}
                      onChange={(e) =>
                        handlePersonalChange("mere", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.mere || "-"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.telephone || ""}
                      onChange={(e) =>
                        handlePersonalChange("telephone", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.telephone || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      value={data.email || ""}
                      onChange={(e) =>
                        handlePersonalChange("email", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.email || "-"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">
                    Adresse
                  </label>
                  {editMode ? (
                    <textarea
                      value={data.adresse || ""}
                      onChange={(e) =>
                        handlePersonalChange("adresse", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-[40px] resize-none"
                      rows={3}
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
                      {data.adresse || "-"}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">
                    Quartier
                  </label>
                  {editMode ? (
                    <textarea
                      value={data.quartier || ""}
                      onChange={(e) =>
                        handlePersonalChange("quartier", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-[40px] resize-none"
                      rows={2}
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
                      {data.quartier || "-"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse et quartier */}
            {/* <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">
                    Adresse
                  </label>
                  {editMode ? (
                    <textarea
                      value={data.adresse || ""}
                      onChange={(e) =>
                        handlePersonalChange("adresse", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-[40px] resize-none"
                      rows={3}
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
                      {data.adresse || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">
                    Quartier
                  </label>
                  {editMode ? (
                    <textarea
                      value={data.quartier || ""}
                      onChange={(e) =>
                        handlePersonalChange("quartier", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 h-[40px] resize-none"
                      rows={2}
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
                      {data.quartier || "-"}
                    </span>
                  )}
                </div> */}
          </div>
        )}

        {/* SECTION 2 : INFORMATIONS SALAIRE */}
        {(isAddMode || activeTab === "salaire") && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
            {isAddMode && (
              <div className="flex items-center gap-2 mb-6 pb-3 border-b">
                <Briefcase className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Informations Salaire
                </h3>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Date d'embauche
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.salaire_personnel?.date_embauche || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "date_embauche",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.date_embauche || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Fonction
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.fonction || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "fonction",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.fonction || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.categorie || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "categorie",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.categorie || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Salaire
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      step="0.01"
                      value={data.salaire_personnel?.salaire || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "salaire",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.salaire
                        ? `${data.salaire_personnel.salaire} Ar`
                        : "-"}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.section || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "section",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.section || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Responsable section
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.responsable_section || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "responsable_section",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.responsable_section || "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Prime ancienneté
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      step="0.01"
                      value={data.salaire_personnel?.prime_anciennete || ""}
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "prime_anciennete",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.prime_anciennete
                        ? `${data.salaire_personnel.prime_anciennete} Ar`
                        : "-"}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    Indemnité déplacement
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      step="0.01"
                      value={
                        data.salaire_personnel?.indemnite_deplacement || ""
                      }
                      onChange={(e) =>
                        handleSectionChange(
                          "salaire_personnel",
                          "indemnite_deplacement",
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">
                      {data.salaire_personnel?.indemnite_deplacement
                        ? `${data.salaire_personnel.indemnite_deplacement} Ar`
                        : "-"}
                    </span>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Observations sur les primes
                </label>
                {editMode ? (
                  <textarea
                    value={data.salaire_personnel?.obs_prime || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        "salaire_personnel",
                        "obs_prime",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2 whitespace-pre-line">
                    {data.salaire_personnel?.obs_prime || "-"}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3 : INFORMATIONS BANCAIRES */}
        {(isAddMode || activeTab === "bancaire") && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
            {isAddMode && (
              <div className="flex items-center gap-2 mb-6 pb-3 border-b">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Informations Bancaires
                </h3>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Nom de la banque
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.nom_banque || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        "bancaire",
                        "nom_banque",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">
                    {data.bancaire?.nom_banque || "-"}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Code banque
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.code_banque || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        "bancaire",
                        "code_banque",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">
                    {data.bancaire?.code_banque || "-"}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Code agence
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.code_agence || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        "bancaire",
                        "code_agence",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">
                    {data.bancaire?.code_agence || "-"}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  N° de compte
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.numero_compte || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        "bancaire",
                        "numero_compte",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">
                    {data.bancaire?.numero_compte || "-"}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Clé RIB
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.cle_rib || ""}
                    onChange={(e) =>
                      handleSectionChange("bancaire", "cle_rib", e.target.value)
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">
                    {data.bancaire?.cle_rib || "-"}
                  </span>
                )}
              </div>

              <div className="flex flex-col md:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-gray-700 mb-2">
                  Banque bénéficiaire
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.banque_beneficiaire || ""}
                    onChange={(e) =>
                      handleSectionChange(
                        "bancaire",
                        "banque_beneficiaire",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">
                    {data.bancaire?.banque_beneficiaire || "-"}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4 : INFORMATIONS FAMILIALES */}
        {(isAddMode || activeTab === "familiale") && (
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
            {isAddMode && (
              <div className="flex items-center gap-2 mb-6 pb-3 border-b">
                <Users className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Informations Familiales
                </h3>
              </div>
            )}

            <div className="space-y-8">
              {/* Sous-section Époux(se) */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b">
                  Époux(se)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Nom époux/épouse
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_nom || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_nom",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-800 py-2">
                        {data.familiale?.epoux_nom || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Prénoms époux/épouse
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_prenoms || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_prenoms",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-800 py-2">
                        {data.familiale?.epoux_prenoms || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Date naissance
                    </label>
                    {editMode ? (
                      <input
                        type="date"
                        value={data.familiale?.epoux_date_naissance || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_date_naissance",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-800 py-2">
                        {data.familiale?.epoux_date_naissance || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Lieu naissance
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_lieu_naissance || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_lieu_naissance",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-800 py-2">
                        {data.familiale?.epoux_lieu_naissance || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Société
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_societe || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_societe",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-800 py-2">
                        {data.familiale?.epoux_societe || "-"}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Fonction
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={data.familiale?.epoux_fonction || ""}
                        onChange={(e) =>
                          handleSectionChange(
                            "familiale",
                            "epoux_fonction",
                            e.target.value
                          )
                        }
                        className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:outline-none focus:ring-1 focus:ring-gray-500"
                      />
                    ) : (
                      <span className="text-sm text-gray-800 py-2">
                        {data.familiale?.epoux_fonction || "-"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Sous-section Enfants */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-2 border-b">
                  <h4 className="text-md font-semibold text-gray-800">
                    Enfants
                  </h4>
                  {editMode && (
                    <button
                      type="button"
                      onClick={handleAddChild}
                      className="flex items-center justify-center gap-2 px-3 py-1 bg-white border border-green-600 text-green-600 rounded text-sm font-medium hover:bg-green-50 transition w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Ajouter un enfant
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {editMode ? (
                    (data.familiale?.enfants || []).map((enfant, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-medium text-gray-700">
                            Enfant {index + 1}
                          </h5>
                          <button
                            type="button"
                            onClick={() => handleRemoveChild(index)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-600 mb-1">
                              Nom et prénoms
                            </label>
                            <input
                              type="text"
                              value={enfant.nom_prenoms || ""}
                              onChange={(e) =>
                                handleChildChange(
                                  index,
                                  "nom_prenoms",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                              placeholder="Nom et prénoms"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-600 mb-1">
                              Sexe
                            </label>
                            <select
                              value={enfant.sexe || ""}
                              onChange={(e) =>
                                handleChildChange(index, "sexe", e.target.value)
                              }
                              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                            >
                              <option value="">-- Sélectionnez --</option>
                              <option value="Masculin">Masculin</option>
                              <option value="Féminin">Féminin</option>
                            </select>
                          </div>

                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-600 mb-1">
                              Date naissance
                            </label>
                            <input
                              type="date"
                              value={enfant.date_naissance || ""}
                              onChange={(e) =>
                                handleChildChange(
                                  index,
                                  "date_naissance",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label className="text-xs font-medium text-gray-600 mb-1">
                              Lieu naissance
                            </label>
                            <input
                              type="text"
                              value={enfant.lieu_naissance || ""}
                              onChange={(e) =>
                                handleChildChange(
                                  index,
                                  "lieu_naissance",
                                  e.target.value
                                )
                              }
                              className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-500"
                              placeholder="Lieu de naissance"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : data.familiale?.enfants &&
                    data.familiale.enfants.length > 0 ? (
                    data.familiale.enfants.map((enfant, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-xs text-gray-500 block">
                              Nom et prénoms
                            </span>
                            <span className="font-medium text-gray-800">
                              {enfant.nom_prenoms || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">
                              Sexe
                            </span>
                            <span className="text-gray-800">
                              {enfant.sexe || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">
                              Date naissance
                            </span>
                            <span className="text-gray-800">
                              {enfant.date_naissance || "-"}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block">
                              Lieu naissance
                            </span>
                            <span className="text-gray-800">
                              {enfant.lieu_naissance || "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">
                        Aucun enfant enregistré
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      {editMode && (
        <div className="border-t bg-gray-50 px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end sticky bottom-0">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition text-sm font-medium order-2 sm:order-1 disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-akj text-white rounded-md transition text-sm font-medium order-1 sm:order-2 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {employee ? "Modifier l'employé" : "Créer l'employé"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeBlock;
