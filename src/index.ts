import app from './server.ts';
import env from '../env.ts';

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})