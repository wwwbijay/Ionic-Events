import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from '../screens/home/home.page';

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
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FolderPageRoutingModule {}
