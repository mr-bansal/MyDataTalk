import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

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
      <header className="site-header">
        <nav>
          <ul>
            <li><a href="#about">About Us</a></li>
            <li><a href="https://github.com/your-repo-link" target="_blank" rel="noopener noreferrer">Repo Link</a></li>
          </ul>
        </nav>
      </header>
      <main className="App-main">
        <header className="App-header">
          <h1>Talk with your Database!</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="Enter your query"
              className="search-input"
            />
            <button type="submit" className="search-button">Submit</button>
          </form>
          <div className="results-container">
            <h2>Results:</h2>
            <pre className="results-pre">{JSON.stringify(results, null, 2)}</pre>
          </div>
        </header>
      </main>
      <footer className="site-footer">
        <p>Made with ❤️ by: <a href="https://www.linkedin.com/in/keshav-bansal-iit/" target="_blank" rel="noopener noreferrer">Keshav Bansal</a></p>
      </footer>
    </div>
  );
}

export default App;
