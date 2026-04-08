import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MinLength,
} from "class-validator";

export default class TrackerDTO {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    title: "Id da campanha",
  })
  campainsId!: string;
  @IsNotEmpty()
  @ApiProperty({
    title: "Título do trackeador",
  })
  @MinLength(3)
  title!: string;
  @ApiHideProperty()
  @IsEmpty()
  @IsOptional()
  key!: string;
  @ApiHideProperty()
  @IsEmpty()
  @IsOptional()
  url!: string;
}
