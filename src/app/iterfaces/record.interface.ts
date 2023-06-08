import { BankedHours } from './banked-hours.interface';

export interface Record {
  id: string | number;
  userId: string | number;
  companyId: string | number;
  employee: string;
  date: string | number | Date;
  checkInTime: string | number | Date;
  startInterval: string | number | Date;
  endInterval: string | number | Date;
  checkOutTime: string | number | Date;
  bankedHours: BankedHours;
}

export interface RecordToPost {
  userId: string | null;
  companyId: string | null;
  employee: string | null;
  date: string | null;
  checkInTime: string | null;
  startInterval: string | null;
  endInterval: string | null;
  checkOutTime: string | null;
}
