import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from '../controllers/token.controller';
import { TokenService } from '../services/token.service';
import { TokenInfoDto } from '../dtos/token-info.dto';

describe('TokenController', () => {
    let controller: TokenController;
    let service: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TokenController],
            providers: [
                {
                    provide: TokenService,
                    useValue: {
                        getTokenInfo: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<TokenController>(TokenController);
        service = module.get<TokenService>(TokenService);
    });

    it('should get token info', async () => {
        const tokenInfo: TokenInfoDto = { tokenId: 'bitcoin', name: 'Bitcoin', price: 60000, marketCap: 1200000000000 };
        jest.spyOn(service, 'getTokenInfo').mockResolvedValue(tokenInfo);
        const result = await controller.getTokenInfo('test-key');
        expect(result).toEqual(tokenInfo);
    });
});