import { Router } from "express";
import ProductDB from "../dao/dbManagers/dbProduct.js";
import { createProduct, deleteProductById, getProductById, getProducts, putProduct, getMockingProducts } from "../controllers/product.controller.js";
import passport from "passport";
import { autorization } from "../utils.js";
const productRouter = Router();
const productDB = new ProductDB();

productRouter.get("/",passport.authenticate("jwt", { session: false }), getProducts)

productRouter.get('/:id',passport.authenticate("jwt", { session: false }), getProductById)

productRouter.post("/",passport.authenticate("jwt", { session: false }), autorization("admin"), createProduct);

productRouter.put('/:pid', passport.authenticate('jwt', {session: false}), autorization("admin"), putProduct);

productRouter.delete("/:pid",passport.authenticate("jwt", { session: false }), autorization("admin"), deleteProductById)

productRouter.get('/mockingproducts/mock', getMockingProducts);

export default productRouter;