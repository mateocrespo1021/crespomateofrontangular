import { Routes } from '@angular/router';
import { AdminProductosComponent } from './admin/pages/admin-productos/admin-productos.component';
import { LoginComponent } from './auth/pages/login/login.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { AdminUsuariosComponent } from './admin/pages/admin-usuarios/admin-usuarios.component';
import { ReportesComponent } from './admin/pages/reportes/reportes.component';
import { authGuard } from './shared/guard/auth.guard';

import { AdminCategoriasComponent } from './admin/pages/admin-categorias/admin-categorias.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/productos',
    component: AdminProductosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/usuarios',
    component: AdminUsuariosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/reportes',
    component: ReportesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin/categorias',
    component: AdminCategoriasComponent,
    canActivate: [authGuard],
  },
];
