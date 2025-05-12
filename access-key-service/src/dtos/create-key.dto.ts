import { IsInt, IsPositive, Min } from 'class-validator';

export class CreateKeyDto {
    @IsInt()
    @IsPositive()
    rateLimit: number;

    @IsInt()
    @Min(Date.now())
    expiration: number;
}