import MessageDB from "../dao/dbManagers/dbMessage.js";

const messageService = new MessageDB();

export const getAllMessages = async (req, res) => {
  let messages = await messageService.getAll();

  res.render("chat", { data: messages });
};

export const sendMessage = async (req, res) => {
  let body = req.body;

  await messageService.createOne(body);

  let messages = await messageService.getAll();

  res.render("chat", { data: messages });
};
