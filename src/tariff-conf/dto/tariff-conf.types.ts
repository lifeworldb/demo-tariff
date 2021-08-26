import { ObjectId } from 'mongodb';

/**
 * Data structure interface that define a service
 */
export interface Services {
  id: ObjectId;
  code: number;
  description: string;
  netWorth: number;
  netValueTariff: number;
  totalValue: number;
}

/**
 * Data structure interface required to create a tariff configuration.
 */
export interface NewTariffConf {
  code: number;
  description: string;
  netWorth: number;
  netValueTariff: number;
  totalValue: number;
  startValidity: Date;
  services: Services[];
}
