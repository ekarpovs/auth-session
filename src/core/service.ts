/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "node:crypto";
import { Types } from "mongoose";

import { BaseUser } from "../models/baseUser";
import { cryptUtils } from "../utils/utils";
import { Token } from "../models/Token";

export const setupAuthService = ({logger}: any) => {
  const crypt = cryptUtils();
  logger.info('Setup Auth Service');

  const changePassword = async (email: string, password: string, passwordNew: string) => {
  
    const user: any = await BaseUser.findOne({ email }); 
    if (!user) throw new Error("the user doesn't exists!");
  
    // Check credentials
    if (!await crypt.compare(password, user.password)) {
      throw new Error("Something wrong with credentials");
    };
  
    // Change password
    const hash = await crypt.hash(passwordNew);
    const updatedUser = await BaseUser.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true }
    );
  
    const changeParams = {
      email: String(updatedUser?.email),
      name: String(updatedUser?.name),
    };
    return changeParams;
  };
  
  const resetPasswordRequest = async (email: string) => {
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
    const hash = await crypt.hash(resetPasswordToken);
  
    // save the token 
    await new Token({
      user: id,
      token: hash,
      createdAt: Date.now(),
    }).save();
    return resetPasswordToken;
  };
  
  const resetPassword = async (id: string, token: string, password: string) => {
    const passwordResetToken = await validateResetToken(id, token);
    const hash = await crypt.hash(password);
    const user = await BaseUser.findOneAndUpdate(
      { _id: id },
      { password: hash },
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
    const isValid = await crypt.compare(token, passwordResetToken.token);
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
    
  return { 
    changePassword,
    resetPasswordRequest,
    resetPassword,
  };
};

