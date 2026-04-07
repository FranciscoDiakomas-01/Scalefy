import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export default class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: "Email to auth",
  })
  email!: string;
  @IsNotEmpty()
  @ApiProperty({
    description: "Password to auth",
  })
  password!: string;
}
