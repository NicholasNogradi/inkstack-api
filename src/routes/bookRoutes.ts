import { Router } from 'express';
import { getAllBooks, getBookById, updateBook, createBook } from '../controllers/bookController.ts';

const router  = Router();

router.get('/', getAllBooks)

router.post('/', createBook)

router.get('/:id', getBookById)

router.put('/:id', updateBook)
router.patch('/:id', updateBook)

export default router