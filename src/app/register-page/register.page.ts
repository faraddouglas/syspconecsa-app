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
  storedUser:any = localStorage.getItem('user');
  records: any [] = localStorage.getItem('records') ? JSON.parse(this.storedRecords) : [];
  states: any [] = [];
  recordState = 'chegada';
  user: any = localStorage.getItem('user');
  userType = JSON.parse(this.user).userType;
  recordToPost: any = {
    'userId': JSON.parse(this.user).userId,
    'employee': JSON.parse(this.user).name,
    'companyId': JSON.parse(this.user).companyId,
    'date': null,
    'checkInTime': null,
    'startInterval': null,
    'endInterval': null,
    'checkOutTime': null
  }

  constructor(
    private alertController: AlertController,
    private registerService: RegisterService,
    private navCtrl: NavController
    ) {}

  ngOnInit() {

    this.displayTime();

    localStorage.getItem('user') ? this.user = JSON.parse(this.storedUser) : this.user = {};
    if ( this.user.hasInterval === true) {
      this.states = ['chegada', 'intervalo', 'retorno','saida', 'concluido'];
    } else {
      this.states = ['chegada', 'saida', 'concluido'];
    }
  }

  displayTime() {
    setInterval(() => {
      const date = new Date();
      const time = date.toLocaleTimeString('pt-BR');
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
    const time: any = date.toLocaleTimeString('pt-BR');
    const dateKey: any = date.toLocaleDateString('pt-BR');

    if (!this.records[dateKey]) {
      this.records[dateKey] = localStorage.getItem('records') ? JSON.parse(this.storedRecords) : [];
    }

    if (!this.records[dateKey][this.recordState]) {
      this.records[dateKey][this.recordState] = time;
    }

    if (this.recordState === 'chegada') {
      this.recordToPost.checkInTime = time;
      this.postRecord();
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
      this.storeRecord();
      this.unableButton('record-time-btn');
      this.presentAlert();
      this.navCtrl.navigateForward('/page/records');
    }
    this.storeRecord();
  }

  async postRecord() {
    const date = new Date();
    const dateKey: any = date.toLocaleDateString('pt-BR');
    this.recordToPost.date = String(dateKey.split('/').reverse().join('-'));
    await lastValueFrom(this.registerService.postRecords(this.recordToPost));

    setTimeout(() => {
      this.records = [];
      this.recordState = 'chegada';
      localStorage.removeItem('records');
    }, 18 * 60 * 60 * 1000); // 18 horas

  }

  async putRecord() {
    const date = new Date();
    const dateKey: any = date.toLocaleDateString('pt-BR');
    const lastId: string = await this.registerService.getLastId();

    this.recordToPost.date = String(dateKey.split('/').reverse().join('-'));
    this.recordToPost.checkInTime = this.records[dateKey]['chegada'];
    this.recordToPost.checkOutTime = this.records[dateKey]['saida'];
    this.recordToPost.startInterval = this.records[dateKey]['intervalo'];
    this.recordToPost.endInterval = this.records[dateKey]['retorno'];

    console.log(lastId);
    await lastValueFrom(this.registerService.putRecord(this.recordToPost, lastId));
  }

  storeRecord(){
    localStorage.setItem('records', JSON.stringify(this.records));
  }

  unableButton(btn: string) {
    document.getElementById(btn)!.setAttribute('disabled', 'true');
  }
}
