import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateMessageInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  @ApiProperty({
    description: "The id of the session to which this message should belong to.",
    type: "string",
    minLength: 36,
    maxLength: 36,
  })
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ description: "The content of the message.", type: "string", maxLength: 255 })
  msg: string;
}
