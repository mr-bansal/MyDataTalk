import React, { useContext } from 'react';
import { QueryContext } from '../../contexts/QueryContext';

const QueryHistory = () => {
    const { history, getFromHistory, setQueryResults } = useContext(QueryContext);



    if (!history || history.length === 0) {
        return (
            <div className="group relative rounded-3xl p-[2px] bg-transparent overflow-hidden">

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
                <div className="relative rounded-3xl bg-gray-900 p-6 text-center">
                    <p className="text-white font-bold">No query history available.</p>
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

            {/* inner content */}
            <div className="relative rounded-3xl bg-gray-900 p-6 text-center transform transition duration-500">
                <h3 className="text-xl font-semibold text-white mb-4">Query History</h3>
                <ul className="space-y-4">
                    {history.map((item) => (
                        <li
                            key={item.id}
                            className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 cursor-pointer hover:bg-gray-700 transition-all duration-300"
                            onClick={() => {
                                const cached = getFromHistory(item.id);
                                console.log('Clicked, cached:', cached);
                                setQueryResults({ results: cached.results, metadata: cached.metadata });
                            }}
                        >
                            <p className="text-gray-200">
                                <strong className="text-white">Query:</strong>{' '}
                                {item.naturalQuery || item.sqlQuery}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                <strong>Created At:</strong>{' '}
                                {new Date(item.created_at).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
};

export default QueryHistory;