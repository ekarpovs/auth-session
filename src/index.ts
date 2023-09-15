import { Express } from "express";
import session from "express-session";
import passport from "passport";

import { CookieConfig, SessionConfig, initSession } from "./configuration/session";
import { setupPassport } from "./configuration/passport";
import { sessionStorage, StorageConfig } from "./storage/storage";
import { BaseUser } from "./storage/baseUser";
import LocalStrategy from "./strategies/local";
import authRouter from "./core/router";

// reexport 
export { BaseUser };
export type { StorageConfig };
export type { CookieConfig };
export type { SessionConfig };

export { authRouter };

export type AuthConfig = {
  app: Express;
  User: typeof BaseUser;
  storageConfig: StorageConfig;
  sessionConfig: SessionConfig;
};

export const initAuth = (authConfig: AuthConfig): void => {
  
  const store = { store: sessionStorage(authConfig.storageConfig)};

  const sessionOptions = initSession(authConfig.sessionConfig);

  authConfig.app.use(session({...sessionOptions, ...store}));

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
