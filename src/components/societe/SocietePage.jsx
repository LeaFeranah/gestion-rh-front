import React, { useState, useEffect } from "react";
import SocieteModal from "./SocieteModal";
import "/src/styles/custom.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faEye } from "@fortawesome/free-solid-svg-icons";
import { faEdit as farEdit } from "@fortawesome/free-regular-svg-icons";
// Utilisation du nom de fichier que vous avez importé : SocieteDeleteModal
import DeleteConfirmationModal from "./SocieteDeleteModal"; 
// NOUVEAU : Importez votre composant de modal de détails
import SocieteDetailsModal from "./SocieteDetailsModal";
import {
  fetchSocietes,
  createSociete,
  updateSociete,
  deleteSociete,
} from "../../services/societeService";

const SocietePage = () => {
  const [societes, setSocietes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [societeToEdit, setSocieteToEdit] = useState(null);

  // 👈 NOUVEAUX ÉTATS POUR LE MODAL DE SUPPRESSION
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // Contient l'objet société à supprimer, nécessaire pour l'ID et le nom dans le modal
  const [societeToDelete, setSocieteToDelete] = useState(null); 

  // 🔹 Charger les sociétés depuis la base de données au montage
  useEffect(() => {
    loadSocietes();
  }, []);

  // 👈 NOUVEAUX ÉTATS POUR LE MODAL DE DÉTAILS
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [societeToView, setSocieteToView] = useState(null);

  const loadSocietes = async () => {
    try {
      const data = await fetchSocietes();
      setSocietes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des sociétés :", error);
      alert("Impossible de charger les sociétés depuis le serveur.");
    }
  };

  // 🔹 Nouvelle fonction pour ouvrir le modal de détails
  const handleViewDetails = (societe) => {
    setSocieteToView(societe);
    setIsDetailsModalOpen(true);
  };

  // 🔹 Ouvrir le modal pour ajouter
  const handleAdd = () => {
    setSocieteToEdit(null);
    setIsOpen(true);
  };

  // 🔹 Ouvrir le modal pour modifier
  const handleEdit = (societe) => {
    setSocieteToEdit(societe);
    setIsOpen(true);
  };
  
  // 🔹 Ouvre le modal de confirmation
  const openDeleteConfirmation = (societe) => {
    setSocieteToDelete(societe);
    setIsDeleteModalOpen(true);
  };

  // 🔹 SUPPRESSION EFFECTIVE APRÈS CONFIRMATION (NOUVELLE LOGIQUE)
  const confirmDelete = async () => {
    if (!societeToDelete) return; // Sécurité

    const id = societeToDelete.id;
    try {
      await deleteSociete(id); // Appel du service de suppression
      setSocietes((prev) => prev.filter((s) => s.id !== id));
      
      // Ferme le modal et réinitialise l'état
      setIsDeleteModalOpen(false);
      setSocieteToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Échec de la suppression de la société.");
      // Ferme le modal même en cas d'échec
      setIsDeleteModalOpen(false); 
      setSocieteToDelete(null);
    }
  };


  // 🔹 Sauvegarder (ajout ou modification)
  const handleSave = async (data) => {
    try {
      if (data.id) {
        // Modification
        const updated = await updateSociete(data.id, data);
        setSocietes((prev) =>
          prev.map((s) => (s.id === data.id ? updated : s))
        );
      } else {
        // Création
        const newSociete = await createSociete(data);
        setSocietes((prev) => [...prev, newSociete]);
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      alert("Impossible d’enregistrer la société.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Gestion des sociétés 
      </h1>

      <button
        onClick={handleAdd}
        className="px-4 py-2 mb-4 bg-akj text-white rounded transition"
      >
        Ajouter une société
      </button>

      {/* Liste des sociétés */}
      <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nom</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Adresse</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Téléphone</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {societes.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500 italic">
                  Aucune société trouvée.
                </td>
              </tr>
            ) : (
              societes.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-gray-50 border-b text-sm text-gray-700"
                >
                  <td className="px-6 py-3">{s.name}</td>
                  <td className="px-6 py-3">{s.adresse}</td>
                  <td className="px-6 py-3">{s.telephone}</td>
                  <td className="px-6 py-3">{s.email}</td>
                  <td className="px-6 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleViewDetails(s)}
                      //className="bg-green-500 hover:bg-green-600 text-white p-2 rounded transition"
                      title="Voir les détails"
                    >
                      <FontAwesomeIcon icon={faEye} /> {/* 👈 Icône Voir */}
                    </button>
                    <button
                      onClick={() => handleEdit(s)}
                      //className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                      title="Modifier"
                    >
                      <FontAwesomeIcon icon={farEdit} />
                    </button>
                    {/* 👈 Appel pour ouvrir le MODAL de confirmation */}
                    <button
                      onClick={() => openDeleteConfirmation(s)} 
                      //className="bg-red-500 hover:bg-red-600 text-white p-2 rounded transition"
                      title="Supprimer"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal d’ajout/modification */}
      <SocieteModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        societe={societeToEdit}
        onSave={handleSave}
      />
      
      {/* 👈 MODAL DE CONFIRMATION DE SUPPRESSION */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete} // Exécute la suppression après confirmation
        societeName={societeToDelete ? societeToDelete.name : ""} // Nom affiché dans le modal
      />

      {/* 👈 NOUVEAU MODAL DE DÉTAILS */}
      <SocieteDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        societe={societeToView} 
      />
    </div>
  );
};

export default SocietePage;