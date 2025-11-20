// import axios from "axios";


// // URL de base de ton API Django
// const BASE_URL = "http://198.168.3.178:8000/"; 

// // Création d'une instance Axios
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// //Exemple pour gérer le token si tu utilises l'authentification
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem('userToken');
//     if(token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// export default api;



import axios from "axios";

// URL de base de ton API Django
const BASE_URL = "http://192.168.3.178:8000/";

// Création d'une instance Axios
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log("🔍 Vérification du token:", token ? "✅ Token trouvé" : "❌ Pas de token");
    
    if (token) {
      config.headers.Authorization = `Token ${token}`; // ⚠️ Utilisez "Token" ou "Bearer" selon votre backend Django
    }
    
    console.log("🚀 Requête envoyée vers:", config.baseURL + config.url);
    console.log("📦 Headers:", config.headers);
    
    return config;
  },
  (error) => {
    console.error("❌ Erreur dans l'intercepteur:", error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses
api.interceptors.response.use(
  (response) => {
    console.log("✅ Réponse réussie:", response.status);
    return response;
  },
  (error) => {
    console.error("❌ Erreur de réponse:", error.response?.status, error.response?.data);
    
    // Si 401 ou 403, le token est peut-être invalide
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("⚠️ Token invalide ou expiré. Redirection vers login...");
      // Optionnel : rediriger vers login
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;



// import axios from "axios";

// const BASE_URL = "http://127.0.0.1:8000/";

// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Intercepteur pour le token
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('userToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;