import { Component, OnInit } from '@angular/core';
import { RecordService } from './record.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-records',
  templateUrl: 'records.page.html',
  styleUrls: ['records.page.scss']
})
export class RecordsPage implements OnInit {
  constructor(private recordService: RecordService) {}
  records: any = [];
  user: any = localStorage.getItem('user');
  hasInterval = JSON.parse(this.user).hasInterval;

  ngOnInit() {
    this.loadRecords();
  }

  async loadRecords(){
    this.records = await this.recordService.getRecords();
  }

  formatDate(_date: string) {

    const date = new Date(_date);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    if(day < 10 && month < 10){
      return `0${day}/0${month}/${year}`;
    } else if(day < 10 && month >= 10){
      return `0${day}/${month}/${year}`;
    } else if(day >= 10 && month < 10){
      return `${day}/0${month}/${year}`;
    } else {
      return `${day}/${month}/${year}`;
    }
  }
}

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(value: any) {
    return value.slice().reverse();
  }
}
