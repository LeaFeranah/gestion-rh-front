
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/personnel/";

// ----------- PERSONNEL -----------

// GET all employees
export const getAllEmployees = async () => {
  const res = await axios.get(`${BASE_URL}employes/`);
  return res.data;
};

// GET single employee by ID
export const getEmployeeById = async (id) => {
  const res = await axios.get(`${BASE_URL}employes/${id}/`);
  return res.data;
};

// CREATE new employee
export const createEmployee = async (data) => {
  const res = await axios.post(`${BASE_URL}employes/`, data);
  return res.data;
};

// UPDATE employee
export const updateEmployee = async (id, data) => {
  const res = await axios.put(`${BASE_URL}employes/${id}/`, data);
  return res.data;
};

// DELETE employee
export const deleteEmployee = async (id) => {
  const res = await axios.delete(`${BASE_URL}employes/${id}/`);
  return res.data;
};


// ----------- DOSSIER PERSONNEL -----------

export const getAllDossiers = async () => {
  const res = await axios.get(`${BASE_URL}dossier/`);
  return res.data;
};

export const getDossierById = async (id) => {
  const res = await axios.get(`${BASE_URL}dossier/${id}/`);
  return res.data;
};

// CREATE new dossier personnel (POST)
export const createDossier = async (data) => {
  const formData = new FormData();

  // Ajouter chaque champ à FormData
  for (const key in data) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }

  const res = await axios.post(`${BASE_URL}dossier/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// UPDATE existing dossier (PATCH)
export const updateDossier = async (id, data) => {
  const formData = new FormData();

  for (const key in data) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }

  const res = await axios.patch(`${BASE_URL}dossier/${id}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE dossier personnel
export const deleteDossier = async (id) => {
  const res = await axios.delete(`${BASE_URL}dossier/${id}/`);
  return res.data;
};


// ----------- BANCAIRE -----------

export const getAllBancaires = async () => {
  const res = await axios.get(`${BASE_URL}bancaire/`);
  return res.data;
};

export const createBancaire = async (data) => {
  const res = await axios.post(`${BASE_URL}bancaire/`, data);
  return res.data;
};

export const updateBancaire = async (id, data) => {
  const res = await axios.put(`${BASE_URL}bancaire/${id}/`, data);
  return res.data;
};

export const deleteBancaire = async (id) => {
  const res = await axios.delete(`${BASE_URL}bancaire/${id}/`);
  return res.data;
};

// ----------- SOCIALE -----------

export const getAllSociales = async () => {
  const res = await axios.get(`${BASE_URL}sociale/`);
  return res.data;
};

export const createSociale = async (data) => {
  const res = await axios.post(`${BASE_URL}sociale/`, data);
  return res.data;
};

export const updateSociale = async (id, data) => {
  const res = await axios.put(`${BASE_URL}sociale/${id}/`, data);
  return res.data;
};

export const deleteSociale = async (id) => {
  const res = await axios.delete(`${BASE_URL}sociale/${id}/`);
  return res.data;
};


// ----------- FAMILIALE -----------

export const getAllFamiliales = async () => {
  const res = await axios.get(`${BASE_URL}familiale/`);
  return res.data;
};

export const getFamilialeById = async (id) => {
  const res = await axios.get(`${BASE_URL}familiale/${id}/`);
  return res.data;
};

export const createFamiliale = async (data) => {
  const res = await axios.post(`${BASE_URL}familiale/`, data);
  return res.data;
};

export const updateFamiliale = async (id, data) => {
  const res = await axios.put(`${BASE_URL}familiale/${id}/`, data);
  return res.data;
};

export const deleteFamiliale = async (id) => {
  const res = await axios.delete(`${BASE_URL}familiale/${id}/`);
  return res.data;
};

// ----------- ENFANTS -----------

export const getAllEnfants = async () => {
  const res = await axios.get(`${BASE_URL}enfants/`);
  return res.data;
};

export const getEnfantById = async (id) => {
  const res = await axios.get(`${BASE_URL}enfants/${id}/`);
  return res.data;
};

export const createEnfant = async (data) => {
  const res = await axios.post(`${BASE_URL}enfants/`, data);
  return res.data;
};

export const updateEnfant = async (id, data) => {
  const res = await axios.put(`${BASE_URL}enfants/${id}/`, data);
  return res.data;
};

export const deleteEnfant = async (id) => {
  const res = await axios.delete(`${BASE_URL}enfants/${id}/`);
  return res.data;
};

// ----------- SALAIRE PERSONNEL -----------

export const getAllSalaires = async () => {
  const res = await axios.get(`${BASE_URL}salaire/`);
  return res.data;
};

export const getSalaireById = async (id) => {
  const res = await axios.get(`${BASE_URL}salaire/${id}/`);
  return res.data;
};

export const createSalaire = async (data) => {
  const res = await axios.post(`${BASE_URL}salaire/`, data);
  return res.data;
};

export const updateSalaire = async (id, data) => {
  const res = await axios.put(`${BASE_URL}salaire/${id}/`, data);
  return res.data;
};

export const deleteSalaire = async (id) => {
  const res = await axios.delete(`${BASE_URL}salaire/${id}/`);
  return res.data;
};



