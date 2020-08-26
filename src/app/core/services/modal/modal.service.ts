import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  public modal = false;
  private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  public get notificarUpload(){
    return this._notificarUpload;
  }

  public abrirModal(): void {
    this.modal = true;
  }

  public cerrarModal(): void {
    this.modal = false;
  }
}
