import express from 'express'
const router = express.Router();

import {
  addBook,
  deleteBook,
  EditBook,
  ShowBooks,
  ShowBookId
} from '../controllers/bookController.js';
import authenticateToken from '../middlewares/auth.js';

router.post('/', authenticateToken, addBook);          
router.get('/', authenticateToken, ShowBooks);       
router.get('/:id', authenticateToken, ShowBookId);    
router.put('/:id', authenticateToken, EditBook);      
router.delete('/:id', authenticateToken, deleteBook); 

export default router;
