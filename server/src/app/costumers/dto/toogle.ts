import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";

export class ToogleUserDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  userId!: string;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  status!: boolean;
}
