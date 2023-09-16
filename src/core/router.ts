import { Request, Response, Router } from "express";
import { 
  resetPassword,
  resetPasswordRequest,
  login,
  logout,
  register,
  changePassword
} from "./controller";

const authRouter = Router();

authRouter.get("/", (req: Request, res: Response) => {
  res.send('hello world');
});

authRouter.post("/login", login);

authRouter.get("/logout", logout);

authRouter.post("/register", register);

authRouter.post("/change-password", changePassword);

authRouter.post("/reset-password-request", resetPasswordRequest);

authRouter.post("/reset-password", resetPassword);

export default authRouter;
