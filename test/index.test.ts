import { describe, test } from '@jest/globals';
import express, { Express } from 'express';

import { 
  AuthConfig,
  BaseUser,
  CookieConfig,
  SessionConfig,
} from '../src';


describe("Auth with session config test", () => {

  test("Has to prepare the package configuration", async ()=> {
    const app: Express = express();

    const cookieConfig: CookieConfig = {
      secure: "false",
      sameSite: "lax",
      httpOnly: "true",
      maxAge: "3600000",
    };

    const sessionConfig: SessionConfig = {
      name: "",
      secret: "",
      saveUninitialized: "false",
      cookie: cookieConfig,
      resave: "false"
    };

    const authConfig: AuthConfig = {
      app: app,
      storage: undefined,
      User: BaseUser,
      sessionConfig: sessionConfig,
    };

    console.log(authConfig);
  });
});