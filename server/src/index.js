import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import queryRoutes from './routes/queryRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/query', queryRoutes);
app.use('/api/export', exportRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'API server is running!' });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
