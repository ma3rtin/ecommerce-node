import ProductDB from "../dao/dbManagers/dbProduct.js";
import { productsModel } from "../dao/models/product.model.js";
import { generateProducts } from '../utils.js';

const productService = new ProductDB();

export const getProducts = async (req, res) => {
  let limit = parseInt(req.query.limit) || 5;
  let page = parseInt(req.query.page) || 1;
  let sort = parseInt(req.query.sort) || 1;
  let query = req.query.query;

  const products = await productsModel.paginate( {},{ page, limit, sort: { title: sort }, lean: true });
  
  products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}`: "";

  products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}`: "";
  
  products.isValid = !(page <= 0 || page > products.totalPages);

  res.render("products", products);
};

export const getProductById = async (req, res) => {
  try {
    let { id } = req.params;

    let resp = await productService.getOne(id);

    res.render("dashboard", { user: req.user });
  } catch (error) {
    res.status(500).send({ status: "error", message: error });
  }
};

export const createProduct = async (req, res) => {
  let newProduct = req.body;
  const result = await productService.createOne(newProduct);

  res.send({ result });
};

export const putProduct = async (req, res) => {
  try {

      let { pid } = req.params;

      let productNew = req.body;

      // console.log(pid, productNew);
      console.log(productNew);

      let resp = await productService.updateOne(pid, productNew);

      res.send({ status: 'ok', message: resp, payload: resp });
  } catch (error) {
      res.status(500).send({ status: 'error', message: error });
  }
}

export const deleteProductById = async (req, res) => {
  const id = req.params.pid;
  const result = await productService.deleteOne(id);
  res.render("products", { status: "ok", payload: result });
};


export const getMockingProducts = async (req, res) => {

  const productsFaker = generateProducts();

  console.log(productsFaker);

  res.send({ status: "ok", payload: productsFaker });
}

