## Authentication with session

A auth with express session and passport, - a solution for Nodejs applications.

<p>
  <a href="https://www.npmjs.com/package/@ekarpovs/auth-session" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@ekarpovs/auth-session.svg">
  </a>
  <a href="https://github.com/ekarpovs/auth-session#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/ekarpovs/auth-session/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/ekarpovs/auth-session/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

### Installation
```bash
  npm install @ekarpovs/auth-session
```
### Usage
#### Optional: extend user model, 
```
  // for example two property are added (isSuperAdmin and phone):
import { Schema } from "mongoose";

import { BaseUser } from "../lib/auth-session";


export interface UserInterface {
  isSuperAdmin: boolean;
  phone?: string;
}

const UserSchema = new Schema<UserInterface>({
  isSuperAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  phone: {
    type: String,
    required: false,
  },
}, {collection: 'users'});

export const User = BaseUser.discriminator("user", UserSchema);
```
#### Initialize:
```
  import express, { Express } from 'express';

  import { 
    AuthConfig,
    BaseUser,
    CookieConfig,
    SessionConfig,
  } from '@ekarpovs/auth-session';
  
  // Optional:
  // import { StorageConfig, sessionStorage } from '@ekarpovs/session-storage';

  // Somewhere in an application
  const app: Express = express();


  // Configuration
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

  // Optional: - inject session-storage
    const storageConfig: StorageConfig = {
    uri: "",
    db: "",
    collection: "",
  };

  // const storage = sessionStorage(storageConfig);
  // authConfig.storage = { store: storage};

  initAuth(authConfig);

  // Usage
  ...
```
