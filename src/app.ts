import { createServer, log } from './utils';

const app = createServer();

app.listen(4000, () => {
  log.info(`Server is listening on url http://localhost:${4000}`);
});
