export interface IMongoOptions  {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  useCreateIndex: boolean;
  useFindAndModify: boolean;
  autoIndex: boolean;
  poolSize: number,
  bufferMaxEntries: number,
  connectTimeoutMS: number,
  socketTimeoutMS: number,
}

export interface IAdmin {
  username:string;
  password:string;
}

export interface EnvConfig {
    environment: string;
    PORT:string;
    MONGO_URL:string;
    JWT_SECRET:string;
    JWT_SECRET_ADMIN:string;
    MONGO_OPTIONS:IMongoOptions
    ADMIN:IAdmin
}

//common
export type ICallback = <T>(err:Error | null,done:T) =>void;