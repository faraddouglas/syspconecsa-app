import { Component, OnInit } from '@angular/core';
import { CustomComponent } from '../custom-component/custom-component.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

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
  isSubmitting: boolean = false;
  itsEnterprise: any = false;
  itsUser: any = false;

  constructor(
    private customComponent: CustomComponent,
    private authGuard: AuthGuard,
  ) {};

  ngOnInit() {
    this.isSubmitting = false;
  };

  async getEnterprise() {
    this.isSubmitting = true;
    if (this.companyId === '') {
      this.customComponent.presentAlert(
        'Erro',
        'Preencha o campo corretamente',
        '',
        ['OK']
      );
      this.isSubmitting = false;
    } else {
      await this.authGuard.getEnterprise(this.companyId);
      setTimeout(() => {
        this.isSubmitting = false;
      }, 5000);
      this.itsEnterprise = true;
    };
  };

  async login() {
    if (this.userId === '') {
      this.customComponent.presentAlert(
        'Erro',
        'Preencha o campo corretamente',
        '',
        ['OK']
      );
    } else {
      this.isSubmitting = true;
      await this.authGuard.login(this.companyId, this.userId);
    };
  };

  numericOnly() {
    addEventListener('numericOnly', (event: any) => {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
  };
};
