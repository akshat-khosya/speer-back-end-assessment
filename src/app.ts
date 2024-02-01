import * as cluster from 'cluster';

import { cpus } from 'os';

const numCPUs = cpus().length;

import { config } from './lib';

import { createServer, log } from './utils';

const port = config.get('port') as number;

const main = async () => {
  const app = await createServer();

  app.listen(port, () => {
    log.info(`Server is listening on url http://localhost:${port}`);
  });
};

if (cluster.default.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.default.fork();
  }
  cluster.default.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.default.fork();
  });
} else {
  main();
}
