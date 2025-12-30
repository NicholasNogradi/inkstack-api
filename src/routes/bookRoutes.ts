import { Router } from 'express';
import { getAllBooks, getBookById } from '../controllers/bookController.ts';

const router  = Router();

router.get('/', getAllBooks)

router.post('/', (req, res) => {
    res.status(201).json({message: "Book created"})
})

router.get('/:id', getBookById)

export default router