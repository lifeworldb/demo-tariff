import { ObjectId } from 'mongodb';

export type TAllArgs = {
  skip: number;
  take: number;
};

export type TIdArg = {
  id: ObjectId;
};
