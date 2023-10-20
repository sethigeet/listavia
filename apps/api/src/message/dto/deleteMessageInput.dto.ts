import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DeleteMessageInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  @ApiProperty({
    description: "The id of the message which should be deleted.",
    type: "string",
    minLength: 36,
    maxLength: 36,
  })
  id: string;
}
