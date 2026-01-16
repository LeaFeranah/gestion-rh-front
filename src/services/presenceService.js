import axios from "axios";

const API_URL = "http://localhost:8000/api/presence/";

const presenceService = {
  updateEvenementByUserDate: async (
    userid,
    date,
    type_evenement,
    commentaire = ""
  ) => {
    try {
      console.log("🔄 Envoi requête événement:", {
        url: `${API_URL}evenements/user/${userid}/date/${date}/`,
        data: { type_evenement, commentaire },
      });

      const response = await axios.post(
        `${API_URL}evenements/user/${userid}/date/${date}/`,
        {
          type_evenement: type_evenement,
          commentaire: commentaire,
        }
      );

      console.log("✅ Réponse serveur événement:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Erreur détaillée:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  verifierEvenement: async (userid, date) => {
    try {
      const response = await axios.get(
        `${API_URL}evenements/user/${userid}/date/${date}/`
      );
      console.log("🔍 Vérification événement:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur vérification événement:", error);
      return null;
    }
  },

  getEvenementsMois: async (annee, mois) => {
    try {
      const response = await axios.get(`${API_URL}evenements/`, {
        params: { annee, mois },
      });
      console.log("📋 Événements du mois récupérés:", response.data.count);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération événements du mois:", error);
      throw error;
    }
  },

  genererDates: async (annee, mois) => {
    try {
      console.log("🔄 Génération des dates pour:", { annee, mois });
      const response = await axios.get(`${API_URL}generer-dates/`, {
        params: { annee, mois },
      });
      console.log("✅ Dates générées:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la génération des dates:", error);
      throw error;
    }
  },

  getDates: async (annee, mois) => {
    try {
      const response = await axios.get(`${API_URL}dates/`, {
        params: { annee, mois },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des dates:", error);
      throw error;
    }
  },

  getPresencesMois: async (annee, mois, inclureHorsPeriode = true) => {
    try {
      const response = await axios.get(`${API_URL}mois/`, {
        params: {
          annee,
          mois,
          inclure_hors_periode: inclureHorsPeriode,
        },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des présences:", error);
      throw error;
    }
  },

  getPresencesMoisCalculee: async (annee, mois, inclureHorsPeriode = false) => {
    try {
      console.log("🔄 Récupération présences calculées:", { annee, mois });
      const response = await axios.get(`${API_URL}mois/detail/calculee/`, {
        params: {
          annee,
          mois,
          inclure_hors_periode: inclureHorsPeriode,
        },
      });
      console.log("✅ Présences récupérées:", response.data.presences?.length);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des présences calculées:",
        error
      );
      throw error;
    }
  },

  getHorairesSection: async () => {
    try {
      const response = await axios.get(`${API_URL}horaires-section/`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des horaires:", error);
      throw error;
    }
  },

  createHoraireSection: async (data) => {
    try {
      const response = await axios.post(`${API_URL}horaires-section/`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'horaire:", error);
      throw error;
    }
  },

  updateHoraireSection: async (section, data) => {
    try {
      const response = await axios.put(
        `${API_URL}horaires-section/${section}/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de l'horaire:", error);
      throw error;
    }
  },

  getTypesEvenements: async () => {
    try {
      const response = await axios.get(`${API_URL}types-evenements/`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des types d'événements:",
        error
      );
      throw error;
    }
  },

  getEvenements: async (annee = null, mois = null, badgenumber = null) => {
    try {
      const params = {};
      if (annee) params.annee = annee;
      if (mois) params.mois = mois;
      if (badgenumber) params.badgenumber = badgenumber;

      console.log("🔄 Récupération événements avec params:", params);

      const response = await axios.get(`${API_URL}evenements/`, { params });
      console.log("✅ Événements récupérés:", response.data.count);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des événements:", error);
      throw error;
    }
  },

  // Ajoutez cette méthode dans presenceService
  deleteEvenementByUserDate: async (userid, date) => {
    try {
      console.log("🔄 Suppression événement:", { userid, date });
      const response = await axios.delete(
        `${API_URL}evenements/user/${userid}/date/${date}/`
      );
      console.log("✅ Événement supprimé:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'événement:", error);
      throw error;
    }
  },

  getAnomalies: async (annee = null, mois = null, badgenumber = null) => {
    try {
      const params = {};
      if (annee) params.annee = annee;
      if (mois) params.mois = mois;
      if (badgenumber) params.badgenumber = badgenumber;

      console.log("🔄 Récupération anomalies avec params:", params);

      const response = await axios.get(`${API_URL}anomalies/`, { params });
      console.log("✅ Anomalies récupérées:", response.data.count);
      console.log(
        "📋 Détails anomalies:",
        response.data.anomalies?.slice(0, 3)
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Erreur récupération anomalies:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAnomalieByUserDate: async (userid, date) => {
    try {
      console.log("🔄 Récupération anomalie spécifique:", { userid, date });
      const response = await axios.get(
        `${API_URL}anomalies/user/${userid}/date/${date}/`
      );
      console.log("✅ Anomalie récupérée:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération de l'anomalie:", error);
      return null;
    }
  },

  updateAnomalieByUserDate: async (
    userid,
    date,
    heure_entree,
    heure_sortie,
    motif = "",
    modifie_par = ""
  ) => {
    try {
      console.log("🔄 Envoi requête anomalie:", {
        url: `${API_URL}anomalies/user/${userid}/date/${date}/`,
        data: {
          heure_entree_modifiee: heure_entree,
          heure_sortie_modifiee: heure_sortie,
          motif,
          modifie_par,
        },
      });

      const response = await axios.post(
        `${API_URL}anomalies/user/${userid}/date/${date}/`,
        {
          heure_entree_modifiee: heure_entree,
          heure_sortie_modifiee: heure_sortie,
          motif: motif,
          modifie_par: modifie_par,
        }
      );

      console.log("✅ Réponse serveur anomalie:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Erreur détaillée:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  deleteAnomalieByUserDate: async (userid, date) => {
    try {
      console.log("🔄 Suppression anomalie:", { userid, date });
      const response = await axios.delete(
        `${API_URL}anomalies/user/${userid}/date/${date}/`
      );
      console.log("✅ Anomalie supprimée:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'anomalie:", error);
      throw error;
    }
  },
};

export default presenceService;
