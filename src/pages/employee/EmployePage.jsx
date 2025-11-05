import React, { useState, useEffect } from "react";
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
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setEmployees(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

 
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

  const handleUpdate = async () => {
    if (!selectedEmployee) return;

    try {
      // --- Informations personnelles ---
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
        date_CIN: formData.date_CIN || "",
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

      // --- Bancaire ---
      if (formData.bancaire?.id) {
        await updateBancaire(formData.bancaire.id, {
          ...formData.bancaire,
          employe: selectedEmployee.id,
        });
      } else if (
        formData.bancaire?.nom_banque ||
        formData.bancaire?.numero_compte
      ) {
        await createBancaire({
          ...formData.bancaire,
          employe: selectedEmployee.id,
        });
      }

      // --- Salaire ---
      if (formData.salaire_personnel?.id) {
        await updateSalaire(formData.salaire_personnel.id, {
          ...formData.salaire_personnel,
          employe: selectedEmployee.id,
          date_embauche: formData.salaire_personnel?.date_embauche || null,
        });
      } else if (
        formData.salaire_personnel?.salaire ||
        formData.salaire_personnel?.fonction
      ) {
        await createSalaire({
          ...formData.salaire_personnel,
          employe: selectedEmployee.id,
          date_embauche: formData.salaire_personnel?.date_embauche || null,
        });
      }

      // --- Familiale ---
      if (formData.familiale?.id) {
        await updateFamiliale(formData.familiale.id, {
          ...formData.familiale,
          employe: selectedEmployee.id,
          epoux_date_naissance: formData.familiale?.epoux_date_naissance
            ? typeof formData.familiale.epoux_date_naissance === "string"
              ? formData.familiale.epoux_date_naissance
              : formData.familiale.epoux_date_naissance[0] || null
            : null,
        });
      } else if (
        formData.familiale?.epoux_nom ||
        formData.familiale?.enfants?.length > 0
      ) {
        await createFamiliale({
          ...formData.familiale,
          employe: selectedEmployee.id,
          epoux_date_naissance: formData.familiale?.epoux_date_naissance
            ? typeof formData.familiale.epoux_date_naissance === "string"
              ? formData.familiale.epoux_date_naissance
              : formData.familiale.epoux_date_naissance[0] || null
            : null,
        });
      }

      
      fetchEmployees();
      setEditMode(false);
      setSelectedEmployee(null);
      resetForm();
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour :",
        error.response?.data || error
      );
      alert(
        "Erreur lors de la mise à jour. Vérifie les champs obligatoires et le format des données !"
      );
    }
  };

  const handleAdd = async () => {
    try {
      
      if (!formData.numero_matricule || !formData.nom || !formData.prenoms) {
        alert("Veuillez remplir le numéro de matricule, nom et prénoms !");
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
        date_CIN: formData.date_CIN || "",
        lieu_CIN: formData.lieu_CIN || "",
        numero_cnaps: formData.numero_cnaps || "",
        ancien_numero_journaliere : formData.ancien_numero_journaliere || "",
        pere: formData.pere || "",
        mere: formData.mere || "",
        adresse: formData.adresse || "",
        quartier: formData.quartier || "",
        telephone: formData.telephone || "",
        email: formData.email || "",
      };

      
      const newEmp = await createEmployee(persoData);

      // Bancaire
      if (formData.bancaire?.nom_banque || formData.bancaire?.numero_compte) {
        await createBancaire({
          ...formData.bancaire,
          employe: newEmp.id,
          nom_banque: formData.bancaire.nom_banque || "",
          numero_compte: formData.bancaire.numero_compte || "",
          cle_rib: formData.bancaire.cle_rib || "",
          banque_beneficiaire: formData.bancaire.banque_beneficiaire || "",
        });
      }

      // Salaire
      if (
        formData.salaire_personnel?.salaire ||
        formData.salaire_personnel?.fonction
      ) {
        await createSalaire({
          ...formData.salaire_personnel,
          employe: newEmp.id,
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
        });
      }

      // Familiale
      if (
        formData.familiale?.epoux_nom ||
        formData.familiale?.enfants?.length > 0
      ) {
        await createFamiliale({
          ...formData.familiale,
          employe: newEmp.id,
          epoux_nom: formData.familiale.epoux_nom || "",
          epoux_prenoms: formData.familiale.epoux_prenoms || "",
          epoux_date_naissance: formData.familiale.epoux_date_naissance || null,
          epoux_lieu_naissance: formData.familiale.epoux_lieu_naissance || "",
          epoux_societe: formData.familiale.epoux_societe || "",
          epoux_fonction: formData.familiale.epoux_fonction || "",
          enfants: formData.familiale.enfants || [],
        });
      }

      fetchEmployees();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Erreur création employé :", error.response?.data || error);
      alert(
        "Erreur lors de la création. Vérifie les champs obligatoires et le format des données !"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      fetchEmployees();
      setSelectedEmployee(null);
    } catch (error) {
      console.error(error);
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
        numero_compte: "",
        cle_rib: "",
        banque_beneficiaire: "",
      },
      salaire: { id: null, montant: "", date_paiement: "", type_salaire: "" },
      familiale: { id: null, epoux: "", enfants: [] },
    });
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 min-h-screen">
      {/* Liste des employés */}
      {!selectedEmployee && !showForm && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Liste des Employés
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditMode(false);
                setSelectedEmployee(null);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Ajouter un employé
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    N° Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Appellation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fonction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Section
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{emp.numero_matricule}</td>
                    <td className="px-6 py-4">
                      {emp.nom} {emp.prenoms}
                    </td>
                    <td className="px-6 py-4">{emp.appellation}</td>
                    <td className="px-6 py-4">{emp.fonction}</td>
                    <td className="px-6 py-4">{emp.section}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setFormData(initFormData(emp));
                          setEditMode(false);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Voir détails
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setFormData(initFormData(emp));
                          setEditMode(true);
                        }}
                        className="text-green-600 hover:underline"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bloc détails ou formulaire */}
      {(selectedEmployee || showForm || editMode) && (
        <EmployeeBlock
          employee={editMode ? selectedEmployee : null}
          formData={formData}
          setFormData={setFormData}
          onSubmit={editMode ? handleUpdate : handleAdd}
          onCancel={() => {
            setShowForm(false);
            setEditMode(false);
            setSelectedEmployee(null);
            resetForm();
          }}
          editMode={showForm || editMode}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
