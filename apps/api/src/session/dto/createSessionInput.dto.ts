import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateSessionInputDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;
}
