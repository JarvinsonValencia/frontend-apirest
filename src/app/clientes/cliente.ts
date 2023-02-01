import { Factura } from "../facturas/models/factura";
import { Region } from "./region";

export class Cliente {
  id: number;
  name: string;
  lastname: string;
  createAt: string;
  email: string;
  image: string;
  region: Region;
  facturas: Factura[] = [];
}
