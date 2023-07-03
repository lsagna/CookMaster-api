import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllEvents(
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Event[]> {
    if (relation) relations.push(relation);
    return await this.eventsService.getAll(relations);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getEvent(
    @Param() req,
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Event> {
    if (relation) relations.push(relation);
    return await this.eventsService.getById(req.id, relations);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async createEvent(
    @Body() eventDto: CreateEventDto,
    @Param('id') id: number,
  ): Promise<Event> {
    return this.eventsService.create(eventDto, id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateEvent(
    @Param('id') id: number,
    @Body() eventDto: CreateEventDto,
  ): Promise<Event> {
    return this.eventsService.update(id, eventDto);
  }

  @Put('/book:id')
  @HttpCode(HttpStatus.OK)
  async bookEvent(@Req() req, @Param('id') id: number): Promise<Event> {
    return this.eventsService.newAttendee(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Req() req, @Param('id') id: number): Promise<void> {
    return this.eventsService.delete(req.user.id, id);
  }
}
