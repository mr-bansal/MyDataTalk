import React from 'react';

const SchemaInfo = ({ schema }) => {
    if (!schema || schema.length === 0) {
        return (
            <div className="rounded-3xl p-2 bg-gradient-to-br from-black via-red-700 to-purple-800">
                <div className="rounded-3xl bg-gray-900 p-6 text-center">
                    <p className="text-white">No schema information available.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="group relative rounded-3xl p-[2px] bg-transparent overflow-hidden m-8">
            {/* animated gradient border */}
            <div
                className="
      absolute inset-0
      bg-gradient-to-br from-black via-red-700 to-purple-800
      rounded-3xl
      transform origin-top-left scale-0
      group-hover:scale-100
      transition-transform duration-500
    "
            />

            {/* your inner content */}
            <div className="relative rounded-3xl bg-gray-900 p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">
                    Database Schema (Country Table)
                </h3>
                <ul className="list-none space-y-2">
                    {schema.map((column) => (
                        <li key={column.column_name} className="text-gray-300">
                            <strong className="font-medium text-white">
                                {column.column_name}:
                            </strong>{" "}
                            {column.data_type}
                            {column.character_maximum_length &&
                                ` (max length: ${column.character_maximum_length})`}
                            {column.is_nullable === "YES" ? " (nullable)" : " (not nullable)"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
};

export default SchemaInfo;