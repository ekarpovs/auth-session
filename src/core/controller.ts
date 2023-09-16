/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { 
  changePasswordService,
  resetPasswordRequestService,
  resetPasswordService
} from "./service";

import { emailer } from "../bootstrap";

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local-login",
    (error: Error, user: any, info: any): any => {
      if (error) {
        return res.status(403).json(error);
      }
      if (!user) {
        return res.status(404).send(info);
      }
      req.logIn(user, (error) => {
        if (error) {
          return next(error);
        }
        return res.send(user);
      });
    }
  )(req, res, next);
};

export const logout = (req: any, res: Response) => {
  req.session.destroy((error: Error) => {
    if (error) {
      return res.status(500).send({ message: error, success: false });
    }
    return res.status(200).send({ message: "logged Out", success: true });
  });
};

export const register = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local-register",
    (error: Error, user: any, info: any) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        return res.send(info);
      }
      return res.send(user);
    }
  )(req, res, next);
};

export const changePassword = async (req: Request, res: Response) => {
  const { email, password, passwordNew } = req.body;
  try {
    const emailParams = await changePasswordService(email, password, passwordNew);
    // const emailOptions = buildEmailOptions("changePassword", emailParams);
    // await sendEmail(emailOptions);
    return res.status(200).send({ params: emailParams , success: true });
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPasswordRequest = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const emailParams = await resetPasswordRequestService(email);
    await sendEmail("resetPasswordRequest", emailParams);
    return res.status(200).send({ params: emailParams , success: true });
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { user, token, password } = req.body;
  try {
    const emailParams = await resetPasswordService(user, token, password);
    await sendEmail("resetPassword", emailParams);
    return res.status(200).send({ params: emailParams , success: true });
  } catch (error: Error | any) {
    return res.status(500).json({ message: error.message });
  }
};

const sendEmail = async (name: string, params: any) => {
  if (emailer != undefined) {
    const emailClient = emailer();
    const emailOptions = emailClient.buildEmail(name, params);
    await emailClient.sendEmail(emailOptions);
  };
};