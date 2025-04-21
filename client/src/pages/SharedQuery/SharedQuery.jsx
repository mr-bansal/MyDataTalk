import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import MainLayout from '../../layout/MainLayout';
import ResultTable from '../../components/ResultTable/ResultTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const SharedQuery = () => {
    const { shareId } = useParams();
    const [sharedData, setSharedData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSharedData = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await api.get(`/export/shared/${shareId}`);
                setSharedData(response.data);
            } catch (err) {
                setError(err.message || 'Failed to load shared query.');
            } finally {
                setLoading(false);
            }
        };

        fetchSharedData();
    }, [shareId]);

    if (loading) {
        return (
            <MainLayout>
                <LoadingSpinner />
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Alert type="error" message={error} />
            </MainLayout>
        );
    }

    if (!sharedData || !sharedData.results) {
        return (
            <MainLayout>
                <p>No data found for this shared link.</p>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="shared-query-container">
                <h2>Shared Query Results</h2>
                {sharedData.query && <p><strong>Query:</strong> {sharedData.query}</p>}
                <ResultTable results={sharedData.results} />
                {sharedData.createdAt && (
                    <p className="text-sm text-gray-500 mt-2">
                        <strong>Created At:</strong> {new Date(sharedData.createdAt).toLocaleDateString()}
                    </p>
                )}
            </div>
        </MainLayout>
    );
};

export default SharedQuery;
