import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public title = 'App Angular';
  constructor(public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    Swal.fire({
      icon: 'success',
      title: 'Logout',
      text: ` ${this.authService.usuario.username}: has cerrado la sesión`
    });
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  }

