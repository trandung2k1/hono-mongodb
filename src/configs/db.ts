import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {});
    console.log('Connect MongoDB successfully!!');
  } catch (error: any) {
    console.log(error);
    console.error('Connect MongoDB failed!!');
    process.exit(1);
  }
};

process.on('SIGINT', async (): Promise<void> => {
  console.log('You are performing a server shutdown!');
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
