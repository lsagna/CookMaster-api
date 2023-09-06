import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timeslot } from './entities/timeslot.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TimeslotsDTO } from './dto/timeslot.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TimeslotService {
  constructor(
    @InjectRepository(Timeslot)
    private readonly timeslotRepository: Repository<Timeslot>,
    private readonly userService: UsersService,
  ) {}

  async getTimeslotById(id: number): Promise<Timeslot> {
    return this.timeslotRepository.findOne({
      where: { id: id },
      relations: ['booking'],
    });
  }

  async getTimeslots(where?: FindOptionsWhere<Timeslot>): Promise<Timeslot[]> {
    return this.timeslotRepository.find({
      where,
      relations: ['booking'],
    });
  }

  async update(timeslots: Timeslot[]): Promise<Timeslot[]> {
    return this.timeslotRepository.save(timeslots);
  }

  async create(
    timeslotsSettings: TimeslotsDTO,
    userId: number,
  ): Promise<Timeslot[]> {
    const creator = await this.userService.getById(userId);
    const newTimeslots = [];
    let currentDate = timeslotsSettings.startDate;
    while (currentDate < timeslotsSettings.endDate) {
      const day = currentDate.getDay();
      const daySetting = timeslotsSettings.dailyHours[day];

      daySetting.openHours.forEach((element) => {
        const startTime = element.startTime;
        const endTime = element.endTime;

        while (startTime < endTime) {
          const newTimeslot = new Timeslot();
          newTimeslot.date = new Date(startTime);
          newTimeslot.creator = creator;
        }
      });
      currentDate = new Date(currentDate.getTime() + 86400000);
    }
  }
}
