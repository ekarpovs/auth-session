/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import passport from "passport";

import { setupAuthService } from "./service";

export const setupAuthController = ({ emailer, logger }: any) => {
  logger.info('Setup Auth Controller');
  const srv = setupAuthService({emailer, logger});
  const login = (req: Request, res: Response, next: NextFunction) => {
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
  
  const logout = (req: any, res: Response) => {
    req.session.destroy((error: Error) => {
      if (error) {
        return res.status(500).send({ message: error, success: false });
      }
      return res.status(200).send({ message: "logged Out", success: true });
    });
  };
  
  const register = (req: Request, res: Response, next: NextFunction) => {
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
  
  const changePassword = async (req: Request, res: Response) => {
    const { email, password, passwordNew } = req.body;
    try {
      const emailParams = await srv.changePassword(email, password, passwordNew);
      await sendEmail("changePassword", emailParams);
      return res.status(200).send({ params: emailParams , success: true });
    } catch (error: Error | any) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  const resetPasswordRequest = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const emailParams = await srv.resetPasswordRequest(email);
      await sendEmail("resetPasswordRequest", emailParams);
      return res.status(200).send({ params: emailParams , success: true });
    } catch (error: Error | any) {
      return res.status(500).json({ message: error.message });
    }
  };
  
  const resetPassword = async (req: Request, res: Response) => {
    const { user, token, password } = req.body;
    try {
      const emailParams = await srv.resetPassword(user, token, password);
      await sendEmail("resetPassword", emailParams);
      return res.status(200).send({ params: emailParams , success: true });
    } catch (error: Error | any) {
      return res.status(500).json({ message: error.message });
    }
  };

  const sendEmail = async (name: string, params: any): Promise<void> => {
    if (emailer != undefined) {
      const emailOptions = emailer.buildEmail(name, params);
      await emailer.sendEmail(emailOptions);
    };
  };
  
  return { 
    login, logout, register,
    changePassword,
    resetPasswordRequest, resetPassword 
  };
};

