import React from 'react';

const Button = ({ children, onClick, className, ...rest }) => {
    const buttonClass = `px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${className || ''}`;
    return (
        <button onClick={onClick} className={buttonClass} {...rest}>
            {children}
        </button>
    );
};

export default Button;