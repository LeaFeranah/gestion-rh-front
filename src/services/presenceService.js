// import api from "../api/api";

// const presenceService = {
//   updateEvenementByUserDate: async (
//     userid,
//     date,
//     type_evenement,
//     commentaire = "",
//   ) => {
//     try {
//       console.log("🔄 Envoi requête événement:", {
//         url: `api/presence/evenements/user/${userid}/date/${date}/`,
//         data: { type_evenement, commentaire },
//       });

//       const response = await api.post(
//         `api/presence/evenements/user/${userid}/date/${date}/`,
//         {
//           type_evenement: type_evenement,
//           commentaire: commentaire,
//         },
//       );

//       console.log("✅ Réponse serveur événement:", response.data);

//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur détaillée:", {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       throw error;
//     }
//   },

//   verifierEvenement: async (userid, date) => {
//     try {
//       const response = await api.get(
//         `api/presence/evenements/user/${userid}/date/${date}/`,
//       );
//       console.log("🔍 Vérification événement:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur vérification événement:", error);
//       return null;
//     }
//   },

//   getEvenementsMois: async (annee, mois) => {
//     try {
//       const response = await api.get(`api/presence/evenements/`, {
//         params: { annee, mois },
//       });
//       console.log("📋 Événements du mois récupérés:", response.data.count);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur récupération événements du mois:", error);
//       throw error;
//     }
//   },

//   genererDates: async (annee, mois) => {
//     try {
//       console.log("🔄 Génération des dates pour:", { annee, mois });
//       const response = await api.get(`api/presence/generer-dates/`, {
//         params: { annee, mois },
//       });
//       console.log("✅ Dates générées:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la génération des dates:", error);
//       throw error;
//     }
//   },

//   getDates: async (annee, mois) => {
//     try {
//       const response = await api.get(`api/presence/dates/`, {
//         params: { annee, mois },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la récupération des dates:", error);
//       throw error;
//     }
//   },

//   getPresencesMois: async (annee, mois, inclureHorsPeriode = true) => {
//     try {
//       const response = await api.get(`api/presence/mois/`, {
//         params: {
//           annee,
//           mois,
//           inclure_hors_periode: inclureHorsPeriode,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la récupération des présences:", error);
//       throw error;
//     }
//   },

//   // getPresencesMoisCalculee: async (annee, mois, inclureHorsPeriode = false) => {
//   //   try {
//   //     console.log("🔄 Récupération présences calculées:", { annee, mois });
//   //     const response = await api.get(`api/presence/mois/detail/calculee/`, {
//   //       params: {
//   //         annee,
//   //         mois,
//   //         inclure_hors_periode: inclureHorsPeriode,
//   //       },
//   //     });
//   //     console.log("✅ Présences récupérées:", response.data.presences?.length);
//   //     return response.data;
//   //   } catch (error) {
//   //     console.error(
//   //       "❌ Erreur lors de la récupération des présences calculées:",
//   //       error,
//   //     );
//   //     throw error;
//   //   }
//   // },

//   // presenceService.js — corriger l'URL
//   getPresencesMoisCalculee: async (annee, mois, inclureHorsPeriode = false, section = '') => {
//   const params = { annee, mois, inclure_hors_periode: inclureHorsPeriode };
//   if (section) params.section = section;
//   const response = await api.get(`api/presence/mois/detail/calculee/`, { params }); // ← URL corrigée
//   return response.data;
// },

//   getHorairesSection: async () => {
//     try {
//       const response = await api.get(`api/presence/horaires-section/`);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la récupération des horaires:", error);
//       throw error;
//     }
//   },

//   createHoraireSection: async (data) => {
//     try {
//       const response = await api.post(`api/presence/horaires-section/`, data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la création de l'horaire:", error);
//       throw error;
//     }
//   },

//   updateHoraireSection: async (section, data) => {
//     try {
//       const response = await api.put(
//         `api/presence/horaires-section/${section}/`,
//         data,
//       );
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la mise à jour de l'horaire:", error);
//       throw error;
//     }
//   },

//   getTypesEvenements: async () => {
//     try {
//       const response = await api.get(`api/presence/types-evenements/`);
//       return response.data;
//     } catch (error) {
//       console.error(
//         "❌ Erreur lors de la récupération des types d'événements:",
//         error,
//       );
//       throw error;
//     }
//   },

//   getEvenements: async (annee = null, mois = null, badgenumber = null) => {
//     try {
//       const params = {};
//       if (annee) params.annee = annee;
//       if (mois) params.mois = mois;
//       if (badgenumber) params.badgenumber = badgenumber;

//       console.log("🔄 Récupération événements avec params:", params);

//       const response = await api.get(`api/presence/evenements/`, { params });
//       console.log("✅ Événements récupérés:", response.data.count);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la récupération des événements:", error);
//       throw error;
//     }
//   },

//   deleteEvenementByUserDate: async (userid, date) => {
//     try {
//       console.log("🔄 Suppression événement:", { userid, date });
//       const response = await api.delete(
//         `api/presence/evenements/user/${userid}/date/${date}/`,
//       );
//       console.log("✅ Événement supprimé:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur lors de la suppression de l'événement:", error);
//       throw error;
//     }
//   },

//   getHeuresJour: async (userid, date) => {
//     try {
//       const response = await api.get(`api/presence/heures-jour/`, {
//         params: { userid, date },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur récupération heures jour:", error);
//       throw error;
//     }
//   },

//   /**
//    * Modifie manuellement les heures d'un employé
//    */
//   modifierHeuresManuellement: async (data) => {
//     try {
//       console.log("🔄 Modification manuelle heures:", data);

//       const response = await api.post(`api/presence/modifier-heures/`, data);

//       console.log("✅ Heures modifiées:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur modification heures:", error);
//       throw error;
//     }
//   },

//   /**
//    * Supprime les modifications manuelles et rétablit les pointages bruts
//    */
//   supprimerHeuresManuellement: async (userid, date) => {
//     try {
//       console.log("🔄 Suppression modifications heures:", { userid, date });

//       const response = await api.delete(`api/presence/supprimer-heures/`, {
//         data: { userid, date },
//       });

//       console.log("✅ Modifications supprimées:", response.data);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur suppression heures:", error);
//       throw error;
//     }
//   },

//   searchEmployees: async (query) => {
//     try {
//       const response = await api.get(`api/presence/search-employees/`, {
//         params: { q: query },
//       });
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur recherche employés:", error);
//       throw error;
//     }
//   },


//   // Ajouter dans presenceService
//   getSections: async () => {
//     try {
//       const response = await api.get(`api/presence/sections/`);
//       return response.data;
//     } catch (error) {
//       console.error("❌ Erreur récupération sections:", error);
//       throw error;
//     }
//   },
// };

// export default presenceService;




import api from "../api/api";

const presenceService = {
  updateEvenementByUserDate: async (
    userid,
    date,
    type_evenement,
    commentaire = "",
  ) => {
    try {
      const response = await api.post(
        `api/presence/evenements/user/${userid}/date/${date}/`,
        {
          type_evenement,
          commentaire,
        },
      );
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
      const response = await api.get(
        `api/presence/evenements/user/${userid}/date/${date}/`,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur vérification événement:", error);
      return null;
    }
  },

  getEvenementsMois: async (annee, mois) => {
    try {
      const response = await api.get(`api/presence/evenements/`, {
        params: { annee, mois },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération événements du mois:", error);
      throw error;
    }
  },

  genererDates: async (annee, mois) => {
    try {
      const response = await api.get(`api/presence/generer-dates/`, {
        params: { annee, mois },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la génération des dates:", error);
      throw error;
    }
  },

  getDates: async (annee, mois) => {
    try {
      const response = await api.get(`api/presence/dates/`, {
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
      const response = await api.get(`api/presence/mois/`, {
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

  getPresencesMoisCalculee: async (
    annee,
    mois,
    inclureHorsPeriode = false,
    section = "",
    page = 1,
    pageSize = 50,
    q = "",
  ) => {
    try {
      const params = {
        annee,
        mois,
        inclure_hors_periode: inclureHorsPeriode,
        page,
        page_size: pageSize,
      };

      if (section) params.section = section;
      if (q) params.q = q;

      const response = await api.get(`api/presence/mois/detail/calculee/`, {
        params,
      });

      return response.data;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des présences calculées:",
        error,
      );
      throw error;
    }
  },

  getHorairesSection: async () => {
    try {
      const response = await api.get(`api/presence/horaires-section/`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des horaires:", error);
      throw error;
    }
  },

  createHoraireSection: async (data) => {
    try {
      const response = await api.post(`api/presence/horaires-section/`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la création de l'horaire:", error);
      throw error;
    }
  },

  updateHoraireSection: async (section, data) => {
    try {
      const response = await api.put(
        `api/presence/horaires-section/${section}/`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour de l'horaire:", error);
      throw error;
    }
  },

  getTypesEvenements: async () => {
    try {
      const response = await api.get(`api/presence/types-evenements/`);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des types d'événements:",
        error,
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

      const response = await api.get(`api/presence/evenements/`, { params });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des événements:", error);
      throw error;
    }
  },

  deleteEvenementByUserDate: async (userid, date) => {
    try {
      const response = await api.delete(
        `api/presence/evenements/user/${userid}/date/${date}/`,
      );
      return response.data;
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'événement:", error);
      throw error;
    }
  },

  getHeuresJour: async (userid, date) => {
    try {
      const response = await api.get(`api/presence/heures-jour/`, {
        params: { userid, date },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération heures jour:", error);
      throw error;
    }
  },

  modifierHeuresManuellement: async (data) => {
    try {
      const response = await api.post(`api/presence/modifier-heures/`, data);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur modification heures:", error);
      throw error;
    }
  },

  supprimerHeuresManuellement: async (userid, date) => {
    try {
      const response = await api.delete(`api/presence/supprimer-heures/`, {
        data: { userid, date },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur suppression heures:", error);
      throw error;
    }
  },

  searchEmployees: async (query) => {
    try {
      const response = await api.get(`api/presence/search-employees/`, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Erreur recherche employés:", error);
      throw error;
    }
  },

  getSections: async () => {
    try {
      const response = await api.get(`api/presence/sections/`);
      return response.data;
    } catch (error) {
      console.error("❌ Erreur récupération sections:", error);
      throw error;
    }
  },
};

export default presenceService;