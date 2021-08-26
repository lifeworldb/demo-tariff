import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from 'nestjs-typegoose';
import { TAllArgs } from '@commons/types/args.types';
import { IResponse } from '@commons/interfaces/response.interface';
import { DevelopResponse } from '@commons/enums';
import { TariffConf } from './tariff-conf.model';
import { NewTariffConf } from './dto/tariff-conf.types';

/**
 * Container class of the applicable methods on the Tariff Configuration model.
 *
 * This class contains all the methods that can be called by the gRPC controller.
 */
@Injectable()
export class TariffConfService {
  /**
   * The class constructor receives by injection the model to which it will be used and the logger instance.
   * @param model Injection of the mongo model.
   * @param logger Injection of the logger instance.
   */
  constructor(
    @InjectModel(TariffConf)
    private readonly model: ReturnModelType<typeof TariffConf>,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(TariffConfService.name);
  }

  /**
   * Method in charge of returning all the created tariffs Configuration.
   *
   * The method receives by parameter the amount of tariffs configuration to take and the amount of tariffs to skip.
   * @param take amount of tariffs configuration to be taken.
   * @param skip amount of tariffs configuration that will be skipped.
   * @return Promise<TariffConf[]> Returns an array of tariff configuration settings.
   */
  async allTariffConf({ take, skip }: TAllArgs = { take: 0, skip: 0 }): Promise<TariffConf[]> {
    return await this.model.find().limit(take).skip(skip);
  }

  /**
   * Method in charge of validating the business logic before generating a new record.
   * @param data Data structure required for the creation of a record.
   * @return Promise<IResponse> Returns a response of type IResponse to indicate the resulting status.
   */
  async create(data: NewTariffConf): Promise<IResponse> {
    return new Promise(async (resolve) => {
      if (data.code !== null || data.code) {
        await this.model.countDocuments({ code: data.code, termValidity: null }, async (err, count) => {
          if (err) {
            this.logger.error(err);
            return resolve({
              message: err.message,
              developerCode: DevelopResponse.INTERNAL_ERROR
            });
          }

          if (count > 0) {
            await this.model.findOneAndUpdate(
              {
                code: data.code,
                termValidity: null
              },
              { termValidity: new Date() },
              { new: true }
            );

            return resolve(await this.createConf(data));
          } else {
            const tariffConf = await this.model.countDocuments();
            return resolve(await this.createConf({ ...data, code: tariffConf > 0 ? tariffConf + 1 : 1 }));
          }
        });
      } else {
        const tariffConf = await this.model.countDocuments();
        return resolve(await this.createConf({ ...data, code: tariffConf > 0 ? tariffConf + 1 : 1 }));
      }
    });
  }

  /**
   * Method in charge of creating a configuration of a tariff.
   *
   * This method is only responsible for generating the record in the database.
   * @param data Data structure required for the creation of a record.
   * @private
   * @return Promise<IResponse> Returns a response of type IResponse to indicate the resulting status.
   */
  private createConf(data: NewTariffConf): Promise<IResponse> {
    return new Promise(async (resolve) => {
      await this.model.create(
        {
          ...data
        },
        (err) => {
          if (err) {
            this.logger.error(err);
            return resolve({
              message: 'An error occurred while trying to update tariff conf data.',
              developerCode: DevelopResponse.INTERNAL_ERROR
            });
          }

          return resolve({
            message: 'The tariff conf has been updated.',
            developerCode: DevelopResponse.SUCCESS_QUERY
          });
        }
      );
    });
  }
}
