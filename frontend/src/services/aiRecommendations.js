import axios from 'axios';

// Fetches AI Recommendations (Stitch MCP ready logic bound to dynamic backend architectures)
export const getRecommendations = async (token) => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    
    // Securely requests the actively aggregated arrays mapping natively off active ML models.
    const { data } = await axios.get('http://localhost:5000/api/recommendations', config);
    return data;
    
  } catch (error) {
    console.error('Failed to fetch AI Recommendations:', error);
    
    // Fallback safely to empty arrays to prevent mapping crashes on the DOM
    return {
      recommendedForYou: [],
      becauseYouViewed: []
    };
  }
};
