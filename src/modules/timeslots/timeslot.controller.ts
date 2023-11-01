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
} from '@nestjs/common';
import { TimeslotsDTO, TimeslotsUpdateDTO } from './dto/timeslot.dto';
import { Timeslot } from './entities/timeslot.entity';
import { TimeslotService } from './timeslot.service';

@Controller('timeslots')
export class TimeslotController {
  constructor(private readonly timeslotService: TimeslotService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts(
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Timeslot[]> {
    if (relation) relations.push(relation);
    return await this.timeslotService.getTimeslots();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProduct(
    @Param() req,
    @Query('relations') relations: string[] = [],
    @Query('relation') relation: string,
  ): Promise<Timeslot> {
    if (relation) relations.push(relation);
    return await this.timeslotService.getTimeslotById(req.id);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async createProduct(
    @Param() req,
    @Body() timeslotsDto: TimeslotsDTO,
  ): Promise<Timeslot[]> {
    return this.timeslotService.create(timeslotsDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: number,
    @Body() timeslotsUpdateDTO: TimeslotsUpdateDTO,
  ): Promise<Timeslot[]> {
    return this.timeslotService.update(timeslotsUpdateDTO);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(): Promise<void> {
    return this.timeslotService.delete();
  }
}
