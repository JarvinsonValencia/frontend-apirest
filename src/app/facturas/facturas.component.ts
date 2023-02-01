import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Product } from './models/product';
import { FacturasService } from './services/facturas.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',

})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autoCompleteControl = new FormControl('');
  productosFiltrados: Observable<Product[]>;

  constructor(private clienteService: ClienteService, private activateRoute: ActivatedRoute,
    private facturaService: FacturasService, private router: Router) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params =>{
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.client = cliente);
    })

    this.productosFiltrados = this.autoCompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string'? value: value),
      flatMap(value =>value ? this._filter(value): []),
    );
  }




  private _filter(value: string): Observable<Product[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProducto(filterValue);
  }

  mostrarNombre(product?: Product): string | undefined{
    return product ? product.name : undefined;
  }

  selecProduct(event: MatAutocompleteSelectedEvent): void{
    let product = event.option.value as Product;
    console.log(product);

    if(this.existItem(product.id)){
      this.incrementaCantidad(product.id);
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.product = product;
      this.factura.items.push(nuevoItem);
    }

    this.autoCompleteControl.setValue('');
    event.option.deselect();
  }

  actualizarCantidad(id: number, event:any): void{
    let cantidad:number = event.target.value as number;
    if(cantidad == 0){
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.product.id){
        item.amount = cantidad;
      }
      return item;
    })
  }

  existItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if(id === item.product.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.product.id){
        ++item.amount;
      }
      return item;
    })
  }

  eliminarItemFactura(id: number): void{
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.product.id);
  }

  create(): void {
    this.facturaService.create(this.factura).subscribe(factura => {
      Swal.fire(this.titulo, `Factura ${factura.description} creada con éxito`, 'success')
      this.router.navigate(['/facturas', factura.id]);
    });
  }
}
