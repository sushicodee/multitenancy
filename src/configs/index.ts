import developmentConfig from './development.json';
import { EnvConfig } from './types';
import Dotenv from 'dotenv';
Dotenv.config();
let configs
//for production
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10,
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
};
if (process.env.NODE_ENV === 'production') {
  const productionConfig = {
    environment:"production",
    host: 'localhost',
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN || 'adminSecret',
    MONGO_URL: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.fdomo.mongodb.net/hapi-db-test?retryWrites=true&w=majority`,
    MONGO_OPTIONS : mongoOptions,
    //server admin
    ADMIN:{
      username:process.env.ADMIN_USERNAME,
      password:process.env.ADMIN_PASSWORD
    }
  }
  configs = productionConfig 
} else {
  configs = developmentConfig 
}
export default configs as EnvConfig
