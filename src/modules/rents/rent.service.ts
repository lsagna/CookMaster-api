import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rent } from './entities/rent.entity';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentRepository: Repository<Rent>,
  ) {}
}
