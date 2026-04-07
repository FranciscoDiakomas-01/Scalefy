import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from "class-validator";
import { GetaWayProvider } from "src/infra/Payments/type";

export class CreateSubscriptionDto {
  @ApiProperty({
    description: "ID do plano",
    example: "plan_1234567890",
  })
  @IsUUID()
  @IsNotEmpty()
  planId!: string;
  @ApiProperty({
    description: "metodo de pagamento",
    example: "REFERENCE",
    enum: GetaWayProvider,
  })
  @IsNotEmpty()
  @IsEnum(GetaWayProvider)
  method!: GetaWayProvider;

  @IsEmpty()
  @IsOptional()
  @ApiHideProperty()
  userId!: string;
}
