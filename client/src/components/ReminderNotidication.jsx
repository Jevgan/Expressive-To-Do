export const ReminderNotification = ({ task, onClose }) => {
    const BellIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    );

    if (!task) return null;

    return (
        <div className="fixed top-4 right-4 sm:top-5 sm:right-5 w-full max-w-sm bg-white p-4 rounded-lg shadow-lg border-l-4 border-yellow-400 z-50 animate-fade-in-down">
            <div className="flex items-start">
                <BellIcon />
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">Нагадування!</p>
                    <p className="mt-1 text-sm text-gray-600">Час виконати завдання: "{task.title}"</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button onClick={onClose} className="inline-flex text-gray-400 hover:text-gray-500 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <span className="sr-only">Закрити</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
