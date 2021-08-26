import { modelOptions, pre, prop, Severity } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Node } from '@commons/interfaces/node.interface';
import { FinancingCode, TariffType, Validity } from './dto/tariff.types';
import * as moment from 'moment-timezone';

@pre<Tariff>('save', function (next) {
  this['createdAt'] = moment().tz('America/Santiago').toDate();
  this['updatedAt'] = moment().tz('America/Santiago').toDate();
  next();
})
@pre<Tariff>('findOneAndUpdate', function () {
  this['_update'].updatedAt = moment().tz('America/Santiago').toDate();
})
@modelOptions({ options: { customName: 'Tariffs', allowMixed: Severity.ALLOW } })
export class Tariff implements Node {
  _id: ObjectId;

  @prop({ required: true })
  code: number;

  @prop({ required: true })
  description: string;

  @prop({ default: 3 })
  holding: number;

  @prop({
    default: {
      name: 'Preferente',
      code: 4
    }
  })
  tariffType: TariffType;

  @prop({
    default: {
      code: 0,
      gloss: 'Default'
    }
  })
  financingCode: FinancingCode;

  @prop({ default: 3 })
  tariffRef: number;

  @prop({ default: [] })
  validity: Validity[];

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;
}
