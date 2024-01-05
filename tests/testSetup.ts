import { createServer } from '../src/utils';
import { Express } from 'express';

let app: Express;

beforeAll(async () => {
  app = await createServer();
}, 10000);

export { app };
