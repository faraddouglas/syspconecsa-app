import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterEnterprisePage } from './register-enterprise.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterEnterprisePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterEnterprisePageRoutingModule {}
