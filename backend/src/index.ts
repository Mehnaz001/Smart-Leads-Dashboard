import express from 'express';
import { connect } from 'node:http2';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Smart Leads Server is running' });
});
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});