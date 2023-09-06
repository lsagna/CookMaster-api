export class Hours {
  startTime: number;
  endTime: number;
}

export class DailySettings {
  status: string;
  openHours: Hours[];
}

export class TimeslotsDTO {
  startDate: Date;
  endDate: Date;
  dailyHours: DailySettings[];
}
