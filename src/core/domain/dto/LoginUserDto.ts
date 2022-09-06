import {IsNotEmpty} from "class-validator";

export default class LoginUserDto {
  @IsNotEmpty()
  phone!: string;

  @IsNotEmpty()
  password!: string;
}
