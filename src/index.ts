import app from './server.ts';

const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})