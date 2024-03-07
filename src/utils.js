import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import config from "./config/config.js";
import { faker } from "@faker-js/faker";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const PRIVATE_KEY = config.secretKey;

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

export const decodeToken = (token)=>{
  try{
    return jwt.verify(token, PRIVATE_KEY);
  }catch(error){
    if (error.name === 'TokenExpiredError')
      console.log("Token expired")
    else
    console.log("Error: ", error)
  }
}

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).send({
      error: "Not authenticated",
    });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    if (error) return res.status(403).send({ error: "Not authorized" });
    req.user = credentials.user;
    next();
  });
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const autorization = (role) => {
  return (req, res, next) => {
    console.log(req.user.user);
    if (!req.user.user) return res.status(401).send({ error: "Unauthorized" });
    if (req.user.user.role !== role)
      return res.status(403).send({ error: "No permissions" });
    next();
  };
};

export const generateProducts = () => {
  let products = [];

  for (let i = 0; i < 100; i++) {
    products.push({
      _id: faker.database.mongodbObjectId(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.string.alphanumeric(5),
      price: faker.commerce.price(),
      status: faker.datatype.boolean(),
      stock: faker.number.int({ min: 1, max: 100 }),
      category: faker.commerce.department(),
      thumbnails: faker.image.url(),
    });
  }

  return products;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.email,
    pass: config.pass,
  },
});

export const sendMail = async (email) => {
  return await transporter.sendMail({
    from:`E-commerce <${config.email}>`,
    to: email,
    subject: "Welcome",
    html: `succesful register`,
  });
};

export const sendRestoreMail = async(email,token)=>{
  return await transporter.sendMail({
    from:`E-commerce <${config.email}>`,
    to:email,
    subject:"Restore password",
    html:`http:localhost:8080/api/user/restoreUserPassword/${token}`//falta ruta con token por param
  })
}

export default __dirname;
