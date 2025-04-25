import React from 'react';

const Button = ({ children, onClick, className, ...rest }) => {
    const buttonClass = `px-4 py-2 bg-red-700 hover:scale-105 hover:bg-red-600 transition-transform duration-500 text-white font-semibold rounded-3xl shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75`;
    return (
        <button onClick={onClick} className={buttonClass} {...rest}>
            {children}
        </button>
    );
};

export default Button;