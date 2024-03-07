
import { productsModel } from "../models/product.model.js";

export default class ProductDB{
    constructor(){
    }

    getAll = async ()=>{
        return await productsModel.find().lean();
    }
    getOne = async(id)=>{
        return await productsModel.findById({_id: id}).lean();
    }
    createOne = async(obj)=>{
        const products = await this.getAll();
        const prod = products.find(p => p.code == obj.code);
        if (prod){
            return {status: 404, payload: "CODE ALREADY EXIST"};
        }else{
            return await productsModel.create(obj);
        }
    }
    
    updateOne = async(id, obj) =>{
        return await productsModel.updateOne({_id:id}, obj);
    }

    deleteOne = async(id)=>{
        return await productsModel.deleteOne({_id: id});
    }
}


