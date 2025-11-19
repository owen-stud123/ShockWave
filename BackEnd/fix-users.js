// fix-users.js
import mongoose from 'mongoose';
import User from './models/userModel.js';
import 'dotenv/config';

await mongoose.connect(process.env.MONGO_URI);

const users = await User.find({});
for (const user of users) {
  if (!user.email && user.username) {
    user.email = user.username.toLowerCase() + '@temp.com';
    await user.save();
    console.log('Fixed:', user.name);
  }
}

console.log('Done');
process.exit();
