import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../shared/models/usuario';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public title = 'Inicie Sesión';
  public usuario: Usuario;

  constructor( private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
   }
  ngOnInit(): void {
    // preguntamos si el usuario est autenticado
    if (this.authService.isAuthenticated()) {
      Swal.fire({
        icon: 'info',
        title: 'Autenticacion en curso',
        text: `Hola ${this.authService.usuario.username} ya estas autenticado`
      });
      this.router.navigate(['/clientes']);
    }
    // en text he usado el metodo get de usuario
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacios!',
        text: 'Error usuario y password son requeridos'
      });
      return;
    }
    this.authService.login(this.usuario).subscribe( response => {
      console.log(response);
      // guardar el token y el usuario
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      const usuario = this.authService.usuario;
      // claims datos personalizados el nombre, el apelido, email etc
      this.router.navigate(['/clientes']);
      Swal.fire({
        icon: 'success',
        title: 'Bienvenido!',
        text: `Has iniciado sesión ${usuario.username}`
      });
    }, err => {
      // verificar que el error sea 400 de validación
      if (err.status === 400 ) {
        //  error HTTP 400 Bad Request
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado!',
          text: 'Error en sus credenciales de inicio de sesión'
        });
      }
    });
  }

}
