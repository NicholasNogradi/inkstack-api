import { Router } from 'express';
import { 
    getAllBooks, 
    getBookById, 
    updateBook, 
    createBook, 
    getBooksByCategory, 
    getBooksByCategoryName 
} from '../controllers/bookController.ts';
import { authenticateToken } from '../middleware/auth.ts';

const router  = Router();

// router.use(authenticateToken)

router.get('/', getAllBooks)
router.get('/:id', getBookById)
router.get('/category/:categoryId', getBooksByCategory)
router.get('/category/name/:categoryName', getBooksByCategoryName)

router.post('/', createBook)


router.put('/:id', updateBook)
router.patch('/:id', updateBook)

export default router