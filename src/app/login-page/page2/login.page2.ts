import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../guards/auth.guard';
import { CustomComponent } from '../../custom-component/custom-component.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page2.html',
  styleUrls: ['./login.page2.scss'],
})

export class LoginPage2 implements OnInit {
  userId: string = '';
  enterprise: any = localStorage.getItem('enterprise');
  companyId = JSON.parse(this.enterprise).companyId;
  userType: string = '';
  user = localStorage.getItem('user');
  isSubmitting: boolean = false;

  constructor(
    private authGuard: AuthGuard,
    private customComponent: CustomComponent,
    ) {};

  ngOnInit() {
    this.isSubmitting = false;
  };

  async login(){
    if(this.userId === ''){
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

  numericOnly(){
    addEventListener('numericOnly', (event: any) => {
      event.target.value = event.target.value.replace(/[^0-9]/g, '');
    });
  };
};
