// import React, { useEffect, useState } from "react";
// import api from "../api/api";
// import Societe from "../components/Societes.jsx";

// export default function Societes() {
//   const [societes, setSocietes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.get("societes/api/societe/liste/")
//       .then((response) => {
//         setSocietes(response.data);
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Erreur API:", error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Chargement...</p>;

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Liste des sociétés</h1>
//       <ul className="space-y-2">
//         {societes.map((societe) => (
//           <Societe key={societe.id} societe={societe} />
//         ))}
//       </ul>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { PlusCircle, Edit, Trash2 } from "lucide-react";

// const SocietePage = () => {
//   const [societes, setSocietes] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ id: null, nom: "", adresse: "", email: "", telephone: "" });

//   // Charger les sociétés
//   useEffect(() => {
//     fetch("http://localhost:8000/api/societes/")
//       .then((res) => res.json())
//       .then((data) => setSocietes(data))
//       .catch(console.error);
//   }, []);

//   // Ajouter ou modifier
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const method = formData.id ? "PUT" : "POST";
//     const url = formData.id
//       ? `http://localhost:8000/api/societes/${formData.id}/`
//       : "http://localhost:8000/api/societes/";

//     await fetch(url, {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(formData),
//     });

//     setIsModalOpen(false);
//     setFormData({ id: null, nom: "", adresse: "", email: "", telephone: "" });

//     const res = await fetch("http://localhost:8000/api/societes/");
//     setSocietes(await res.json());
//   };

//   // Supprimer
//   const handleDelete = async (id) => {
//     if (!window.confirm("Supprimer cette société ?")) return;
//     await fetch(`http://localhost:8000/api/societes/${id}/`, { method: "DELETE" });
//     setSocietes(societes.filter((s) => s.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold text-gray-700">Gestion des Sociétés</h1>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
//           >
//             <PlusCircle className="w-5 h-5 mr-2" /> Ajouter
//           </button>
//         </div>

//         <table className="w-full text-sm text-gray-700 border-collapse">
//           <thead className="bg-blue-50 uppercase text-gray-600">
//             <tr>
//               <th className="p-3 text-left">Nom</th>
//               <th className="p-3 text-left">Adresse</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Téléphone</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {societes.map((s) => (
//               <tr key={s.id} className="border-b hover:bg-gray-50">
//                 <td className="p-3">{s.nom}</td>
//                 <td className="p-3">{s.adresse}</td>
//                 <td className="p-3">{s.email}</td>
//                 <td className="p-3">{s.telephone}</td>
//                 <td className="p-3 flex justify-center space-x-3">
//                   <button onClick={() => { setFormData(s); setIsModalOpen(true); }}
//                     className="text-blue-600 hover:text-blue-800">
//                     <Edit className="w-5 h-5" />
//                   </button>
//                   <button onClick={() => handleDelete(s.id)}
//                     className="text-red-600 hover:text-red-800">
//                     <Trash2 className="w-5 h-5" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-xl w-96">
//             <h3 className="text-lg font-semibold text-gray-700 mb-4">
//               {formData.id ? "Modifier la société" : "Ajouter une société"}
//             </h3>
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <input
//                 type="text"
//                 placeholder="Nom"
//                 value={formData.nom}
//                 onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Adresse"
//                 value={formData.adresse}
//                 onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Téléphone"
//                 value={formData.telephone}
//                 onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
//                 className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400"
//               />
//               <div className="flex justify-end space-x-2 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => { setIsModalOpen(false); setFormData({ id: null, nom: "", adresse: "", email: "", telephone: "" }); }}
//                   className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400">
//                   Annuler
//                 </button>
//                 <button type="submit"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//                   Enregistrer
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SocietePage;
