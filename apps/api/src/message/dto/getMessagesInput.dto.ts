import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetMessagesInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  sessionId: string;
}
