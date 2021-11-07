import { User } from '../types/user';
import { Logger } from '../logging/logger';
import { Schema, model, connect } from 'mongoose';

export class DBStore {
  private readonly logger = new Logger('server');
  private schema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String
  });
  private UserModel = model<User>('User', this.schema);

  constructor(url: string) {
    connect(url);
  }

  public write(user: User): void {
    this.logger.log('write', `Received write request: ${JSON.stringify(user)}`);
    const doc = new this.UserModel({
      name: user.name,
      email: user.email,
      avatar: user.avatar
    });
    doc.save();
  }
}