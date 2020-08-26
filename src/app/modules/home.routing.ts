import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FormclienteComponent } from './pages/formcliente/formcliente.component';
// import { PerfilclienteComponent } from './components/perfilcliente/perfilcliente.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';


export const HomeRouting: Routes = [
    { path: '', component: HomeComponent,
    children: [
        { path: 'clientes', component: ClientesComponent},
        { path: 'clientes/page/:page', component: ClientesComponent},
        { path: 'clientes/form', component: FormclienteComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN'} },
        { path: 'clientes/form/:id', component: FormclienteComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'ROLE_ADMIN'}},
        // { path: 'clientes/ver/:id', component: PerfilclienteComponent}
    ]},
];
