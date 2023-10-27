import { Module, forwardRef } from '@nestjs/common';
import { Timeslot } from './entities/timeslot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { TimeslotController } from './timeslot.controller';
import { TimeslotService } from './timeslot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Timeslot]), forwardRef(() => User)],
  controllers: [TimeslotController],
  providers: [TimeslotService],
  exports: [TimeslotService],
})
export class TimeslotModule {}
