import React from 'react';

const Alert = ({ type = 'info', message, onClose }) => {
    const alertClass = `alert alert-${type}`;
    return (
        <div className={`${alertClass} p-4 rounded-md shadow-md flex items-center justify-between`}>
            <span className="text-sm font-medium">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded"
                >
                    &times;
                </button>
            )}
        </div>
    );
};

export default Alert;