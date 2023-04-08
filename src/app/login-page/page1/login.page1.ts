import { Component, OnInit } from '@angular/core';
import { CustomComponent } from '../../custom-component/custom-component.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page1.html',
  styleUrls: ['./login.page1.scss'],
})

export class LoginPage1 implements OnInit {
  userId: string = '';
  companyId: string = '';
  userType: string = '';
  user = localStorage.getItem('user');
  isSubmitting: boolean = false;

  constructor(
    private customComponent: CustomComponent,
    private authGuard: AuthGuard,
    ) {};

  ngOnInit() {
    this.isSubmitting = false;
  };

  async login(){
    this.isSubmitting = true;
    if(this.companyId === ''){
      this.customComponent.presentAlert(
        'Erro',
        'Preencha o campo corretamente',
        '',
        ['OK']
        );
      this.isSubmitting = false;
    } else {
      await this.authGuard.getEnterprises(this.companyId);
    };
  };

  numericOnly(){
    addEventListener('numericOnly', (event: any) => {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
  };
};
