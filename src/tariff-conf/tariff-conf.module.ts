import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { TariffConfService } from './tariff-conf.service';
import { TariffConfController } from './tariff-conf.controller';
import { TariffConf } from './tariff-conf.model'

@Module({
  imports: [TypegooseModule.forFeature([TariffConf])],
  providers: [TariffConfService],
  controllers: [TariffConfController]
})
export class TariffConfModule {}
