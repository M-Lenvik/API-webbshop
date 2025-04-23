//index.ts

import 'dotenv/config';
import express from 'express'; // Import express
import path from 'path'; // Importera path för att kunna använda path.join
import cors from 'cors';
import { connectToDatabase } from './config/db';
const app = express(); // Create an instanse


//General Middleware for all requests
app.use(express.json()); //Parses JSON into Javascript object
app.use(cors());        // This makes the Express server except request from other domains

//Routes
import categoryRoutes from './routes/categories'; // Import the task routes
app.use('/categories', categoryRoutes);

import productRoutes from './routes/products';
app.use('/products', productRoutes);

/*
app.use(express.static(path.join(__dirname, '..', 'Client-side')));
app.use('/img', express.static(path.join(__dirname, '..', 'img')));// Serve static files from the img directory
*/
// Servera statiska frontendfiler från Client-side
app.use(express.static(path.join(__dirname, '..', '..', 'Client-side')));

// Servera bilder från img
app.use('/img', express.static(path.join(__dirname, '..', 'img')));


connectToDatabase();
//startar servern
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});