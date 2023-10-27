import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Preferences, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Address } from './entities/address.entity';
import { Roles } from '../authentication/enum/roles.enum';
import { RefreshToken } from './entities/refresh-token.entity';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(RefreshToken)
    private readonly tokenRepository: Repository<RefreshToken>,
    private readonly configS: ConfigService,
  ) {}

  async getAll(relations: string[] = []) {
    return await this.userRepository.find({
      relations: relations,
    });
  }

  async getById(id: number, relations: string[] = []): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: relations,
    });

    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    return user;
  }

  async getWithPassword(email: string): Promise<User> {
    const user: User = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', {
        email: email,
      })
      .getOne();
    if (!user)
      throw new NotFoundException(`User with email: ${email} not found`);

    return user;
  }

  async create(userDto: CreateUserDto, role: Roles): Promise<User> {
    const newUser = new User();
    const preferences = new Preferences();
    newUser.firstname = userDto.firstname;
    newUser.lastname = userDto.lastname;
    newUser.email = userDto.email;
    userDto.password = await hash(userDto.password, 10);
    newUser.password = userDto.password;
    newUser.role = role;
    preferences.darkMode = false;
    preferences.lang = 'fr-FR';
    preferences.notifications = true;
    preferences.updates = true;
    newUser.preferences = preferences;
    newUser.interactions = [];

    return this.userRepository.save(newUser);
  }

  async update(id: number, userDto: UpdateUserDto): Promise<User> {
    const user: User = await this.getById(id);
    let address: Address = new Address();

    if (user.address && userDto.address) {
      user.address.street = userDto.address.street;
      user.address.apartment = userDto.address.apartment;
      user.address.zip = userDto.address.zip;
      user.address.city = userDto.address.city;
      user.address.country = userDto.address.country;
      await this.addressRepository.save(user.address);
    }
    if (!user.address && userDto.address) {
      address.street = userDto.address.street;
      address.apartment = userDto.address.apartment;
      address.zip = userDto.address.zip;
      address.city = userDto.address.city;
      address.country = userDto.address.country;
      address = await this.addressRepository.save(address);
    }

    user.firstname = userDto.firstname ?? user.firstname;
    user.lastname = userDto.lastname ?? user.lastname;
    user.address = address ?? user.address;
    user.preferences = userDto.preferences ?? user.preferences;
    user.shoppingCart = userDto.shoppingCart ?? user.shoppingCart;

    return this.userRepository.save(user);
  }

  async isEmailExist(email: string): Promise<boolean> {
    const user: User = await this.userRepository.findOne({
      where: { email: email },
    });
    return !!user;
  }

  async getByEmail(email: string, relations: string[] = []): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { email: email },
      relations: relations,
    });

    if (!user)
      throw new NotFoundException(`User with email: ${email} not found`);

    return user;
  }

  async updateRefreshToken(id: number): Promise<RefreshToken> {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: ['refreshToken'],
    });

    const expiredAt = new Date();
    const refreshTokenUUID = uuidv4();

    expiredAt.setSeconds(
      expiredAt.getSeconds() +
        this.configS.get<number>('JWT_REFRESH_EXPIRATION'),
    );

    const refreshToken: RefreshToken = new RefreshToken();
    refreshToken.refreshKey = refreshTokenUUID.toString();
    refreshToken.expireAt = expiredAt.getTime();

    if (user.refreshToken) {
      refreshToken.id = user.refreshToken.id;
    }

    user.refreshToken = refreshToken;
    await this.tokenRepository.save(refreshToken);
    await this.userRepository.save(user);

    return refreshToken;
  }

  async updateAvatar(id: number, avatar: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ avatar: avatar })
      .where('id = :id', { id: id })
      .execute();
  }
}
