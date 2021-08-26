import { modelOptions, pre, prop, Severity } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { Node } from '@commons/interfaces/node.interface';
import * as moment from 'moment-timezone';
import { Services } from './dto/tariff-conf.types';

@pre<TariffConf>('save', function (next) {
  this['createdAt'] = moment().tz('America/Santiago').toDate();
  this['updatedAt'] = moment().tz('America/Santiago').toDate();
  next();
})
@pre<TariffConf>('findOneAndUpdate', function () {
  this['_update'].updatedAt = moment().tz('America/Santiago').toDate();
})
@modelOptions({ options: { customName: 'TariffConf', allowMixed: Severity.ALLOW } })
export class TariffConf implements Node {
  _id: ObjectId;

  @prop({ required: true })
  code: number;

  @prop({ required: true })
  description: string;

  @prop({ default: true })
  status: boolean;

  @prop()
  startValidity: Date;

  @prop()
  termValidity: Date;

  @prop()
  services: Services[];

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;
}
