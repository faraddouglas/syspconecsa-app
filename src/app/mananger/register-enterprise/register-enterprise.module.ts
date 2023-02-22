import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterEnterprisePageRoutingModule } from './register-enterprise-routing.module';

import { RegisterEnterprisePage } from './register-enterprise.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterEnterprisePageRoutingModule
  ],
  declarations: [RegisterEnterprisePage]
})
export class RegisterEnterprisePageModule {}
