// import api from '../api/api';

// const calendrierService = {
//   // ── Calendriers ─────────────────────────────────────────────────────────────

//   getCalendriers: async (annee = null) => {
//     const params = {};
//     if (annee) params.annee = annee;
//     const response = await api.get('api/calendrier/', { params });
//     return response.data;
//   },

//   getCalendrier: async (id) => {
//     const response = await api.get(`api/calendrier/${id}/`);
//     return response.data;
//   },

//   createCalendrier: async (data) => {
//     const response = await api.post('api/calendrier/', data);
//     return response.data;
//   },

//   updateCalendrier: async (id, data) => {
//     const response = await api.patch(`api/calendrier/${id}/`, data);
//     return response.data;
//   },

//   deleteCalendrier: async (id) => {
//     const response = await api.delete(`api/calendrier/${id}/`);
//     return response.data;
//   },

//   // ── Jours fériés ────────────────────────────────────────────────────────────

//   getJoursFeries: async (calId, type = null) => {
//     const params = {};
//     if (type) params.type = type;
//     const response = await api.get(`api/calendrier/${calId}/jours/`, { params });
//     return response.data;
//   },

//   createJourFerie: async (calId, data) => {
//     const response = await api.post(`api/calendrier/${calId}/jours/`, data);
//     return response.data;
//   },

//   updateJourFerie: async (id, data) => {
//     const response = await api.patch(`api/calendrier/jours/${id}/`, data);
//     return response.data;
//   },

//   deleteJourFerie: async (id) => {
//     const response = await api.delete(`api/calendrier/jours/${id}/`);
//     return response.data;
//   },

//   // ── Vue globale ──────────────────────────────────────────────────────────────

//   getTousJoursFeries: async (annee) => {
//     const response = await api.get('api/calendrier/tous-jours/', {
//       params: { annee },
//     });
//     return response.data;
//   },
// };

// export default calendrierService;


import api from '../api/api';

const calendrierService = {
  // ── Calendriers (lecture seule) ─────────────────────────────────────────────

  getCalendrierByAnnee: async (annee) => {
    // Récupère ou crée automatiquement le calendrier pour l'année
    const response = await api.get('api/calendrier/', { params: { annee } });
    const calendriers = response.data.calendriers || [];
    
    if (calendriers.length > 0) {
      return calendriers[0];
    }
    
    // Si aucun calendrier n'existe pour cette année, en créer un automatiquement
    const newCal = await api.post('api/calendrier/', {
      titre: `Calendrier ${annee}`,
      annee: annee,
      description: `Calendrier automatique pour l'année ${annee}`
    });
    return newCal.data;
  },

  // Cette méthode manquante est essentielle !
  getCalendrier: async (id) => {
    const response = await api.get(`api/calendrier/${id}/`);
    return response.data;
  },

  // ── Jours fériés ────────────────────────────────────────────────────────────

  getJoursFeries: async (calId, type = null) => {
    const params = {};
    if (type) params.type = type;
    const response = await api.get(`api/calendrier/${calId}/jours/`, { params });
    return response.data;
  },

  createJourFerie: async (calId, data) => {
    const response = await api.post(`api/calendrier/${calId}/jours/`, data);
    return response.data;
  },

  updateJourFerie: async (id, data) => {
    const response = await api.patch(`api/calendrier/jours/${id}/`, data);
    return response.data;
  },

  deleteJourFerie: async (id) => {
    const response = await api.delete(`api/calendrier/jours/${id}/`);
    return response.data;
  },

  // ── Vue globale ──────────────────────────────────────────────────────────────

  getTousJoursFeries: async (annee) => {
    const response = await api.get('api/calendrier/tous-jours/', {
      params: { annee },
    });
    return response.data;
  },
};

export default calendrierService;