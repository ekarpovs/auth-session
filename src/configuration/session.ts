/**
 *  Defines the express session config
 * 
 *  The session object is associated with all routes
 *   and can be accessed on all requests.
 *   default name is connect.sid.
 *   It's advisable to change the name to avoid fingerprinting.
 *   By default, the cookies are set to:
 *   { path: '/', httpOnly: true, secure: false, maxAge: null }
 *   To harden session cookies:
 *  Recommended option secure: true, however it 
 *   requires an https-enabled web site.
 *  resave: It basically means that for every request to the server, 
 *   it reset the session cookie. 
 *   Even if the request was from the same user or browser and the session
 *   was never modified during the request.
 *  saveUninitialized: When an empty session object is created and 
 *   no properties are set, it is the uninitialized state. 
 *   So, setting saveUninitialized to false will not save 
 *   the session if it is not modified.
 *  The default value of both resave and saveUninitialized is true, 
 *   but using the default is deprecated. 
 *   So, set the appropriate value according to the use case.
 */

const toBoolean = (dataStr: string): boolean => {
  return !!(dataStr?.toLowerCase?.() === 'true');
};

const toSameSite = (dataStr?: string): boolean | "strict" | "none" | "lax" | undefined => {
  if (dataStr === undefined) return undefined;
  const lowerCaseDataStr = dataStr?.toLowerCase?.();
  if (lowerCaseDataStr === 'strict') return 'strict';
  if (lowerCaseDataStr === 'none') return 'none';
  if (lowerCaseDataStr === 'lax') return 'lax';
  return undefined;
};

export type CookieConfig = {
  secure: string;
  sameSite: string;
  httpOnly: string;
  maxAge: string;
  domain?: string;
}
export type SessionConfig = {
  secret: string;
  name: string;
  saveUninitialized: string;
  cookie: CookieConfig;
  resave: string;
};

type Cookie = {
  secure: boolean;
  sameSite: boolean | "strict" | "none" | "lax" | undefined;
  httpOnly: boolean;
  maxAge: number;
  domain?: string;
}
export type SessionOptions = {
  secret: string;
  name: string;
  saveUninitialized: boolean;
  cookie: Cookie;
  resave: boolean;
};

export const initSession = (sessionConfig: SessionConfig): SessionOptions => {
  const sessionOptions: SessionOptions = {
    secret: sessionConfig.secret || "This is a secret",
    name: sessionConfig.name,
    saveUninitialized: toBoolean(sessionConfig.saveUninitialized || 'false'),
    cookie: {
      secure: toBoolean(sessionConfig.cookie.secure || 'false'),
      sameSite: toSameSite(sessionConfig.cookie.sameSite || 'lax'),
      httpOnly: toBoolean(sessionConfig.cookie.httpOnly|| 'false'),
      maxAge: Number.parseInt(sessionConfig.cookie.maxAge || "360000", 10),
      domain: sessionConfig.cookie.domain,
    },
    resave: toBoolean(process.env.SESSION_RESAVE || 'false')
  };
  return sessionOptions;
};

