
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import dotenv from 'dotenv';

// Загрузить переменные окружения
dotenv.config();

// Импортировать маршруты
import authRouter from './routes/auth-router';
import productRouter from './routes/product-router';
import businessRouter from './routes/business-router';
import emailRouter from './routes/email-router';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
}

// API routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/business', businessRouter);
app.use('/api/email', emailRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Handle SPA routing in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

export default app;
