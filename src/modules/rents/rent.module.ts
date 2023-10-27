import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import { TimeslotModule } from '../timeslots/timeslot.module';
import { UsersModule } from '../users/users.module';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent]),
    forwardRef(() => TimeslotModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [RentController],
  providers: [RentService],
  exports: [RentService],
})
export class RentModule {}
