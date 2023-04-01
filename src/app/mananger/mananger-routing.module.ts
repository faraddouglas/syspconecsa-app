import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManangerPage } from './mananger.page';

const routes: Routes = [
  {
    path: 'page/mananger',
    component: ManangerPage,
    children: [
      {
        path: 'register-enterprise',
        loadChildren: () => import('./register-enterprise/register-enterprise.module').then( m => m.RegisterEnterprisePageModule)
      },
      {
        path: 'register-user',
        loadChildren: () => import('./register-user/register-user.module').then( m => m.RegisterUserPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManangerPageRoutingModule {}
