import { IsNotEmpty, IsEmail, IsString, IsObject } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly firstname: string;

    @IsString()
    @IsNotEmpty()
    readonly lastname: string;

	@IsString()
    @IsNotEmpty()
	password: string;

	@IsString()
    @IsNotEmpty()
	readonly email: string;
}
