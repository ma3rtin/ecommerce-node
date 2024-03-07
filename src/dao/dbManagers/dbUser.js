import { userModel } from "../models/user.model.js";

export default class UserDB{
    constructor(){}

    getAll = async ()=>{
        return await userModel.find().lean();
    }


    findById = async(id)=>{
        return await userModel.findById({_id:id});
    }

    getOne = async(email)=>{
        return await userModel.findOne({ email: email }, { email: 1, first_name: 1, last_name: 1, password: 1, role: 1, cart: 1}).lean();
    }

    createOne = async(user)=>{
        return await userModel.create(user);
    }

    updateOne = async(email, user)=>{
        return await userModel.updateOne({email: email}, user);
    }
}