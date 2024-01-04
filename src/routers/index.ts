import express from 'express';
import authRouter from './auth';
import noteRouter from './note';
import { deserializeUser } from '../middlewares';
import { searchNotesHandler } from '../controllers';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/note', deserializeUser, noteRouter);
router.get('/search', deserializeUser, searchNotesHandler);
export default router;
