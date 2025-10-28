// Exemple de contenu pour SocieteDeleteModal.jsx

import React from "react";
import "/src/styles/custom.css";

const SocieteDeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Confirmer la suppression ⚠️
        </h2>
        <p className="mb-6 text-gray-700">
          Êtes-vous sûr(e) de vouloir supprimer cette société ? Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocieteDeleteModal;