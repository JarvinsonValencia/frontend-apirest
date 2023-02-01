import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturasService } from 'src/app/facturas/services/facturas.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  title: string = "Detalle del cliente";
  selectedPhoto: File;
  progress: number = 0;

  constructor(private clienteService: ClienteService, public modalService: ModalService,
     public authService: AuthService, private facturaService: FacturasService) { }

  ngOnInit() {}

  selectPhoto(event){
    this.selectedPhoto = event.target.files[0];
    this.progress = 0;
    console.log(this.selectedPhoto);
    if(this.selectedPhoto.type.indexOf('image') < 0) {
      Swal.fire('Error seleccionar imagen: ', 'El archivo debe ser tipo imagen', 'error');
      this.selectedPhoto = null;
    }
  }

  uploadPhoto() {
    if(!this.selectedPhoto) {
      Swal.fire('Error upload: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.uploadImage(this.selectedPhoto, this.cliente.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((event.loaded/event.total)*100);
        } else if(event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;

          this.modalService.notificarUpload.emit(this.cliente);
          Swal.fire('La foto se ha subido completamente!', response.mensaje, 'success');
        }
        //this.cliente = cliente;

      });
    }

  }

  closeModal(){
    this.modalService.closeModal();
    this.selectedPhoto = null;
    this.progress = 0;
  }

  delete(factura: Factura): void{
    Swal.fire({
      title: '¿Está seguro',
      text: `¿Seguro que desea eliminar la factura ${factura.description}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {

        this.facturaService.delete(factura.id).subscribe(
          response => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f !== factura)
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

}
