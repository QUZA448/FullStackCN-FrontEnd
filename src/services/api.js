import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = process.env.REACT_APP_JWT_TOKEN_KEY || 'forum_jwt_token';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    return Promise.resolve();
  }
};

export const questionsAPI = {
  getAll: (params) => api.get('/questions', { params }),
  getById: (id) => api.get(`/questions/${id}`),
  create: (data) => api.post('/questions', data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`)
};

export const answersAPI = {
  create: (questionId, data) => api.post(`/questions/${questionId}/answers`, data),
  update: (id, data) => api.put(`/answers/${id}`, data),
  delete: (id) => api.delete(`/answers/${id}`),
  markBest: (id) => api.patch(`/answers/${id}/mark-best`)
};

export const votesAPI = {
  vote: (data) => api.post('/votes', data),
  removeVote: (id) => api.delete(`/votes/${id}`)
};

export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  getQuestions: (id) => api.get(`/users/${id}/questions`),
  getAnswers: (id) => api.get(`/users/${id}/answers`)
};

export const tagsAPI = {
  getAll: () => api.get('/tags'),
  getByName: (name) => api.get(`/tags/${name}/questions`)
};

export default api;
