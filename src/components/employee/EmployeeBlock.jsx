import React, { useState } from "react";
import { ArrowLeft, User, Briefcase, CreditCard, Users } from "lucide-react";

const EmployeeBlock = ({
  employee,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editMode,
}) => {
  const [activeTab, setActiveTab] = useState("personnel");

  const tabs = [
    { id: "personnel", label: "Informations Personnelles", icon: User },
    { id: "salaire", label: "Informations Salaire", icon: Briefcase },
    { id: "bancaire", label: "Informations Bancaires", icon: CreditCard },
    { id: "familiale", label: "Informations Familiales", icon: Users },
  ];

  const data = formData || employee || {};

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

  const isViewMode = !editMode && employee;
  // NOUVEAU : Mode ajout = afficher tout en une page
  const isAddMode = editMode && !employee;

  return (
    <div className="bg-white">
      {/* En-tête */}
      {isViewMode ? (
        <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-medium text-gray-800">
              {data.nom || ""} {data.prenoms || ""}
            </h2>
            <p className="text-sm text-gray-500">N° {data.numero_matricule || ""}</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-medium text-gray-800">
              {employee ? "Modifier l'employé" : "Nouvel employé"}
            </h2>
            {employee && (
              <p className="text-sm text-gray-500">
                {data.nom || ""} {data.prenoms || ""} - N° {data.numero_matricule || ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Navigation par onglets - MASQUÉE EN MODE AJOUT */}
      {!isAddMode && (
        <div className="border-b bg-gray-50">
          <div className="flex gap-1 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Contenu - EN MODE AJOUT, TOUT EST VISIBLE */}
      <div className="p-6 space-y-8">
        {/* SECTION 1 : INFORMATIONS PERSONNELLES */}
        {(isAddMode || activeTab === "personnel") && (
          <div>
            {isAddMode && (
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <User className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-800">Informations Personnelles</h3>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Colonne 1 */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">N° Matricule *</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.numero_matricule || ""}
                      onChange={(e) => handlePersonalChange("numero_matricule", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.numero_matricule || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Nom *</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.nom || ""}
                      onChange={(e) => handlePersonalChange("nom", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.nom || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Prénoms *</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.prenoms || ""}
                      onChange={(e) => handlePersonalChange("prenoms", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.prenoms || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Sexe</label>
                  {editMode ? (
                    <select
                      value={data.sexe || ""}
                      onChange={(e) => handlePersonalChange("sexe", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">-- Sélectionnez --</option>
                      <option value="Masculin">Masculin</option>
                      <option value="Féminin">Féminin</option>
                    </select>
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.sexe || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Appellation</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.appellation || ""}
                      onChange={(e) => handlePersonalChange("appellation", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.appellation || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Date de naissance</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.date_naissance || ""}
                      onChange={(e) => handlePersonalChange("date_naissance", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.date_naissance || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Lieu de naissance</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.lieu_naissance || ""}
                      onChange={(e) => handlePersonalChange("lieu_naissance", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.lieu_naissance || "-"}</span>
                  )}
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">CIN</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.CIN || ""}
                      onChange={(e) => handlePersonalChange("CIN", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.CIN || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Date CIN</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.date_CIN || ""}
                      onChange={(e) => handlePersonalChange("date_CIN", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.date_CIN || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Lieu CIN</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.lieu_CIN || ""}
                      onChange={(e) => handlePersonalChange("lieu_CIN", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.lieu_CIN || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">N° CNAPS</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.numero_cnaps || ""}
                      onChange={(e) => handlePersonalChange("numero_cnaps", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.numero_cnaps || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Fonction</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.fonction || ""}
                      onChange={(e) => handlePersonalChange("fonction", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.fonction || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Section</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.section || ""}
                      onChange={(e) => handlePersonalChange("section", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.section || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Ancien N° Journalière</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.ancien_numero_journaliere || ""}
                      onChange={(e) => handlePersonalChange("ancien_numero_journaliere", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.ancien_numero_journaliere || "-"}</span>
                  )}
                </div>
              </div>

              {/* Colonne pleine largeur */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Père</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.pere || ""}
                      onChange={(e) => handlePersonalChange("pere", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.pere || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Mère</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.mere || ""}
                      onChange={(e) => handlePersonalChange("mere", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.mere || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Téléphone</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.telephone || ""}
                      onChange={(e) => handlePersonalChange("telephone", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.telephone || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Email</label>
                  {editMode ? (
                    <input
                      type="email"
                      value={data.email || ""}
                      onChange={(e) => handlePersonalChange("email", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.email || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Adresse</label>
                  {editMode ? (
                    <textarea
                      value={data.adresse || ""}
                      onChange={(e) => handlePersonalChange("adresse", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.adresse || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Quartier</label>
                  {editMode ? (
                    <textarea
                      value={data.quartier || ""}
                      onChange={(e) => handlePersonalChange("quartier", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={2}
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.quartier || "-"}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2 : INFORMATIONS SALAIRE */}
        {(isAddMode || activeTab === "salaire") && (
          <div>
            {isAddMode && (
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-800">Informations Salaire</h3>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Date d'embauche</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.salaire_personnel?.date_embauche || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "date_embauche", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.date_embauche || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Fonction</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.fonction || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "fonction", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.fonction || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Catégorie</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.categorie || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "categorie", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.categorie || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Salaire</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={data.salaire_personnel?.salaire || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "salaire", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.salaire || "-"}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Section</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.section || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "section", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.section || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Responsable section</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.salaire_personnel?.responsable_section || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "responsable_section", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.responsable_section || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Prime ancienneté</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={data.salaire_personnel?.prime_anciennete || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "prime_anciennete", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.prime_anciennete || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Indemnité déplacement</label>
                  {editMode ? (
                    <input
                      type="number"
                      value={data.salaire_personnel?.indemnite_deplacement || ""}
                      onChange={(e) => handleSectionChange("salaire_personnel", "indemnite_deplacement", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.salaire_personnel?.indemnite_deplacement || "-"}</span>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Obs. Prime</label>
                {editMode ? (
                  <textarea
                    value={data.salaire_personnel?.obs_prime || ""}
                    onChange={(e) => handleSectionChange("salaire_personnel", "obs_prime", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2 whitespace-pre-line">{data.salaire_personnel?.obs_prime || "-"}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3 : INFORMATIONS BANCAIRES */}
        {(isAddMode || activeTab === "bancaire") && (
          <div>
            {isAddMode && (
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-800">Informations Bancaires</h3>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Nom de la banque</label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.nom_banque || ""}
                    onChange={(e) => handleSectionChange("bancaire", "nom_banque", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">{data.bancaire?.nom_banque || "-"}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Code banque</label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.code_banque || ""}
                    onChange={(e) => handleSectionChange("bancaire", "code_banque", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">{data.bancaire?.code_banque || "-"}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Code agence</label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.code_agence || ""}
                    onChange={(e) => handleSectionChange("bancaire", "code_agence", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">{data.bancaire?.code_agence || "-"}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">N° de compte</label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.numero_compte || ""}
                    onChange={(e) => handleSectionChange("bancaire", "numero_compte", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">{data.bancaire?.numero_compte || "-"}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Clé RIB</label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.cle_rib || ""}
                    onChange={(e) => handleSectionChange("bancaire", "cle_rib", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">{data.bancaire?.cle_rib || "-"}</span>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">Banque bénéficiaire</label>
                {editMode ? (
                  <input
                    type="text"
                    value={data.bancaire?.banque_beneficiaire || ""}
                    onChange={(e) => handleSectionChange("bancaire", "banque_beneficiaire", e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-sm text-gray-800 py-2">{data.bancaire?.banque_beneficiaire || "-"}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4 : INFORMATIONS FAMILIALES */}
        {(isAddMode || activeTab === "familiale") && (
          <div>
            {isAddMode && (
              <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-medium text-gray-800">Informations Familiales</h3>
              </div>
            )}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Nom époux/épouse</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.familiale?.epoux_nom || ""}
                      onChange={(e) => handleSectionChange("familiale", "epoux_nom", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_nom || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Prénoms époux/épouse</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.familiale?.epoux_prenoms || ""}
                      onChange={(e) => handleSectionChange("familiale", "epoux_prenoms", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_prenoms || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Date naissance</label>
                  {editMode ? (
                    <input
                      type="date"
                      value={data.familiale?.epoux_date_naissance || ""}
                      onChange={(e) => handleSectionChange("familiale", "epoux_date_naissance", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_date_naissance || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Lieu naissance</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.familiale?.epoux_lieu_naissance || ""}
                      onChange={(e) => handleSectionChange("familiale", "epoux_lieu_naissance", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_lieu_naissance || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Société</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.familiale?.epoux_societe || ""}
                      onChange={(e) => handleSectionChange("familiale", "epoux_societe", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_societe || "-"}</span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-medium text-gray-600 mb-1">Fonction</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={data.familiale?.epoux_fonction || ""}
                      onChange={(e) => handleSectionChange("familiale", "epoux_fonction", e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-800 py-2">{data.familiale?.epoux_fonction || "-"}</span>
                  )}
                </div>
              </div>

              {/* Enfants - Affichage en mode consultation */}
              {!editMode && (
                <>
                  {data.enfants && data.enfants.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Enfants</h4>
                      <div className="space-y-2">
                        {data.enfants.map((enfant, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                            <span className="text-sm text-gray-800">
                              {enfant.nom_prenoms || "Non renseigné"} - {enfant.sexe || "Non renseigné"} - {enfant.date_naissance || "Non renseigné"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <span className="text-sm text-gray-500">Aucun enfant enregistré</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Boutons d'action - SEULEMENT EN MODE ÉDITION/AJOUT */}
      {editMode && (
        <div className="border-t bg-gray-50 px-6 py-4 flex gap-3 justify-end sticky bottom-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition text-sm"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-medium"
          >
            {employee ? "Modifier l'employé" : "Créer l'employé"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeBlock;