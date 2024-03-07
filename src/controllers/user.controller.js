import UserDB from "../dao/dbManagers/dbUser.js";
import {
  createHash,
  decodeToken,
  generateToken,
  sendMail,
  sendRestoreMail,
} from "../utils.js";

const userService = new UserDB();

export const createUser = async (req, res) => {
  sendMail(req.user.email);
  res.send({ status: "ok" });
};

export const getRegister = async (req, res) => {
  try {
    res.render("register", {});
  } catch (error) {
    res.send({ error: error });
  }
};

export const getLogin = async (req, res) => {
  try {
    res.render("login", {});
  } catch (error) {
    res.send({ error: error });
  }
};

export const loginUser = async (req, res) => {
  let user = req.user;
  let token = generateToken(user);
  res.cookie("TokenCookie", token).redirect("/api/products");
};

export const authenticateCurrent = async (req, res) => {
  let user = req.user.user;
  res.render("dashboard", { user });
};

export const logOut = async (req, res) => {
  res.clearCookie("TokenCookie").redirect("/api/user/login");
};

export const getRestorePassword = (req, res) => {
  try {
    res.render("email", {});
  } catch (error) {
    res.send({ error });
  }
};

export const postRestorePassword = async (req, res) => {
  const email = req.body.email;
  const user = await userService.getOne(email);
  if (!user) res.send({ status: "user not found" });
  else {
    const token = generateToken(user);
    sendRestoreMail(email, token);
    res.send({ status: "email sent" });
  }
};

export const getRestoreUserPassword = async (req, res) => {
  const { token } = req.params;
  if (!token) res.send({ status: "token not found" });
  else res.render("updatePassword", { token });
};

export const postRestoreUserPassword = async (req, res) => {
  const { token, password } = req.body;
  const userToUpdate = decodeToken(token);
  if (!token || !password || !userToUpdate) res.send({ status: "error" });
  else {
    console.log(userToUpdate);
    userToUpdate.user.password = createHash(password);
    const response = await userService.updateOne(
      userToUpdate.user.email,
      userToUpdate.user
    );
    res.send({ payload: response });
  }
};

export const changeRole = async (req, res) => {
  if (req.user.user.role == "admin")
    res.send({ status: "admin cannot change role" });
  else {
    req.user.user.role = req.user.user.role == "premium" ? "user" : "premium";
    const response = await userService.updateOne(
      req.user.user.email,
      req.user.user
    );
    res.redirect("logout");
  }
};
