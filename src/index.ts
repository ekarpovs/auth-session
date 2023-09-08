import { Express } from "express";
import session from "express-session";

import { CookieConfig, SessionConfig, initSession } from "./configuration/session";
import { PassportConfig, initPassport } from "./configuration/passport";
import { sessionStorage, StorageConfig } from "./storage/storage";
import { BaseUser } from "./storage/baseUser";

// Types reexport 
export { BaseUser };
export { PassportConfig };
export type { StorageConfig };
export type { CookieConfig };
export type { SessionConfig };

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

  const passportConfig: PassportConfig = {
    app: authConfig.app, 
    User: authConfig.User,
  };

  initPassport(passportConfig);
};
