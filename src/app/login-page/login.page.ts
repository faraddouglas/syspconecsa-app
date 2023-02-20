import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthGuard } from '../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private alertController: AlertController, private auth: AuthGuard) { }
  registration: string = '';
  enterprise: string = '';
  userType: string = 'hasInterval';


  ngOnInit() {
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      subHeader: 'Não foi possível realizar o login!',
      message: 'Verifique suas credenciais',
      buttons: ['OK'],
    });

    await alert.present();
  }

  login() {
    if (this.registration === '123456' && this.enterprise === '123456') {
      const user = { registration: this.registration, enterprise: this.enterprise, userType: this.userType };
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['page/register']);
    } else {
      this.presentAlert();
    }
  }
}
