import { Draggable } from 'react-beautiful-dnd';

const TaskCard = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-3 ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(task)}
                className="text-gray-400 hover:text-indigo-600"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="text-gray-400 hover:text-red-600"
              >
                🗑️
              </button>
            </div>
          </div>
          {task.description && (
            <p className="text-xs text-gray-600 mb-2">{task.description}</p>
          )}
          {task.fileName && (
            <div className="text-xs text-indigo-600 mb-2">
              📎 {task.originalName || 'File attached'}
            </div>
          )}
          <div className="text-xs text-gray-500">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;