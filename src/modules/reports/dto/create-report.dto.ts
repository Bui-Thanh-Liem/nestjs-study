import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1886) // Năm đầu tiên của ô tô
  @Max(new Date().getFullYear() + 1) // Năm hiện tại + 1
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}
