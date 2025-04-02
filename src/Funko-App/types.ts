import { FunkoModel } from "./funko.js";

export type RequestType = {
  type: 'add' | 'update' | 'remove' | 'show' | 'list';
  user: string;
  id?: string;
  funko?: FunkoModel;
};

export type ResponseType = {
  type: 'add' | 'update' | 'remove' | 'show' | 'list' | 'error';
  success: boolean;
  message: string;
  funko?: FunkoModel;
  funkoPops?: object[];

};