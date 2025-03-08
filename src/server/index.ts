
import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { supabase } from '../integrations/supabase/client';
import productRouter from './routes/product-router';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is up and running' });
});

// Register routers
app.use('/api', productRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for potential integration with other server files
export default app;
