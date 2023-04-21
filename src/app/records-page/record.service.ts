import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  user: any = localStorage.getItem('user');
  records: any[] = [];
  getRecordsFromUserUrl = 
    `https://syspteste.herokuapp.com/api/user-records?companyId=
      ${JSON.parse(this.user).companyId}&userId=${JSON.parse(this.user).userId}`;
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
    return lastValueFrom( this.http.get<any>(this.getRecordsFromUserUrl, { headers: headers }))
  };
};
