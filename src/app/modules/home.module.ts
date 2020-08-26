import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { CoreModule } from '../core/core.module';
import { HomeRouting } from './home.routing';
import { HomeComponent } from './home.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FormclienteComponent } from './pages/formcliente/formcliente.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PerfilclienteComponent } from './components/perfilcliente/perfilcliente.component';
import { PipesModule } from '../shared/pipes/pipes.module';
import { TokenInterceptor } from '../core/interceptors/token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../core/interceptors/auth.interceptor';


@NgModule({
  declarations: [
    HomeComponent,
    ClientesComponent,
    FormclienteComponent,
    PaginatorComponent,
    PerfilclienteComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    PipesModule,
    RouterModule.forChild(HomeRouting)
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
})
export class HomeModule { }
