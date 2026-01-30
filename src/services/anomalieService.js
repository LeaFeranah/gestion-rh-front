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
    
    // FORCER le format HH:MM (sans secondes)
    const forceHHMM = (timeStr) => {
      if (!timeStr || timeStr === '-') return null;
      // Si déjà au format HH:MM, garder
      if (timeStr.length === 5 && timeStr.includes(':')) return timeStr;
      // Si au format HH:MM:SS, tronquer
      if (timeStr.length >= 8 && timeStr.includes(':')) {
        return timeStr.substring(0, 5);
      }
      // Autre format, essayer de parser
      const match = timeStr.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        const hours = match[1].padStart(2, '0');
        const minutes = match[2];
        return `${hours}:${minutes}`;
      }
      return null;
    };
    
    const payload = {
      heure_reelle_entree: forceHHMM(data.heure_reelle_entree),
      heure_reelle_sortie: forceHHMM(data.heure_reelle_sortie),
      heure_rectifiee_entree: forceHHMM(data.heure_rectifiee_entree),
      heure_rectifiee_sortie: forceHHMM(data.heure_rectifiee_sortie),
    };
    
    console.log('📤 Payload envoyé (HH:MM):', payload);
    
    try {
      const response = await api.patch(
        `api/presence/anomalies/${id}/`,
        payload
      );
      console.log('✅ Anomalie mise à jour');
      return response.data;
    } catch (error) {
      console.log('❌ Erreur PATCH:', error);
      
      // Essayer avec PUT si PATCH échoue
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