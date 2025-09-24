import api from './api';

export const taskService = {
  async getTasks(boardId) {
    const response = await api.get(`/tasks/board/${boardId}`);
    return response.data;
  },

  async createTask(taskData) {
    const formData = new FormData();
    Object.keys(taskData).forEach(key => {
      if (taskData[key] !== null && taskData[key] !== undefined) {
        formData.append(key, taskData[key]);
      }
    });

    const response = await api.post('/tasks', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateTask(id, taskData) {
    const formData = new FormData();
    Object.keys(taskData).forEach(key => {
      if (taskData[key] !== null && taskData[key] !== undefined) {
        formData.append(key, taskData[key]);
      }
    });

    const response = await api.put(`/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};