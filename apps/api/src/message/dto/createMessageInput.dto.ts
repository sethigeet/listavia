import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateMessageInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  msg: string;
}
