/* eslint-disable @typescript-eslint/no-unused-expressions */
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { FunkoModel, FunkoType, FunkoGenre } from "./funko.js";
import { Collection } from "./collection.js";
import { User } from "./user.js";

yargs(hideBin(process.argv))
  .command({
    command: 'add',
    describe: 'Add a new Funko to the collection',
    builder: {
      user: { describe: 'Username', demandOption: true, type: 'string' },
      name: { describe: 'Funko name', demandOption: true, type: 'string' },
      desc: { describe: 'Funko description', demandOption: true, type: 'string' },
      type: { 
        describe: 'Funko type', 
        demandOption: true, 
        choices: Object.values(FunkoType),
        type: 'string'
      },
      genre: { 
        describe: 'Funko genre', 
        demandOption: true, 
        choices: Object.values(FunkoGenre),
        type: 'string'
      },
      franchise: { describe: 'Franchise', demandOption: true, type: 'string' },
      number: { describe: 'Funko number', demandOption: true, type: 'number' },
      exclusive: { describe: 'Is exclusive', type: 'boolean', default: false },
      value: { describe: 'Market value', demandOption: true, type: 'number' }
    },
    handler(argv) {
      const user = new User(argv.user as string, new Collection());
      user.loadCollection();
      
      const funko = new FunkoModel(
        argv.name as string,
        argv.description as string,
        argv.type as FunkoType,
        argv.genre as FunkoGenre,
        argv.franchise as string,
        argv.number as number,
        argv.exclusive as boolean,
        argv.value as number
      );
      
      user.addFunkoToCollection(funko);
      user.saveCollection();
    }
  })
  .command({
    command: 'list',
    describe: 'List all Funkos for a user',
    builder: {
      user: { describe: 'Username', demandOption: true, type: 'string' }
    },
    handler(argv) {
      const user = new User(argv.user as string, new Collection());
      user.loadCollection();
      user.listFunkosInCollection();
    }
  })
  .command({
    command: 'update',
    describe: 'Update a Funko',
    builder: {
      user: { describe: 'Username', demandOption: true, type: 'string' },
      id: { describe: 'Funko ID', demandOption: true, type: 'number' },
      name: { describe: 'New name', type: 'string' },
      description: { describe: 'New description', type: 'string' },
      type: { describe: 'New type', choices: Object.values(FunkoType), type: 'string' },
      genre: { describe: 'New genre', choices: Object.values(FunkoGenre), type: 'string' },
      franchise: { describe: 'New franchise', type: 'string' },
      number: { describe: 'New number', type: 'number' },
      exclusive: { describe: 'Is exclusive', type: 'boolean' },
      value: { describe: 'New market value', type: 'number' }
    },
    handler(argv) {
      const user = new User(argv.user as string, new Collection());
      user.loadCollection();
      
      const updateData: Partial<FunkoModel> = {};
      if (argv.name) updateData.name = argv.name as string;
      if (argv.description) updateData.description = argv.description as string;
      if (argv.type) updateData.type = argv.type as FunkoType;
      if (argv.genre) updateData.genre = argv.genre as FunkoGenre;
      if (argv.franchise) updateData.franchise = argv.franchise as string;
      if (argv.number) updateData.number = argv.number as number;
      if (argv.exclusive !== undefined) updateData.exclusive = argv.exclusive as boolean;
      if (argv.value) updateData.market_value = argv.value as number;
      
      const updated = user.collection.updateFunko(argv.id.toString(), updateData);
      if (updated) {
        user.saveCollection();
        console.log(chalk.green('Funko updated successfully!'));
      } else {
        console.log(chalk.red(`Funko not found at ${argv.user}'s collection!`));
      }
    }
  })
  .command({
    command: 'remove',
    describe: 'Remove a Funko from collection',
    builder: {
      user: { describe: 'Username', demandOption: true, type: 'string' },
      id: { describe: 'Funko ID', demandOption: true, type: 'number' }
    },
    handler(argv) {
      const user = new User(argv.user as string, new Collection());
      user.loadCollection();
      const success = user.collection.removeFunko(argv.id.toString(), user);
      if (success) {
          console.log(chalk.green(`Funko removed from ${argv.user}'s collection!`));
          user.saveCollection();
      } else {
          console.log(chalk.red(`Funko not found at ${argv.user}'s collection!`));
      }
  }
  })
  .command({
    command: 'read',
    describe: 'Show details of a specific Funko',
    builder: {
      user: { describe: 'Username', demandOption: true, type: 'string' },
      id: { describe: 'Funko ID', demandOption: true, type: 'number' }
    },
    handler(argv) {
      const user = new User(argv.user as string, new Collection());
      user.loadCollection();
      const funko = user.collection.getFunkoById(argv.id.toString());
      
      if (funko) {
        console.log(chalk.bold.blue(`\nFunko Details (ID: ${funko.id}):`));
        console.log(chalk.green(`Name: ${funko.name}`));
        console.log(chalk.green(`Description: ${funko.description}`));
        console.log(chalk.green(`Type: ${funko.type}`));
        console.log(chalk.green(`Genre: ${funko.genre}`));
        console.log(chalk.green(`Franchise: ${funko.franchise}`));
        console.log(chalk.green(`Number: ${funko.number}`));
        console.log(chalk.green(`Exclusive: ${funko.exclusive ? 'Yes' : 'No'}`));
        console.log(chalk.green(`Market Value: ${funko.market_value}`));
      } else {
        console.log(chalk.red(`Funko not found at ${argv.user}'s collection!`));
      }
    }
  })
  .demandCommand(1, 'You need at least one command')
  .help()
  .argv;