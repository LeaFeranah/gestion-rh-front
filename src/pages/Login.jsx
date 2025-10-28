import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/custom.css";
import api from "../api/api"; 
import logo from "../assets/OIP.webp"// ton instance Axios (comme dans Register)


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const credentials = { email, password };

    try {
      const response = await api.post("api/auth/login/", credentials);
      const token = response.data.token;
      localStorage.setItem("userToken", token);
      navigate("/dashboard"); // redirection
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setErrorMessage(
        "Identifiants invalides. Veuillez vérifier votre adresse email et votre mot de passe."
      );
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
              htmlFor="email"
              className="block text-gray-700 text-xs mb-1"
            >
              Adresse Email
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Mot de passe"
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

        {/* Lien vers inscription */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Pas encore de compte ?{" "}
          <a
            href="/register"
            className="text-gray-700 hover:text-gray-900 underline"
          >
            S’inscrire
          </a>
        </p>
      </div>
    </div>
  );
}
