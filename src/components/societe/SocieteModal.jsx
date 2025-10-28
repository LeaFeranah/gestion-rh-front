import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave } from 'react-icons/fa';
import "/src/styles/custom.css";

const initialFormState = {
  name: '', adresse: '', raison_social: '', rcs: '', nif: '', stat: '', 
  ostie: '', cnaps: '', telephone: '', email: ''
};

const SocieteModal = ({ isOpen, onClose, societe, onSave }) => {
  const [formData, setFormData] = useState(initialFormState);

  // useEffect(() => {
  //   if (societe) {
  //     setFormData({ ...societe });
  //   } else {
  //     setFormData(initialFormState);
  //   }
  // }, [societe]);
  useEffect(() => {
    if (isOpen) {
      if (societe) {
        setFormData({ ...societe });
      } else {
        setFormData(initialFormState);
      }
    }
  }, [societe, isOpen]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  const title = societe ? "Modifier la Société" : "Ajouter une Nouvelle Société";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-indigo-50 rounded-t-xl">
          <h3 className="text-2xl font-semibold text-bg-akj">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InputField label="Nom" name="name" value={formData.name} onChange={handleChange} required />
            <InputField label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} />
            <InputField label="Raison Sociale" name="raison_social" value={formData.raison_social} onChange={handleChange} />
            <InputField label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} type="tel" />
            <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
          </div>

          <div className="space-y-4">
            <InputField label="RCS" name="rcs" value={formData.rcs} onChange={handleChange} />
            <InputField label="NIF" name="nif" value={formData.nif} onChange={handleChange} />
            <InputField label="STAT" name="stat" value={formData.stat} onChange={handleChange} />
            <InputField label="OSTIE" name="ostie" value={formData.ostie} onChange={handleChange} />
            <InputField label="CNAPS" name="cnaps" value={formData.cnaps} onChange={handleChange} />
          </div>

          <div className="md:col-span-2 pt-4 border-t mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
              Annuler
            </button>
            <button type="submit" className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-akj rounded-lg shadow-md transition transform hover:scale-[1.02]">
              <FaSave className="mr-2" /> Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocieteModal;

const InputField = ({ label, name, value, onChange, type = 'text', required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
      placeholder={`Saisir le ${label.toLowerCase()}`}
    />
  </div>
);
