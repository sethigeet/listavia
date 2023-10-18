import { IsString, Length } from "class-validator";

export class RegisterInputDto {
  @IsString()
  @Length(3, 30)
  username: string;

  @IsString()
  @Length(3, 255)
  password: string;
}
