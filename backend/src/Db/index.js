import mongoose from 'mongoose';

async function ConnectDB() {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);

    if (connection.host) {
      console.log(`Database connected successfully`);
    }
  } catch (error) {
    console.log('Failed to connect with database', error);
    process.exit(1);
  }
}

export default ConnectDB;
