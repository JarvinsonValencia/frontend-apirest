import { Cliente } from "src/app/clientes/cliente";
import { ClienteService } from "src/app/clientes/cliente.service";
import { ItemFactura } from "./item-factura";

export class Factura {
  id: number;
  description: string;
  observation: string;
  items: Array<ItemFactura> = [];
  client: Cliente;
  total: number;
  createAt: string;

  calcularGranTotal(): number{
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }
}
