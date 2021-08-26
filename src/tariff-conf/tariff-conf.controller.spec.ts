import { Test, TestingModule } from '@nestjs/testing';
import { TariffConfController } from './tariff-conf.controller';

describe('TariffConfController', () => {
  let controller: TariffConfController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TariffConfController],
    }).compile();

    controller = module.get<TariffConfController>(TariffConfController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
