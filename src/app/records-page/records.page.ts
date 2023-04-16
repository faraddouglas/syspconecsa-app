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
  bankedHours: any [] = [];
  extraHours: any [] = [];
  weekendHours: any [] = [];
  totalBankedHours: string = '00:00';
  totalExtraHours: string = '00:00';
  totalWeekendHours: string = '00:00';

  ngOnInit() {
    this.loadRecords();
  };

  async loadRecords(){
    this.records = await this.recordService.getRecords();

    // Get banked hours
    const workedHours = this.records.map((record: any) => record.bankedHours);
    for (let i = 0; i < workedHours.length; i++) {
      if (workedHours.length > 0 && workedHours[i] !== undefined) {
        this.bankedHours.push(workedHours[i]['totalWorkedHoursWithInterval']);
        this.extraHours.push(workedHours[i]['extraHours']);
        this.weekendHours.push(workedHours[i]['extraWeekendHours']);
      };
    };
    this.totalBankedHours = this.sumTimeValues(this.bankedHours);
    this.totalExtraHours = this.sumTimeValues(this.extraHours);
    this.totalWeekendHours = this.sumTimeValues(this.weekendHours);
  };

  formatDate(_date: string) {
    const date = new Date(_date);
    const day = this.padLeadingZero(date.getDate());
    const month = this.padLeadingZero(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  formatTime(_time: string) {
    const time = new Date(_time);
    const hours = this.padLeadingZero(time.getUTCHours());
    const minutes = this.padLeadingZero(time.getUTCMinutes());
    const seconds = this.padLeadingZero(time.getUTCSeconds());
    return `${hours}:${minutes}:${seconds}`;
  }
  
  padLeadingZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }  

  sumTimeValues(timeValues: string[]): string {
    let totalHours = 0;
    let totalMinutes = 0;
  
    // Loop through each time value
    timeValues.forEach(timeValue => {
      const [hours, minutes] = timeValue.split(':').map(Number);
      totalHours += hours;
      totalMinutes += minutes;
    });
  
    // Convert excess minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
  
    // Format the total hours and minutes as "hh:mm"
    const formattedHours = totalHours < 10 ? `0${totalHours}` : `${totalHours}`;
    const formattedMinutes = totalMinutes < 10 ? `0${totalMinutes}` : `${totalMinutes}`;
  
    return `${formattedHours}:${formattedMinutes}`;
  };
};

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(value: any) {
    return value.slice().reverse();
  };
};
