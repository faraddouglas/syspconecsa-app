import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'page/login',
    pathMatch: 'full'
  },
  {
    path: 'page',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'page/register',
        loadChildren: () => import('../register-page/register.module').then(m => m.RegisterPageModule)
      },
      {
        path: 'page/records',
        loadChildren: () => import('../records-page/records.module').then(m => m.RecordsPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
