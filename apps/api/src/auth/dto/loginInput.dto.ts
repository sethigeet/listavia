import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginInputDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  username: string;

  @Length(3, 255)
  @IsString()
  @IsNotEmpty()
  password: string;
}
