import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecordService } from '../records-page/record.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  records: [] = [];
  postUrl: string = 'https://syspteste.herokuapp.com/api/employee-time-record/';
  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    Authorization: `Bearer ${this.token}`,
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Conection: 'keep-alive',
    Accept: '*/*',
  });
  constructor(private http: HttpClient, private recordService: RecordService) {}

  postRecords(record: object) {
    return this.http.post<any>(this.postUrl, record, { headers: this.headers });
  }

  putRecord(record: object, companyId: number, userId: number, id: number) {
    return this.http.put<string>(
      `${this.postUrl}${companyId}/${userId}/${id}`,
      record,
      { headers: this.headers }
    );
  }

  async getLastId(): Promise<number> {
    const records: [] = await this.recordService.getRecords();
    const idList: any = records.map((record: any) => record.id);
    let lastId = 0;
    idList.forEach((id: number) => {
      while (id > lastId) {
        lastId = id;
      }
    });
    return lastId;
  }
}
