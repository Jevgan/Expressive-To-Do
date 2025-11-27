import { useState } from 'react'

export const TaskItem = ({ task, onToggleComplete, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [editedDueDate, setEditedDueDate] = useState(task.dueDate || "");

    const EditIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
        </svg>
    );

    const TrashIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    );

    const handleSave = () => {
        onUpdate(task.id, {
            title: editedTitle,
            description: editedDescription,
            dueDate: editedDueDate || ''
        });
        setIsEditing(false);
    };

    const isPastDue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 space-y-3">
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Назва завдання"
                />
                <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full p-2 border resize-none rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                    placeholder="Опис"
                />
                <input
                    type="datetime-local"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                    className="w-full p-2 border rounded-md text-gray-600"
                />
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors">Скасувати</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Зберегти</button>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-lg shadow-sm transition-all duration-300 flex flex-col sm:flex-row sm:items-start ${task.completed ? 'bg-gray-100' : 'bg-white'} ${isPastDue ? 'border-l-4 border-red-500' : 'border-l-4 border-transparent'}`}>
            <div className="flex items-start flex-grow min-w-0">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id, !task.completed)}
                    className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer flex-shrink-0"
                />
                <div className="ml-4 flex-grow min-w-0">
                    <h3 className={`text-lg font-medium break-words ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                    </h3>
                    <p className={`text-sm break-words ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                    </p>
                    {task.dueDate && (
                        <p className={`text-xs mt-2 p-1 px-2 rounded-full inline-block ${isPastDue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            Виконати до: {new Date(task.dueDate).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-2 mt-3 sm:mt-0 sm:ml-4 flex-shrink-0 self-end sm:self-start">
                <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                    <EditIcon />
                </button>
                <button onClick={() => onDelete(task.id)} className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};
