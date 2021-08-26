import { ObjectId } from 'mongodb';

export abstract class Node {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
