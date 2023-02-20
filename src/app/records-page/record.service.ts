import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  records: any[] = [];
  getRecordsUrl = 'https://syspteste.herokuapp.com/api/employee-time-record'
  constructor(private http: HttpClient) {}

  async getRecords() {
    return this.http.get<any>(this.getRecordsUrl);
  }
}
