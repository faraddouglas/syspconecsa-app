import { RecordService } from './../records-page/record.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { RegisterService } from './register.service';
import { lastValueFrom } from 'rxjs';
import { CustomComponent } from '../custom-component/custom-component.component';


@Component({
  selector: 'register',
  templateUrl: './register.page.html',
  styleUrls: ['./register-page.page.scss'],
})

export class RegisterPage implements OnInit {

  user: any = localStorage.getItem('user');
  companyId = JSON.parse(this.user).companyId;
  userId = JSON.parse(this.user).userId;
  records: any [] = [];
  states: any [] = [];
  userType = JSON.parse(this.user).userType;
  hasInterval = JSON.parse(this.user).hasInterval;
  recordState: any = null;
  recordToPost: any = {};
  date = new Date();
  time: any = new Date().toLocaleTimeString();
  dateKey: any = new Date().toLocaleDateString();
  formatedDate = String(this.dateKey.split('/').reverse().join('-'));
  formadatedTimeStamp = `${this.formatedDate} ${this.time}`;

  constructor(
    private registerService: RegisterService,
    private recordService: RecordService,
    private navCtrl: NavController,
    private customComponent: CustomComponent
    ) {}

  ngOnInit() {
    this.recordToPost = {
      'date': `${this.formatedDate} 00:00:00`,
      'userId': JSON.parse(this.user).userId,
      'employee': JSON.parse(this.user).name,
      'companyId': JSON.parse(this.user).companyId,
      'checkInTime': null,
      'startInterval': null,
      'endInterval': null,
      'checkOutTime': null
    };
    this.setParameters();
    this.getTodaysRecord();
    this.displayTime();
  };

  displayTime() {
    setInterval(() => {
      const time = this.date.toLocaleTimeString();
      document.querySelectorAll('#time').forEach((element) => {
        element.innerHTML = time;
        }, 1000);
    });
  };

  recordTime() {
    //Case the user has no record for today
    if (this.recordState === this.states[0]) {
      this.recordToPost.checkInTime = this.formadatedTimeStamp;
      this.unableButton('record-time-btn');
      this.updateRecordState();
      this.postRecord();
    } else {
        //Case the user has a record for today
        this.unableButton('record-time-btn');
        this.updateRecordState();
        this.putRecord();
      };
    };

  async postRecord() {
    this.recordToPost.date = this.formatedDate;
    await lastValueFrom(this.registerService.postRecords(this.recordToPost));
  };

  async putRecord() {
    const lastId: number = await this.registerService.getLastId();
    //Case the user has no interval
    if(this.hasInterval === false){
      if (this.recordState === this.states[2]) {
        this.recordToPost.checkInTime = `${this.formatedDate} ${this.records[this.dateKey][this.states[0]]}`;
        this.recordToPost.checkOutTime = `${this.formatedDate} ${this.records[this.dateKey][this.states[1]]}`;
      };
    } else {
      //Case the user has interval
      if (this.recordState === this.states[2]) {
        this.recordToPost.checkInTime = `${this.formatedDate} ${this.records[this.dateKey][this.states[0]]}`;
        this.recordToPost.startInterval = `${this.formatedDate} ${this.records[this.dateKey][this.states[1]]}`;
      };
      if (this.recordState === this.states[3]) {
        this.recordToPost.checkInTime = `${this.formatedDate} ${this.records[this.dateKey][this.states[0]]}`;
        this.recordToPost.startInterval = `${this.formatedDate} ${this.records[this.dateKey][this.states[1]]}`;
        this.recordToPost.endInterval = `${this.formatedDate} ${this.records[this.dateKey][this.states[2]]}`;
      };
      if (this.recordState === this.states[4]) {
        this.recordToPost.checkInTime = `${this.formatedDate} ${this.records[this.dateKey][this.states[0]]}`;
        this.recordToPost.startInterval = `${this.formatedDate} ${this.records[this.dateKey][this.states[1]]}`;
        this.recordToPost.endInterval = `${this.formatedDate} ${this.records[this.dateKey][this.states[2]]}`;
        this.recordToPost.checkOutTime = `${this.formatedDate} ${this.records[this.dateKey][this.states[3]]}`;
      };
    };
    await lastValueFrom(this.registerService.putRecord(this.recordToPost, this.companyId, this.userId, lastId));
  };

  unableButton(btn: string) {
    document.getElementById(btn)!.setAttribute('disabled', 'true');
  };

  getTodaysRecord(){
    //Search for records in database
    this.recordService.getRecords().then((dbRecords) => {
      if (dbRecords.length !== 0) {
        let matchingRecord: any = null;
        for (const record of dbRecords) {
          if (record.date === `${this.formatedDate}T00:00:00.000Z`) {
            matchingRecord = record;
            break;
          };
        };
        if (matchingRecord !== null) {
          //Case 1 - User has interval and all records are filled
          if (this.hasInterval === true && matchingRecord['checkOutTime'] !== null) {
              this.records[this.dateKey][this.states[0]] = new Date(matchingRecord['checkInTime']).toLocaleTimeString(
                'pt-BR',
                { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                );
              this.records[this.dateKey][this.states[1]] = new Date(matchingRecord['startInterval']).toLocaleTimeString(
                'pt-BR',
                { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                );
              this.records[this.dateKey][this.states[2]] = new Date(matchingRecord['endInterval']).toLocaleTimeString(
                'pt-BR',
                { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                );
              this.records[this.dateKey][this.states[this.states.length -2]] = new Date(matchingRecord['checkOutTime']).toLocaleTimeString(
                'pt-BR',
                { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                );
              this.unableButton('record-time-btn');
              this.recordState = this.states[this.states.length - 1];
              this.customComponent.presentAlert(
                'Sucesso!',
                'Todos os seus horários foram registrados!',
                'Volte amanhã para registrar seu horário de trabalho!',
                ['OK']
                );
          //Case 2 - User has interval and only checkInTime is filled
          } else if (this.hasInterval === true && matchingRecord['startInterval'] === null
            ){
              this.records[this.dateKey][this.states[0]] = new Date(
                matchingRecord['checkInTime']).toLocaleTimeString( 
                  'pt-BR', 
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC' }
                );
              this.recordState = this.states[1];
          //Case 3 - User has interval and only checkInTime and startInterval are filled
          } else if (this.hasInterval === true && matchingRecord['endInterval'] === null
            ){
              this.records[this.dateKey][this.states[0]] = new Date(
                matchingRecord['checkInTime']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.records[this.dateKey][this.states[1]] = new Date(
                matchingRecord['startInterval']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.recordState = this.states[2];
          //Case 4 - User has interval and only checkInTime, startInterval and endInterval are filled
          } else if (this.hasInterval === true && matchingRecord.checkOutTime === null
            ){
              this.records[this.dateKey][this.states[0]] = new Date(
                matchingRecord['checkInTime']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.records[this.dateKey][this.states[1]] = new Date(
                matchingRecord['startInterval']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.records[this.dateKey][this.states[2]] = new Date(
                matchingRecord['endInterval']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.recordState = this.states[this.states.length -2];
          //Case 5 - User has no interval and all records are filled
          } else if (this.hasInterval === false && matchingRecord['checkOutTime'] === null
            ){
              this.records[this.dateKey][this.states[0]] = new Date(
                matchingRecord['checkInTime']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.recordState = this.states[this.states.length -2];
          //Case 6 - User has no interval and only checkInTime is filled
          } else if (this.hasInterval === false && matchingRecord['checkOutTime'] !== null
            ){
              this.records[this.dateKey][this.states[0]] = new Date(
                matchingRecord['checkInTime']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.records[this.dateKey][this.states[this.states.length -2]] = new Date(
                matchingRecord['checkOutTime']).toLocaleTimeString(
                  'pt-BR',
                  { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'UTC'}
                  );
              this.unableButton('record-time-btn');
              this.recordState = this.states[this.states.length - 1];
              this.customComponent.presentAlert(
                'Sucesso!',
                'Todos os seus horários foram registrados!',
                'Volte amanhã para registrar seu horário de trabalho!',
                ['OK']
                );
          } else {
              //Record not found
              this.recordState = this.states[0];
          };
        } else {
          //No records found
          this.recordState = this.states[0];
        };
      } else {
        //No records found
        this.recordState = this.states[0];
      };
    });
  };

  setParameters(){
    //Create a new record object
    if (!this.records[this.dateKey]) {
      this.records[this.dateKey] = {};
    };
    //Set the states array
    if ( this.hasInterval === true ) {
      this.states = ['chegada', 'intervalo', 'retorno','saída', 'concluído'];
    } else {
      this.states = ['chegada', 'saída', 'concluído'];
    };
  };

  updateRecordState(){
    this.records[this.dateKey][this.recordState] = this.time;
    //Loop through the states array to find the next state
    for ( const state of this.states) {
      for (let i = 0; i < this.states.length; i++){
        const nextState = this.states[i];
        if (this.recordState === state && !this.records[this.dateKey][nextState]) {
          this.recordState = nextState;
        };
      };
    };
    //Case the user has finished his work day
    if(this.recordState === this.states[this.states.length - 1]) {
      this.customComponent.presentAlert(
        'Sucesso!',
        'Todos os seus horários foram registrados!',
        'Volte amanhã para registrar seu horário de trabalho!',
        ['OK']
        );
      setTimeout(() => {
        this.navCtrl.navigateForward('/page/tabs/records');
      }, 1000);
    };
  };
};
