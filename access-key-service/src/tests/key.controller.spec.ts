import { Test, TestingModule } from '@nestjs/testing';
import { KeyController } from '../controllers/key.controller';
import { KeyService } from '../services/key.service';
import { CreateKeyDto } from '../dtos/create-key.dto';

describe('KeyController', () => {
    let controller: KeyController;
    let service: KeyService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [KeyController],
            providers: [
                {
                    provide: KeyService,
                    useValue: {
                        createKey: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<KeyController>(KeyController);
        service = module.get<KeyService>(KeyService);
    });

    it('should create a key', async () => {
        const dto: CreateKeyDto = { rateLimit: 10, expiration: Date.now() + 3600000 };
        const key = { key: 'test-key', rateLimit: 10, expiration: dto.expiration, isActive: true };
        jest.spyOn(service, 'createKey').mockResolvedValue(key);
        const result = await controller.createKey(dto);
        expect(result).toEqual(key);
    });
});