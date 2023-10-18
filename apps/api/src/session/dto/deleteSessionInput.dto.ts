import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DeleteSessionInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  id: string;
}
