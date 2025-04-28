import React, { useState, useContext } from 'react';
import MainLayout from '../../layout/MainLayout';
import QueryInput from '../../components/QueryInput/QueryInput';
import ResultTable from '../../components/ResultTable/ResultTable';
import ExportOptions from '../../components/ExportOptions/ExportOptions';
import SchemaInfo from '../../components/SchemaInfo/SchemaInfo';
import QueryHistory from '../../components/QueryHistory/QueryHistory';
import { QueryContext } from '../../contexts/QueryContext';

const Home = () => {
    const { queryResults } = useContext(QueryContext);
    const [schemaInfo, setSchemaInfo] = useState(null);


    const handleSchemaInfo = (schema) => {
        setSchemaInfo(schema);
    };

    return (
        <MainLayout>
            <div className="home-container p-4">
                <a
                    href="/motto"
                    className="flex text-xl text-red-500 hover:text-red-600 hover:scale-105 font-extrabold justify-center transition-all duration-300 ease-in-out"
                >
                    Read my motto here
                </a>
                <QueryInput onSchemaInfo={handleSchemaInfo} />

                {schemaInfo && (
                    <div className="mt-4">
                        <SchemaInfo schema={schemaInfo} />
                    </div>
                )}

                {queryResults && queryResults.results && queryResults.results.length > 0 && (
                    <div className="mt-4">
                        <ResultTable
                            results={queryResults.results}
                            metadata={queryResults.metadata}
                        />
                        <ExportOptions queryResults={queryResults} />

                    </div>
                )}

                <div className="mt-4">
                    <QueryHistory />
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;