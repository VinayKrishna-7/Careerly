import api from './api.js';

export const coverLetterApi = {
  getAll: async () => {
    const response = await api.get('/cover-letters');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cover-letters/${id}`);
    return response.data;
  },

  create: async (data = {}) => {
    const response = await api.post('/cover-letters', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/cover-letters/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cover-letters/${id}`);
    return response.data;
  },

  generateText: async (data) => {
    const response = await api.post('/cover-letters/generate-text', data);
    return response.data;
  },

  downloadPdf: async (id, fileName = 'CoverLetter.pdf') => {
    const response = await api.get(`/cover-letters/${id}/pdf`, {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    return true;
  }
};

export default coverLetterApi;
