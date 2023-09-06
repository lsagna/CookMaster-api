import { Controller } from '@nestjs/common';
import { RentService } from './rent.service';

@Controller('rents')
export class RentController {
  constructor(private readonly rentService: RentService) {}
}
