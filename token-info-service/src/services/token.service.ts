import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Key } from '../entities/key.entity';
import { RequestLog } from '../entities/request-log.entity';
import { TokenInfoDto } from '../dtos/token-info.dto';
import { Redis } from 'ioredis';

@Injectable()
export class TokenService {
    private redis: Redis;

    constructor(
        @InjectRepository(Key)
        private keyRepository: Repository<Key>,
        @InjectRepository(RequestLog)
        private logRepository: Repository<RequestLog>,
    ) {
        this.redis = new Redis({ host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) });
    }

    async getTokenInfo(key: string): Promise<TokenInfoDto> {
        // Validate key
        const keyEntity = await this.keyRepository.findOneBy({ key, isActive: true });
        if (!keyEntity) throw new HttpException('Invalid or inactive key', HttpStatus.UNAUTHORIZED);
        if (keyEntity.expiration < Date.now()) throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);

        // Check rate limit
        const oneMinuteAgo = Date.now() - 60 * 1000;
        const requestCount = await this.logRepository.count({
            where: { key, timestamp: MoreThanOrEqual(oneMinuteAgo), success: true },
        });
        if (requestCount >= keyEntity.rateLimit) throw new Error('Rate limit exceeded');

        // Log request
        await this.logRepository.save({ key, timestamp: Date.now(), success: true });

        // Mock token info
        return {
            tokenId: 'bitcoin',
            name: 'Bitcoin',
            price: 60000,
            marketCap: 1200000000000,
        };
    }
}