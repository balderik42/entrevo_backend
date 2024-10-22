import express from 'express';
import Connection from './database/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import Router from './routes/route.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Apply middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "categories" directory
app.use('/categories', express.static(path.join(__dirname, 'categories')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Use the router for product-related routes
app.use('/', Router);

// Set PORT and DB credentials from .env file

const PORT = process.env.PORT || 8000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

// Initialize database connection
Connection(USERNAME, PASSWORD);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running successfully on PORT ${PORT}`);
});
