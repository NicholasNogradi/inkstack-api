import express from 'express';

const app = express();

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        name: 'Inkstack-api'
    })
})

export default app;