import { Router } from "express";
import MessageDB from "../dao/dbManagers/dbMessage.js";
import { getAllMessages, sendMessage } from "../controllers/message.controller.js";
import passport from "passport";
import { autorization } from "../utils.js";

const messageRouter = Router();
const messageDB = new MessageDB();

messageRouter.get("/",passport.authenticate("jwt", { session: false }), autorization("user"), getAllMessages);

messageRouter.post("/",passport.authenticate("jwt", { session: false }), autorization("user"), sendMessage);

export default messageRouter;