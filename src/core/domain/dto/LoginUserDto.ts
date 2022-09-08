import {IsNotEmpty} from "class-validator";

export default class LoginUserDto {
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  password!: string;
}
