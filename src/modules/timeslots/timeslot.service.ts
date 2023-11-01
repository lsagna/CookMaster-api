import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Timeslot } from './entities/timeslot.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TimeslotsDTO, TimeslotsUpdateDTO } from './dto/timeslot.dto';
import { UsersService } from '../users/users.service';
import { elementAt } from 'rxjs';

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
      relations: ['rent'],
    });
  }

  async getTimeslots(where?: FindOptionsWhere<Timeslot>): Promise<Timeslot[]> {
    return this.timeslotRepository.find({
      where,
      relations: ['rent'],
    });
  }

  async update(timeslotsUpdateDTO: TimeslotsUpdateDTO): Promise<Timeslot[]> {
    return this.timeslotRepository.save(timeslotsUpdateDTO.timeslots);
  }

  async create(timeslotsSettings: TimeslotsDTO): Promise<Timeslot[]> {
    const newTimeslots = [];
    let currentDate = timeslotsSettings.startDate;
    while (currentDate < timeslotsSettings.endDate) {
      const day = currentDate.getDay();
      const daySetting = timeslotsSettings.dailyHours[day];

      if (daySetting.status === 'OPEN') {
        daySetting.openHours.forEach((element) => {
          let startTime = element.startTime;
          const endTime = element.endTime;

          while (startTime < endTime) {
            const newTimeslot = new Timeslot();
            newTimeslot.date = new Date(startTime);
            newTimeslots.push(newTimeslot);
            startTime = startTime + 1800000;
          }
        });
      }
      currentDate = new Date(currentDate.getTime() + 86400000);
    }
    return this.timeslotRepository.save(newTimeslots);
  }

  async delete(): Promise<void> {
    const limitDate = new Date();
    const timeslots = await this.getTimeslots();
    const ids = [] as number[];
    timeslots.forEach((timeslot) => {
      if (timeslot.date < limitDate) ids.push(timeslot.id);
    });

    this.timeslotRepository
      .createQueryBuilder()
      .delete()
      .from(Timeslot)
      .where({ id: ids })
      .execute();
  }
}
