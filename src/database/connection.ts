import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
const uri = process.env.MONGO_URI || '';

export const connectDB = async () => {
	try {
		const connection = await mongoose.connect(uri);

		console.log(`MongoDb connected: ${connection.connection.host}`);
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
};

export const disconnectDB = async () => {
	await mongoose.connection.close();
};
