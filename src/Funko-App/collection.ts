import chalk from "chalk";
import fs from "fs";
import * as path from "path";
import { join } from "path";
import { FunkoModel } from "./funko.js";
import { User } from "./user.js";

const projectRoot = process.cwd();
const dataDir = join(projectRoot, "data");

fs.access(dataDir, fs.constants.F_OK, (err) => {
  if (err) {
    fs.mkdir(dataDir, { recursive: true }, (mkdirErr) => {
      if (mkdirErr) console.error(chalk.red(`Error creating data directory: ${mkdirErr}`));
    });
  }
});

/**
 * Clase Collection donde se almacenan los funkos
 */
export class Collection {
  private funkos: FunkoModel[] = [];

  constructor(initialFunkos?: FunkoModel[]) {
    this.funkos = initialFunkos || [];
  }

  /**
   * Method to get all Funkos in the collection.
   * @returns An array of FunkoModel objects.
   */
  getFunkos(): FunkoModel[] {
    return this.funkos;
  }

  getNextId(): number {
    if (this.funkos.length === 0) return 1;
    const maxId = Math.max(...this.funkos.map((f) => parseInt(f.id, 10)));
    return maxId + 1;
  }

  getFunkoById(id: string): FunkoModel | undefined {
    return this.funkos.find((f) => f.id === id);
  }

  addFunko(funko: FunkoModel, preserveId = false): boolean {
    if (!preserveId) {
      funko.id = this.getNextId().toString();
    }

    if (this.funkos.some((f) => f.id === funko.id)) {
      return false;
    }
    this.funkos.push(funko);
    return true;
  }

  updateFunko(
    id: string,
    updatedData: Partial<Omit<FunkoModel, "id">>,
  ): boolean {
    const funko = this.getFunkoById(id);
    if (!funko) return false;

    if (updatedData.name !== undefined) funko.name = updatedData.name;
    if (updatedData.description !== undefined)
      funko.description = updatedData.description;
    if (updatedData.type !== undefined) funko.type = updatedData.type;
    if (updatedData.genre !== undefined) funko.genre = updatedData.genre;
    if (updatedData.franchise !== undefined)
      funko.franchise = updatedData.franchise;
    if (updatedData.number !== undefined) funko.number = updatedData.number;
    if (updatedData.exclusive !== undefined)
      funko.exclusive = updatedData.exclusive;
    if (updatedData.market_value !== undefined)
      funko.setMarketValue(updatedData.market_value);

    return true;
  }

  removeFunko(id: string, user: User, callback: (success: boolean) => void): void {
    const funkoIndex = this.funkos.findIndex((f) => f.id === id);
    if (funkoIndex === -1) {
      callback(false);
      return;
    }

    const userDir = path.join(dataDir, user.username);
    const funkoFilePath = path.join(userDir, `${id}.json`);

    fs.unlink(funkoFilePath, (err) => {
      if (err && err.code !== "ENOENT") {
        callback(false);
        return;
      }
      this.funkos.splice(funkoIndex, 1);
      callback(true);
    });
  }

  showFunkos(): void {
    this.funkos.forEach((funko) => {
      const marketValue = funko.getMarketValue();
      let marketColor: string;

      if (marketValue! >= 500) {
        marketColor = chalk.green(marketValue);
      } else if (marketValue! >= 200) {
        marketColor = chalk.yellow(marketValue);
      } else if (marketValue! >= 50) {
        marketColor = chalk.rgb(255, 153, 0)(marketValue);
      } else {
        marketColor = chalk.red(marketValue);
      }

      console.log(chalk.green(`ID: ${funko.id}`));
      console.log(chalk.green(`Name: ${funko.name}`));
      console.log(chalk.green(`Description: ${funko.description}`));
      console.log(chalk.green(`Type: ${funko.type}`));
      console.log(chalk.green(`Genre: ${funko.genre}`));
      console.log(chalk.green(`Franchise: ${funko.franchise}`));
      console.log(chalk.green(`Number: ${funko.number}`));
      console.log(chalk.green(`Exclusive: ${funko.exclusive ? "Yes" : "No"}`));
      console.log(chalk.green(`Market Value: ${marketColor}`));
      console.log("-----------------------------------");
    });
  }

  saveToFile(user: User, callback: (success: boolean) => void): void {
    const userDir = path.join(dataDir, user.username);

    fs.access(userDir, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(userDir, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error(chalk.red(`Error creating user directory: ${mkdirErr}`));
            callback(false);
            return;
          }
          this.writeFunkosToFile(userDir, callback);
        });
      } else {
        this.writeFunkosToFile(userDir, callback);
      }
    });
  }

  private writeFunkosToFile(userDir: string, callback: (success: boolean) => void): void {
    let success = true;
    let pending = this.funkos.length;

    if (pending === 0) {
      callback(true);
      return;
    }

    this.funkos.forEach((funko) => {
      const filePath = path.join(userDir, `${funko.id}.json`);
      fs.writeFile(filePath, JSON.stringify(funko.toJSON(), null, 2), (err) => {
        if (err) {
          console.error(chalk.red(`Error saving Funko: ${err}`));
          success = false;
        }
        pending -= 1;
        if (pending === 0) {
          callback(success);
        }
      });
    });
  }

  loadFromFile(user: User, callback: (success: boolean) => void): void {
    const userDir = path.join(dataDir, user.username);

    fs.access(userDir, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(userDir, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            console.error(chalk.red(`Error creating user directory: ${mkdirErr}`));
            callback(false);
            return;
          }
          this.funkos = [];
          callback(true);
        });
      } else {
        fs.readdir(userDir, (readErr, files) => {
          if (readErr) {
            console.error(chalk.red(`Error reading directory: ${readErr}`));
            callback(false);
            return;
          }

          const funkoFiles = files.filter((file) => file.endsWith(".json"));
          this.funkos = [];
          let pending = funkoFiles.length;

          if (pending === 0) {
            callback(true);
            return;
          }

          funkoFiles.forEach((file) => {
            const filePath = path.join(userDir, file);
            fs.readFile(filePath, "utf-8", (readFileErr, data) => {
              if (readFileErr) {
                console.error(chalk.red(`Error reading file ${file}: ${readFileErr}`));
                pending -= 1;
                if (pending === 0) {
                  callback(true);
                }
                return;
              }

              try {
                const funkoData = JSON.parse(data);
                const funko = FunkoModel.fromJSON(funkoData);
                this.addFunko(funko, true); // Preserve the loaded ID
              } catch (parseErr) {
                console.error(chalk.red(`Error parsing file ${file}: ${parseErr}`));
              }

              pending -= 1;
              if (pending === 0) {
                callback(true);
              }
            });
          });
        });
      }
    });
  }
}