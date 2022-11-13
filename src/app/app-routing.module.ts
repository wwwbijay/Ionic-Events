import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'events',
    loadChildren: () =>
      import('./folder/folder.module').then(m => m.FolderPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./screens/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'events',
  },
  {
    path: 'event',
    loadChildren: () => import('./screens/event/event.module').then( m => m.EventPageModule)
  },
  {
    path: 'qr-scan',
    loadChildren: () => import('./screens/qr-scan/qr-scan.module').then( m => m.QrScanPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
