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
  addFunkoToCollection(funko: FunkoModel): void {
    if (this.collection.addFunko(funko)) {
      console.log(chalk.green(`Funko with ID ${funko.id} has been added to the collection`));
    } else {
      throw new Error(`Funko with ID ${funko.id} already exists.`);
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
    this.collection.saveToFile(this);
  }

  /**
   * Funcion que carga los funkos guardados en los ficheros JSON a la coleccion.
   */
  loadCollection(): void {
    this.collection.loadFromFile(this);
  }
}