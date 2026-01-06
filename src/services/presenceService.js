// import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/presence/';

// class PresenceService {
//   // Récupérer toutes les présences
//   getAllPresences() {
//     return axios.get(API_URL);
//   }

//   // Récupérer les présences par badge number
//   getPresenceByBadgeNumber(badgenumber) {
//     return axios.get(`${API_URL}${badgenumber}/`);
//   }
// }

// export default new PresenceService();



// services/presenceService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/presence/';

const presenceService = {
  // Générer les dates du mois
  genererDates: async (annee, mois) => {
    try {
      const response = await axios.get(`${API_URL}generer-dates/`, {
        params: { annee, mois }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération des dates:', error);
      throw error;
    }
  },

  // Récupérer les dates avec codes
  getDates: async (annee, mois) => {
    try {
      const response = await axios.get(`${API_URL}dates/`, {
        params: { annee, mois }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des dates:', error);
      throw error;
    }
  },

  // Récupérer les présences du mois
  getPresencesMois: async (annee, mois, inclureHorsPeriode = true) => {
    try {
      const response = await axios.get(`${API_URL}mois/`, {
        params: { 
          annee, 
          mois, 
          inclure_hors_periode: inclureHorsPeriode 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des présences:', error);
      throw error;
    }
  },

  // Optionnel: Récupérer les présences d'un employé spécifique
  getPresencesEmploye: async (userId, annee, mois) => {
    try {
      const response = await axios.get(`${API_URL}employe/${userId}/`, {
        params: { annee, mois }
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des présences de l'employé ${userId}:`, error);
      throw error;
    }
  },

  // Optionnel: Mettre à jour une présence
  updatePresence: async (presenceId, data) => {
    try {
      const response = await axios.put(`${API_URL}${presenceId}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      throw error;
    }
  }
};

export default presenceService;