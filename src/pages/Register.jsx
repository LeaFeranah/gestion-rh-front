import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "/src/styles/custom.css"; // pour la couleur bg-akj
import logo from "../assets/OIP.webp"

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const API_URL = "http://127.0.0.1:8000/api/auth/register/";
    setErrorMessage("");
    setIsLoading(true);

    if (password !== password2) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(API_URL, { username, email, password, password2 });
      navigate("/");
    } catch (error) {
      if (error.response?.data) {
        const errors = error.response.data;
        let msg = "";
        if (errors.username) msg += `Nom d'utilisateur: ${errors.username[0]} `;
        if (errors.email) msg += `Email: ${errors.email[0]} `;
        if (errors.password) msg += `Mot de passe: ${errors.password[0]} `;
        if (errors.password2) msg += `Confirmation: ${errors.password2[0]} `;
        setErrorMessage(msg.trim());
      } else {
        setErrorMessage("Erreur de connexion au serveur.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-50">
      <div className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-gray-200 shadow-xl rounded-2xl p-8">

        {/* --- LOGO rond avec bordure Tailwind --- */}
        <div className="flex flex-col items-center -mt-20 mb-8">
          <div className="relative p-1 rounded-full border-4" style={{ borderColor: "#56656b" }}>
            <div className="absolute inset-0 rounded-full bg-akj"></div>
            <img
              src={logo}
              alt="Logo"
              className="w-24 h-24 object-contain relative z-10 drop-shadow-md rounded-full"
            />
          </div>
        </div>

        
    

        {/* --- Message d’erreur --- */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-xs px-3 py-2 rounded mb-3">
            {errorMessage}
          </div>
        )}

        {/* --- FORMULAIRE --- */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-xs mb-1">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="ex: jdupont"
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 text-xs mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ex: jdupont@email.com"
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-xs mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mot de passe"
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password2" className="block text-gray-700 text-xs mb-1">
              Confirmer le mot de passe
            </label>
            <input
              id="password2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              placeholder="Confirmez le mot de passe"
              className="w-full text-sm px-3 py-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-akj text-white font-medium text-sm rounded-md hover:bg-gray-600 transition disabled:opacity-50 shadow-md"
          >
            {isLoading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Déjà inscrit ?{" "}
          <Link to="/" className="text-gray-700 hover:text-gray-900 underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
