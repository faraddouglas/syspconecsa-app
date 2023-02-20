import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecordService } from '../records-page/record.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  records: any[] = [];
  postUrl: string = 'https://syspteste.herokuapp.com/api/employee-time-record/'
  constructor(private http: HttpClient, private recordService: RecordService) {}

  postRecords(record: any) {
    return this.http.post<any>(this.postUrl, record);
  }

  putRecord(record: any, id: any) {
    return this.http.put<any>(this.postUrl + id, record);
  }

  async getLastId(): Promise<any> {
    const records = await lastValueFrom(await this.recordService.getRecords());
    const lastRecord = records[records.length - 1];
    return lastRecord.id;
  }
}
