import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Fetch all notices
export const fetchNotices = async () => {
  try {
    const response = await axios.get(`${API_URL}/notices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notices:", error);
    return [];
  }
};

// Add a new notice
export const addNotice = async (title, content) => {
  try {
    const response = await axios.post(`${API_URL}/notices`, {
      title,
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding notice:", error);
    return null;
  }
};
