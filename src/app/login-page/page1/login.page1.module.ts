import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPage1RoutingModule } from './login-page1-routing.module';
import { LoginPage1 } from './login.page1';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPage1RoutingModule
  ],
  declarations: [LoginPage1]
})
export class LoginPage1Module {};
