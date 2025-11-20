

// import axios from 'axios';

// const API_URL = 'http://192.168.3.178:8000/api';

// // Configuration Axios globale
// axios.defaults.headers.common['Content-Type'] = 'application/json';

// // Employés
// export const getAllEmployees = async () => {
//   const response = await axios.get(`${API_URL}/personnel/employes/`);
//   return response.data;
// };

// export const createEmployee = async (formData) => {
//   try {
//     const response = await axios.post(
//       `${API_URL}/personnel/employes/`,
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.error('Erreur création employé:', error);
//     throw error;
//   }
// };

// export const updateEmployee = async (id, formData) => {
//   const response = await axios.put(
//     `${API_URL}/personnel/employes/${id}/`,
//     formData,
//     {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     }
//   );
//   return response.data;
// };

// export const deleteEmployee = async (id) => {
//   const response = await axios.delete(`${API_URL}/personnel/employes/${id}/`);
//   return response.data;
// };

// // Informations bancaires
// export const createBancaire = async (bancaireData) => {
//   const response = await axios.post(`${API_URL}/personnel/bancaire/`, bancaireData);
//   return response.data;
// };

// export const updateBancaire = async (id, bancaireData) => {
//   const response = await axios.put(`${API_URL}/personnel/bancaire/${id}/`, bancaireData);
//   return response.data;
// };

// // Informations salaire
// export const createSalaire = async (salaireData) => {
//   const response = await axios.post(`${API_URL}/personnel/salaire/`, salaireData);
//   return response.data;
// };

// export const updateSalaire = async (id, salaireData) => {
//   const response = await axios.put(`${API_URL}/personnel/salaire/${id}/`, salaireData);
//   return response.data;
// };

// // Informations familiales
// export const createFamiliale = async (familialeData) => {
//   const response = await axios.post(`${API_URL}/personnel/familiale/`, familialeData);
//   return response.data;
// };

// export const updateFamiliale = async (id, familialeData) => {
//   const response = await axios.put(`${API_URL}/personnel/familiale/${id}/`, familialeData);
//   return response.data;
// };

// // 🔹 Gestion des enfants
// export const getAllEnfants = async () => {
//   const response = await axios.get(`${API_URL}/personnel/enfants/`);
//   return response.data;
// };

// export const getEnfantsByFamiliale = async (familialeId) => {
//   const response = await axios.get(`${API_URL}/personnel/enfants/?familiale=${familialeId}`);
//   return response.data;
// };

// export const createEnfant = async (enfantData) => {
//   const response = await axios.post(`${API_URL}/personnel/enfants/`, enfantData);
//   return response.data;
// };

// export const updateEnfant = async (id, enfantData) => {
//   const response = await axios.put(`${API_URL}/personnel/enfants/${id}/`, enfantData);
//   return response.data;
// };

// export const deleteEnfant = async (id) => {
//   const response = await axios.delete(`${API_URL}/personnel/enfants/${id}/`);
//   return response.data;
// };

// export const getEnfant = async (id) => {
//   const response = await axios.get(`${API_URL}/personnel/enfants/${id}/`);
//   return response.data;
// };



import api from '../api/api'; // ✅ Importer l'instance configurée avec l'intercepteur

// ❌ Plus besoin de ça :
// import axios from 'axios';
// const API_URL = 'http://192.168.3.178:8000/api';

// ✅ L'URL de base est déjà configurée dans api.js
// ✅ Le token est automatiquement ajouté par l'intercepteur

// Employés
export const getAllEmployees = async () => {
  const response = await api.get('api/personnel/employes/');
  return response.data;
};

export const createEmployee = async (formData) => {
  try {
    const response = await api.post(
      'api/personnel/employes/',
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
  const response = await api.put(
    `api/personnel/employes/${id}/`,
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
  const response = await api.delete(`api/personnel/employes/${id}/`);
  return response.data;
};

// Informations bancaires
export const createBancaire = async (bancaireData) => {
  const response = await api.post('api/personnel/bancaire/', bancaireData);
  return response.data;
};

export const updateBancaire = async (id, bancaireData) => {
  const response = await api.put(`api/personnel/bancaire/${id}/`, bancaireData);
  return response.data;
};

// Informations salaire
export const createSalaire = async (salaireData) => {
  const response = await api.post('api/personnel/salaire/', salaireData);
  return response.data;
};

export const updateSalaire = async (id, salaireData) => {
  const response = await api.put(`api/personnel/salaire/${id}/`, salaireData);
  return response.data;
};

// Informations familiales
export const createFamiliale = async (familialeData) => {
  const response = await api.post('api/personnel/familiale/', familialeData);
  return response.data;
};

export const updateFamiliale = async (id, familialeData) => {
  const response = await api.put(`api/personnel/familiale/${id}/`, familialeData);
  return response.data;
};

// 🔹 Gestion des enfants
export const getAllEnfants = async () => {
  const response = await api.get('api/personnel/enfants/');
  return response.data;
};

export const getEnfantsByFamiliale = async (familialeId) => {
  const response = await api.get(`api/personnel/enfants/?familiale=${familialeId}`);
  return response.data;
};

export const createEnfant = async (enfantData) => {
  const response = await api.post('api/personnel/enfants/', enfantData);
  return response.data;
};

export const updateEnfant = async (id, enfantData) => {
  const response = await api.put(`api/personnel/enfants/${id}/`, enfantData);
  return response.data;
};

export const deleteEnfant = async (id) => {
  const response = await api.delete(`api/personnel/enfants/${id}/`);
  return response.data;
};

export const getEnfant = async (id) => {
  const response = await api.get(`api/personnel/enfants/${id}/`);
  return response.data;
};