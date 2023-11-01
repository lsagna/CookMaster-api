import { Room } from 'src/modules/establishments/entities/establishment.entity';
import { Timeslot } from '../entities/timeslot.entity';

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
  room: Room;
}

export class TimeslotsUpdateDTO {
  timeslots: Timeslot[];
}
