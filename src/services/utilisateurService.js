import api from '../api/api';

const utilisateurService = {
  getUtilisateurs: async () => {
    const response = await api.get('api/personnel/utilisateurs-admin/');
    return response.data;
  },
  creerUtilisateur: async (data) => {
    const response = await api.post('api/personnel/utilisateurs-admin/', data);
    return response.data;
  },
  modifierUtilisateur: async (id, data) => {
    const response = await api.patch(`api/personnel/utilisateurs-admin/${id}/`, data);
    return response.data;
  },
  supprimerUtilisateur: async (id) => {
    const response = await api.delete(`api/personnel/utilisateurs-admin/${id}/`);
    return response.data;
  },
};

export default utilisateurService;