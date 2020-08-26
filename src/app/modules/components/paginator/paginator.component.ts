import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginador: any;
  paginas: number[];
  public desde: number;
  public hasta: number;
  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // cuando cambia el objeto que el padre esta inyectando
    const paginadorActualizado = changes['paginador'];
    // SI TIENE UN ESTADO ANTERIOR, haya cambiado
    if ( paginadorActualizado.previousValue) {
      this.initPaginator();
    }

  }

  private initPaginator(): void {
    // el maximo entre 1 (1 es el valor minimo que podria tener el desde) y nuestra pagina actual -4 , total de paginas -5
    this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
    // el minimo entre el total de paginas y nuestra pagina actual + 4
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);

    /* En resumen el rango es entre 1 y 6 */
    if (this.paginador.totalPages > 5) {
      this.paginas = new Array(this.hasta - this.desde + 1).fill(0).map((_valor, indice) => indice + this.desde);
    } else {
      // fill para llenar un arreglo con datos
      this.paginas = new Array(this.paginador.totalPages).fill(0).map((_valor, indice) => indice + 1);
    }
  }

}
