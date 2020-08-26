import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common'; // encargado del *ngIf *ngFor
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [
    ImagenPipe
  ],
  imports: [
  ],
  exports:[
    ImagenPipe
  ]
})
export class PipesModule {}