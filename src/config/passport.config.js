import passport from "passport";
import local from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import UserDB from "./../dao/dbManagers/dbUser.js";
import jwt from "passport-jwt";
import config from "./config.js";
import CartsDB from "../dao/dbManagers/dbCarts.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const userDB = new UserDB();
const cartService = new CartsDB();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await userDB.getOne(email);
          if (user) {
            console.log("El usuario ya existe");
            return done(null, false);
          }
          const cart = await cartService.createOne();
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            cart,
            password: createHash(password),
          };
          req.user = newUser;
          let result = await userDB.createOne(newUser);
          return done(null, result);
        } catch (err) {
          return done("Error al obtener el usuario" + err);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
          try {
            const user = await userDB.getOne(username);
            if (!user) {
              console.log("usuario no existe");
              return done(null, false);
            }
            if (!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userDB.findById(id);
    done(null, user);
  });

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: config.secretKey,
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["TokenCookie"];
  }
  return token;
};

export default initializePassport;
