import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DeleteMessageInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  id: string;
}
