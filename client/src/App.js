import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/query', { query });
      setResults(response.data);
    } catch (error) {
      console.error('Error executing query:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Natural Language Query to SQL</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter your query"
          />
          <button type="submit">Submit</button>
        </form>
        <div>
          <h2>Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
