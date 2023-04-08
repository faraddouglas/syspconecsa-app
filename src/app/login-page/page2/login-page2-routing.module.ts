import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage2 as LoginPage2 } from './login.page2';

const routes: Routes = [
  {
    path: '',
    component: LoginPage2
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPage2RoutingModule {};
