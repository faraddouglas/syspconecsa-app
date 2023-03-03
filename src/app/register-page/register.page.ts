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

    if ( this.hasInterval === true) {
      this.states = ['chegada', 'intervalo', 'retorno','saída', 'concluído'];
    } else {
      this.states = ['chegada', 'saída', 'concluído'];
    };

    this.recordToPost = {
      'date': this.dateKey,
      'date': this.formatedDate,
      'userId': JSON.parse(this.user).userId,
      'employee': JSON.parse(this.user).name,
      'companyId': JSON.parse(this.user).companyId,
      'checkInTime': null,
      'startInterval': null,
      'endInterval': null,
      'checkOutTime': null
    };

    this.recordService.getRecords().then((dbRecords) => {
      if (dbRecords.length !== 0) {
      for (const record of dbRecords) {
        if (this.hasInterval === true && record.date === this.formatedDate
          && record.checkOutTime !== null
          ){
            this.records[this.dateKey][this.states[0]] = record.checkInTime;
            this.records[this.dateKey][this.states[1]] = record.startInterval;
            this.records[this.dateKey][this.states[2]] = record.endInterval;
            this.records[this.dateKey][this.states[this.states.length -2]] = record.checkOutTime;
            this.unableButton('record-time-btn');
            this.recordState = this.states[this.states.length - 1];
            this.presentAlert();
        } else if (this.hasInterval === true &&
          record.date === this.formatedDate &&
          record.startInterval === null
          ){
            this.records[this.dateKey][this.states[0]] = record.checkInTime;
            this.recordState = this.states[1];
        } else if (this.hasInterval === true &&
          record.date === this.formatedDate &&
          record.endInterval === null
          ){
            this.records[this.dateKey][this.states[0]] = record.checkInTime;
            this.records[this.dateKey][this.states[1]] = record.startInterval;
            this.recordState = this.states[2];
        } else if (this.hasInterval === true &&
          record.date === this.formatedDate &&
          record.checkOutTime === null
          ){
            this.records[this.dateKey][this.states[0]] = record.checkInTime;
            this.records[this.dateKey][this.states[1]] = record.startInterval;
            this.records[this.dateKey][this.states[2]] = record.endInterval;
            this.recordState = this.states[this.states.length -2];
        } else if (this.hasInterval === false &&
          record.date === this.formatedDate &&
          record.checkOutTime === null
          ){
            this.records[this.dateKey][this.states[0]] = record.checkInTime;
            this.recordState = this.states[this.states.length -2];
        } else if (this.hasInterval === false &&
          record.date === this.formatedDate &&
          record.checkOutTime !== null
          ){
            this.records[this.dateKey][this.states[0]] = record.checkInTime;
            this.records[this.dateKey][this.states[this.states.length -2]] = record.checkOutTime;
            this.unableButton('record-time-btn');
            this.recordState = this.states[this.states.length - 1];
            this.presentAlert();
          } else {
          this.recordState = this.states[0];
        }
        break;
      }
    } else {
      this.recordState = this.states[0];
    };
    });

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
        };
      };
    };

    this.unableButton('record-time-btn');
    this.putRecord();

    if(this.recordState === this.states[this.states.length - 1]) {
      this.presentAlert();
      this.navCtrl.navigateForward('/page/records');
    };

    this.storeRecord();
  };

  async postRecord() {
    this.recordToPost.date = this.formatedDate;
    this.storeRecord();
    await lastValueFrom(this.registerService.postRecords(this.recordToPost));
  };

  async putRecord() {
    const lastId: string = await this.registerService.getLastId();

    if(this.hasInterval === false){
      this.recordToPost.checkInTime = this.records[this.dateKey][this.states[0]];
      this.recordToPost.checkOutTime = this.records[this.dateKey][this.states[this.states.length - 2]];
    } else {
        this.recordToPost.checkInTime = this.records[this.dateKey][this.states[0]];
        this.recordToPost.checkOutTime = this.records[this.dateKey][this.states[this.states.length - 2]];
        this.recordToPost.startInterval = this.records[this.dateKey][this.states[1]];
        this.recordToPost.endInterval = this.records[this.dateKey][this.states[2]];
        };

    await lastValueFrom(this.registerService.putRecord(this.recordToPost, lastId));
  };

  storeRecord(){
    localStorage.setItem('records', JSON.stringify(this.records));
  };

  unableButton(btn: string) {
    document.getElementById(btn)!.setAttribute('disabled', 'true');
  };
};
