import mongoose, { Document, Schema } from 'mongoose';

// Interface สำหรับ User
interface IUser extends Document {
  username: string;
  password: string;
}

// สร้าง Schema สำหรับ User
const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// สร้างโมเดล User
const User = mongoose.model<IUser>('User', userSchema);

export default User;
