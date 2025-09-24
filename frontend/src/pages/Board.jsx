import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import { boardService } from '../services/boards';
import { taskService } from '../services/tasks';
import Header from '../components/common/Header';
import Column from '../components/board/Column';
import TaskModal from '../components/board/TaskModal';
import toast from 'react-hot-toast';

const Board = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [initialStatus, setInitialStatus] = useState('To Do');

  const statuses = ['To Do', 'In Progress', 'Done'];

  useEffect(() => {
    fetchBoardData();
  }, [id]);

  const fetchBoardData = async () => {
    try {
      const [boardData, tasksData] = await Promise.all([
        boardService.getBoard(id),
        taskService.getTasks(id)
      ]);
      setBoard(boardData);
      setTasks(tasksData);
    } catch (error) {
      toast.error('Failed to fetch board data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    try {
      await taskService.updateTask(draggableId, { status: destination.droppableId });
      
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === draggableId
            ? { ...task, status: destination.droppableId }
            : task
        )
      );
      
      toast.success('Task moved successfully');
    } catch (error) {
      toast.error('Failed to move task');
    }
  };

  const handleAddTask = (status) => {
    setInitialStatus(status);
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.updateTask(editingTask._id, taskData);
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === editingTask._id ? updatedTask : task
          )
        );
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.createTask({ ...taskData, boardId: id });
        setTasks(prevTasks => [...prevTasks, newTask]);
        toast.success('Task created successfully');
      }
    } catch (error) {
      toast.error('Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
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
            <div>
              <Link
                to="/dashboard"
                className="text-indigo-600 hover:text-indigo-800 text-sm mb-2 inline-block"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{board?.title}</h1>
              {board?.description && (
                <p className="text-gray-600 mt-1">{board.description}</p>
              )}
            </div>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statuses.map(status => (
                <Column
                  key={status}
                  status={status}
                  tasks={getTasksByStatus(status)}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </DragDropContext>

          <TaskModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveTask}
            task={editingTask}
            initialStatus={initialStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Board;