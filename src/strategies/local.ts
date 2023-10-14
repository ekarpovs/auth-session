/***
 * Define passport local strategy
 * 
 * To authenticate, Passport first looks at the user's login details,
 *  then invokes a verified callback (done). 
 * If the user gets properly authenticated, pass the user into the callback. 
 * If the user does not get appropriately authenticated, pass false into the callback. 
 * You also have the option to pass a specific message into the callback.
 * 
 * When you use sessions with Passport, as soon as a user gets appropriately authenticated,
 *  a new session begins. 
 * When this transpires, we serialize the user data to the session
 *  and the user ID is stored in req.session.passport.user. 
 * To access the user data it is deserialized, using the user ID as its key.
 * The user data is queried and attached to req.user
 */

import { Request } from "express";
import { Strategy } from "passport-local";
import { cryptUtils } from "../utils/utils";

class LocalStrategy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static init(app: any, User: any): void {
    const crypt = cryptUtils();
    // configure the register strategy.
    app.use("local-register", new Strategy({
      // by default, local strategy uses username and password, 
      // we will override with email
      usernameField: "email",
      passwordField: 'password',
      // allows to pass the entire request to the callback
      passReqToCallback: true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, async (req: Request, email: string, password: string, done: any) => {
      try {
        if (!email) done(null, false);
        const user = await User.findOne({"email": email.toLowerCase()});
        if (user) {
          done(null, false, { message: "User already exist"});
        } else {
          const newUser = new User(req.body);
          newUser.password = await crypt.hash(password);
          try {
            const user = await newUser.save();
            done(null, user);
          } catch (e) {
            done(e);
          }
        }
      } catch (e) {
        done(e);
      }
    }));

    // configure the login strategy.
    app.use("local-login", new Strategy({
      usernameField: "email",
      passwordField: 'password'
    }, async (email: string, password: string, done) => {
      try {
        if (!email) { done(null, false); }
        const user = await User.findOne({"email": email.toLowerCase()});
        if (!user) { return done(null, false, { message: 'User not found.' });}
        if (user && user.email != email) {
          done(null, false, { message: "User or password incorrect"});
        }
        if (!await crypt.compare(password, user.password)) {
          done(null, false, {message: "User or password incorrect"});
        }
        else {
          done(null, user);
        }
      } catch (e) {
        done(e);
      }
    }));
  }
}

export default LocalStrategy;