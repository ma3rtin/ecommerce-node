import { Router } from "express";
import passport from "passport";
import {
  authenticateCurrent,
  createUser,
  getLogin,
  getRegister,
  loginUser,
  logOut,
  getRestorePassword,
  postRestorePassword,
  getRestoreUserPassword,
  postRestoreUserPassword,
  changeRole
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/register", passport.authenticate("register"), createUser);

userRouter.post("/login", passport.authenticate("login", { session: false }), loginUser);

userRouter.get("/current",passport.authenticate("jwt", { session: false }),authenticateCurrent);

userRouter.get("/login", getLogin);

userRouter.get("/register", getRegister);

userRouter.get("/logout",passport.authenticate("jwt", { session: false }), logOut);

userRouter.get("/restorepassword", getRestorePassword)

userRouter.post("/restorepassword", postRestorePassword)

userRouter.get("/restoreuserpassword/:token", getRestoreUserPassword)

userRouter.post("/restoreuserpassword", postRestoreUserPassword)

userRouter.get("/changerole",passport.authenticate("jwt", { session: false }), changeRole)
export default userRouter;
