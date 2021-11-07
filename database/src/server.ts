import express from 'express';
import { User } from './types/user';
import bodyParser from 'body-parser';
import { Environment } from './env/env';
import { Logger } from './logging/logger';
import { Schema, model, connect } from 'mongoose';

const logger = new Logger('server');
const env = new Environment();
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String
});
const UserModel = model<User>('User', schema);
if (env.validKeys()) {
  const server = express();
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());

  run().catch((err) => {
    logger.error('main', 'Something happened :(', err);
  });

  server.post('/', (req, res) => {
    logger.log('main', `Receive POST request - ${req.url}`);
  });

  server.listen(env.DB_STORE_PORT, () => {
    logger.log('main', `Server is up and listening on port: ${env.DB_STORE_PORT}`);
  });
}

async function run(): Promise<void> {
  const url = 'mongodb://mongodb:27017';
  await connect(url);

  const doc = new UserModel({
    name: 'my name',
    email: 'my email',
    avatar: 'my avatar'
  });
  await doc.save();
  logger.log('run', doc.email);
}