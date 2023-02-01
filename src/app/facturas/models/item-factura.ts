import { Product } from "./product";

export class ItemFactura {
  product: Product;
  amount: number = 1;
  importe: number;

  public calcularImporte(): number {
    return this.amount * this.product.price;
  }
}
