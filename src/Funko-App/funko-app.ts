import net from "net";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { FunkoType, FunkoGenre } from "./funko.js";
import { RequestType } from "./types.js";

/**
 * This function validates the type and genre of a Funko
 * @param type - The type of the Funko
 * @param genre - The genre of the Funko
 */
const validateFunkoAttributes = (type: FunkoType, genre: FunkoGenre): void => {
  if (!Object.values(FunkoType).includes(type))
    throw new Error("Invalid Funko type");
  if (!Object.values(FunkoGenre).includes(genre))
    throw new Error("Invalid Funko genre");
};

/**
 * This function creates a Funko object from the arguments
 * @param args - The arguments to create a Funko from
 * @returns A Funko object created from the arguments
 */
import { FunkoModel } from "./funko.js";

interface FunkoArgs {
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  num_franchise: number;
  exclusive: boolean;
  market_value: number;
}

const createFunkoFromArgs = (args: FunkoArgs): FunkoModel => {
  validateFunkoAttributes(args.type, args.genre);
  return new FunkoModel(
    args.name,
    args.description,
    args.type,
    args.genre,
    args.franchise,
    args.num_franchise,
    args.exclusive,
    args.market_value
  );
};

/**
 * This function receives a Funko method and atributes from the command line
 */
const argv = yargs(hideBin(process.argv))
  .command("add", "Add a new Funko", {
    user: { type: "string", demandOption: true },
    name: { type: "string", demandOption: true },
    desc: { type: "string", demandOption: true },
    type: { type: "string", demandOption: true },
    genre: { type: "string", demandOption: true },
    franchise: { type: "string", demandOption: true },
    number: { type: "number", demandOption: true },
    exclusive: { type: "boolean", demandOption: true },
    value: { type: "number", demandOption: true },
  })
  .command("remove", "Remove a Funko", {
    user: { type: "string", demandOption: true },
    id: { type: "string", demandOption: true },
  })
  .command("update", "Update a Funko info", {
    user: { type: "string", demandOption: true },
    id: { type: "string", demandOption: true },
    name: { type: "string", demandOption: false },
    desc: { type: "string", demandOption: false },
    type: { type: "string", demandOption: false },
    genre: { type: "string", demandOption: false },
    franchise: { type: "string", demandOption: false },
    number: { type: "number", demandOption: false },
    exclusive: { type: "boolean", demandOption: false },
    value: { type: "number", demandOption: false },
  })
  .command("show", "Show a Funko", {
    user: { type: "string", demandOption: true },
    id: { type: "string", demandOption: true },
  })
  .command("list", "List all Funkos", {
    user: { type: "string", demandOption: true },
  })
  .help().parseSync();

/**
 * This function connect the client to the server and sends the request
 * @param port - The port to connect to
 */
const client = net.createConnection({ port: 60300 }, () => {
  console.log("Connected to server");
  let request: RequestType;
  if (argv._[0] === "add") {
    request = {
      type: "add",
      user: argv.user as string,
      funko: createFunkoFromArgs({
        name: argv.name as string,
        description: argv.description as string,
        type: argv.type as FunkoType,
        genre: argv.genre as FunkoGenre,
        franchise: argv.franchise as string,
        num_franchise: argv.num_franchise as number,
        exclusive: argv.exclusive as boolean,
        market_value: argv.market_value as number,
      }),
    };
  } else if (argv._[0] === "remove") {
    request = {
      type: "remove",
      user: argv.user as string,
      id: argv.id as string,
    };
  } else if (argv._[0] === "update") {
    request = {
      type: "update",
      user: argv.user as string,
      funko: createFunkoFromArgs({
        name: argv.name as string,
        description: argv.description as string,
        type: argv.type as FunkoType,
        genre: argv.genre as FunkoGenre,
        franchise: argv.franchise as string,
        num_franchise: argv.num_franchise as number,
        exclusive: argv.exclusive as boolean,
        market_value: argv.market_value as number,
      }),
    };
  } else if (argv._[0] === "show") {
    request = {
      type: "show",
      user: argv.user as string,
      id: argv.id as string,
    };
  } else if (argv._[0] === "list") {
    request = {
      type: "list",
      user: argv.user as string,
    };
  } else {
    console.error("Unknown command");
    client.end();
    return;
  }
  client.write(JSON.stringify(request));
  client.end();
});

/**
 * This function handles the data received from the server
 * @param data - The data received from the server
 */
client.on("data", (data) => {
  const response = JSON.parse(data.toString());
  if (response.success) {
    console.log(response.message);
  } else {
    console.error(response.message);
  }
});

/**
 * This function end the session when the server decides to do so
 */
client.on("end", () => {
  console.log("Disconnected from server");
});