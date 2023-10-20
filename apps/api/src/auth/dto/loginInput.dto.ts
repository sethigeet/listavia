import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginInputDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The username with which you want to login with.",
    type: "string",
    minLength: 3,
    maxLength: 30,
  })
  username: string;

  @Length(3, 255)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "The password for the given username.",
    type: "string",
    minLength: 3,
    maxLength: 255,
  })
  password: string;
}
