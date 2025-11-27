import { useState } from 'react';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export const AddTaskForm = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAddTask({ title, description, dueDate });

        setTitle('');
        setDescription('');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-700">Нове завдання</h2>
            <input
                type="text"
                placeholder="Назва завдання"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full outline-none p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            />
            <textarea
                placeholder="Опис (необов'язково)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full outline-none resize-none min-h-[50px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                rows="2"
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                <input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="outline-none w-full sm:w-auto flex-grow p-3 border border-gray-300 rounded-md text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
                <button type="submit" className="flex items-center justify-center w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PlusIcon />
                    <span className="ml-2">Додати</span>
                </button>
            </div>
        </form>
    );
};
