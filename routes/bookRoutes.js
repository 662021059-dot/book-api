import express from 'express'
const router = express.Router();

import {
  addBook,
  deleteBook,
  EditBook,
  ShowBooks,
  ShowBookId
} from '../controllers/bookController.js';

router.post('/', addBook);          
router.get('/', ShowBooks);       
router.get('/:id', ShowBookId);    
router.put('/:id', EditBook);      
router.delete('/:id', deleteBook); 

export default router;
