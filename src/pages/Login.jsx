// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "/src/styles/custom.css";
// import api from "../api/api"; 
// import logo from "../assets/OIP.webp"// ton instance Axios (comme dans Register)


// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setErrorMessage("");
//     setIsLoading(true);

//     const credentials = { email, password };

//     try {
//       const response = await api.post("api/auth/login/", credentials);
//       const token = response.data.token;
//       localStorage.setItem("userToken", token);
//       navigate("/dashboard"); // redirection
//     } catch (error) {
//       console.error("Erreur de connexion:", error);
//       setErrorMessage(
//         "Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50">
//       <div className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
        
//         {/* Logo rond */}
//         <div className="flex flex-col items-center -mt-20 mb-8">
//           <div
//             className="relative p-1 rounded-full border-4"
//             style={{ borderColor: "#56656b" }}
//           >
//             <div className="absolute inset-0 rounded-full bg-akj"></div>
//             <img
//               src={logo}
//               alt="Logo"
//               className="w-24 h-24 object-contain relative z-10 drop-shadow-md rounded-full"
//             />
//           </div>
//         </div>

//         {/* Message d'erreur */}
//         {errorMessage && (
//           <div className="bg-red-50 border border-red-300 text-red-600 text-xs px-3 py-2 rounded mb-3">
//             {errorMessage}
//           </div>
//         )}

//         {/* Formulaire */}
//         <form onSubmit={handleLogin} className="space-y-4">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-gray-700 text-xs mb-1"
//             >
//               Adresse Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               required
//               placeholder="votre.email@exemple.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-gray-700 text-xs mb-1"
//             >
//               Mot de passe
//             </label>
//             <input
//               id="password"
//               type="password"
//               required
//               placeholder="Mot de passe"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-2 bg-akj text-white font-medium text-sm rounded-md hover:bg-gray-600 transition disabled:opacity-50 shadow-md"
//           >
//             {isLoading ? "Connexion en cours..." : "Se connecter"}
//           </button>
//         </form>

//         {/* Lien vers inscription */}
//         <p className="text-center text-xs text-gray-500 mt-6">
//           Pas encore de compte ?{" "}
//           <a
//             href="/register"
//             className="text-gray-700 hover:text-gray-900 underline"
//           >
//             S’inscrire
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/custom.css";
import api from "../api/api"; 
import logo from "../assets/OIP.webp";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const credentials = { username, password };

    console.log("Username envoyé:", username);
    console.log("Password envoyé:", password);
    console.log("Credentials:", credentials);

    try {
      // ✅ Utilisation de axios via l'instance api
      const response = await api.post("api/personnel/login/", credentials);
      
      console.log("✅ Réponse complète:", response.data);
      
      const { token, username: userUsername, email } = response.data;
      
      // Stocker les informations avec la clé "token" (pas "userToken")
      localStorage.setItem("token", token);
      localStorage.setItem("username", userUsername);
      localStorage.setItem("email", email);
      
      console.log("✅ Token stocké:", localStorage.getItem("token"));
      
      // Redirection
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Erreur de connexion:", error);
      console.error("❌ Détails:", error.response?.data);
      
      if (error.code === 'ERR_NETWORK') {
        setErrorMessage("Erreur de connexion au serveur. Vérifiez que le serveur est démarré.");
      } else if (error.response?.status === 400) {
        setErrorMessage("Données invalides. Vérifiez les champs.");
      } else if (error.response?.status === 401) {
        setErrorMessage("Identifiants incorrects.");
      } else if (error.response?.status === 403) {
        setErrorMessage("Accès refusé.");
      } else if (error.response?.status === 404) {
        setErrorMessage("Service non trouvé.");
      } else {
        setErrorMessage(error.response?.data?.error || error.response?.data?.detail || "Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">
        
        {/* Logo rond */}
        <div className="flex flex-col items-center -mt-20 mb-8">
          <div
            className="relative p-1 rounded-full border-4"
            style={{ borderColor: "#56656b" }}
          >
            <div className="absolute inset-0 rounded-full bg-akj"></div>
            <img
              src={logo}
              alt="Logo"
              className="w-24 h-24 object-contain relative z-10 drop-shadow-md rounded-full"
            />
          </div>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-xs px-3 py-2 rounded mb-3">
            {errorMessage}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 text-xs mb-1"
            >
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              required
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-xs mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-akj text-white font-medium text-sm rounded-md hover:bg-gray-600 transition disabled:opacity-50 shadow-md"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        {/* Lien vers inscription
        <p className="text-center text-xs text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="text-gray-700 hover:text-gray-900 underline"
          >
            S'inscrire
          </a>
        </p> */}
      </div>
    </div>
  );
}