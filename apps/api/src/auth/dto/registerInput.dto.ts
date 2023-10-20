import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class RegisterInputDto {
  @IsString()
  @Length(3, 30)
  @ApiProperty({
    description: "The username with which you want to login with.",
    type: "string",
    minLength: 3,
    maxLength: 30,
  })
  username: string;

  @IsString()
  @Length(3, 255)
  @ApiProperty({
    description: "The password for the given username.",
    type: "string",
    minLength: 3,
    maxLength: 255,
  })
  password: string;
}
