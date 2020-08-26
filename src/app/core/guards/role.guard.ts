import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    /** Preguntar si esta autenticado */
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = next.data.role as string;
    // let role = next.data['role] as string;
    console.log(role);
    if (this.authService.hasRole(role)) {
      return true;
    }
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: `${this.authService.usuario.username},  No posees los permisos para esta acción`
    });
    this.router.navigate(['/clientes']);
    return false;
  }
}
