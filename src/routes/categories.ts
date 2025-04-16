import express from 'express'; // Import express
import { 
    fetchAllCategories, 
} 

from '../controller/categoriesController'; // Importera controllern

const router = express.Router(); // Create an instanse

router.get('/', fetchAllCategories); // Hämta alla kategorier

export default router; // Exportera routern