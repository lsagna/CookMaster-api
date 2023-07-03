import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly configS: ConfigService,
  ) {}

  async getAll(relations: string[] = []): Promise<Event[]> {
    return await this.eventRepository.find({
      relations: relations,
    });
  }

  async getById(id: number, relations: string[] = []): Promise<Event> {
    const event: Event = await this.eventRepository.findOne({
      where: { id: id },
      relations: relations,
    });

    if (!event) throw new NotFoundException(`Course with id: ${id} not found`);
    return event;
  }

  async create(eventDto: CreateEventDto, userId: number): Promise<Event> {
    const newEvent = new Event();
    const user = await this.userService.getById(userId);
    newEvent.startTime = eventDto.startTime;
    newEvent.duration = eventDto.duration;
    newEvent.description = eventDto.description;
    newEvent.maxAttendees = eventDto.maxAttendees;
    newEvent.remainingTickets = eventDto.maxAttendees;
    newEvent.address = eventDto.address;
    newEvent.host = user;
    newEvent.attendees = [];

    return this.eventRepository.save(newEvent);
  }

  async update(eventId: number, eventDto: CreateEventDto): Promise<Event> {
    const event = await this.getById(eventId);
    const newRemainingTickets = this.newRemainingTicketCalc(
      event.attendees.length,
      eventDto.maxAttendees ?? event.maxAttendees,
    );
    event.startTime = eventDto.startTime ?? event.startTime;
    event.duration = eventDto.duration ?? event.duration;
    event.description = eventDto.description ?? event.description;
    event.maxAttendees = eventDto.maxAttendees ?? event.maxAttendees;
    event.remainingTickets = newRemainingTickets ?? event.remainingTickets;
    event.address = eventDto.address ?? event.address;
    return this.eventRepository.save(event);
  }

  async newAttendee(eventId: number, userId: number): Promise<Event> {
    const event = await this.getById(eventId);
    const user = await this.userService.getById(userId);
    event.attendees.push(user);
    event.remainingTickets = event.remainingTickets - 1;
    return this.eventRepository.save(event);
  }

  async delete(userId: number, eventId: number) {
    const user: User = await this.userService.getById(userId);
    const event: Event = await this.getById(eventId);

    if (user.id !== event.host.id) {
      throw new ForbiddenException("Can't delete the animal of someone else!");
    }

    await this.eventRepository.delete(eventId);
  }

  newRemainingTicketCalc(
    attendeesNumber: number,
    newMaxTickets: number,
  ): number {
    return newMaxTickets - attendeesNumber;
  }
}
