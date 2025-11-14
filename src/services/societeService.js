import axios from "axios";

//const BASE_URL = "http://localhost:8000/societes/api/societe/";
const BASE_URL = "http://192.168.3.178:8000/societes/api/societe/";

// Liste complète
export const fetchSocietesListe = async () => {
  const res = await axios.get(`${BASE_URL}liste/`);
  return res.data;
};

// Liste générale + création
export const fetchSocietes = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

export const createSociete = async (data) => {
  const res = await axios.post(BASE_URL, data);
  return res.data;
};

// Détails, update, delete
export const fetchSocieteDetail = async (id) => {
  const res = await axios.get(`${BASE_URL}${id}`);
  return res.data;
};

export const updateSociete = async (id, data) => {
  const res = await axios.put(`${BASE_URL}${id}`, data);
  return res.data;
};

export const patchSociete = async (id, data) => {
  const res = await axios.patch(`${BASE_URL}${id}`, data);
  return res.data;
};

export const deleteSociete = async (id) => {
  const res = await axios.delete(`${BASE_URL}${id}`);
  return res.data;
};
