
import React from "react";
import "/src/styles/custom.css";


const SocieteDetailsModal = ({ isOpen, onClose, societe }) => {
  if (!isOpen || !societe) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-bg-akj border-b pb-2">
          Détails de la société : {societe.name}
        </h2>
        
        <div className="space-y-4 text-gray-700">
          <p>
            <strong className="font-semibold text-gray-800">Nom :</strong> {societe.name}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Adresse :</strong> {societe.adresse}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Raison social :</strong> {societe.raison_social}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Rcs :</strong> {societe.rcs}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Nif :</strong> {societe.nif}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Stat :</strong> {societe.stat}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Ostie :</strong> {societe.ostie}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Cnaps :</strong> {societe.cnaps}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Téléphone :</strong> {societe.telephone}
          </p>
          <p>
            <strong className="font-semibold text-gray-800">Email :</strong> {societe.email}
          </p>
          
          
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium rounded-lg text-white bg-akj transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocieteDetailsModal;