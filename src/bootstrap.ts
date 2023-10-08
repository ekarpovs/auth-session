/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";

import { CookieConfig, SessionConfig, initSession } from "./configuration/session";
import { setupPassport } from "./configuration/passport";

import { BaseUser } from "./models/baseUser";
import LocalStrategy from "./strategies/local";
import { setupAuthRouter } from "./core/router";

// reexport 
export { BaseUser };
export type { CookieConfig };
export type { SessionConfig };

export type AuthConfig = {
  app: Express;
  User: typeof BaseUser | any;
  sessionConfig: SessionConfig;
  storage?: any;
  emailer?: any;
  logger?: any;
};

export const initAuth = (authConfig: AuthConfig) => {
  
  const emailer = authConfig.emailer;
  const logger: any = authConfig.logger;

  const sessionOptions = initSession(authConfig.sessionConfig);

  authConfig.app.use(session({...sessionOptions, ...authConfig.storage}));

  setupPassport(authConfig.User);

  LocalStrategy.init(passport, authConfig.User);

  // init passport on every route call
  authConfig.app.use(passport.initialize());
  // passport.session has to be used after 
  // express.session in order to work properly.
  // allow passport to use "express-session"
  authConfig.app.use(passport.session());
  // passport function that calls the strategy to be executed
  authConfig. app.use(passport.authenticate('session'));

  const authRouter = setupAuthRouter({emailer, logger});

  const isAuthenticated = (req: Request ,res: Response, next: NextFunction): Response | void => {
  /**
   * If the user is already authenticated and the browser already has a session id 
   * then upon request the deSerializeUser function will be called first, 
   * it will retrieve the user from the session and add it to 
   * req.user and pass to isAuthenticated function.
   * If the user is already authenticated in isAuthenticated function (req.user exist) 
   * then go to next function which will be /api/user route.
   * Otherwise, redirect to homepage.         * 
   */
    if(req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
  };

  return { authRouter, isAuthenticated };
};
