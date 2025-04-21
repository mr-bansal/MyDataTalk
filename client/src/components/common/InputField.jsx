import React from 'react';


const InputField = ({ label, type = 'text', value, onChange, ...rest }) => {
    return (
        <div className="mb-4">
            {label && (
                <label
                    htmlFor={rest.id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                type={type}
                id={rest.id}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                {...rest}
            />
        </div>
    );
};

export default InputField;