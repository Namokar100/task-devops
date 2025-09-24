const Board = require('../models/Board');
const Task = require('../models/Task');

const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const owner = req.userId;

    const board = new Board({ title, description, owner });
    await board.save();

    res.status(201).json(board);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.userId }).populate('owner', 'username email');
    res.json(boards);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.userId })
      .populate('owner', 'username email');
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const tasks = await Task.find({ board: board._id }).populate('assignedTo', 'username');
    
    res.json({ ...board.toObject(), tasks });
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { title, description },
      { new: true }
    );

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await Task.deleteMany({ board: req.params.id });
    
    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createBoard, getBoards, getBoard, updateBoard, deleteBoard };