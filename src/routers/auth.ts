import express from 'express';
import { createUserHandler } from '../controllers';
import { validate } from '../middlewares';
import { createUserSchema, loginUserSchema } from '../schema';
import { loginHandler } from '../controllers/auth';

const authRouter = express.Router();

authRouter.post('/create', validate(createUserSchema), createUserHandler);

authRouter.post('/login', validate(loginUserSchema), loginHandler);

export default authRouter;
