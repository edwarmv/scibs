import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('@pages/login/login.module').then((m) => m.LoginModule),
    title: 'Inicio de sesión',
    canActivate: [LoginGuard],
  },
  {
    path: 'cambiar-password',
    loadChildren: () =>
      import('@pages/cambiar-password/cambiar-password.module').then(
        (m) => m.CambiarPasswordModule
      ),
    title: 'Cambio de contraseña',
    canActivate: [LoginGuard],
  },
  {
    path: 'nueva-cuenta',
    loadChildren: () =>
      import('@pages/nuevo-usuario/nuevo-usuario.module').then(
        (m) => m.NuevoUsuarioModule
      ),
    title: 'Nuevo usuario',
    canActivate: [LoginGuard],
  },
  {
    path: 'entradas',
    loadChildren: () =>
      import('@pages/entradas/entradas.module').then((m) => m.EntradasModule),
    data: {
      showSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'salidas',
    loadChildren: () =>
      import('@pages/salidas/salidas.module').then((m) => m.SalidasModule),
    data: {
      showSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'saldos',
    loadChildren: () =>
      import('@pages/saldos/saldos.module').then((m) => m.SaldosModule),
    title: 'Saldos',
    data: {
      showSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'materiales',
    loadChildren: () =>
      import('@pages/materiales/materiales.module').then(
        (m) => m.MaterialesModule
      ),
    data: {
      showSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'gestiones',
    loadChildren: () =>
      import('@pages/gestiones/gestiones.module').then(
        (m) => m.GestionesModule
      ),
    title: 'Gestiones',
    data: {
      showSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'reportes',
    loadChildren: () =>
      import('@pages/reportes/reportes.module').then((m) => m.ReportesModule),
    title: 'Reportes',
    data: {
      showSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'copias-seguridad',
    loadChildren: () =>
      import('@pages/copias-seguridad/copias-seguridad.module').then(
        (m) => m.CopiasSeguridadModule
      ),
    title: 'Copias de seguridad',
    data: {
      showSidebar: true,
    },
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '/entradas',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
