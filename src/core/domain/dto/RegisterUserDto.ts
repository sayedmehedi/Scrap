import {IsNotEmpty} from 'class-validator';

export default class RegisterUserDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
