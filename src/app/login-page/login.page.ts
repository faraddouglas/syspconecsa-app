import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userId: string = '';
  companyId: string = '';
  userType: string = '';

  constructor( private authGuard: AuthGuard) { }

  ngOnInit() {}

  async login(){
    if(this.userId === '' || this.companyId === ''){
      this.authGuard.presentAlert();
  } else {
    this.authGuard.login(this.companyId, this.userId);
    }
  }
}
