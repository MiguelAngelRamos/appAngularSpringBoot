import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../shared/models/cliente';
import { ClienteService } from '../../../core/services/cliente/cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '../../../core/services/modal/modal.service';
import { AuthService } from '../../../core/services/auth/auth.service';
@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public clientes: Cliente[];
  public paginadorCli: any;
  public clienteSeleccionado: Cliente;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService
    ) { }

  ngOnInit(): void {
    this.getClientes();
  }

  public getClientes(): void {
    /** necesitamos observar los cambios del page para eso usamos el observable paramMap */
    this.activatedRoute.paramMap.subscribe( params => {
      let page = +params.get('page');
      // para la primera pagina el parametro page no existe cuando no existe lo asignamos a 0
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page)
      .pipe(
        tap(response => {
          console.log('ClientesComponent: tap 3');
          (response.content as Cliente[]).forEach( cliente => {
            console.log(cliente.nombre);
          });
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        console.log(response);
        this.paginadorCli = response;

      });
    });
    this.modalService.notificarUpload.subscribe( cliente => {
      // recorrer el listado de cliente preungtamos si el cliente id de cada cliente id que estamos emitiendo actualizamos la imagen
      this.clientes = this.clientes.map(clienteOriginal => {
        if(cliente.id === clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto; // igualamos a la foto que trae el cliente q emite
        }
        return clienteOriginal;
      });
    })
  }

  public delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Eliminaras al cliente: ${cliente.nombre} ${cliente.apellido}`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#958F8E',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          reponse => {
            // this.clientes = this.clientes.filter(cli => cli !== cliente);
            this.getClientes();
            Swal.fire(
              'Eliminado!',
              `Cliente ${cliente.nombre} eliminado con éxito`,
              'success'
            );
          }
        );
      }
    });
  }

  public abrirModal(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
