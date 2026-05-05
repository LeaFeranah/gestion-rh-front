import api from '../api/api'; // ✅ Importer l'instance configurée avec l'intercepteur

// ==================== EMPLOYÉS ====================
// export const getAllEmployees = async () => {
//   const response = await api.get('api/personnel/employes/');
//   return response.data;
// };
// export const getAllEmployees = async (page = 1, pageSize = 50) => {
//   const response = await api.get('api/personnel/employes/', {
//     params: { page, page_size: pageSize }
//   });
//   return response.data;
// };
export const getAllEmployees = async (page = 1, pageSize = 100) => {
  const response = await api.get('api/personnel/employes/', {
    params: { page, page_size: pageSize }
  });
  // Si paginé → retourner results, sinon retourner data directement
  return response.data.results || response.data;
};

// ✅ AJOUTER cette fonction qui manque
export const getEmployeeById = async (id) => {
  const response = await api.get(`api/personnel/employes/${id}/`);
  return response.data;
};

export const createEmployee = async (formData) => {
  try {
    const response = await api.post(
      'api/personnel/employes/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur création employé:', error);
    throw error;
  }
};

export const updateEmployee = async (id, formData) => {
  const response = await api.put(
    `api/personnel/employes/${id}/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`api/personnel/employes/${id}/`);
  return response.data;
};

// export const deleteInformationProfessionnelle = async (id) => {
//   const response = await api.delete(`api/personnel/professionnelle/${id}/`);
//   return response.data;
// };

// ==================== INFORMATIONS BANCAIRES ====================
export const createBancaire = async (bancaireData) => {
  const response = await api.post('api/personnel/bancaire/', bancaireData);
  return response.data;
};

export const updateBancaire = async (id, bancaireData) => {
  const response = await api.put(`api/personnel/bancaire/${id}/`, bancaireData);
  return response.data;
};

// ==================== INFORMATIONS SALAIRE ====================
export const createSalaire = async (salaireData) => {
  const response = await api.post('api/personnel/salaire/', salaireData);
  return response.data;
};

export const updateSalaire = async (id, salaireData) => {
  const response = await api.put(`api/personnel/salaire/${id}/`, salaireData);
  return response.data;
};

export const getSalaire = async (id) => {
  const response = await api.get(`api/personnel/salaire/${id}/`);
  return response.data;
};

export const deleteSalaire = async (id) => {
  const response = await api.delete(`api/personnel/salaire/${id}/`);
  return response.data;
};

// ==================== SALAIRE AVEC HISTORIQUE ====================
export const getAllSalaireAvecHistorique = async () => {
  const response = await api.get('api/personnel/salaire-avec-historique/');
  return response.data;
};

export const getSalaireAvecHistorique = async (id) => {
  const response = await api.get(`api/personnel/salaire-avec-historique/${id}/`);
  return response.data;
};


// ==================== INFORMATIONS FAMILIALES ====================
export const createFamiliale = async (familialeData) => {
  const response = await api.post('api/personnel/familiale/', familialeData);
  return response.data;
};

export const updateFamiliale = async (id, familialeData) => {
  const response = await api.put(`api/personnel/familiale/${id}/`, familialeData);
  return response.data;
};

// ==================== GESTION DES ENFANTS ====================
export const getAllEnfants = async () => {
  const response = await api.get('api/personnel/enfants/');
  return response.data;
};

export const getEnfantsByFamiliale = async (familialeId) => {
  const response = await api.get(`api/personnel/enfants/?familiale=${familialeId}`);
  return response.data;
};

export const createEnfant = async (enfantData) => {
  const response = await api.post('api/personnel/enfants/', enfantData);
  return response.data;
};

export const updateEnfant = async (id, enfantData) => {
  const response = await api.put(`api/personnel/enfants/${id}/`, enfantData);
  return response.data;
};

export const deleteEnfant = async (id) => {
  const response = await api.delete(`api/personnel/enfants/${id}/`);
  return response.data;
};

export const getEnfant = async (id) => {
  const response = await api.get(`api/personnel/enfants/${id}/`);
  return response.data;
};

// ==================== DOSSIER PERSONNEL ====================
export const createDossierPersonnel = async (dossierData) => {
  const response = await api.post('api/personnel/dossier/', dossierData);
  return response.data;
};

export const updateDossierPersonnel = async (id, dossierData) => {
  const response = await api.put(`api/personnel/dossier/${id}/`, dossierData);
  return response.data;
};

export const getDossierPersonnel = async (id) => {
  const response = await api.get(`api/personnel/dossier/${id}/`);
  return response.data;
};

// ==================== INFORMATIONS SOCIALES ====================
export const createSociale = async (socialeData) => {
  const response = await api.post('api/personnel/sociale/', socialeData);
  return response.data;
};

export const updateSociale = async (id, socialeData) => {
  const response = await api.put(`api/personnel/sociale/${id}/`, socialeData);
  return response.data;
};

// ==================== DASHBOARD & STATISTIQUES ====================
export const getMesEmployes = async () => {
  const response = await api.get('api/personnel/mes-employes/');
  return response.data;
};

export const getMesStatistiques = async () => {
  const response = await api.get('api/personnel/mes-statistiques/');
  return response.data;
};

export const getProfilUtilisateur = async () => {
  const response = await api.get('api/personnel/profil/');
  return response.data;
};

// ==================== AUTHENTIFICATION ====================
export const login = async (credentials) => {
  const response = await api.post('api/personnel/login/', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('api/personnel/logout/');
  return response.data;
};





// ==================== HISTORIQUE DES SALAIRES ====================

export const getHistoriqueBySalaire = async (salaireId) => {
  const response = await api.get(`api/personnel/salaire/${salaireId}/historique/`);
  return response.data;
};


export const getAllHistoriqueSalaire = async () => {
  const response = await api.get('api/personnel/historique-salaire/');
  return response.data;
};


export const getHistoriqueSalaire = async (historiqueId) => {
  const response = await api.get(`api/personnel/historique-salaire/${historiqueId}/`);
  return response.data;
};

export const getHistoriqueSalaireParEmploye = async (employeId) => {
  const response = await api.get(
    `api/personnel/historique-salaire/par_employe/?employe_id=${employeId}`
  );
  return response.data;
};






// ==================== INFORMATIONS PROFESSIONNELLES ====================

export const getAllInformationsProfessionnelles = async () => {
  const response = await api.get('api/personnel/professionnelle/');
  return response.data;
};

export const getInformationProfessionnelleByEmploye = async (employeId) => {
  const response = await api.get(`api/personnel/professionnelle/?employe=${employeId}`);
  return response.data;
};

export const getInformationProfessionnelle = async (id) => {
  const response = await api.get(`api/personnel/professionnelle/${id}/`);
  return response.data;
};

export const createInformationProfessionnelle = async (professionnelleData) => {
  const response = await api.post('api/personnel/professionnelle/', professionnelleData);
  return response.data;
};

export const updateInformationProfessionnelle = async (id, professionnelleData) => {
  const response = await api.put(`api/personnel/professionnelle/${id}/`, professionnelleData);
  return response.data;
};











// ==================== ÉVOLUTIONS DE POSTE ====================

// Récupérer toutes les évolutions de poste
export const getAllEvolutionsPoste = async () => {
  const response = await api.get('api/personnel/evolutions-poste/');
  return response.data;
};

// Récupérer les évolutions de poste par employé
export const getEvolutionsPosteByEmploye = async (employeId) => {
  const response = await api.get(`api/personnel/evolutions-poste/par-employe/${employeId}/`);
  return response.data;
};

// Récupérer les évolutions via l'information professionnelle
export const getEvolutionsByInfoProfessionnelle = async (infoProfId) => {
  const response = await api.get(`api/personnel/professionnelle/${infoProfId}/evolutions/`);
  return response.data;
};

// Créer une évolution de poste
export const createEvolutionPoste = async (evolutionData) => {
  const response = await api.post('api/personnel/evolutions-poste/', evolutionData);
  return response.data;
};

// Créer une évolution via l'information professionnelle
export const createEvolutionViaInfoPro = async (infoProfId, evolutionData) => {
  const response = await api.post(`api/personnel/professionnelle/${infoProfId}/creer-evolution/`, evolutionData);
  return response.data;
};

// Appliquer une évolution de poste
export const appliquerEvolutionPoste = async (evolutionId) => {
  const response = await api.post(`api/personnel/evolutions-poste/${evolutionId}/appliquer/`, {});
  return response.data;
};

// Changer le statut d'une évolution
export const changerStatutEvolutionPoste = async (evolutionId, statut) => {
  const response = await api.post(`api/personnel/evolutions-poste/${evolutionId}/changer-statut/`, { statut });
  return response.data;
};

// Récupérer une évolution spécifique
export const getEvolutionPoste = async (evolutionId) => {
  const response = await api.get(`api/personnel/evolutions-poste/${evolutionId}/`);
  return response.data;
};

// Mettre à jour une évolution
export const updateEvolutionPoste = async (evolutionId, evolutionData) => {
  const response = await api.put(`api/personnel/evolutions-poste/${evolutionId}/`, evolutionData);
  return response.data;
};

// Supprimer une évolution
export const deleteEvolutionPoste = async (evolutionId) => {
  const response = await api.delete(`api/personnel/evolutions-poste/${evolutionId}/`);
  return response.data;
};