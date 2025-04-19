//routes/products.ts

import express from 'express'; // Import express
import { 
    fetchAllProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
} 
from '../controller/productController'; // Importera controllern

const router = express.Router(); // Create an instanse

router.get('/', fetchAllProducts); // Hämta alla produkter
router.get('/:id', fetchProductById); // Hämta produkt ur kategori
router.post('/', createProduct); // Lägg till en ny produkt
router.patch('/:id', updateProduct); // Uppdatera befintlig kategori
router.delete('/:id', deleteProduct); // Uppdatera befintlig kategori


export default router; // Exportera routern




