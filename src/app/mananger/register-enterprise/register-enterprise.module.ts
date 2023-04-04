import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterEnterprisePageRoutingModule } from './register-enterprise-routing.module';
import { RegisterEnterprisePage } from './register-enterprise.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterEnterprisePageRoutingModule
  ],
  declarations: [RegisterEnterprisePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterEnterprisePageModule {};
