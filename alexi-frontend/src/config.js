/**
 * Application Configuration
 * Environment variables can be overridden via .env file
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
  GET_STATUS: `${API_BASE_URL}/get-status`,
  START_CLASSROOM: `${API_BASE_URL}/start-classroom`,
  START_MIMI_SESSION: `${API_BASE_URL}/start-mimi-session`,
  GET_MIMI_STATUS: `${API_BASE_URL}/mimi-get`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
