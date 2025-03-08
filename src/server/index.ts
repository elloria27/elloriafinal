
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import authRouter from './routes/auth-router';
import productRouter from './routes/product-router';
import emailRouter from './routes/email-router';
import businessRouter from './routes/business-router';

// Load environment variables
const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();

// Apply middleware
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist')));
}

// API routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/email', emailRouter);
app.use('/api/business', businessRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// In production, serve the React app for any other request
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

export default app;
