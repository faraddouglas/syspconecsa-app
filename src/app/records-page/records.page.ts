import { Component, OnInit } from '@angular/core';
import { RecordService } from './record.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-records',
  templateUrl: 'records.page.html',
  styleUrls: ['records.page.scss'],
})
export class RecordsPage implements OnInit {
  constructor(private recordService: RecordService) {}

  records: any = [];
  user: any = localStorage.getItem('user');
  hasInterval = JSON.parse(this.user).hasInterval;
  workedHours: never | string[] = [];
  extraHours: never | string[] = [];
  weekendHours: never | string[] = [];
  outstandingHours: never | string[] = [];
  totalBankedHours = {
    totalWorkedHours: '00:00',
    totalExtraHours: '00:00',
    totalWeekendHours: '00:00',
    totalOutstandingHours: '00:00',
  };
  selectedInterval = 'week';
  interval = {
    startDate: this.formatDate(new Date()).split('/').reverse().join('-'),
    endDate: this.formatDate(new Date()).split('/').reverse().join('-'),
  };

  ngOnInit() {
    this.getRecordsByInterval(this.selectedInterval);
  }

  async getRecordsByInterval(interval: string) {
    this.records = await this.recordService.getRecords();

    // Filter records based on selected interval
    const currentDate = new Date();
    let startDate: Date | string;
    let endDate: Date;
    switch (interval) {
      case 'week':
        startDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = new Date(currentDate.getTime());
        this.selectedInterval = 'week';
        this.records = this.records.filter(
          (record: { date: string | number | Date }) => {
            const recordDate = new Date(record.date);
            return recordDate > startDate && recordDate <= endDate;
          }
        );
        break;
      case 'month':
        this.selectedInterval = 'month';
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
        this.selectedInterval = 'year';
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
        this.selectedInterval = 'custom';
        startDate = new Date(this.interval.startDate);
        endDate = new Date(this.interval.endDate);
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
    this.getBankedHours();
  }

  async getBankedHours() {
    const bankedHours = await Promise.all(
      this.records.map((record: { bankedHours: any }) => record.bankedHours)
    );

    this.totalBankedHours.totalWorkedHours = this.sumTimeValues(
      bankedHours.map((hours) => hours?.totalWorkedHours ?? '00:00')
    );

    const extraHours = bankedHours
      .filter((hours) => hours?.extraHours)
      .map((hours) => hours.extraHours);
    const weekendHours = bankedHours
      .filter((hours) => hours?.extraWeekendHours)
      .map((hours) => hours.extraWeekendHours);
    const outstandingHours = bankedHours
      .filter((hours) => hours?.outstandingHours)
      .map((hours) => hours.outstandingHours);

    const totalExtraHours = this.sumTimeValues(extraHours);
    const totalWeekendHours = this.sumTimeValues(weekendHours);
    const totalOutstandingHours = this.sumTimeValues(outstandingHours);

    if (
      this.selectedInterval === 'week' &&
      this.timestringToTimestamp(this.totalBankedHours.totalWorkedHours) >
        44 * 60 * 60
    ) {
      const relativeExtraHours =
        this.timestringToTimestamp(totalExtraHours) -
        this.timestringToTimestamp(totalOutstandingHours);
      if (relativeExtraHours > 0) {
        this.totalBankedHours.totalExtraHours =
          this.timestampToTimestring(relativeExtraHours);
      } else {
        this.totalBankedHours.totalExtraHours = '00:00';
      }
      const relativeWeekendHours =
        this.timestringToTimestamp(totalWeekendHours) -
        this.timestringToTimestamp(totalOutstandingHours);
      if (relativeWeekendHours > 0) {
        this.totalBankedHours.totalWeekendHours =
          this.timestampToTimestring(relativeWeekendHours);
      } else {
        this.totalBankedHours.totalWeekendHours = '00:00';
      }
      const relativeOutstandingHours =
        this.timestringToTimestamp(totalOutstandingHours) -
        this.timestringToTimestamp(totalOutstandingHours) -
        this.timestringToTimestamp(totalExtraHours) -
        this.timestringToTimestamp(totalWeekendHours);
      if (relativeOutstandingHours > 0) {
        this.totalBankedHours.totalOutstandingHours =
          this.timestampToTimestring(relativeOutstandingHours);
      } else {
        this.totalBankedHours.totalOutstandingHours = '00:00';
      }
    } else if (
      this.selectedInterval === 'month' &&
      this.timestringToTimestamp(this.totalBankedHours.totalWorkedHours) >
        176 * 60 * 60
    ) {
      const relativeExtraHours =
        this.timestringToTimestamp(totalExtraHours) -
        this.timestringToTimestamp(totalOutstandingHours);
      if (relativeExtraHours > 0) {
        this.totalBankedHours.totalExtraHours =
          this.timestampToTimestring(relativeExtraHours);
      } else {
        this.totalBankedHours.totalExtraHours = '00:00';
      }
      const relativeWeekendHours =
        this.timestringToTimestamp(totalWeekendHours) -
        this.timestringToTimestamp(totalOutstandingHours);
      if (relativeWeekendHours > 0) {
        this.totalBankedHours.totalWeekendHours =
          this.timestampToTimestring(relativeWeekendHours);
      } else {
        this.totalBankedHours.totalWeekendHours = '00:00';
      }
      const relativeOutstandingHours =
        this.timestringToTimestamp(totalOutstandingHours) -
        this.timestringToTimestamp(totalOutstandingHours) -
        this.timestringToTimestamp(totalExtraHours) -
        this.timestringToTimestamp(totalWeekendHours);
      if (relativeOutstandingHours > 0) {
        this.totalBankedHours.totalOutstandingHours =
          this.timestampToTimestring(relativeOutstandingHours);
      } else {
        this.totalBankedHours.totalOutstandingHours = '00:00';
      }
    } else if (
      this.selectedInterval === 'year' &&
      this.timestringToTimestamp(this.totalBankedHours.totalWorkedHours) >
        2112 * 60 * 60
    ) {
      const relativeExtraHours =
        this.timestringToTimestamp(totalExtraHours) -
        this.timestringToTimestamp(totalOutstandingHours);
      if (relativeExtraHours > 0) {
        this.totalBankedHours.totalExtraHours =
          this.timestampToTimestring(relativeExtraHours);
      } else {
        this.totalBankedHours.totalExtraHours = '00:00';
      }
      const relativeWeekendHours =
        this.timestringToTimestamp(totalWeekendHours) -
        this.timestringToTimestamp(totalOutstandingHours);
      if (relativeWeekendHours > 0) {
        this.totalBankedHours.totalWeekendHours =
          this.timestampToTimestring(relativeWeekendHours);
      } else {
        this.totalBankedHours.totalWeekendHours = '00:00';
      }
      const relativeOutstandingHours =
        this.timestringToTimestamp(totalOutstandingHours) -
        this.timestringToTimestamp(totalOutstandingHours) -
        this.timestringToTimestamp(totalExtraHours) -
        this.timestringToTimestamp(totalWeekendHours);
      if (relativeOutstandingHours > 0) {
        this.totalBankedHours.totalOutstandingHours =
          this.timestampToTimestring(relativeOutstandingHours);
      } else {
        this.totalBankedHours.totalOutstandingHours = '00:00';
      }
    } else {
      this.totalBankedHours.totalExtraHours = totalExtraHours;
      this.totalBankedHours.totalWeekendHours = totalWeekendHours;
      this.totalBankedHours.totalOutstandingHours = totalOutstandingHours;
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
