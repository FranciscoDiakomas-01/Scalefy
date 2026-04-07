import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsNumber,
  Min,
  IsEnum,
} from "class-validator";
import { PlanDurationType } from "src/domains/entities/Plans";

export default class PlanDTO {
  @ApiProperty({
    example: "Plano Pro",
    description: "Nome do plano",
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    example: "Plano com funcionalidades avançadas",
    description: "Descrição do plano",
  })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: ["Feature 1", "Feature 2"],
    description: "Lista de funcionalidades do plano",
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  features!: string[];

  @ApiProperty({
    example: 100,
    description: "Preço do plano (mínimo 0)",
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    example: "MONTHLY",
    description: "Duração do plano",
    enum: PlanDurationType,
  })
  @IsEnum(PlanDurationType)
  duration!: PlanDurationType;

  @ApiProperty({
    example: 10,
    description: "Máximo de campanhas (0 = ilimitado)",
  })
  @IsNumber()
  @Min(0)
  maxCapains!: number;

  @ApiProperty({
    example: 5,
    description: "Máximo de trackers (0 = ilimitado)",
  })
  @IsNumber()
  @Min(0)
  maxTrackers!: number;
}
