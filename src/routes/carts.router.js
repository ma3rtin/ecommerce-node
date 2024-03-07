import { Router } from "express";
import CartsDB from "./../dao/dbManagers/dbCarts.js";
import { addProductToCart, createCart, getCartById, purchaseCart} from "../controllers/carts.controller.js";
import passport from "passport";
const cartsRouter = Router();
const cartsDB = new CartsDB();

cartsRouter.get("/",passport.authenticate("jwt", { session: false }), getCartById);

cartsRouter.post("/",passport.authenticate("jwt", { session: false }), createCart);

cartsRouter.post("/products/:pid",passport.authenticate("jwt", { session: false }), addProductToCart);

cartsRouter.post("/purchase",passport.authenticate("jwt", { session: false }), purchaseCart)

export default cartsRouter;
