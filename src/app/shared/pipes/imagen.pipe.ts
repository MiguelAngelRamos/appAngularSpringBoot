import { Pipe, PipeTransform } from '@angular/core';
import { URL } from '../../config/url';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {
  // por defecto sera usuario
  transform(img: string): any {
    if (!img) {
      // ruta aleatoria probando el error para traer el no image
      console.log('Cuando la imagen es !img');
      return 'http://localhost:8080/images/no-usuario.png';
    }
    return URL + '/uploads/img/' + img;
  }
}

// http://localhost:8080/api
// http://localhost:8080/images/no-usuario.png
// http://localhost:8080/api/uploads/img/{{cliente.foto}}