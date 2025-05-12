import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class UpdateKeyDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    rateLimit?: number;

    @IsOptional()
    @IsInt()
    @Min(Date.now())
    expiration?: number;
}