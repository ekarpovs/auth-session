import { Request, Response, Router } from "express";
import { setupAuthController } from "./controller";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setupAuthRouter = ({ emailer, logger }: any) => {
  const cnt = setupAuthController({ emailer, logger });
  const router = Router();
  logger.info('Setup Auth Router');

  router.get("/", (req: Request, res: Response) => {
    res.send('hello world');
  });
  
  router.post("/login", cnt.login);
  router.get("/logout", cnt.logout);
  router.post("/register", cnt.register);
  router.post("/change-password", cnt.changePassword); 
  router.post("/reset-password-request", cnt.resetPasswordRequest);
  router.post("/reset-password", cnt.resetPassword);  

  return router;
};
