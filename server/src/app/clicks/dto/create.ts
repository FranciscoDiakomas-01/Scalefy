import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateClickDto {
  @ApiProperty({
    description: "ID do tracker",
    example: "tracker_123",
  })
  @IsString()
  trackerId!: string;

  @ApiPropertyOptional({
    description: "UTM source",
    example: "facebook",
  })
  @IsOptional()
  @IsString()
  utm_source?: string;

  @ApiPropertyOptional({
    description: "UTM medium",
    example: "ads",
  })
  @IsOptional()
  @IsString()
  utm_medium?: string;

  @ApiPropertyOptional({
    description: "UTM campaign",
    example: "blackfriday",
  })
  @IsOptional()
  @IsString()
  utm_campaign?: string;

  @ApiPropertyOptional({
    description: "UTM content",
    example: "banner1",
  })
  @IsOptional()
  @IsString()
  utm_content?: string;

  @ApiPropertyOptional({
    description: "Referrer do cliente",
  })
  @IsOptional()
  @IsString()
  referrer?: string;

  @ApiPropertyOptional({
    description: "User agent",
  })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
