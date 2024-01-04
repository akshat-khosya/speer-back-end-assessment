import { Request, Response } from 'express';
import { createUser, getUserByEmail } from '../services';
import bcrypt from 'bcrypt';
import { config } from '../lib';
import { sign } from '../utils';

const saltRounds = config.get('saltRounds') as number;

const createUserHandler = async (req: Request, res: Response) => {
  // check user
  const checkUserEmail = await getUserByEmail(req.body.email);

  if (checkUserEmail) {
    return res.status(409).json({ error: 'Email is already registered.' });
  }

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);
  // create user
  await createUser(req.body.email, hash, req.body.name);

  // return 201
  return res.status(201).json({ message: 'User registered successfully' });
};

const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Compare password with the hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Create Token
  const accessToken = sign({ userId: user.id }, { expiresIn: config.get('accessTokenTtl') as string });

  const sanitizedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };
  return res.status(200).json({ message: 'Login successful', accessToken: accessToken, user: sanitizedUser });
};

export { createUserHandler, loginHandler };
