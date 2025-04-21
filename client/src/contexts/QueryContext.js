import React, { createContext, useState, useEffect } from 'react';

export const QueryContext = createContext();

const HISTORY_KEY = 'sql_nl_history';
const MAX_HISTORY = 10;

export const QueryProvider = ({ children }) => {
    const [queryResults, setQueryResults] = useState(null);
    const [history, setHistory] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = window.localStorage.getItem(HISTORY_KEY);
        if (stored) {
            setHistory(JSON.parse(stored));
        }
    }, []);

    // Persist history whenever it changes
    useEffect(() => {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }, [history]);


    const addToHistory = (naturalQuery, sqlQuery, results, metadata) => {
        const entry = {
            id: Date.now(),
            naturalQuery,
            sqlQuery,
            results,
            metadata,
            created_at: new Date().toISOString(),
        };
        setHistory(prev => {
            const next = [entry, ...prev];
            return next.slice(0, MAX_HISTORY);
        });
    };


    const getFromHistory = id => history.find(item => item.id === id);

    return (
        <QueryContext.Provider
            value={{
                queryResults,
                setQueryResults,
                history,
                addToHistory,
                getFromHistory,
            }}
        >
            {children}
        </QueryContext.Provider>
    );
};
