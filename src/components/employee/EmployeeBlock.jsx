import React from "react";

const EmployeeBlock = ({
  employee,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editMode,
}) => {
  const data = formData || employee || {};

  // Mise à jour générale pour sections (ex: "bancaire", "salaire_personnel", "familiale")
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  // Mise à jour pour champs personnels au niveau racine (ex: numero_matricule, nom, date_naissance...)
  const handleChangePerso = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        {editMode ? "Ajouter / Éditer Employé" : "Détails Employé"}
      </h2>

      {/* ------------------ Informations Personnelles ------------------ */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Informations Personnelles</h3>

        {[
          "numero_matricule",
          "nom",
          "prenoms",
          "sexe",
          "appellation",
          "date_naissance",
          "lieu_naissance",
          "CIN",
          "date_CIN",
          "lieu_CIN",
          "numero_cnaps",
          "fonction",
          "section",
          "ancien_numero_journaliere",
          "pere",
          "mere",
          "adresse",
          "quartier",
          "telephone",
          "email",
        ].map((field) => (
          <div key={field} className="flex gap-2 items-center">
            <label className="w-40 capitalize">{field.replace(/_/g, " ")} :</label>

            {editMode ? (
              field === "sexe" ? (
                <select
                  value={data?.[field] || ""}
                  onChange={(e) => handleChangePerso(field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                >
                  <option value="">-- Sélectionnez --</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>
              ) : field.includes("date") ? (
                <input
                  type="date"
                  value={data?.[field] || ""}
                  onChange={(e) => handleChangePerso(field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                />
              ) : field === "adresse" || field === "quartier" ? (
                <textarea
                  value={data?.[field] || ""}
                  onChange={(e) => handleChangePerso(field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                />
              ) : (
                <input
                  type="text"
                  value={data?.[field] || ""}
                  onChange={(e) => handleChangePerso(field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                />
              )
            ) : (
              <span>{data?.[field] || "-"}</span>
            )}
          </div>
        ))}
      </div>

      {/* ------------------ Informations Bancaires ------------------ */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Informations Bancaires</h3>

        {["nom_banque", "code_banque", "code_agence", "numero_compte", "cle_rib", "banque_beneficiaire"].map(
          (field) => (
            <div key={field} className="flex gap-2 items-center">
              <label className="w-40 capitalize">{field.replace(/_/g, " ")} :</label>
              {editMode ? (
                <input
                  type="text"
                  value={data.bancaire?.[field] || ""}
                  onChange={(e) => handleChange("bancaire", field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                />
              ) : (
                <span>{data.bancaire?.[field] || "-"}</span>
              )}
            </div>
          )
        )}
      </div>

      {/* ------------------ Informations Salaire ------------------ */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Informations Salaire</h3>

        {[
          "date_embauche",
          "fonction",
          "categorie",
          "salaire",
          "section",
          "responsable_section",
          "prime_anciennete",
          "indemnite_deplacement",
          "dernier_aug_indice",
          "pour_30",
          "T1_17",
          "T2_17",
          "T3_17",
          "T4_17",
          "obs_prime",
        ].map((field) => (
          <div key={field} className="flex gap-2 items-start">
            <label className="w-48 capitalize">{field.replace(/_/g, " ")} :</label>

            {editMode ? (
              field === "obs_prime" ? (
                <textarea
                  value={data.salaire_personnel?.[field] || ""}
                  onChange={(e) => handleChange("salaire_personnel", field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                  rows={3}
                />
              ) : (
                <input
                  type={field.includes("date") ? "date" : field.includes("salaire") || field.includes("prime") || field.includes("indemnite") || field.startsWith("T") ? "number" : "text"}
                  value={data.salaire_personnel?.[field] ?? ""}
                  onChange={(e) => handleChange("salaire_personnel", field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                />
              )
            ) : (
              <span className="flex-1">{data.salaire_personnel?.[field] ?? "-"}</span>
            )}
          </div>
        ))}
      </div>

      {/* ------------------ Informations Familiales ------------------ */}
      <div className="border p-4 rounded space-y-2">
        <h3 className="font-semibold">Informations Familiales</h3>

        {["epoux_nom", "epoux_prenoms", "epoux_date_naissance", "epoux_lieu_naissance", "epoux_societe", "epoux_fonction"].map(
          (field) => (
            <div key={field} className="flex gap-2 items-center">
              <label className="w-40 capitalize">{field.replace(/_/g, " ")} :</label>

              {editMode ? (
                <input
                  type={field.includes("date") ? "date" : "text"}
                  value={data.familiale?.[field] ?? ""}
                  onChange={(e) => handleChange("familiale", field, e.target.value)}
                  className="border p-1 flex-1 rounded"
                />
              ) : (
                <span>{data.familiale?.[field] ?? "-"}</span>
              )}
            </div>
          )
        )}

        {data.enfants?.length > 0 && (
          <div className="mt-2">
            <h4 className="font-semibold">Enfants :</h4>
            {data.enfants.map((enfant, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <span>
                  {enfant.nom_prenoms} - {enfant.sexe} - {enfant.date_naissance || "-"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------ Boutons ------------------ */}
      {editMode ? (
        <div className="flex gap-2">
          <button onClick={onSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Enregistrer
          </button>
          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Annuler
          </button>
        </div>
      ) : (
        <div>
          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Retour
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeBlock;



