import { Component, OnInit } from '@angular/core';
import { RecordService } from '../../services/record.service';
import { Pipe, PipeTransform } from '@angular/core';
import { Record } from '../iterfaces/record.interface';
import { User } from '../iterfaces/user.interface';
import { Interval } from '../iterfaces/banked-hours.interface';
import { BankedHours } from '../iterfaces/banked-hours.interface';

@Component({
  selector: 'app-records',
  templateUrl: 'records.page.html',
  styleUrls: ['records.page.scss'],
})
export class RecordsPage implements OnInit {
  constructor(private recordService: RecordService) {}

  records: Record[] = [];
  user: User = JSON.parse(localStorage.getItem('user') || '{}');
  hasInterval = this.user.hasInterval;

  filter: Event | string = 'week';
  interval: Interval = {
    startDate: this.formatDate(new Date()).split('/').reverse().join('-'),
    endDate: this.formatDate(new Date()).split('/').reverse().join('-'),
  };

  bankedHours: BankedHours = {
    totalWorkedHours: '00:00',
    extraHours: '00:00',
    extraWeekendHours: '00:00',
    outstandingHours: '00:00',
  };

  ngOnInit() {
    this.getRecordsByInterval();
  }

  async getRecordsByInterval() {
    await this.recordService
      .getRecordsByInterval(this.filter, this.interval)
      .then((records) => {
        this.records = records;
      })
      .then(() => {
        this.getBankedHours(this.filter);
      });
  }

  async getBankedHours(filter: Event | string) {
    // Filter records based on selected interval
    const currentDate = new Date();
    let startDate: Date | string;
    let endDate: Date;
    switch (filter) {
      case 'week':
        startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = new Date(currentDate.getTime());
        this.filter = 'week';
        this.records = this.records.filter(
          (record: { date: string | number | Date }) => {
            const recordDate = new Date(record.date);
            return recordDate > startDate && recordDate <= endDate;
          }
        );
        break;
      case 'month':
        this.filter = 'month';
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
        this.filter = 'year';
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
        this.filter = 'custom';
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
    this.calculateBankedHours();
  }

  async calculateBankedHours() {
    const bankedHours = await Promise.all(
      this.records.map((record: { bankedHours: any }) => record.bankedHours)
    );

    this.bankedHours.totalWorkedHours = this.sumTimeValues(
      bankedHours.map((hours) => hours?.totalWorkedHours ?? '00:00')
    );

    const extraHours = this.getValidHours(bankedHours, 'extraHours');
    const weekendHours = this.getValidHours(bankedHours, 'extraWeekendHours');
    const outstandingHours = this.getValidHours(bankedHours, 'outstandingHours');

    const totalExtraHours = this.sumTimeValues(extraHours);
    const totalWeekendHours = this.sumTimeValues(weekendHours);
    const totalOutstandingHours = this.sumTimeValues(outstandingHours);

    this.bankedHours.extraHours = this.calculateRelativeHours(
      totalExtraHours,
      totalOutstandingHours
    );
    this.bankedHours.extraWeekendHours = this.calculateRelativeHours(
      totalWeekendHours,
      totalOutstandingHours
    );
    this.bankedHours.outstandingHours = this.calculateRelativeHours(
      totalOutstandingHours
    );

    this.updateExtraHours();
    this.updateOutstandingHours();
  }

  getValidHours(bankedHours: any[], propertyName: string) {
    return bankedHours
      .filter((hours) => hours?.[propertyName])
      .map((hours) => hours[propertyName]);
  }

  calculateRelativeHours(hours: string, subtractHours: string = '00:00') {
    const relativeHours =
      this.timestringToTimestamp(hours) -
      this.timestringToTimestamp(subtractHours);

    return relativeHours > 0 ? this.timestampToTimestring(relativeHours) : '00:00';
  }

  updateExtraHours() {
    const totalWorkedHours = this.timestringToTimestamp(this.bankedHours.totalWorkedHours);

    if (this.filter === 'week' && totalWorkedHours < 44 * 60 * 60) {
      this.bankedHours.extraHours = '00:00';
      this.bankedHours.extraWeekendHours = '00:00';
    } else if (this.filter === 'month' && totalWorkedHours < 176 * 60 * 60) {
      this.bankedHours.extraHours = '00:00';
      this.bankedHours.extraWeekendHours = '00:00';
    } else if (this.filter === 'year' && totalWorkedHours < 2112 * 60 * 60) {
      this.bankedHours.extraHours = '00:00';
      this.bankedHours.extraWeekendHours = '00:00';
    }
  }

  updateOutstandingHours() {
    const totalWorkedHours = this.timestringToTimestamp(this.bankedHours.totalWorkedHours);

    if (this.filter === 'week' && totalWorkedHours > 44 * 60 * 60) {
      this.bankedHours.outstandingHours = '00:00';
    } else if (this.filter === 'month' && totalWorkedHours > 176 * 60 * 60) {
      this.bankedHours.outstandingHours = '00:00';
    } else if (this.filter === 'year' && totalWorkedHours > 2112 * 60 * 60) {
      this.bankedHours.outstandingHours = '00:00';
    }
  }

  timestringToTimestamp(timestring: string) {
    const time = timestring.split(':');
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);
    return hours * 60 * 60 + minutes * 60;
  }

  timestampToTimestring(timestamp: number) {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp - hours * 3600) / 60);
    return `${this.padLeadingZero(hours)}:${this.padLeadingZero(minutes)}`;
  }

  formatDate(_date: string | number | Date) {
    const date = new Date(_date);
    const day = this.padLeadingZero(date.getDate());
    const month = this.padLeadingZero(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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
    timeValues.forEach((timeValue) => {
      const [hours, minutes] = timeValue.split(':').map(Number);
      totalHours += hours;
      totalMinutes += minutes;
    });

    // Convert excess minutes to hours
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    // Format the total hours and minutes as "hh:mm"
    const formattedHours = totalHours < 10 ? `0${totalHours}` : `${totalHours}`;
    const formattedMinutes =
      totalMinutes < 10 ? `0${totalMinutes}` : `${totalMinutes}`;

    return `${formattedHours}:${formattedMinutes}`;
  }
}

@Pipe({ name: 'reverse' })
export class ReversePipe implements PipeTransform {
  transform(value: any) {
    return value.slice().reverse();
  }
}
