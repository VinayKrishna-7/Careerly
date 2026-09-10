import api from './api.js';

export const resumeApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/resumes', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resumes/${id}`);
    return response.data;
  },

  create: async (data = {}) => {
    const response = await api.post('/resumes', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/resumes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/resumes/${id}`);
    return response.data;
  },

  duplicate: async (id) => {
    const response = await api.post(`/resumes/${id}/duplicate`);
    return response.data;
  },

  rename: async (id, title) => {
    const response = await api.patch(`/resumes/${id}/rename`, { title });
    return response.data;
  },

  getAtsScore: async (id, jobDescription = '', resumeData = null) => {
    const response = await api.post(`/resumes/${id}/score`, { jobDescription, resumeData });
    return response.data;
  },

  downloadPdf: async (id, fileName = 'resume.pdf') => {
    const response = await api.get(`/resumes/${id}/pdf`, {
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
