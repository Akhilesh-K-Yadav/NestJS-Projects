import { Test, TestingModule } from '@nestjs/testing';
import { KeyService } from '../services/key.service';
import { Repository } from 'typeorm';
import { Key } from '../entities/key.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateKeyDto } from '../dtos/create-key.dto';

describe('KeyService', () => {
    let service: KeyService;
    let repository: Repository<Key>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KeyService,
                {
                    provide: getRepositoryToken(Key),
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<KeyService>(KeyService);
        repository = module.get<Repository<Key>>(getRepositoryToken(Key));
    });

    it('should create a key', async () => {
        const dto: CreateKeyDto = { rateLimit: 10, expiration: Date.now() + 3600000 };
        const key = { key: 'test-key', rateLimit: 10, expiration: dto.expiration, isActive: true };
        jest.spyOn(repository, 'save').mockResolvedValue(key as any);
        const result = await service.createKey(dto);
        expect(result.key).toBeDefined();
        expect(result.rateLimit).toBe(dto.rateLimit);
    });
});