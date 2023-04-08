import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPage2RoutingModule } from './login-page2-routing.module';
import { LoginPage2 as LoginPage2 } from './login.page2';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPage2RoutingModule
  ],
  declarations: [LoginPage2]
})
export class LoginPage2Module {};
