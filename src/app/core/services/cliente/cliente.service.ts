import { Injectable } from '@angular/core';
import { Cliente } from '../../../shared/models/cliente';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { URL } from '../../../config/url';
import { Router } from '@angular/router';
import { Region } from '../../../shared/models/region';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient, private router: Router) { }

  /** Método protegido agrego la cabecera con el token */
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${URL}/clientes/regiones`);
  }

  // Obtener todos los clientes
  getClientes(page: number): Observable<any>{
    // return of();
   // return this.http.get<Cliente[]>(URL + '/api/clientes'); una forma
   return this.http.get(`${URL}/clientes/page/${page}`).pipe(
    tap((response: any) => { // response de tipo object
      console.log('ClienteService: tap 1');
      (response.content as Cliente[]).forEach( client => {
        console.log(client.nombre);
      });
    }),
     map((response) => {
       (response.content as Cliente[]).map(cliente => {
         cliente.nombre = cliente.nombre.toUpperCase();
         // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
         // const datePipe = new DatePipe('es');
         // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); // nombre del dia EEEE y otra M para el mes
         return cliente;
       });
       return response;
      }),
      tap((response) => {
        // en esta parte como el map cambia los valores el response ya viene como tipo cliente
         console.log('ClienteService: tap 2');
         (response.content as Cliente[]).forEach( client => {
         console.log(client.nombre);
        });
      }),
   );
  }

  // Crear un cliente es un método protegido agrego la cabecera con el token
  create( cliente: Cliente): Observable<Cliente> {
    return this.http.post(URL + '/clientes', cliente).pipe(
      map( (response: any) => response.cliente as Cliente), // cambia el response de tipo object a cliente
      catchError(e => {
        console.error(e.error.mensaje);
        /** Errores de validación de formularios */
        if (e.status === 400){
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  // Obtener un solo ciente por id método protegido incluyo la cabecera con el token

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${URL}/clientes/${id}`).pipe(
      catchError(e => {
        // captura el error por medio del estado de la respuesta 404 no fount 500 server internal error
        if (e.status !== 401 && e.error.mensaje) {
          this.router.navigate(['/clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  // Actualizar cliente método protegido agrego la cabeceras con el token
  update(cliente: Cliente): Observable<Cliente>{
    return this.http.put(`${URL}/clientes/${cliente.id}`, cliente).pipe(
      map((response: any) => {
        return response.cliente as Cliente;
      }),
      catchError(e => {
        if (e.status === 400){
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }
  /** Método protegido agrego las cabecerasc con el token */
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${URL}/clientes/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  /**  */
  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    // aqui tenemos que crear una instancia separada del headers por que no estamos enviando un content type json sino un form data
    // let httpHeaders = new HttpHeaders();
    // const token = this.authService.token;
    // if ( token != null) {
    //   httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
    // }
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('id', id);
    // para el progress bar
    const req = new HttpRequest('POST', `${URL}/clientes/upload`, formData, {
      reportProgress: true
      // headers: httpHeaders
    });

    return this.http.request(req);
  }
//   return this.http.post(`${URL}/clientes/upload`, formData).pipe(
//     map((response: any) => response.cliente as Cliente),
//     catchError(e => {
//       console.error(e.error.error);
//       Swal.fire({
//         icon: 'error',
//         title: 'Error al subir foto',
//         text: e.error.mensaje
//       });
//       return throwError(e);
//     })
//   );
// }
}


/* Antes de la páginacion el getClientes tenia esta forma */
// getClientes(): Observable<Cliente[]>{
//   // return of();
//  // return this.http.get<Cliente[]>(URL + '/api/clientes'); una forma
//  return this.http.get(URL + '/clientes').pipe(
//   tap(response => { // response de tipo object
//     const clientes = response as Cliente[];
//     console.log('ClienteService: tap 1');
//     clientes.forEach( client => {
//       console.log(client.nombre);
//     });
//   }),
//    map(response => {
//      const clientes = response as Cliente[];
//      return clientes.map(cliente => {
//        cliente.nombre = cliente.nombre.toUpperCase();
//        // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
//        const datePipe = new DatePipe('es');
//        // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); // nombre del dia EEEE y otra M para el mes
//        return cliente;
//      });
//     })
//     , tap(response => {
//       // en este parte como el map cambia los valores el response es de tipo cliente
//        console.log('ClienteService: tap 2');
//        response.forEach( client => {
//        console.log(client.nombre);
//       });
//     }),
//  );
// }
