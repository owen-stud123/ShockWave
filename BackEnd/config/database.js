import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    console.error('\n💡 Make sure MongoDB is running!');
    console.error('   - Windows: Run "net start MongoDB" or start mongod.exe manually');
    console.error('   - Install MongoDB from: https://www.mongodb.com/try/download/community\n');
    process.exit(1);
  }
};

export default connectDB;