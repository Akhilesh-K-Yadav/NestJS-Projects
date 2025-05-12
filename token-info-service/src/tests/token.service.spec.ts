import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../services/token.service';
import { Repository } from 'typeorm';
import { Key } from '../entities/key.entity';
import { RequestLog } from '../entities/request-log.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TokenService', () => {
    let service: TokenService;
    let keyRepository: Repository<Key>;
    let logRepository: Repository<RequestLog>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TokenService,
                {
                    provide: getRepositoryToken(Key),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(RequestLog),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<TokenService>(TokenService);
        keyRepository = module.get<Repository<Key>>(getRepositoryToken(Key));
        logRepository = module.get<Repository<RequestLog>>(getRepositoryToken(RequestLog));
    });

    it('should return token info for valid key', async () => {
        const key = {
            key: 'test-key',
            rateLimit: 10,
            expiration: Date.now() + 3600000,
            isActive: true,
        };
        jest.spyOn(keyRepository, 'findOneBy').mockResolvedValue(key as any);
        jest.spyOn(logRepository, 'count').mockResolvedValue(0);
        jest.spyOn(logRepository, 'save').mockResolvedValue({} as any);
        const result = await service.getTokenInfo('test-key');
        expect(result.tokenId).toBe('bitcoin');
    });
});