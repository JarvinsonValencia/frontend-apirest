import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';



@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',

})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginator: any;
  selectedClient: Cliente;

  constructor(private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService) { }

  ngOnInit(): void {
    let page = 0;
    this.activateRoute.paramMap.subscribe ( params => {
      let page: number = +params.get('page');

      if(!page) {
        page = 0;
      }
    this.clienteService.getClientes(page).pipe(
      tap(response => {

        console.log('ClienteComponent: tap 3');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.name);
        });
      })
    ).subscribe(response =>{
      this.clientes = response.content as Cliente[];
      this.paginator = response;
    });
  });
  this.modalService.notificarUpload.subscribe(cliente => {
    this.selectedClient.image = cliente.image;
  })
   }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: '¿Está seguro',
      text: `¿Seguro que desea eliminar al cliente ${cliente.name} ${cliente.lastname}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            )
          }
        )

      }
    })
  }

  openModal(cliente: Cliente) {
    this.selectedClient = cliente;
    this.modalService.openModal();
  }

}
