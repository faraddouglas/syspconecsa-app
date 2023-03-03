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
  user = localStorage.getItem('user');

  constructor( private authGuard: AuthGuard) { }

  ngOnInit() {}
    isSubmitting = false;

  async login(){

    if(this.userId === '' || this.companyId === ''){
      this.authGuard.presentAlert();
  } else {
      await this.authGuard.login(this.companyId, this.userId);
      if(!this.user){
        this.isSubmitting = false;
      } else { this.isSubmitting = true; }
    }
  }

  numericOnly(){
    addEventListener('numericOnly', (event: any) => {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
  }
}
