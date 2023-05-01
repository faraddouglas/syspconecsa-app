import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPage1 as LoginPage1 } from './login.page1';

const routes: Routes = [
  {
    path: '',
    component: LoginPage1
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPage1RoutingModule {};
