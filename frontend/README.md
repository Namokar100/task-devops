# TaskBoard Frontend

React frontend for the TaskBoard application built with Vite and Tailwind CSS.

## Features

- User authentication (login/signup)
- Dashboard with board management
- Kanban board with drag-and-drop functionality
- Task management with file uploads
- Responsive design with Tailwind CSS

## Tech Stack

- React 19
- Vite
- React Router DOM
- Axios for API calls
- React Beautiful DnD for drag-and-drop
- React Hot Toast for notifications
- Tailwind CSS for styling

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── board/         # Board and task components
│   └── common/        # Shared components
├── context/           # React contexts
├── pages/             # Main pages
├── services/          # API services
└── App.jsx           # Main app component
```