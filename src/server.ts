import express from 'express';
import bookRoutes from './routes/bookRoutes.ts'

const app = express();

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        name: 'Inkstack-api'
    })
})

app.use('/api/books', bookRoutes)

export default app;