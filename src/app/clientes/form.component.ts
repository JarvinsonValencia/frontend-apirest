import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',

})
export class FormComponent implements OnInit {
  public client: Cliente = new Cliente()
  public title:string = "Crear Cliente"
  public errors: string[];
  public regiones: Region[];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.client = cliente)
      }
    });
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    })
  }

  public create(): void{
    console.log(this.client);
    this.clienteService.create(this.client)
      .subscribe(client => {
        this.router.navigate(['/clientes'])
          Swal.fire('Nuevo cliente', `Cliente ${client.name} creado con éxito!`, 'success')
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  public updated(): void {
    console.log(this.client);
    this.client.facturas = null;
      this.clienteService.update(this.client)
      .subscribe(json => {
        this.router.navigate(['/clientes'])
        Swal.fire('Cliente actualizado', `${json.mensaje }: ${json.cliente.name } `, 'success')
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      })
  }

  compararRegion(o1: Region, o2:Region): boolean {
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null? false: o1.id===o2.id;
  }

}
