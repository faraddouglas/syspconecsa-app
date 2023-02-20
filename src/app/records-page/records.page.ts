import { Component, OnInit } from '@angular/core';
import { RecordService } from './record.service';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-records',
  templateUrl: 'records.page.html',
  styleUrls: ['records.page.scss']
})
export class RecordsPage implements OnInit {
  constructor(private recordService: RecordService) {}
  records: any = [];

  ngOnInit() {
    this.loadRecords();
  }

  async loadRecords(){
    this.records = await lastValueFrom(await this.recordService.getRecords());
  }
}
