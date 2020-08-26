import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Cliente } from '../../../shared/models/cliente';
import { ClienteService } from '../../../core/services/cliente/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from '../../../shared/models/region';

@Component({
  selector: 'app-formcliente',
  templateUrl: './formcliente.component.html',
  styleUrls: ['./formcliente.component.css']
})
export class FormclienteComponent implements OnInit {
  public forma: FormGroup;
  public cliente: Cliente = new Cliente('', '', '', '');
  public regiones: Region[];
  public titulo = 'Formulario Cliente';
  public errores: string[];

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    this.cargarCliente();
    this.cargarRegiones();
  }
  /* Funcion que valida los campos, es usada por el html */
  public validarCampo(campo: string): boolean {
    return this.forma.get(campo).invalid && this.forma.get(campo).touched;
  }

  public crearFormulario(): void {
    this.forma = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(4)]],
      apellido: ['', [Validators.required]],
      createAt: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i)]],
      region: ['', [Validators.required]]
    });
  }

  public create(): void {
    if (this.forma.invalid) {
      /* Estrategia de marcar a todos como tocados si envio y no llenado  */
      return Object.values(this.forma.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(controlInternal => controlInternal.markAllAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    console.log(this.forma);
    console.log(this.cliente);
    this.cliente.nombre = this.forma.get('nombre').value;
    this.cliente.apellido = this.forma.get('apellido').value;
    this.cliente.createAt = this.forma.get('createAt').value;
    this.cliente.email = this.forma.get('email').value;
    this.cliente.region = this.regiones[(this.forma.get('region').value) - 1];
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Cliente: ${cliente.nombre} creado con éxito`,
          showConfirmButton: false,
          timer: 1500
        });
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  public update(evt): void {
    evt.preventDefault();
    console.log('en el metodo update');
    console.log(this.forma);
    this.cliente.nombre = this.forma.get('nombre').value;
    this.cliente.apellido = this.forma.get('apellido').value;
    this.cliente.createAt = this.forma.get('createAt').value;
    this.cliente.email = this.forma.get('email').value;
    this.cliente.region = this.regiones[(this.forma.get('region').value) - 1];
    // this.cliente.region = this.forma.get('region').value;

    console.log(this.cliente);
    this.clienteService.update(this.cliente).subscribe(response => {
      console.log(response);
      this.router.navigate(['/clientes']);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Cliente: ${response.nombre}, Actualizado con exito`,
        showConfirmButton: false,
        timer: 1500
      });
    },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }
  public cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      const id: string = params.id;
      if (id) {
        this.clienteService.getCliente(id).subscribe(response => {
          console.log(response);
          this.cliente = response;
          console.log(this.cliente);
          this.cargarDataAlFormulario(this.cliente);
        });
      }
    });
  }

  /** Cargar data al formulario */
  public cargarDataAlFormulario(cliente: Cliente): void {
    console.log(cliente.region);
    this.forma.setValue({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      createAt: cliente.createAt,
      region: cliente.region.id
    });
  }
  /* Cargar regiones */
  public cargarRegiones(): void {
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
      console.log(this.regiones);
    });
  }
 // el primero es la regiones del ng for y el segundo la region asignada al cliente
  // public compararRegion(o1: Region, o2: Region): boolean {
  //   return o1 === null || o2 === null ? false : o1.id === o2.id;
  // }
}
