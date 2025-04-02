import * as net from 'net';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';

type RequestType = {
  type: 'add' | 'update' | 'remove' | 'read' | 'list';
  user: string;
  funkoPop?: object;
  id?: string;
};

type ResponseType = {
  success: boolean;
  message: string;
  funkoPops?: object[];
};

const client = new net.Socket();

yargs(hideBin(process.argv))
  .command({
    command: 'add',
    describe: 'Add a new Funko to the collection',
    builder: {
      user: { describe: 'Username', demandOption: true, type: 'string' },
      name: { describe: 'Funko name', demandOption: true, type: 'string' },
      description: { describe: 'Funko description', demandOption: true, type: 'string' },
      type: { describe: 'Funko type', demandOption: true, type: 'string' },
      genre: { describe: 'Funko genre', demandOption: true, type: 'string' },
      franchise: { describe: 'Franchise', demandOption: true, type: 'string' },
      number: { describe: 'Funko number', demandOption: true, type: 'number' },
      exclusive: { describe: 'Is exclusive', type: 'boolean', default: false },
      value: { describe: 'Market value', demandOption: true, type: 'number' },
    },
    handler(argv) {
      const request: RequestType = {
        type: 'add',
        user: argv.user as string,
        funkoPop: {
          name: argv.name,
          description: argv.description,
          type: argv.type,
          genre: argv.genre,
          franchise: argv.franchise,
          number: argv.number,
          exclusive: argv.exclusive,
          market_value: argv.value,
        },
      };

      client.connect(3000, 'localhost', () => {
        client.write(JSON.stringify(request));
      });

      client.on('data', (data) => {
        const response: ResponseType = JSON.parse(data.toString());
        if (response.success) {
          console.log(chalk.green(response.message));
        } else {
          console.log(chalk.red(response.message));
        }
        client.end();
      });
    },
  })
  .help()
  .parse();