//routes/categories.ts

import express from 'express'; // Import express
import { 
    fetchAllCategories
}
from '../controller/categoriesController'; // Importera controllern


import {
    fetchProductsByCategoryId
} 
from '../controller/productController';


const router = express.Router(); // Create an instanse

router.get('/', fetchAllCategories); // Hämta alla kategorier
router.get('/:id/products', fetchProductsByCategoryId); // Hämta produkt ur kategori

export default router; // Exportera routern