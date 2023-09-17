/* eslint-disable @typescript-eslint/no-explicit-any */
import { Express } from "express";
import session from "express-session";
import passport from "passport";

import { CookieConfig, SessionConfig, initSession } from "./configuration/session";
import { checkAuthenticated, setupPassport } from "./configuration/passport";
import { BaseUser } from "./models/baseUser";
import LocalStrategy from "./strategies/local";
import authRouter from "./core/router";

// reexport 
export { BaseUser };
export type { CookieConfig };
export type { SessionConfig };

export { authRouter };
export { checkAuthenticated };

export type AuthConfig = {
  app: Express;
  User: typeof BaseUser | any;
  sessionConfig: SessionConfig;
  storage?: any;
  emailer?: any;
  logger?: any;
};

let emailClient: any;
export const emailer = (): any => {
  return emailClient;
};

let extLogger: any;
export const logger = (): any => {
  return extLogger; 
};

export const initAuth = (authConfig: AuthConfig): void => {
  
  emailClient = authConfig.emailer;
  extLogger = authConfig.logger;

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
};
