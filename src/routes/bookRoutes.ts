import { Router } from 'express';

const router  = Router();

router.get('/', (req, res) => {
    res.json({message: "Get all books"})
})

router.post('/', (req, res) => {
    res.status(201).json({message: "Book created"})
})

router.get('/:id', (req, res) => {
    res.json({message: `Get book by id: ${req.params.id}`})
})

export default router