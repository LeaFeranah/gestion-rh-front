// import React, { useState, useEffect } from 'react';
// import { FaTimes, FaSave } from 'react-icons/fa';


// const initialFormState = {
//     name: '', adresse: '', raison_social: '', rcs: '', nif: '', stat: '', 
//     ostie: '', cnaps: '', telephone: '', email: ''
// };

// function SocieteModal({ isOpen, onClose, societe, onSave }) {
//     // État local pour le formulaire
//     const [formData, setFormData] = useState(initialFormState);

//     // Mettre à jour le formulaire lorsque la prop 'societe' change (pour l'édition)
//     useEffect(() => {
//         if (societe) {
//             // Remplir le formulaire avec les données de la société
//             setFormData({
//                 id: societe.id, // Garder l'ID pour la modification
//                 name: societe.name || '',
//                 adresse: societe.adresse || '',
//                 raison_social: societe.raison_social || '',
//                 rcs: societe.rcs || '',
//                 nif: societe.nif || '',
//                 stat: societe.stat || '',
//                 ostie: societe.ostie || '',
//                 cnaps: societe.cnaps || '',
//                 telephone: societe.telephone || '',
//                 email: societe.email || '',
//             });
//         } else {
//             // Réinitialiser pour l'ajout
//             setFormData(initialFormState);
//         }
//     }, [societe]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSave(formData);
//     };

//     if (!isOpen) return null;

//     const title = societe ? "Modifier la Société" : "Ajouter une Nouvelle Société";

//     return (
//         // Overlay de la modale
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex justify-center items-center p-4">
            
//             {/* Conteneur de la Modale */}
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                
//                 {/* Header */}
//                 <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-indigo-50 rounded-t-xl">
//                     <h3 className="text-2xl font-semibold text-indigo-800">{title}</h3>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition">
//                         <FaTimes className="w-5 h-5" />
//                     </button>
//                 </div>

//                 {/* Corps du Formulaire */}
//                 <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
//                     {/* Colonne 1 : Infos Générales */}
//                     <div className="space-y-4">
//                         <h4 className="text-lg font-medium text-gray-700 border-b pb-1 mb-3">Détails de Base</h4>
                        
//                         <InputField label="Nom de la Société" name="name" value={formData.name} onChange={handleChange} required />
//                         <InputField label="Adresse" name="adresse" value={formData.adresse} onChange={handleChange} />
//                         <InputField label="Raison Sociale" name="raison_social" value={formData.raison_social} onChange={handleChange} />
//                         <InputField label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} type="tel" />
//                         <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
//                     </div>

//                     {/* Colonne 2 : Infos Légales et Fiscales */}
//                     <div className="space-y-4">
//                         <h4 className="text-lg font-medium text-gray-700 border-b pb-1 mb-3">Informations Légales</h4>
                        
//                         <InputField label="RCS" name="rcs" value={formData.rcs} onChange={handleChange} />
//                         <InputField label="NIF" name="nif" value={formData.nif} onChange={handleChange} />
//                         <InputField label="STAT" name="stat" value={formData.stat} onChange={handleChange} />
//                         <InputField label="OSTIE" name="ostie" value={formData.ostie} onChange={handleChange} />
//                         <InputField label="CNAPS" name="cnaps" value={formData.cnaps} onChange={handleChange} />
//                     </div>

//                     {/* Footer / Boutons d'Action */}
//                     <div className="md:col-span-2 pt-4 border-t mt-6 flex justify-end space-x-3">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
//                         >
//                             Annuler
//                         </button>
//                         <button
//                             type="submit"
//                             className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition transform hover:scale-[1.02]"
//                         >
//                             <FaSave className="mr-2" /> Enregistrer
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default SocieteModal;

// // Composant utilitaire pour les champs de formulaire (ergonomie et réutilisation)
// const InputField = ({ label, name, value, onChange, type = 'text', required = false }) => (
//     <div>
//         <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//             {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <input
//             type={type}
//             id={name}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required={required}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
//             placeholder={`Saisir le ${label.toLowerCase()}`}
//         />
//     </div>
// );