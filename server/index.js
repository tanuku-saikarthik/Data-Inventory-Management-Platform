import express from 'express';
import connectDB from './config/db.js';
import cors  from 'cors';
//import authRoutes from './routes/auth.js'
import dotenv from 'dotenv';
import bodyParser from 'body-parser'
dotenv.config();

import customerRoutes from './routes/customerRoutes.js';
import authRoutes from './routes/auth.js';
import auditLogRoutes from "./routes/auditRoutes.js";
//import mergeRoutes from './routes/mergeRoutes.js';
//import recordRoutes from "./routes/recordRoutes.js";
//import { findDuplicates, mergeDuplicates } from './utils/duplicateDetection.js';
const app = express();
connectDB();
const PORT = process.env.PORT||3000;
app.use(cors());
app.use(express.json());
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', customerRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/audit", auditLogRoutes);

//app.use('/api/auth', authRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

