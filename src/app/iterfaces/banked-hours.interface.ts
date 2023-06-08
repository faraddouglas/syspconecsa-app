export interface BankedHours {
  totalWorkedHours: string;
  extraHours: string;
  extraWeekendHours: string;
  outstandingHours: string;
}

export interface Interval {
  startDate: Event | string;
  endDate: Event | string;
}
