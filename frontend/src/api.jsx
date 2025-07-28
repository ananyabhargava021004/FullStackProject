// Import the axios library for making HTTP requests
import axios from 'axios';

// Create an axios instance with custom default configurations
export const API = axios.create({
  // Set the base URL for all HTTP requests made using this instance
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // Send cookies and credentials (like JWT tokens in cookies) along with every request
  // This is necessary when your frontend and backend are on different ports/domains and use cookies for authentication
  //  withCredentials: true,
});

// Export this axios instance so it can be imported and used across your React app
// export default API;

export const compilerAPI = axios.create({
  baseURL: import.meta.env.VITE_COMPILER_URL,
});

// these become functions ab