import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterUserPageRoutingModule } from './register-user-routing.module';
import { RegisterUserPage } from './register-user.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterUserPageRoutingModule
  ],
  declarations: [RegisterUserPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterUserPageModule {}
