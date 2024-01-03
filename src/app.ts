import { config } from './lib';
import connect from './lib/database/configuration';
import { createServer, log } from './utils';

const port = config.get('port') as number;

const app = createServer();

connect();

app.listen(port, () => {
  log.info(`Server is listening on url http://localhost:${port}`);
});
