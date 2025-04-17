//routes/products.ts

import express from 'express'; // Import express
import { 
    fetchAllProducts,
    fetchProductById,
    createProduct
} 
from '../controller/productController'; // Importera controllern

const router = express.Router(); // Create an instanse

router.get('/', fetchAllProducts); // Hämta alla produkter
router.get('/:id', fetchProductById); // Hämta produkt ur kategori
router.post('/', createProduct); // Hämta produkt ur kategori

export default router; // Exportera routern




