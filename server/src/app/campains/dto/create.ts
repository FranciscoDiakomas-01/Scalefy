import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
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
}
