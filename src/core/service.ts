/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

import { BaseUser } from "../models/baseUser";
import { Token } from "../models/Token";

const saltWorkFactor = Number(process.env.SALT_WORK_FACTOR);

export const changePasswordService = async (email: string, password: string, passwordNew: string) => {

  let user: any = await BaseUser.findOne({ email }); 
  if (!user) throw new Error("the user doesn't exists!");

  // Check credentials
  user.comparePassword(password, (err: any, isMatch: boolean) => {
    if (err) {
      throw new Error("Something wrong with credentials");
    }
    if (!isMatch) {
      throw new Error("User or password incorrect");
    }
  });

  // Change password
  const hash = await bcrypt.hash(passwordNew, saltWorkFactor);
  user = await BaseUser.findOneAndUpdate(
    { email },
    { $set: { password: hash } },
    { new: true }
  );

  const changeParams = {
    email: String(user?.email),
    name: String(user?.name),
  };
  return changeParams;
};

export const resetPasswordRequestService = async (email: string) => {
  const user = await BaseUser.findOne({ email });
  if (!user) throw new Error("the user doesn't exists");
  const resetToken = await createAndStoreResetPasswordToken(user._id);

  const resetRequestParams = {
    name: String(user?.name),
    email: String(user?.email),
    token: resetToken,
    id: user._id,
  };
  return resetRequestParams;
};

const createAndStoreResetPasswordToken = async (id: Types.ObjectId) => {
  // create new reset token
  const token = await Token.findOne({user: id});
  if (token) await token.deleteOne();
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetPasswordToken, saltWorkFactor);

  // save the token 
  await new Token({
    user: id,
    token: hash,
    createdAt: Date.now(),
  }).save();
  return resetPasswordToken;
};

export const resetPasswordService = async (id: string, token: string, password: string) => {
  const passwordResetToken = await validateResetToken(id, token);
  const hash = await bcrypt.hash(password, saltWorkFactor);
  const user = await BaseUser.findOneAndUpdate(
    { _id: id },
    { $set: { password: hash } },
    { new: true }
  );

  await passwordResetToken.deleteOne();
  const resetParams = {
    email: String(user?.email),
    name: String(user?.name),
  };
  return resetParams;
};

const validateResetToken = async (id: string, token: string) => {
  const passwordResetToken = await Token.findOne({ user: id });
  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }
  const isValid = await bcrypt.compare(token, passwordResetToken.token);
  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  const dateNow = Date.now();
  const tokenDate = passwordResetToken.createdAt.getTime();
  const expired = (dateNow - tokenDate) > passwordResetToken.expiresSec*1000;
  if (expired) {
    throw new Error("Invalid or expired password reset token");
  }
  return passwordResetToken;
};