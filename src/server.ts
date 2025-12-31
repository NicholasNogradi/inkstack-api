import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isDev, isTesting} from '../env.ts'
import bookRoutes from './routes/bookRoutes.ts'
import authRoutes from './routes/authRoutes.ts'


const app = express();

app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true
}))

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        name: 'Inkstack-api'
    })
})

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(
    morgan('dev', {
        skip: () => isTesting()
    })
)

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes)

export default app;