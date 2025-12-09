import api from '../api/api'; // ✅ Importer l'instance configurée avec l'intercepteur

// ==================== EMPLOYÉS ====================
export const getAllEmployees = async () => {
  const response = await api.get('api/personnel/employes/');
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

export const deleteInformationProfessionnelle = async (id) => {
  const response = await api.delete(`api/personnel/professionnelle/${id}/`);
  return response.data;
};

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







// ==================== ÉVOLUTION DE POSTE ====================

/**
 * Récupère toutes les évolutions de poste
 * @returns {Promise} - Liste de toutes les évolutions
 */
export const getAllEvolutionsPoste = async () => {
  const response = await api.get('api/personnel/evolution-poste/');
  return response.data;
};

/**
 * Récupère une évolution de poste par son ID
 * @param {number} id - L'ID de l'évolution
 * @returns {Promise} - Évolution de poste
 */
export const getEvolutionPoste = async (id) => {
  const response = await api.get(`api/personnel/evolution-poste/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle évolution de poste
 * @param {Object} evolutionData - Données de l'évolution
 * @returns {Promise} - Évolution créée
 */
export const createEvolutionPoste = async (evolutionData) => {
  const response = await api.post('api/personnel/evolution-poste/', evolutionData);
  return response.data;
};

/**
 * Met à jour une évolution de poste
 * @param {number} id - L'ID de l'évolution
 * @param {Object} evolutionData - Données à mettre à jour
 * @returns {Promise} - Évolution mise à jour
 */
export const updateEvolutionPoste = async (id, evolutionData) => {
  const response = await api.put(`api/personnel/evolution-poste/${id}/`, evolutionData);
  return response.data;
};

/**
 * Supprime une évolution de poste
 * @param {number} id - L'ID de l'évolution
 * @returns {Promise} - Confirmation de suppression
 */
export const deleteEvolutionPoste = async (id) => {
  const response = await api.delete(`api/personnel/evolution-poste/${id}/`);
  return response.data;
};

/**
 * Récupère toutes les évolutions d'un employé (via URL param)
 * @param {number} employeId - L'ID de l'employé
 * @returns {Promise} - { employe, information_actuelle, total_evolutions, evolutions: [] }
 */
export const getEvolutionsByEmploye = async (employeId) => {
  const response = await api.get(`api/personnel/evolution-poste/employe/${employeId}`);
  return response.data;
};

/**
 * Récupère toutes les évolutions d'un employé (via query param)
 * @param {number} employeId - L'ID de l'employé
 * @returns {Promise} - Liste des évolutions
 */
export const getEvolutionsParEmploye = async (employeId) => {
  const response = await api.get(`api/personnel/evolution-poste/par-employe/?employe_id=${employeId}`);
  return response.data;
};

/**
 * Récupère les statistiques des évolutions de poste
 * @returns {Promise} - Statistiques
 */
export const getStatistiquesEvolutions = async () => {
  const response = await api.get('api/personnel/evolution-poste/statistiques/');
  return response.data;
};

/**
 * Récupère les évolutions filtrées par section
 * @param {string} section - Nom de la section
 * @returns {Promise} - { section, count, evolutions: [] }
 */
export const getEvolutionsBySection = async (section) => {
  const response = await api.get(`api/personnel/evolution-poste/par-section/?section=${encodeURIComponent(section)}`);
  return response.data;
};

/**
 * Récupère les évolutions filtrées par type
 * @param {string} type - Type d'évolution (PROMOTION, MUTATION, etc.)
 * @returns {Promise} - { type, type_display, count, evolutions: [] }
 */
export const getEvolutionsByType = async (type) => {
  const response = await api.get(`api/personnel/evolution-poste/par-type/?type=${type}`);
  return response.data;
};

/**
 * Récupère les évolutions récentes
 * @param {number} limit - Nombre d'évolutions à récupérer (par défaut 20)
 * @returns {Promise} - { count, limit, evolutions: [] }
 */
export const getEvolutionsRecentes = async (limit = 20) => {
  const response = await api.get(`api/personnel/evolution-poste/recentes/?limit=${limit}`);
  return response.data;
};

/**
 * Récupère l'historique des évolutions pour une information professionnelle
 * @param {number} infoProfId - L'ID de l'information professionnelle
 * @returns {Promise} - Historique des évolutions
 */
export const getHistoriqueEvolutionByInfoProf = async (infoProfId) => {
  const response = await api.get(`api/personnel/professionnelle/${infoProfId}/historique-evolution/`);
  return response.data;
};








// ==================== HISTORIQUE DES SALAIRES ====================

/**
 * Récupère TOUT l'historique d'un salaire spécifique (recommandé)
 * @param {number} salaireId - L'ID du salaire
 * @returns {Promise} - { count, employe, historiques: [] }
 */
export const getHistoriqueBySalaire = async (salaireId) => {
  const response = await api.get(`api/personnel/salaire/${salaireId}/historique/`);
  return response.data;
};

/**
 * Récupère tous les historiques de salaires (tous employés du RH connecté)
 * @returns {Promise} - Liste de tous les historiques
 */
export const getAllHistoriqueSalaire = async () => {
  const response = await api.get('api/personnel/historique-salaire/');
  return response.data;
};

/**
 * Récupère un historique spécifique par son ID
 * @param {number} historiqueId - L'ID de l'historique
 * @returns {Promise} - Un seul historique
 */
export const getHistoriqueSalaire = async (historiqueId) => {
  const response = await api.get(`api/personnel/historique-salaire/${historiqueId}/`);
  return response.data;
};

/**
 * Récupère l'historique filtré par employé
 * @param {number} employeId - L'ID de l'employé
 * @returns {Promise} - Liste des historiques de cet employé
 */
export const getHistoriqueSalaireParEmploye = async (employeId) => {
  const response = await api.get(
    `api/personnel/historique-salaire/par_employe/?employe_id=${employeId}`
  );
  return response.data;
};






// ==================== INFORMATIONS PROFESSIONNELLES ====================

/**
 * Récupère toutes les informations professionnelles
 * @returns {Promise} - Liste des informations professionnelles
 */
export const getAllInformationsProfessionnelles = async () => {
  const response = await api.get('api/personnel/professionnelle/');
  return response.data;
};

/**
 * Récupère les informations professionnelles d'un employé spécifique
 * @param {number} employeId - L'ID de l'employé
 * @returns {Promise} - Informations professionnelles de l'employé
 */
export const getInformationProfessionnelleByEmploye = async (employeId) => {
  const response = await api.get(`api/personnel/professionnelle/?employe=${employeId}`);
  return response.data;
};

/**
 * Récupère une information professionnelle par son ID
 * @param {number} id - L'ID de l'information professionnelle
 * @returns {Promise} - Information professionnelle
 */
export const getInformationProfessionnelle = async (id) => {
  const response = await api.get(`api/personnel/professionnelle/${id}/`);
  return response.data;
};

/**
 * Crée une nouvelle information professionnelle
 * @param {Object} professionnelleData - Données de l'information professionnelle
 * @returns {Promise} - Information professionnelle créée
 */
export const createInformationProfessionnelle = async (professionnelleData) => {
  const response = await api.post('api/personnel/professionnelle/', professionnelleData);
  return response.data;
};

/**
 * Met à jour une information professionnelle existante
 * @param {number} id - L'ID de l'information professionnelle
 * @param {Object} professionnelleData - Données à mettre à jour
 * @returns {Promise} - Information professionnelle mise à jour
 */
export const updateInformationProfessionnelle = async (id, professionnelleData) => {
  const response = await api.put(`api/personnel/professionnelle/${id}/`, professionnelleData);
  return response.data;
};

/**
 * Supprime une information professionnelle
 * @param {number} id - L'ID de l'information professionnelle
 * @returns {Promise} - Confirmation de suppression
 */
