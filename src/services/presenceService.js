import axios from 'axios';

const API_URL = 'http://localhost:8000/api/presence/';

class PresenceService {
  // Récupérer toutes les présences
  getAllPresences() {
    return axios.get(API_URL);
  }

  // Récupérer les présences par badge number
  getPresenceByBadgeNumber(badgenumber) {
    return axios.get(`${API_URL}${badgenumber}/`);
  }
}

export default new PresenceService();