import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { BooleanTrue } from '../../common/validator/boolean-validator';

export class CreateSubscriptionPayload {
  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    required: true,
  })
  @IsBoolean()
  @BooleanTrue('true')
  consent: boolean;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiPropertyOptional({
    required: false,
  })
  firstName: string;

  @ApiPropertyOptional({
    required: false,
  })
  gender: string;
}
