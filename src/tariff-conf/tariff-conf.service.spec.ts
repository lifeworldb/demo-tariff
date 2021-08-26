import { Test, TestingModule } from '@nestjs/testing';
import { TariffConfService } from './tariff-conf.service';

describe('TariffConfService', () => {
  let service: TariffConfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TariffConfService],
    }).compile();

    service = module.get<TariffConfService>(TariffConfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
