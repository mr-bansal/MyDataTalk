import React, { useState, useContext } from 'react';
import { api } from '../../services/api';
import Button from '../common/Button';
import InputField from '../common/InputField';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';
import { QueryContext } from '../../contexts/QueryContext';

const QueryInput = ({ onSchemaInfo }) => {
    const { setQueryResults, addToHistory } = useContext(QueryContext);
    const [naturalQuery, setNaturalQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleInputChange = (e) => {
        setNaturalQuery(e.target.value);
        setError('');
    };

    const handleSubmitQuery = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/query', { query: naturalQuery });
            setLoading(false);

            if (response.data.sql_query) {
                setQueryResults(response.data);
                addToHistory(
                    naturalQuery,
                    response.data.sql_query,
                    response.data.results,
                    response.data.metadata
                );

            } else {
                setError('No results received.');
            }
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Failed to process query.');
        }
    };



    const handleGetSchema = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.get('/query/schema');
            setLoading(false);
            onSchemaInfo(response.data);
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Failed to fetch schema.');
        }
    };

    return (
        <>
            {loading ? (
                <LoadingSpinner size="small" />
            ) : (
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
                    <div className="relative rounded-[calc(1.5rem-2px)] bg-gray-900 p-6 text-center transition duration-500">
                        <h2 className="text-2xl font-semibold text-white mb-4">Ask a Question about Countries</h2>

                        <InputField
                            id="naturalQuery"
                            value={naturalQuery}
                            onChange={handleInputChange}
                            placeholder="e.g., Give Names of top 10 countries with greatest GDP"
                            className="w-full p-1.5 rounded-lg bg-gray-800 text-white placeholder-gray-400 text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                        />

                        <div className="flex justify-between items-center mt-4">

                            <Button
                                onClick={handleSubmitQuery}
                                className="  
                             
                          bg-red-700
                          hover:scale-105
                          hover:bg-red-600
                          transition-transform duration-500"
                            >
                                Get Results
                            </Button>

                            <Button
                                onClick={handleGetSchema}
                                className="
                          bg-red-700
                          hover:scale-105
                            hover:bg-red-600
                          transition-transform duration-500"
                            >
                                Show Available Schema
                            </Button>
                        </div>



                        {error && <Alert type="error" message={error} />}
                    </div>
                </div>
            )}
        </>
    );
};

export default QueryInput;