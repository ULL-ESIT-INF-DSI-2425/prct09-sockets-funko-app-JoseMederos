import chalk from 'chalk';
import { FunkoModel } from "./funko.js";
import { Collection } from "./collection.js";

/**
 * Clase User donde se almacena un usuario y su coleccion de funkos.
 */
export class User {
  constructor(public username: string, public collection: Collection = new Collection()) {}

  /**
   * Funcion que añade un Funko a la colección llamando a addFunko.
   * @param funko - funko a añadir
   */
  addFunkoToCollection(funko: FunkoModel): boolean {
    if (this.collection.addFunko(funko)) {
      console.log(chalk.green(`Funko with ID ${funko.id} has been added to the collection`));
      return true;
    } else {
      console.error(chalk.red(`Funko with ID ${funko.id} already exists.`));
      return false;
    }
  }
  /**
   * Funcion que lista todos los funkos en la colleción del usuario.
   */
  listFunkosInCollection(): void {
    console.log(`${this.username}'s Funko Collection:`);
    this.collection.showFunkos();
  }

  /**
   * Funcion que guarda la collecion del usuario en ficheros JSON
   */
  saveCollection(): void {
    this.collection.saveToFile(this, (success: boolean) => {
      if (success) {
        console.log(chalk.green('Collection saved successfully.'));
      } else {
        console.error(chalk.red('Failed to save the collection.'));
      }
    });
  }

  /**
   * Funcion que carga los funkos guardados en los ficheros JSON a la coleccion.
   */
  loadCollection(): void {
    this.collection.loadFromFile(this, (success: boolean) => {
      if (success) {
        console.log(chalk.green('Collection loaded successfully.'));
      } else {
        console.error(chalk.red('Failed to load the collection.'));
      }
    });
  }

  getFunkos(): FunkoModel[] {
    return this.collection.getFunkos();
  }
}