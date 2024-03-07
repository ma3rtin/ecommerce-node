import { cartsModel } from "../models/carts.model.js";

export default class CartsDB {
  constructor() {}

  getOne = async (id) => {
    return await cartsModel.find({ _id: id }).lean();
  };

  createOne = async () => {
    return await cartsModel.create({ products: [] });
  };

  addProduct = async (cid, pid) => {
    try {
      let cart = await this.getOne(cid);
      if (cart) {
        console.log("cart: ", cart)

        let products = cart[0].products || [];

        let prd = products.find((obj) => obj.product._id == pid);
        if (prd) {
          prd.quantity += 1;
        } else {
          products.push({ product: pid, quantity: 1 });
        }
        cart.products = products;
        await this.updateOne(cid, cart[0]);

        return { status: "ok", payload: cart[0] };
      } else {
        return { status: "error", error: "cart not found" };
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateOne = async (cid, cart) => {
    try {
      return await cartsModel.updateOne(
        { _id: cid },
        { $set: { products: cart.products } }
      );
    } catch (error) {
      console.log("error updating cart: ", error);
    }
  };
}
