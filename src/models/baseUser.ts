import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR) || 10;

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

export type hookCallback = (error?: Error | null, flag?: boolean | undefined) => void;

BaseUserSchema.pre("save", function (next: hookCallback) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  // hash the password
  bcrypt.hash(this.password, SALT_WORK_FACTOR, (error, hash) => {
    if (error) return next(error);
    // override the cleartext password with the hashed one
    this.password = hash;
    next();
  });
});

BaseUserSchema.methods.comparePassword = async function (
  password: string,
  cb: hookCallback
): Promise<void> {
  bcrypt.compare(password, this.password, (error: Error | undefined, isMatch: boolean) => {
    if (error) return cb(error);
    cb(null, isMatch);
  });
};

export const BaseUser = model("BaseUser", BaseUserSchema);

