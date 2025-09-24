import api from './api';

export const taskService = {
  async getTasks(boardId) {
    const response = await api.get(`/tasks/board/${boardId}`);
    return response.data;
  },

  async createTask(taskData) {
    const formData = new FormData();
    Object.keys(taskData).forEach(key => {
      if (key === 'file' && taskData[key] instanceof File) {
        formData.append('file', taskData[key]);
      } else if (key !== 'file' && taskData[key] !== null && taskData[key] !== undefined) {
        formData.append(key, taskData[key]);
      }
    });

    const response = await api.post('/tasks', formData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const formData = new FormData();
    Object.keys(taskData).forEach(key => {
      if (key === 'file' && taskData[key] instanceof File) {
        formData.append('file', taskData[key]);
      } else if (key !== 'file' && taskData[key] !== null && taskData[key] !== undefined) {
        formData.append(key, taskData[key]);
      }
    });

    const response = await api.put(`/tasks/${id}`, formData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};