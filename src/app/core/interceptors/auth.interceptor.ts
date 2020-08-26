import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';



/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // cuando recibimos
    return next.handle(req).pipe(
      catchError(e => {
        /* Código 401 es no autorizado(Unauthorized) y 403 es Forbidden (Prohibido) el servidor te niega el acceso a ese recurso */
        /** Cuando no esta autenticado  */
        if (e.status === 401) {
          // si el token expira me va enviar el mismo error 401
          // si es asi voy a preguntar si expiro cuando el usuario se autentico y entonces cierro su sesion
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        /* Acceso prohibido*/
        if (e.status === 403) {
          Swal.fire({
            icon: 'error',
            title: 'No posees los permisos para esta acción',
            text: e.error.error
          });
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }
}
