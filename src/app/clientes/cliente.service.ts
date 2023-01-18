import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import localeEs from '@angular/common/locales/es-CO'
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clients';

  private httpHeaders = new HttpHeaders({'content-type': 'application/json'})

  constructor(private http: HttpClient, private router:Router) {}

  private isNotAuthorized(e): boolean{
    if(e.status== 401 || e.status==403){
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones').pipe(
      catchError(e => {
        this.isNotAuthorized(e);
        return throwError(e);
      })
    );
  }

  getClientes(page: number): Observable<any> {
   // return of(CLIENTES);
   return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
    tap((response: any) => {
      console.log('ClienteService: tap 1');
      (response.content as Cliente[]).forEach( Cliente => {
        console.log(Cliente.name)
      })
    }),
    map((response:any) => {
      (response.content as Cliente[]).map(Cliente => {
        Cliente.name = Cliente.name.toUpperCase();
        //Cliente.lastname = Cliente.lastname.toUpperCase();
        let datePipe = new DatePipe('es');
        //Cliente.createAt = datePipe.transform(Cliente.createAt, 'fullDate');//formatDate(Cliente.createAt, 'dd-MM-yyyy', 'en-US');
        return Cliente;
      });
      return response;
    }),
    tap(response => {
      console.log('ClienteService: tap 2');
      (response.content as Cliente[]).forEach( Cliente => {
        console.log(Cliente.name)
      })
    })
   );
  }

  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }
        if(e.status == 400){
          return throwError(e);
        }

        console.error(e.error.mensaje)
        Swal.fire('Error al crear el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje)
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers:this.httpHeaders}).pipe(
      catchError(e => {
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }
        if(e.status == 400){
          return throwError(e);
        }
        console.error(e.error.mensaje)
        Swal.fire('Error al editar el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        if(this.isNotAuthorized(e)){
          return throwError(e);
        }
        console.error(e.error.mensaje)
        Swal.fire('Error al eliminar el cliente', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  uploadImage(file: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });
    return this.http.request(req).pipe(
      catchError(e => {
        this.isNotAuthorized(e);
        return throwError(e);
      })
    );
  }
}

