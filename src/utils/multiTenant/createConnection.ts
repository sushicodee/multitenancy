import mongoose from 'mongoose';
/**
 * creates a connection to the database without creating a default connection
 */
import configs from './../../configs'
/**
 * 
 * @param mongoUrl for switching database based on dbName
 */
const connect = () =>
    mongoose.createConnection(configs.MONGO_URL, configs.MONGO_OPTIONS);
    const connectToMongoDB = () => {
    console.log('connecting to mongodb');
    // @ts-ignore
    const db = connect(configs.MONGO_URL);
    db.on('open', () => {
        console.log(
        `Mongoose connection open to mongodb`
        );
    });
    db.on('error', (err) => {
        console.log(`Mongoose connection error: ${err} with connection info`);
        process.exit(0);
    });
    return db;
    };
export default connectToMongoDB()
