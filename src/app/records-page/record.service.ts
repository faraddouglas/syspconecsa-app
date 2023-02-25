import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  records: any[] = [];
  getRecordsUrl = 'https://syspteste.herokuapp.com/api/employee-time-record'
  token = localStorage.getItem('token');


  constructor(private http: HttpClient) {}

  async getRecords() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Conection': 'keep-alive',
      'Accept': '*/*'
    });
    return lastValueFrom( this.http.get<any>(this.getRecordsUrl, {headers: headers}))
  };
}
