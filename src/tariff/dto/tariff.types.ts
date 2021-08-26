import { ObjectId } from 'mongodb';

export interface TariffType {
  name: string;
  code: number;
}

export interface FinancingCode {
  code: number;
  gloss: string;
}

export interface Validity {
  start: Date;
  end: Date;
  timezoneOffset: number;
}

export interface NewTariff {
  description: string;
}

export interface TariffValidity {
  code: number;
  validity: {
    start: Date;
    end: Date;
  };
}
