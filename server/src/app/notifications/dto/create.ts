import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export default class CampainsDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  @ApiProperty()
  title!: string;
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  funilUrl!: string;
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  investment!: number;
}
