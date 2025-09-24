const mongoose = require('mongoose');
const User = require('../models/User');
const Board = require('../models/Board');
const Task = require('../models/Task');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Board.deleteMany({});
    await Task.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: 'password123'
      }
    ]);

    console.log('Created users:', users.length);

    // Create sample boards
    const boards = await Board.create([
      {
        title: 'Project Alpha',
        description: 'Main development project',
        owner: users[0]._id
      },
      {
        title: 'Marketing Campaign',
        description: 'Q4 marketing initiatives',
        owner: users[0]._id
      },
      {
        title: 'Personal Tasks',
        description: 'Personal productivity board',
        owner: users[1]._id
      }
    ]);

    console.log('Created boards:', boards.length);

    // Create sample tasks
    const tasks = await Task.create([
      {
        title: 'Setup development environment',
        description: 'Configure Docker and local development setup',
        status: 'Done',
        board: boards[0]._id,
        assignedTo: users[0]._id
      },
      {
        title: 'Implement user authentication',
        description: 'Create login and signup functionality',
        status: 'In Progress',
        board: boards[0]._id,
        assignedTo: users[0]._id
      },
      {
        title: 'Design database schema',
        description: 'Plan MongoDB collections and relationships',
        status: 'To Do',
        board: boards[0]._id,
        assignedTo: users[0]._id
      },
      {
        title: 'Create social media content',
        description: 'Develop content for Instagram and Twitter',
        status: 'To Do',
        board: boards[1]._id,
        assignedTo: users[0]._id
      },
      {
        title: 'Learn Docker',
        description: 'Complete Docker tutorial and practice',
        status: 'In Progress',
        board: boards[2]._id,
        assignedTo: users[1]._id
      }
    ]);

    console.log('Created tasks:', tasks.length);
    console.log('Seed data created successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();