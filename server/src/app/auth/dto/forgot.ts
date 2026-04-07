import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsOptional } from "class-validator";

export default class ForgotDto {
  @ApiProperty({
    description: "The email of the user",
    example: "user@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
  @IsEmpty()
  @IsOptional()
  metadata!: Record<string, string>;
}
