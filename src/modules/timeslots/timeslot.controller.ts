import { Controller } from '@nestjs/common';
import { TimeslotService } from './timeslot.service';

@Controller('timeslots')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}
}
