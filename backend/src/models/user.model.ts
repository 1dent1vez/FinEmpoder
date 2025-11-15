// backend/src/models/user.model.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    name: { type: String },
    career: { type: String },
    age: { type: Number },
    phone: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model('User', userSchema);
