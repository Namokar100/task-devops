import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { boardService } from '../services/boards';
import Header from '../components/common/Header';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoard, setNewBoard] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const data = await boardService.getBoards();
      setBoards(data);
    } catch (error) {
      toast.error('Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const board = await boardService.createBoard(newBoard);
      setBoards([...boards, board]);
      setNewBoard({ title: '', description: '' });
      setShowCreateForm(false);
      toast.success('Board created successfully');
    } catch (error) {
      toast.error('Failed to create board');
    }
  };

  const handleDeleteBoard = async (id) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await boardService.deleteBoard(id);
        setBoards(boards.filter(board => board._id !== id));
        toast.success('Board deleted successfully');
      } catch (error) {
        toast.error('Failed to delete board');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Boards</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Board
            </button>
          </div>

          {showCreateForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Board</h3>
                <form onSubmit={handleCreateBoard}>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Board title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={newBoard.title}
                      onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      placeholder="Board description (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      value={newBoard.description}
                      onChange={(e) => setNewBoard({ ...newBoard, description: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div key={board._id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {board.title}
                    </h3>
                    <button
                      onClick={() => handleDeleteBoard(board._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {board.description || 'No description'}
                  </p>
                  <div className="mt-4">
                    <Link
                      to={`/board/${board._id}`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                    >
                      Open Board
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {boards.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No boards</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new board.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;