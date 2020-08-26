import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../../../shared/models/cliente';
import { ClienteService } from '../../../core/services/cliente/cliente.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from '../../../core/services/modal/modal.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-perfilcliente',
  templateUrl: './perfilcliente.component.html',
  styleUrls: ['./perfilcliente.component.css']
})
export class PerfilclienteComponent implements OnInit {

  @Input() cliente: Cliente;
  public titulo = 'Perfil del Cliente';
  public fotoSeleccionada: File;
  public progreso = 0;

  constructor(private clienteService: ClienteService, public modalService: ModalService, public authService: AuthService) { }

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   const id = +params.get('id');

    //   if (id) {
    //     this.clienteService.getCliente(id).subscribe( cliente => {
    //       this.cliente = cliente;
    //     });
    //   }
    // });
  }

  public seleccionarFoto(event): void {
    this.fotoSeleccionada = event.target.files[0]; // tiene un arreglo de archivo pero seleccionamos el que estamos subiendo indice 0
    this.progreso = 0; // cada vez que se selecciona una nueva foto el progreso vuelve a 0
    console.log(this.fotoSeleccionada);
    // indexOf si se encuentra es mayor que 0 sino es menor que 0 es un -1
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Debes seleccionar un archivo de tipo imagen`,
        showConfirmButton: false,
        timer: 1500
      });
      this.fotoSeleccionada = null;
    }
  }

  public subirFoto(): void {
    if (!this.fotoSeleccionada){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Debes seleccionar una foto`,
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      console.log(this.cliente.id);
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe( event => {
        // preguntamos si el upload esta en curso si el archivo se esta subiendo
        // HttpEventType es como un enumerador con varias opciones
        if (event.type === HttpEventType.UploadProgress) {
          // porcentaje del progreso
          // lo que se ha subido dividido por el total * 100
          // event.loaded = cargado hasta el momento
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          const response: any = event.body; // body el cuerpo de la respuesta (response) aca recupero al cliente
          console.log(response);
          this.cliente = response.cliente as Cliente;
          console.log(this.cliente);
          this.modalService.notificarUpload.emit(this.cliente); // emitimos al cliente nuevo con la foto
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: `La foto se ha subido completamente ${response.mensaje}`,
            showConfirmButton: false,
            timer: 1500
          });
        }
        /** Nota: 
         * HttpEventType.Response cuando ha finalizado la subida de archivo y ahi es cuando vamos capturar al cliente
         * y convertilo en un tipo cliente
         */

      });
    }
  }
  public cerrarModal(): void {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }
}
