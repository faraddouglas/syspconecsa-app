import { RegisterEnterprisePage } from './mananger/register-enterprise/register-enterprise.page';
import { ManangerPage } from './mananger/mananger.page';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  {
    path: '', redirectTo: 'page/login', pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'page/login',
    loadChildren: () => import('./login-page/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [

    {
      path: 'page/register',
      loadChildren: () => import('./register-page/register.module').then( m => m.RegisterPageModule)
    },
    {
      path: 'page/records',
      loadChildren: () => import('./records-page/records.module').then( m => m.RecordsPageModule)
    },
]},
  {
    path: '',
    component: ManangerPage,
    canActivate: [AuthGuard],
    children: [

    {
      path: 'page/mananger',
      loadChildren: () => import('./mananger/mananger.module').then( m => m.ManangerPageModule)
    }
  ],
  },
  {
    path: 'page/mananger/register-enterprise',
    component: RegisterEnterprisePage,
    canActivate: [AuthGuard],
    loadChildren: () => import('./mananger/register-enterprise/register-enterprise.module').then( m => m.RegisterEnterprisePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
