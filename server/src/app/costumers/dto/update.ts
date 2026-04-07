import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export default class UpdateCostumerDTO {
  @ApiProperty({
    description: "The name of the user",
    example: "John Doe",
  })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name!: string;
  @ApiProperty({
    description: "The email address of the user",
    example: "",
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
