//routes/categories.ts

import express from 'express'; // Import express
import { 
    fetchAllCategories, createCategory, updateCategory, deleteCategory
}
from '../controller/categoriesController'; // Importera controllern


import {
    fetchProductsByCategoryId
} 
from '../controller/productController';


const router = express.Router(); // Create an instanse

router.get('/', fetchAllCategories); // Hämta alla kategorier
router.get('/:id/products', fetchProductsByCategoryId); // Hämta produkt ur kategori
router.post('/', createCategory); // Skapa ny kategori
router.patch('/:id', updateCategory); // Uppdatera befintlig kategori
router.delete('/:id', deleteCategory); // Uppdatera befintlig kategori

export default router; // Exportera routern