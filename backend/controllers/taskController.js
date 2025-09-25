const Task = require('../models/Task');
const Board = require('../models/Board');
const { uploadFile, deleteFile } = require('../services/fileService');

const createTask = async (req, res) => {
  try {
    const { title, description, status, boardId } = req.body;
    
    const board = await Board.findOne({ _id: boardId, owner: req.userId });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const taskData = {
      title,
      description,
      status: status || 'To Do',
      board: boardId,
      assignedTo: req.userId
    };

    if (req.file) {
      const fileData = await uploadFile(req.file);
      taskData.fileName = fileData.fileName;
      taskData.originalName = fileData.originalName;
      taskData.fileUrl = fileData.url;
    }

    const task = new Task(taskData);
    await task.save();
    
    await task.populate('assignedTo', 'username');
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { boardId } = req.params;
    
    const board = await Board.findOne({ _id: boardId, owner: req.userId });
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const tasks = await Task.find({ board: boardId }).populate('assignedTo', 'username');
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    const task = await Task.findById(req.params.id).populate('board');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const board = await Board.findOne({ _id: task.board._id, owner: req.userId });
    if (!board) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = { title, description, status };
    if (req.file) {
      if (task.fileName) {
        await deleteFile(task.fileName);
      }
      const fileData = await uploadFile(req.file);
      updateData.fileName = fileData.fileName;
      updateData.originalName = fileData.originalName;
      updateData.fileUrl = fileData.url;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'username');

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('board');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const board = await Board.findOne({ _id: task.board._id, owner: req.userId });
    if (!board) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (task.fileName) {
      await deleteFile(task.fileName);
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };