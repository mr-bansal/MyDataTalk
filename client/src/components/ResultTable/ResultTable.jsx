import React from 'react';

const ResultTable = ({ results, metadata }) => {
    if (!results || results.length === 0) {
        return (
            <div className="rounded-3xl p-2 bg-gradient-to-br from-black via-red-700 to-purple-800">
                <div className="rounded-3xl bg-gray-900 p-6 text-center">
                    <p className="text-white">No results found.</p>
                </div>
            </div>
        );
    }

    const columns = Object.keys(results[0] || {});

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

            {/* inner content */}
            <div className="relative rounded-3xl bg-gray-900 p-6 transform transition duration-500">
                <h3 className="text-2xl font-semibold mb-4 text-white text-center">
                    Query Results
                </h3>

                {metadata && (
                    <p className="text-gray-400 mb-2 text-center">
                        Rows: {metadata.row_count}, Execution Time: {metadata.execution_time_ms} ms
                    </p>
                )}

                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full bg-gray-800 border border-gray-700 shadow-md rounded-lg">
                        <thead className="bg-gray-700">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {results.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? 'bg-gray-700' : 'bg-gray-800'}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={`${index}-${column}`}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                                        >
                                            {row[column]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default ResultTable;