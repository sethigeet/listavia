import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class DeleteSessionInputDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID("4")
  @ApiProperty({
    description: "The id of the session which should be deleted.",
    type: "string",
    minLength: 36,
    maxLength: 36,
  })
  id: string;
}
