import { Region } from './region';

export class Cliente {
  nombre: string;
  apellido: string;
  createAt: string; // fecha
  email: string;
  foto: string;
  region: Region;
  id?: number;

  constructor(nombre: string, apellido: string, createAt: string, email: string, region?: Region, foto?: string,  id?: number){
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.createAt = createAt;
    this.region = region;
    this.email = email;
    this.foto = foto;
  
  }
}
