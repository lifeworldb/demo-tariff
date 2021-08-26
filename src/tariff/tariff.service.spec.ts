import { Test, TestingModule } from '@nestjs/testing';
import { TariffService } from './arancel.service';

describe('ArancelService', () => {
  let service: TariffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TariffService],
    }).compile();

    service = module.get<TariffService>(TariffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
