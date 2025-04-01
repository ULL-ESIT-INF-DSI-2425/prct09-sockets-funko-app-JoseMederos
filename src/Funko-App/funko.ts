import chalk from 'chalk';

/**
 * Enum con los typos de Funkos
 */
export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold"
}

/**
 * Enum con los generos de Funkos
 */
export enum FunkoGenre {
  AMT = "Animación, Películas y TV",
  VIDEOGAMES = "Videojuegos",
  SPORTS = "Deportes",
  MUSIC = "Música ",
  ANIME = "Ánime",
  OTHER = "Otros"
}

/**
 * Interface especificando los datos necesarios de un Funko.
 */
export interface Funko {
  id: string;
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  number: number;
  exclusive: boolean;
  market_value: number;
}

/**
 * Clase FunkoModel que implementa la interface Funko.
 */
export class FunkoModel implements Funko {
  private static nextId = 1;
  id: string;

  constructor(
    public name: string,
    public description: string,
    public type: FunkoType,
    public genre: FunkoGenre,
    public franchise: string,
    public number: number,
    public exclusive: boolean,
    public market_value: number
  ) {
    this.id = (FunkoModel.nextId++).toString();
  }

  /**
   * getter del market_value
   * @returns market_value
   */
  getMarketValue(): number | undefined {
    return this.market_value;
  }

  /**
   * Setter del market_value
   * @param value - valor a asignar
   */
  setMarketValue(value: number) {
    if (value <= 0) {
      console.log(chalk.red("Market value must be a positive number."));
    }
    this.market_value = value;
  }

  /**
   * Metodo para pasar un objeto FunkoModel a JSON
   * @returns objeto JSON
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      genre: this.genre,
      franchise: this.franchise,
      number: this.number,
      exclusive: this.exclusive,
      market_value: this.market_value,
    };
  }

  /**
   * Metodo para obtener los datos de un Funko a partir del formato JSON
   * @param data - datos del Funko
   * @returns objeto FunkoModel
   */
  static fromJSON(data: Partial<FunkoModel>): FunkoModel {
    return new FunkoModel(
      data.name!,
      data.description!,
      data.type!,
      data.genre!,
      data.franchise!,
      data.number!,
      data.exclusive!,
      data.market_value!,
    );
  }
}