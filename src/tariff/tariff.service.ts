import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { PinoLogger } from 'nestjs-pino';
import { InjectModel } from 'nestjs-typegoose';
import { TAllArgs } from '@commons/types/args.types';
import { IResponse } from '@commons/interfaces/response.interface';
import { DevelopResponse } from '@commons/enums';
import { Tariff } from './tariff.model';
import { NewTariff, TariffValidity } from './dto/tariff.types';

/**
 * Container class of the applicable methods on the Tariff model.
 *
 * This class contains all the methods that can be called by the gRPC controller.
 */
@Injectable()
export class TariffService {
  /**
   * The class constructor receives by injection the model to which it will be used and the logger instance.
   * @param model Injection of the mongo model.
   * @param logger Injection of the logger instance.
   */
  constructor(
    @InjectModel(Tariff)
    private readonly model: ReturnModelType<typeof Tariff>,
    private readonly logger: PinoLogger
  ) {
    logger.setContext(TariffService.name);
  }

  /**
   * Method in charge of returning all the created tariffs.
   * The method receives by parameter the amount of tariffs to take and the amount of tariffs to skip.
   * @param take amount of tariffs to be taken.
   * @param skip amount of tariffs that will be skipped.
   */
  async allTariff({ take, skip }: TAllArgs = { take: 0, skip: 0 }): Promise<Tariff[]> {
    return await this.model.find().limit(take).skip(skip);
  }

  /**
   * Method in charge of creating a tariff.
   * The method receives by parameter the description or name that the tariff will carry.
   * @param description description that will identify the tariff.
   */
  async create({ description }: NewTariff): Promise<IResponse> {
    return new Promise(async (resolve) => {
      await this.model.countDocuments({ description: description }, async (err, count) => {
        if (err) {
          this.logger.error(err);
          return resolve({
            message: err.message,
            developerCode: DevelopResponse.INTERNAL_ERROR
          });
        }

        if (count > 0)
          return resolve({
            message: 'There is already a tariff with the same description, which you want to register.',
            developerCode: DevelopResponse.ERROR_QUERY
          });
        else {
          const tariffs = await this.model.countDocuments();
          this.model
            .create({ description, code: tariffs > 0 ? tariffs + 1 : 1 })
            .then(() => {
              return resolve({
                message: 'The tariff has been created successfully.',
                developerCode: DevelopResponse.SUCCESS_QUERY
              });
              // Todo: Call Valorizador
            })
            .catch((err) => {
              this.logger.error(err);
              return resolve({
                message: 'An ocurred error.',
                developerCode: DevelopResponse.INTERNAL_ERROR
              });
            });
        }
      });
    });
  }

  /**
   * Method in charge of generating a new validity for a tariff.
   * The method receives by parameters the tariff code and the data of the new validity.
   * @param code tariff identification code.
   * @param validity new validation to enter the tariff.
   */
  async createValidity({ code, validity }: TariffValidity): Promise<IResponse> {
    return new Promise(async (resolve) => {
      await this.model.findOneAndUpdate(
        { code: code },
        {
          $push: {
            validity: {
              start: validity.start,
              end: validity.end,
              timezoneOffset: 1
            }
          }
        },
        (err) => {
          if (err) {
            this.logger.error(err);
            return resolve({
              message: 'An error occurred while trying to update tariff data.',
              developerCode: DevelopResponse.INTERNAL_ERROR
            });
          }

          return resolve({
            message: 'The validity has been updated.',
            developerCode: DevelopResponse.SUCCESS_QUERY
          });
        }
      );
    });
  }
}
