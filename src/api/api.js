// import axios from "axios";


// // URL de base de ton API Django
// const BASE_URL = "http://127.0.0.1:8000/"; 

// // Création d'une instance Axios
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// //Exemple pour gérer le token si tu utilises l'authentification
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('token');
//     if(token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;


import axios from "axios";

// URL de base de ton API Django
const BASE_URL = import.meta.env.VITE_API_URL;

// Création d'une instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Exemple pour gérer le token si tu utilises l'authentification
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
