import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { RegisterService } from './register.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'register',
  templateUrl: './register.page.html',
  styleUrls: ['./register-page.page.scss'],
})

export class RegisterPage implements OnInit {

  storedRecords:any  = localStorage.getItem('records');
  records: any [] = localStorage.getItem('records') ? JSON.parse(this.storedRecords) : [];
  states: any [] = [];
  recordState = 'chegada';
  user: any = localStorage.getItem('user');
  userType = JSON.parse(this.user).userType;
  recordToPost: any = {
    'companyId': JSON.parse(this.user).enterprise,
    'employee': JSON.parse(this.user).registration,
    'date': '',
    'checkInTime': '',
    'startInterval': '',
    'endInterval': '',
    'checkOutTime': ''
  }

  constructor(
    private alertController: AlertController,
    private registerService: RegisterService,
    private navCtrl: NavController
    ) {}

  ngOnInit() {

    this.displayTime();
    this.postRecord();

    if (this.userType === 'hasInterval') {
      this.states = ['chegada', 'intervalo', 'retorno','saida', 'concluido'];
    } else {
      this.states = ['chegada', 'saida', 'concluido'];
    }

    setTimeout(() => {
      this.records = [];
      this.recordState = 'chegada';
      localStorage.removeItem('records');
    }, 18 * 60 * 60 * 1000); // 18 horas
  }

  displayTime() {
    setInterval(() => {
      const date = new Date();
      const time = date.toLocaleTimeString();
      document.querySelectorAll('#time').forEach((element) => {
        element.innerHTML = time;
        }, 1000);
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      subHeader: 'Todos os seus horários foram registrados!',
      message: 'Volte amanhã para registrar seu horário de trabalho!',
      buttons: ['OK'],
    });
    await alert.present();
  }

  recordTime() {
    const date = new Date();
    const time: any = date.toLocaleTimeString();
    const dateKey: any = date.toLocaleDateString();

    if (!this.records[dateKey]) {
      this.records[dateKey] = localStorage.getItem('records') ? JSON.parse(this.storedRecords) : [];
    }

    if (!this.records[dateKey][this.recordState]) {
      this.records[dateKey][this.recordState] = time;
    }

    for ( const state of this.states) {
      for (let i = 0; i < this.states.length; i++){
        const nextState = this.states[i];
        if (this.recordState === state && !this.records[dateKey][nextState]) {
          this.recordState = nextState;
        }
      }
      this.putRecord();
    }

    if(this.recordState === 'concluido') {
      localStorage.setItem('records', JSON.stringify(this.records));
      this.presentAlert();
      this.navCtrl.navigateForward('/page/records');
    }
    localStorage.setItem('records', JSON.stringify(this.records));
  }

  async postRecord() {
    const date = new Date();
    const dateKey: any = date.toLocaleDateString();
    this.recordToPost.date = String(dateKey.split('/').reverse().join('-'));
    await lastValueFrom(this.registerService.postRecords(this.recordToPost));
  }

  async putRecord() {
    const date = new Date();
    const dateKey: any = date.toLocaleDateString();
    const lastId: string = await this.registerService.getLastId();

    this.recordToPost.date = String(dateKey.split('/').reverse().join('-'));
    this.recordToPost.checkInTime = this.records[dateKey]['chegada'];
    this.recordToPost.checkOutTime = this.records[dateKey]['saida'];
    this.recordToPost.startInterval = this.records[dateKey]['intervalo'];
    this.recordToPost.endInterval = this.records[dateKey]['retorno'];

    console.log(lastId);
    await lastValueFrom(this.registerService.putRecord(this.recordToPost, lastId));
  }
}
