import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManangerPage } from './mananger.page';

const routes: Routes = [
  {
    path: '',
    component: ManangerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManangerPageRoutingModule {}
