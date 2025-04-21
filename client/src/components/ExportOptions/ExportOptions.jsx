import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Button from '../common/Button';
import Alert from '../common/Alert';
import LoadingSpinner from '../common/LoadingSpinner';

const ExportOptions = ({ queryResults }) => {
    const [exportFormat, setExportFormat] = useState('');
    const [availableFormats, setAvailableFormats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shareableLink, setShareableLink] = useState('');

    useEffect(() => {
        const fetchFormats = async () => {
            try {
                const response = await api.get('/export/formats');
                setAvailableFormats(response.data.available_formats);
            } catch (err) {
                setError(err.message || 'Failed to fetch export formats.');
            }
        };

        fetchFormats();
    }, []);

    const handleExport = async (format) => {
        if (!queryResults || queryResults.results.length === 0) {
            setError('No results to export.');
            return;
        }

        setLoading(true);
        setExportFormat(format); // Set active format for loading indicator
        setError('');
        try {

            const response = await api.post(`/export/${format}`, {
                sqlQuery: queryResults.sql_query,

                results: queryResults.results
            }, {

                responseType: 'blob'
            });

            setLoading(false);

            // Handle file download based on the response
            const blob = response.data; // Data is already a blob with responseType: 'blob'
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `query_results${availableFormats.find(f => f.id === format)?.extension || ''}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a); // Clean up the DOM
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export error:', err.response?.data || err);
            setLoading(false);
            setError(err.message || `Failed to export to ${format}.`);
        }
    };

    const handleShare = async () => {
        if (!queryResults || queryResults.sql_query === '') {
            setError('No query to share.');
            return;
        }

        setLoading(true);
        setError('');
        setShareableLink('');
        try {

            const response = await api.post('/export/share', {
                sqlQuery: queryResults.sql_query,

                format: 'json'
            });

            setLoading(false);

            setShareableLink(response.data.shareUrl);
        } catch (err) {
            console.error('Share error:', err.response?.data || err);
            setLoading(false);
            setError(err.message || 'Failed to generate shareable link.');
        }
    };

    return (
        <div className="group relative rounded-3xl p-[2px] bg-transparent overflow-hidden m-8">

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


            <div className="relative rounded-3xl bg-gray-900 p-6 transform transition duration-500">
                <h3 className="text-xl font-semibold mb-4 text-white">Export Options</h3>

                {error && <Alert type="error" message={error} className="mb-4" />}

                <h4 className="text-lg font-medium mb-2 text-gray-200">Download</h4>
                <div className="export-buttons flex flex-wrap gap-4 mb-6">
                    {availableFormats.map((format) => (
                        <Button
                            key={format.id}
                            onClick={() => handleExport(format.id)}
                            disabled={loading}
                            className={`px-4 py-2 rounded-3xl text-white ${loading && exportFormat === format.id
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-transparent hover:bg-gray-700 transition-all duration-300 border border-gray-600'
                                }`}
                        >
                            {loading && exportFormat === format.id ? (
                                <LoadingSpinner size="small" />
                            ) : (
                                `Export to ${format.name}`
                            )}
                        </Button>
                    ))}
                </div>

                <h4 className="text-lg font-medium mb-2 text-gray-200">Share</h4>
                <Button
                    onClick={handleShare}
                    disabled={loading}
                    className={`px-4 py-2 rounded-3xl text-white ${loading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-transparent hover:bg-gray-700 transition-all duration-300 border border-gray-600'
                        }`}
                >
                    {loading ? <LoadingSpinner size="small" /> : 'Generate Shareable Link'}
                </Button>

                {shareableLink && (
                    <div className="share-link mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <p className="text-sm font-medium mb-2 text-gray-200">Share this link:</p>
                        <a
                            href={shareableLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline break-all"
                        >
                            {shareableLink}
                        </a>
                    </div>
                )}
            </div>
        </div>

    );
};

export default ExportOptions;