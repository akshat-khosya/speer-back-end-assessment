import rateLimit from 'express-rate-limit';
import { config } from './lib';
import connect from './lib/database/configuration';
import router from './routers';
import { createServer, log } from './utils';

const port = config.get('port') as number;

const app = createServer();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

connect();

app.use('/api', router);

app.listen(port, () => {
  log.info(`Server is listening on url http://localhost:${port}`);
});
