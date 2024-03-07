import CartsDB from "../dao/dbManagers/dbCarts.js";
import ProductDB from "../dao/dbManagers/dbProduct.js";
import TicketDB from "./../dao/dbManagers/dbTicket.js";
const cartService = new CartsDB();
const productService = new ProductDB();
const ticketService = new TicketDB();

export const getCartById = async (req, res) => {
 if(!req.user)res.send({status: "error"})
  try {
    
    const cart = await cartService.getOne(req.user.user.cart);
    res.send(cart);
  } catch (error) {
    console.log(error);
    res.send({ error: "Error" });
  }
};

export const createCart = async (req, res) => {
  const newCart = await cartService.createOne();

  res.send({ status: "ok", payload: newCart });
};

export const addProductToCart = async (req, res) => {
  const productId = req.params.pid;
  console.log("req user: ", req.user)
  const cartId = req.user.user.cart;

  const cart = await cartService.addProduct(cartId, productId);

  res.send({ payload: cart });
};

export const purchaseCart = async (req, res) => {
  const cart = await cartService.getOne(req.user.user.cart);

  if (cart) {
    let total = 0;
    const itemsLeft = [];
    await Promise.all(
      cart[0].products.map(async (product) => {
        let prod = await productService.getOne(product.product._id);
        if (prod && product.quantity <= prod.stock) {
          prod.stock -= product.quantity;
          let partialAmount = product.quantity * prod.price;
          total += partialAmount;
          await productService.updateOne(product.product, prod);
        } else {
          itemsLeft.push(product);
        }
      })
    );
    if (total != 0) {
      const ticket = {
        code: new Date().getTime().toString(),
        purchase_datetime: new Date().getTime(),
        amount: total,
        purchaser: req.user.user.email,
      };

      const response = await ticketService.createOne(ticket);
      await cartService.updateOne(req.params.cid, { products: itemsLeft });
      res.send({ payload: response, items: itemsLeft });
    }
  } else {
    res.send({ error: "error" });
  }
};
