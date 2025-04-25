# DataTalk

**DataTalk** is an AI-powered data exploration and export platform that enables users to interact with their PostgreSQL databases using natural language. Whether you're a data analyst, product manager, or developer, DataTalk empowers you to query your data without writing complex SQL manually.

Ask questions like _"What were our top 10 best-selling products last quarter?"_ directly to your database, and DataTalk will convert that into a safe, optimized SQL query, execute it, and return the results in your preferred format (JSON or CSV).

---

## 🚀 Key Features

### 🧠 Natural Language → SQL
Use simple English to ask questions about your database. Our AI backend (powered by Gemini API) interprets your intent and generates syntactically correct, parameterized SQL.

### 🔒 Safe SQL Execution
Before any SQL is run:
- Queries are validated for potential threats (e.g. `DROP`, `DELETE`, `ALTER`).
- Parameterized statements prevent SQL injection.
- Only read-only queries are permitted.

### 📈 Performance Metrics
Every query execution returns:
- Result set (rows)
- Row count
- Execution time in milliseconds

Useful for profiling query performance and understanding data scale.

### 🕓 Query History
All executed queries are stored along with:
- Original question
- Generated SQL
- Result metadata (row count, timing)
- Timestamp

Users can review or re-execute past queries via a clean interface.

### 📤 Data Export
After getting your query result:
- Download the dataset as `.csv` or `.json`
- Copy query results to clipboard for quick sharing

### 🔗 Shareable Links
Need to show a teammate or client? Generate a one-time or public URL for any past query result and share instantly.

### 🗂️ Schema Introspection
Browse your database schema easily:
- View table names, column types, relationships
- Use this to guide question formulation or debugging

---

## 🛠️ Tech Stack

### Backend
- **Node.js + Express** 
- **Postgres.js** 
- **Gemini API** – Translates English to SQL with clarification when needed
- **PostgreSQL**

### Frontend
- **React**
- **Tailwind CSS**


---
