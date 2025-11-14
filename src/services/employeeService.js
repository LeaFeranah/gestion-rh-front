
// import axios from "axios";

// //const BASE_URL = "http://localhost:8000/api/personnel/";
// const BASE_URL = "http://192.168.3.178:8000/api/personnel/"

// // ----------- PERSONNEL -----------

// // GET all employees
// export const getAllEmployees = async () => {
//   const res = await axios.get(`${BASE_URL}employes/`);
//   return res.data;
// };

// // GET single employee by ID
// export const getEmployeeById = async (id) => {
//   const res = await axios.get(`${BASE_URL}employes/${id}/`);
//   return res.data;
// };

// // CREATE new employee
// export const createEmployee = async (data) => {
//   const res = await axios.post(`${BASE_URL}employes/`, data);
//   return res.data;
// };

// // UPDATE employee
// export const updateEmployee = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}employes/${id}/`, data);
//   return res.data;
// };

// // DELETE employee
// export const deleteEmployee = async (id) => {
//   const res = await axios.delete(`${BASE_URL}employes/${id}/`);
//   return res.data;
// };


// // ----------- DOSSIER PERSONNEL -----------

// export const getAllDossiers = async () => {
//   const res = await axios.get(`${BASE_URL}dossier/`);
//   return res.data;
// };

// export const getDossierById = async (id) => {
//   const res = await axios.get(`${BASE_URL}dossier/${id}/`);
//   return res.data;
// };

// // CREATE new dossier personnel (POST)
// export const createDossier = async (data) => {
//   const formData = new FormData();

//   // Ajouter chaque champ à FormData
//   for (const key in data) {
//     if (data[key]) {
//       formData.append(key, data[key]);
//     }
//   }

//   const res = await axios.post(`${BASE_URL}dossier/`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// // UPDATE existing dossier (PATCH)
// export const updateDossier = async (id, data) => {
//   const formData = new FormData();

//   for (const key in data) {
//     if (data[key]) {
//       formData.append(key, data[key]);
//     }
//   }

//   const res = await axios.patch(`${BASE_URL}dossier/${id}/`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// // DELETE dossier personnel
// export const deleteDossier = async (id) => {
//   const res = await axios.delete(`${BASE_URL}dossier/${id}/`);
//   return res.data;
// };


// // ----------- BANCAIRE -----------

// export const getAllBancaires = async () => {
//   const res = await axios.get(`${BASE_URL}bancaire/`);
//   return res.data;
// };

// export const createBancaire = async (data) => {
//   const res = await axios.post(`${BASE_URL}bancaire/`, data);
//   return res.data;
// };

// export const updateBancaire = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}bancaire/${id}/`, data);
//   return res.data;
// };

// export const deleteBancaire = async (id) => {
//   const res = await axios.delete(`${BASE_URL}bancaire/${id}/`);
//   return res.data;
// };

// // ----------- SOCIALE -----------

// export const getAllSociales = async () => {
//   const res = await axios.get(`${BASE_URL}sociale/`);
//   return res.data;
// };

// export const createSociale = async (data) => {
//   const res = await axios.post(`${BASE_URL}sociale/`, data);
//   return res.data;
// };

// export const updateSociale = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}sociale/${id}/`, data);
//   return res.data;
// };

// export const deleteSociale = async (id) => {
//   const res = await axios.delete(`${BASE_URL}sociale/${id}/`);
//   return res.data;
// };


// // ----------- FAMILIALE -----------

// export const getAllFamiliales = async () => {
//   const res = await axios.get(`${BASE_URL}familiale/`);
//   return res.data;
// };

// export const getFamilialeById = async (id) => {
//   const res = await axios.get(`${BASE_URL}familiale/${id}/`);
//   return res.data;
// };

// export const createFamiliale = async (data) => {
//   const res = await axios.post(`${BASE_URL}familiale/`, data);
//   return res.data;
// };

// export const updateFamiliale = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}familiale/${id}/`, data);
//   return res.data;
// };

// export const deleteFamiliale = async (id) => {
//   const res = await axios.delete(`${BASE_URL}familiale/${id}/`);
//   return res.data;
// };

// // ----------- ENFANTS -----------

// export const getAllEnfants = async () => {
//   const res = await axios.get(`${BASE_URL}enfants/`);
//   return res.data;
// };

// export const getEnfantById = async (id) => {
//   const res = await axios.get(`${BASE_URL}enfants/${id}/`);
//   return res.data;
// };

// export const createEnfant = async (data) => {
//   const res = await axios.post(`${BASE_URL}enfants/`, data);
//   return res.data;
// };

// export const updateEnfant = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}enfants/${id}/`, data);
//   return res.data;
// };

// export const deleteEnfant = async (id) => {
//   const res = await axios.delete(`${BASE_URL}enfants/${id}/`);
//   return res.data;
// };

// // ----------- SALAIRE PERSONNEL -----------

// export const getAllSalaires = async () => {
//   const res = await axios.get(`${BASE_URL}salaire/`);
//   return res.data;
// };

// export const getSalaireById = async (id) => {
//   const res = await axios.get(`${BASE_URL}salaire/${id}/`);
//   return res.data;
// };

// export const createSalaire = async (data) => {
//   const res = await axios.post(`${BASE_URL}salaire/`, data);
//   return res.data;
// };

// export const updateSalaire = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}salaire/${id}/`, data);
//   return res.data;
// };

// export const deleteSalaire = async (id) => {
//   const res = await axios.delete(`${BASE_URL}salaire/${id}/`);
//   return res.data;
// };



// import axios from "axios";

// const BASE_URL = "http://192.168.3.178:8000/api/personnel/";

// // ----------- PERSONNEL -----------
// export const getAllEmployees = async () => {
//   const res = await axios.get(`${BASE_URL}employes/`);
//   return res.data;
// };

// export const getEmployeeById = async (id) => {
//   const res = await axios.get(`${BASE_URL}employes/${id}/`);
//   return res.data;
// };

// export const createEmployee = async (data) => {
//   const formData = new FormData();
  
//   for (const key in data) {
//     if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
//       formData.append(key, data[key]);
//     }
//   }

//   const res = await axios.post(`${BASE_URL}employes/`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// export const updateEmployee = async (id, formData) => {
//   const res = await axios.put(`${BASE_URL}employes/${id}/`, formData, {
//     headers: { 
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   return res.data;
// };


// export const deleteEmployee = async (id) => {
//   const res = await axios.delete(`${BASE_URL}employes/${id}/`);
//   return res.data;
// };

// // ----------- DOSSIER PERSONNEL -----------
// export const getAllDossiers = async () => {
//   const res = await axios.get(`${BASE_URL}dossier/`);
//   return res.data;
// };

// export const getDossierById = async (id) => {
//   const res = await axios.get(`${BASE_URL}dossier/${id}/`);
//   return res.data;
// };

// export const createDossier = async (data) => {
//   const formData = new FormData();
//   for (const key in data) {
//     if (data[key]) formData.append(key, data[key]);
//   }
//   const res = await axios.post(`${BASE_URL}dossier/`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// export const updateDossier = async (id, data) => {
//   const formData = new FormData();
//   for (const key in data) {
//     if (data[key]) formData.append(key, data[key]);
//   }
//   const res = await axios.patch(`${BASE_URL}dossier/${id}/`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// export const deleteDossier = async (id) => {
//   const res = await axios.delete(`${BASE_URL}dossier/${id}/`);
//   return res.data;
// };

// // ----------- BANCAIRE -----------
// export const getAllBancaires = async () => {
//   const res = await axios.get(`${BASE_URL}bancaire/`);
//   return res.data;
// };

// export const createBancaire = async (data) => {
//   const res = await axios.post(`${BASE_URL}bancaire/`, data);
//   return res.data;
// };

// export const updateBancaire = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}bancaire/${id}/`, data);
//   return res.data;
// };

// export const deleteBancaire = async (id) => {
//   const res = await axios.delete(`${BASE_URL}bancaire/${id}/`);
//   return res.data;
// };

// // ----------- SOCIALE -----------
// export const getAllSociales = async () => {
//   const res = await axios.get(`${BASE_URL}sociale/`);
//   return res.data;
// };

// export const createSociale = async (data) => {
//   const res = await axios.post(`${BASE_URL}sociale/`, data);
//   return res.data;
// };

// export const updateSociale = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}sociale/${id}/`, data);
//   return res.data;
// };

// export const deleteSociale = async (id) => {
//   const res = await axios.delete(`${BASE_URL}sociale/${id}/`);
//   return res.data;
// };

// // ----------- FAMILIALE -----------
// export const getAllFamiliales = async () => {
//   const res = await axios.get(`${BASE_URL}familiale/`);
//   return res.data;
// };

// export const getFamilialeById = async (id) => {
//   const res = await axios.get(`${BASE_URL}familiale/${id}/`);
//   return res.data;
// };

// export const createFamiliale = async (data) => {
//   const res = await axios.post(`${BASE_URL}familiale/`, data);
//   return res.data;
// };

// export const updateFamiliale = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}familiale/${id}/`, data);
//   return res.data;
// };

// export const deleteFamiliale = async (id) => {
//   const res = await axios.delete(`${BASE_URL}familiale/${id}/`);
//   return res.data;
// };

// // ----------- ENFANTS -----------
// export const getAllEnfants = async () => {
//   const res = await axios.get(`${BASE_URL}enfants/`);
//   return res.data;
// };

// export const getEnfantById = async (id) => {
//   const res = await axios.get(`${BASE_URL}enfants/${id}/`);
//   return res.data;
// };

// export const createEnfant = async (data) => {
//   const res = await axios.post(`${BASE_URL}enfants/`, data);
//   return res.data;
// };

// export const updateEnfant = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}enfants/${id}/`, data);
//   return res.data;
// };

// export const deleteEnfant = async (id) => {
//   const res = await axios.delete(`${BASE_URL}enfants/${id}/`);
//   return res.data;
// };

// // ----------- SALAIRE PERSONNEL -----------
// export const getAllSalaires = async () => {
//   const res = await axios.get(`${BASE_URL}salaire/`);
//   return res.data;
// };

// export const getSalaireById = async (id) => {
//   const res = await axios.get(`${BASE_URL}salaire/${id}/`);
//   return res.data;
// };

// export const createSalaire = async (data) => {
//   const res = await axios.post(`${BASE_URL}salaire/`, data);
//   return res.data;
// };

// export const updateSalaire = async (id, data) => {
//   const res = await axios.put(`${BASE_URL}salaire/${id}/`, data);
//   return res.data;
// };

// export const deleteSalaire = async (id) => {
//   const res = await axios.delete(`${BASE_URL}salaire/${id}/`);
//   return res.data;
// };



import axios from 'axios';

const API_URL = 'http://192.168.3.178:8000/api';

// Configuration Axios globale
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Employés
export const getAllEmployees = async () => {
  const response = await axios.get(`${API_URL}/personnel/employes/`);
  return response.data;
};

export const createEmployee = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/personnel/employes/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur création employé:', error);
    throw error;
  }
};

export const updateEmployee = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/personnel/employes/${id}/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axios.delete(`${API_URL}/personnel/employes/${id}/`);
  return response.data;
};

// Informations bancaires
export const createBancaire = async (bancaireData) => {
  const response = await axios.post(`${API_URL}/personnel/bancaire/`, bancaireData);
  return response.data;
};

export const updateBancaire = async (id, bancaireData) => {
  const response = await axios.put(`${API_URL}/personnel/bancaire/${id}/`, bancaireData);
  return response.data;
};

// Informations salaire
export const createSalaire = async (salaireData) => {
  const response = await axios.post(`${API_URL}/personnel/salaire/`, salaireData);
  return response.data;
};

export const updateSalaire = async (id, salaireData) => {
  const response = await axios.put(`${API_URL}/personnel/salaire/${id}/`, salaireData);
  return response.data;
};

// Informations familiales
export const createFamiliale = async (familialeData) => {
  const response = await axios.post(`${API_URL}/personnel/familiale/`, familialeData);
  return response.data;
};

export const updateFamiliale = async (id, familialeData) => {
  const response = await axios.put(`${API_URL}/personnel/familiale/${id}/`, familialeData);
  return response.data;
};

// 🔹 Gestion des enfants
export const getAllEnfants = async () => {
  const response = await axios.get(`${API_URL}/personnel/enfants/`);
  return response.data;
};

export const getEnfantsByFamiliale = async (familialeId) => {
  const response = await axios.get(`${API_URL}/personnel/enfants/?familiale=${familialeId}`);
  return response.data;
};

export const createEnfant = async (enfantData) => {
  const response = await axios.post(`${API_URL}/personnel/enfants/`, enfantData);
  return response.data;
};

export const updateEnfant = async (id, enfantData) => {
  const response = await axios.put(`${API_URL}/personnel/enfants/${id}/`, enfantData);
  return response.data;
};

export const deleteEnfant = async (id) => {
  const response = await axios.delete(`${API_URL}/personnel/enfants/${id}/`);
  return response.data;
};

export const getEnfant = async (id) => {
  const response = await axios.get(`${API_URL}/personnel/enfants/${id}/`);
  return response.data;
};