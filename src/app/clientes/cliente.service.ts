import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Region } from './region';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clients';


  constructor(private http: HttpClient, private router:Router) {}


// Se modificó por la clase token.interceptor
 // private addAuthorizationHeader(){
 //   let token = this.authService.token;
 //   if(token != null){
 //     return this.httpHeaders.append('Authorization', 'Bearer ' + token);
 //   }
 //   return this.httpHeaders;
 // }

//Se reemplazó por interceptor auth.interceptor
  // private isNotAuthorized(e): boolean{
  //   if(e.status== 401){
  //     if(this.authService.isAuthenticated()){
  //       this.authService.logout();
  //     }
  //     this.router.navigate(['/login'])
  //     return true;
  //   }

  //   if(e.status== 403 ){
  //     Swal.fire('Acceso Denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
  //     this.router.navigate(['/clientes'])
  //     return true;
  //   }
  //   return false;
  // }

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
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
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje){
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje)
        }

        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if(e.status == 400){
          return throwError(e);
        }
        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    )
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(e.error.mensaje){
          console.error(e.error.mensaje)
        }
        return throwError(e);
      })
    )
  }

  uploadImage(file: File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);


    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,

    });
    return this.http.request(req);
  }
}

