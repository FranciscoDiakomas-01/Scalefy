import { ApiProperty } from "@nestjs/swagger";
import {
  IsJWT,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
} from "class-validator";

export default class ResetPasswordDto {
  @ApiProperty({
    description: "Token enviado para o email do usuário para resetar a senha",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  })
  @IsJWT()
  token!: string;
  @ApiProperty({
    description: "A nova senha para o usuário",
    example: "NewPassword123!",
  })
  @IsStrongPassword()
  @IsNotEmpty()
  @MaxLength(255)
  newPassword!: string;
}
