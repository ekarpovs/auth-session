import { Schema, model } from "mongoose";

const baseOptions = {
  discriminatorKey: '__type',
  collection: 'users'
};

const BaseUserSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
}, baseOptions);

export const BaseUser = model("BaseUser", BaseUserSchema);

