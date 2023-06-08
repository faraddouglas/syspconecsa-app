import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Record } from '../app/iterfaces/record.interface';
import { Interval } from '../app/iterfaces/banked-hours.interface';
import { Enterprise } from 'src/app/iterfaces/enterprise.interface';
import { User } from 'src/app/iterfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class RecordService {
  user: User = JSON.parse(localStorage.getItem('user') || '{}');
  enterprise: Enterprise = JSON.parse(
    localStorage.getItem('enterprise') || '{}'
  );
  records: Record[] = [];
  getRecordsFromUserUrl = `https://syspteste.herokuapp.com/api/employee-time-record/
      ${this.enterprise.companyId}/${this.user.userId}`;
  token = localStorage.getItem('token');

  workedHours: never | string[] = [];
  extraHours: never | string[] = [];
  weekendHours: never | string[] = [];
  outstandingHours: never | string[] = [];
  interval: Interval = {
    startDate: '',
    endDate: '',
  };

  constructor(private http: HttpClient) {}

  async getRecords() {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      Conection: 'keep-alive',
      Accept: '*/*',
    });
    return lastValueFrom(
      this.http.get<Record[]>(this.getRecordsFromUserUrl, { headers: headers })
    );
  }

  async getRecordsByInterval(filter: Event | string, interval?: Interval) {
    this.records = await this.getRecords();
    this.interval = interval || this.interval;

    // Filter records based on selected interval
    const currentDate = new Date();
    let startDate: Date | string;
    let endDate: Date;
    switch (filter) {
      case 'week':
        startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = new Date(currentDate.getTime());
        this.records = this.records.filter(
          (record: { date: string | number | Date }) => {
            const recordDate = new Date(record.date);
            return recordDate > startDate && recordDate <= endDate;
          }
        );
        break;
      case 'month':
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1
        );
        endDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        this.records = this.records.filter(
          (record: { date: string | number | Date }) => {
            const recordDate = new Date(record.date);
            return recordDate > startDate && recordDate <= endDate;
          }
        );
        break;
      case 'year':
        startDate = new Date(
          currentDate.getFullYear() - 1,
          currentDate.getMonth(),
          currentDate.getDate() + 1
        );
        this.records = this.records.filter(
          (record: { date: string | number | Date }) => {
            const recordDate = new Date(record.date);
            return recordDate > startDate && recordDate <= currentDate;
          }
        );
        break;
      // If interval is not 'week', 'month', or 'year', assume it's a specific date range
      default:
        startDate = new Date(String(this.interval.startDate));
        endDate = new Date(String(this.interval.endDate));
        this.records = this.records.filter(
          (record: { date: string | number | Date }) => {
            const recordDate = new Date(record.date);
            return (
              recordDate > startDate &&
              recordDate <=
                new Date(
                  endDate.getFullYear(),
                  endDate.getMonth(),
                  endDate.getDate() + 2
                )
            );
          }
        );
        break;
    }
    return this.records;
  }

  setInterval(interval: { startDate: string; endDate: string }) {
    this.interval = interval;
  }
}
