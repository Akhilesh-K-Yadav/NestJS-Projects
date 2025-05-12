import { Controller, Get, Query } from '@nestjs/common';
import { TokenService } from '../services/token.service';
import { TokenInfoDto } from '../dtos/token-info.dto';

@Controller('tokens')
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Get()
    async getTokenInfo(@Query('key') key: string): Promise<TokenInfoDto> {
        return this.tokenService.getTokenInfo(key);
    }
}