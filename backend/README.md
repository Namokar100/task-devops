# TaskBoard Backend

Express.js REST API for TaskBoard application with MongoDB.

## Features

- User authentication (signup/login/logout)
- Board management (CRUD operations)
- Task management with file uploads
- Health check and Prometheus metrics endpoints
- File upload support for tasks

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Boards
- `GET /api/boards` - Get user's boards
- `POST /api/boards` - Create new board
- `GET /api/boards/:id` - Get board with tasks
- `PUT /api/boards/:id` - Update board
- `DELETE /api/boards/:id` - Delete board

### Tasks
- `GET /api/tasks/board/:boardId` - Get tasks for board
- `POST /api/tasks` - Create new task (with optional file upload)
- `PUT /api/tasks/:id` - Update task (with optional file upload)
- `DELETE /api/tasks/:id` - Delete task

### System
- `GET /api/health` - Health check endpoint
- `GET /api/metrics` - Prometheus metrics

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables in `.env`:
```
MONGO_URI=mongodb://localhost:27017/task-devops
PORT=5000
```

3. Seed database with sample data:
```bash
npm run seed
```

4. Start development server:
```bash
npm run dev
```

## File Uploads

Files are stored in the `uploads/` directory. Supported formats:
- Images: jpeg, jpg, png, gif
- Documents: pdf, doc, docx, txt
- Max file size: 5MB

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (default: 5000)