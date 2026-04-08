import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
  Min,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { EventType, Paymethod } from "src/domains/entities/Event";

export class ClientDTO {
  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: "john@email.com" })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @ApiProperty({ example: "numero de telefone" })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;
}
export class ProductDTO {
  @ApiProperty({ example: "prod_123" })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(0)
  price!: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title!: string;
  @IsString()
  @ApiProperty()
  @IsOptional()
  description!: string;
}
export default class EventDTO {
  @ApiProperty({ example: "click_abc123" })
  @IsString()
  @IsNotEmpty()
  clickId!: string;

  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  eventType!: EventType;

  @ApiProperty({ example: 150.5 })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({ enum: Paymethod })
  @IsEnum(Paymethod)
  method!: Paymethod;

  @ApiProperty({ type: ClientDTO })
  @ValidateNested()
  @Type(() => ClientDTO)
  client!: ClientDTO;

  @ApiProperty({ type: [ProductDTO] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  products!: ProductDTO[];
}
