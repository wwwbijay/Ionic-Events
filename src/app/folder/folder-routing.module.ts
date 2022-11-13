import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FolderPage } from './folder.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/events/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: FolderPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../screens/home/home.module').then(m => m.HomePageModule)
          }
        ]
      },
      {
        path: 'qrscan',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../screens/qr-scan/qr-scan.module').then(m => m.QrScanPageModule)
          }
        ]
      },
      {
        path: ':eventId',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../screens/event/event.module').then(m => m.EventPageModule)
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
