import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export default class CreateAskQuestionRequest {
  @IsNotEmpty()
  @IsNumber()
  receiver_id!: number;

  @IsNotEmpty()
  @IsNumber()
  product_id!: number;

  @IsNotEmpty()
  @IsString()
  message!: string;
}
