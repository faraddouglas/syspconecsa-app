import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  user: any = localStorage.getItem('user');
  userId = JSON.parse(this.user).userId;
  companyId = JSON.parse(this.user).companyId;
  records: any[] = [];
  getRecordsFromUserUrl = `https://syspteste.herokuapp.com/api/user-records?companyId=${this.companyId}&userId=${this.userId}`;
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
}
