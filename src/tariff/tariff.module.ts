import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TariffController } from './tariff.controller';
import { TariffService } from './tariff.service';
import { Tariff } from './tariff.model';

@Module({
  imports: [TypegooseModule.forFeature([Tariff])],
  controllers: [TariffController],
  providers: [TariffService]
})
export class TariffModule {}
