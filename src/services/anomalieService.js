/*import api from '../api/api';

const anomalieService = {
  detecterAnomalies: async (annee, mois) => {
    try {
      console.log("🔄 Détection des anomalies:", { annee, mois });
      const response = await api.post(`api/presence/detecter-anomalies/`, {
        annee,
        mois,
      });
      console.log("✅ Anomalies détectées:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur détection anomalies:", error);
      throw error;
    }
  },

  getAnomalies: async (annee = null, mois = null, section = null, corrigee = null) => {
    try {
      const params = {};
      if (annee) params.annee = annee;
      if (mois) params.mois = mois;
      if (section) params.section = section;
      if (corrigee !== null) params.corrigee = corrigee;

      console.log("🔄 Récupération anomalies avec params:", params);
      const response = await api.get(`api/presence/anomalies/`, { params });
      console.log("✅ Anomalies récupérées:", response.data.count);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération anomalies:", error);
      throw error;
    }
  },

  getAnomaliesParSection: async (annee, mois) => {
    try {
      const response = await api.get(`api/presence/anomalies/par-section/`, {
        params: { annee, mois },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération anomalies par section:", error);
      throw error;
    }
  },

  getAnomalieDetail: async (id) => {
    try {
      const response = await api.get(`api/presence/anomalies/${id}/`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération anomalie:", error);
      throw error;
    }
  },

  updateAnomalie: async (id, data) => {
    try {
      console.log("🔄 Mise à jour anomalie:", { id, data });
      
      // S'assurer que heure_reelle = heure_comptabilisee
      const updatedData = { ...data };
      if (data.heure_reelle_entree) {
        updatedData.heure_comptabilisee_entree = data.heure_reelle_entree;
      }
      if (data.heure_reelle_sortie) {
        updatedData.heure_comptabilisee_sortie = data.heure_reelle_sortie;
      }
      
      const response = await api.put(
        `api/presence/anomalies/${id}/`,
        updatedData
      );
      console.log("✅ Anomalie mise à jour:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur mise à jour anomalie:", error);
      throw error;
    }
  },
};

export default anomalieService;*/

import api from '../api/api';

const anomalieService = {
  detecterAnomalies: async (annee, mois) => {
    const response = await api.post('api/presence/detecter-anomalies/', {
      annee,
      mois,
    });
    return response.data;
  },

  getAnomalies: async (annee = null, mois = null, section = null, corrigee = null) => {
    const params = {};
    if (annee) params.annee = annee;
    if (mois) params.mois = mois;
    if (section) params.section = section;
    if (corrigee !== null) params.corrigee = corrigee;

    const response = await api.get('api/presence/anomalies/', { params });
    return response.data;
  },

  getAnomaliesParSection: async (annee, mois) => {
    const response = await api.get('api/presence/anomalies/par-section/', {
      params: { annee, mois },
    });
    return response.data;
  },

  getAnomalieDetail: async (id) => {
    const response = await api.get(`api/presence/anomalies/${id}/`);
    return response.data;
  },

  updateAnomalie: async (id, data) => {
    console.log('🔄 Mise à jour anomalie ID:', id);
    
    const payload = {
      heure_reelle_entree: data.heure_reelle_entree || null,
      heure_reelle_sortie: data.heure_reelle_sortie || null,
      heure_rectifiee_entree: data.heure_rectifiee_entree || null,
      heure_rectifiee_sortie: data.heure_rectifiee_sortie || null,
    };
    
    console.log('📤 Payload envoyé:', payload);
    
    try {
      const response = await api.patch(
        `api/presence/anomalies/${id}/`,
        payload
      );
      console.log('✅ Anomalie mise à jour');
      return response.data;
    } catch {
      console.log('❌ Erreur PATCH, essai avec PUT...');
      
      const putPayload = {
        ...payload,
        commentaire: data.commentaire || '',
      };
      
      const response = await api.put(
        `api/presence/anomalies/${id}/`,
        putPayload
      );
      console.log('✅ Anomalie mise à jour (PUT)');
      return response.data;
    }
  },
};

export default anomalieService;