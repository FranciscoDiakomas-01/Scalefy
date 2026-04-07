import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from "class-validator";

export default class RegisterDto {
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
  @ApiProperty({
    description: "The password of the user",
    example: "P@ssw0rd!",
  })
  @IsStrongPassword()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
