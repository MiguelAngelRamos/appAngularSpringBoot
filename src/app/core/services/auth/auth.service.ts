import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from '../../../shared/models/usuario';
import { URLAUTH } from '../../../config/urlAuth';
import { credenciales } from '../../../config/crendecial';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null){
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null)  {
      return this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
    }
    /* si no existe en ninguna parte ni en los atributos ni en la session*/
    return new Usuario(); // nueva instancia vacia
  }

  public get token(): string {
    if (this._token != null){
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null)  {
      return this._token = sessionStorage.getItem('token');
    }
    return null;
  }
  login(usuario: Usuario): Observable<any> {
    // CREDENCIALES DE LA APLICACION
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    console.log(params);
    console.log(params.toString());
    return this.http.post<any>(URLAUTH, params.toString(), {headers: httpHeaders});
  }
  guardarUsuario(accessToken: string): void  {
    const payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void  {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }

  obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    // atraves de estos datos podemos validar que el username exista y que contenga un string que su largo sea mayor que cero
    // token como es un get no es invocable se llama sin los ()
    const payload = this.obtenerDatosToken(this.token);
    if (payload !== null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  // tiene rol?
  hasRole(role: string ): boolean {
    // llamando al metodo get usuario
    // includes permite validar si existe algun elemento dentro de este arreglo
    if (this.usuario.roles.includes(role)) {
      // si lo contiene lo incluye
      return true;
    }
    return false;
  }

  logout(): void {
    this._token = null;
    this._usuario = null;
    /*
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('usuario') */
    sessionStorage.clear();
  }
}
