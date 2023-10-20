import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class GetMessagesInputDto {
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
}
