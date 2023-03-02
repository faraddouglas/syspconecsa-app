import { RecordService } from './../records-page/record.service';
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

  user:any = localStorage.getItem('user');
  records: any [] = [];
  states: any [] = [];
  userType = JSON.parse(this.user).userType;
  hasInterval = JSON.parse(this.user).hasInterval;
  recordState: any = null;
  recordToPost: any = {};
  time: any = new Date().toLocaleTimeString();
  dateKey: any = new Date().toLocaleDateString();
  formatedDate = String(new Date().toLocaleDateString()).split('/').reverse().join('-');

  constructor(
    private alertController: AlertController,
    private registerService: RegisterService,
    private recordService: RecordService,
    private navCtrl: NavController
    ) {}

  ngOnInit() {

    if (!this.records[this.dateKey]) {
      this.records[this.dateKey] = {};
    };

    if (!this.records[this.dateKey][this.recordState]) {
      this.records[this.dateKey][this.recordState] = this.time;
    };

    this.recordToPost = {
      'userId': JSON.parse(this.user).userId,
      'employee': JSON.parse(this.user).name,
      'companyId': JSON.parse(this.user).companyId,
      'date': null,
      'checkInTime': null,
      'startInterval': null,
      'endInterval': null,
      'checkOutTime': null
    };

    this.recordService.getRecords().then((dbRecords) => {
      if (dbRecords.length !== 0) {
      for (const record of dbRecords) {
        if (record.date === this.formatedDate
          && record.checkOutTime !== null || ''
          ){
            this.records[this.dateKey]['chegada'] = record.checkInTime;
            this.records[this.dateKey]['intervalo'] = record.startInterval;
            this.records[this.dateKey]['retorno'] = record.endInterval;
            this.records[this.dateKey]['saida'] = record.checkOutTime;
            this.unableButton('record-time-btn');
            this.recordState = 'concluido';
            this.presentAlert();
        } else if (this.hasInterval === true &&
          record.date === this.formatedDate &&
          record.startInterval === null || ''){
            this.records[this.dateKey]['chegada'] = record.checkInTime;
            this.recordState = 'intervalo';
        } else if (this.hasInterval === true &&
          record.date === this.formatedDate &&
          record.endInterval === null || ''){
            this.records[this.dateKey]['chegada'] = record.checkInTime;
            this.records[this.dateKey]['intervalo'] = record.startInterval;
            this.recordState = 'retorno';
        } else if (this.hasInterval === true &&
          record.date === this.formatedDate &&
          record.checkOutTime === null || ''){
            this.records[this.dateKey]['chegada'] = record.checkInTime;
            this.records[this.dateKey]['intervalo'] = record.startInterval;
            this.records[this.dateKey]['retorno'] = record.endInterval;
            this.recordState = 'saida';
        } else if (this.hasInterval === false &&
          record.date === this.formatedDate &&
          record.checkOutTime === null || ''){
            this.records[this.dateKey]['chegada'] = record.checkInTime;
            this.recordState = 'saida';
        } else {
          this.recordState = 'chegada';
        }
        break;
      }
    } else {
      this.recordState = 'chegada';
    }
    });

    if ( this.hasInterval === true) {
      this.states = ['chegada', 'intervalo', 'retorno','saida', 'concluido'];
    } else {
      this.states = ['chegada', 'saida', 'concluido'];
    };

    this.displayTime();
  };

  displayTime() {
    setInterval(() => {
      const date = new Date();
      const time = date.toLocaleTimeString();
      document.querySelectorAll('#time').forEach((element) => {
        element.innerHTML = time;
        }, 1000);
    });
  };

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Sucesso!',
      subHeader: 'Todos os seus horários foram registrados!',
      message: 'Volte amanhã para registrar seu horário de trabalho!',
      buttons: ['OK'],
    });
    await alert.present();
  };

  recordTime() {

    if (this.recordState === this.states[0]) {
      this.recordToPost.checkInTime = this.time;
      this.postRecord();
    };

    this.records[this.dateKey][this.recordState] = this.time;

    for ( const state of this.states) {
      for (let i = 0; i < this.states.length; i++){
        const nextState = this.states[i];
        if (this.recordState === state && !this.records[this.dateKey][nextState]) {
          this.recordState = nextState;
        }
      }
    };

    this.unableButton('record-time-btn');
    this.putRecord();

    if(this.recordState === this.states[this.states.length - 1]) {
      this.presentAlert();
      this.navCtrl.navigateForward('/page/records');
    }
  };

  async postRecord() {
    const date = new Date();
    const dateKey: any = date.toLocaleDateString();
    this.recordToPost.date = String(dateKey.split('/').reverse().join('-'));
    this.storeRecord();
    await lastValueFrom(this.registerService.postRecords(this.recordToPost));
  };

  async putRecord() {
    const date = new Date();
    const dateKey: any = date.toLocaleDateString();
    const lastId: string = await this.registerService.getLastId();

    this.recordToPost.date = String(dateKey.split('/').reverse().join('-'));
    this.recordToPost.checkInTime = this.records[dateKey]['chegada'];
    this.recordToPost.checkOutTime = this.records[dateKey]['saida'];
    this.recordToPost.startInterval = this.records[dateKey]['intervalo'];
    this.recordToPost.endInterval = this.records[dateKey]['retorno'];

    this.storeRecord();
    await lastValueFrom(this.registerService.putRecord(this.recordToPost, lastId));
  };

  storeRecord(){
    localStorage.setItem('records', JSON.stringify(this.records));
  };

  unableButton(btn: string) {
    document.getElementById(btn)!.setAttribute('disabled', 'true');
  };
};
