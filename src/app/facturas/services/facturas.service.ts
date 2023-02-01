import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Factura } from '../models/factura';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndPoint: string = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) { }

  getFactura(id:number): Observable<Factura> {
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProducto(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.urlEndPoint}/filtrar-productos/${term}`);
  }

  create(factura: Factura): Observable<Factura>{
    return this.http.post<Factura>(this.urlEndPoint, factura);
  }
}
