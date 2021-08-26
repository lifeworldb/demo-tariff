import { Controller, Inject } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { GrpcMethod } from '@nestjs/microservices';
import { IResponse } from '@commons/interfaces/response.interface';
import { TAllArgs } from '@commons/types/args.types';
import { NewTariff, TariffValidity } from './dto/tariff.types';
import { TariffService } from './tariff.service';
import { Tariff } from './tariff.model';

/**
 * Controller of gRPC services for Tariff services.
 */
@Controller('tariff')
export class TariffController {
  /**
   * The constructor of the class receives by injection the service to be invoked and the instance of the logger.
   * @param service Injection of the service instance.
   * @param logger Injection of the logger instance.
   */
  constructor(
    @Inject(TariffService)
    private readonly service: TariffService,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(TariffController.name);
  }

  /**
   * Controller method in charge of invoking the create method in the injected service.
   *
   * This invocation will be generated by a call from the gRPC client.
   * @param data Data received from the client which correspond to the NewTariff structure
   * @return Promise<IResponse> Returns a response of type IResponse to indicate the resulting status.
   */
  @GrpcMethod('TariffService')
  async create(data: NewTariff): Promise<IResponse> {
    this.logger.info('TariffController#create.call %o', data);
    return this.service.create(data);
  }

  /**
   * Controller method in charge of invoking the tariffs method in the injected service.
   *
   * This invocation will be generated by a call from the gRPC client.
   * @param data Data received from the client which correspond to the TAllArgs type
   * @return Promise<{ tariffs: Tariff[] }> Returns an object with an array of rate settings.
   */
  @GrpcMethod('TariffService')
  async tariffs(data: TAllArgs): Promise<{ tariffs: Tariff[] }> {
    this.logger.info('TariffController#tariffs.call %o', data);
    const res = await this.service.allTariff(data);
    return Promise.resolve({ tariffs: res });
  }

  /**
   * Controller method in charge of invoking the createValidity method in the injected service.
   *
   * This invocation will be generated by a call from the gRPC client.
   * @param data Data received from the client which correspond to the TariffValidity structure
   * @return Promise<IResponse> Returns a response of type IResponse to indicate the resulting status.
   */
  @GrpcMethod('TariffService')
  async createValidity(data: TariffValidity): Promise<IResponse> {
    this.logger.info('TariffController#createValidity.call %o', data);
    return this.service.createValidity(data);
  }
}