import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

const Column = ({ status, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const statusColors = {
    'To Do': 'bg-gray-100 border-gray-300',
    'In Progress': 'bg-yellow-100 border-yellow-300',
    'Done': 'bg-green-100 border-green-300'
  };

  return (
    <div className={`rounded-lg border-2 ${statusColors[status]} p-4 min-h-96`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">{status}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      
      <button
        onClick={() => onAddTask(status)}
        className="w-full mb-4 p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
      >
        + Add a task
      </button>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-32 ${
              snapshot.isDraggingOver ? 'bg-indigo-50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;