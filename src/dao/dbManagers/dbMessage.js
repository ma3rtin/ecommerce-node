import { messageModel } from "../models/message.model.js"


export default class MessageDB{
constructor(){

}
getAll = async()=>{
    return await messageModel.find().lean();
}

createOne = async(obj)=>{
    await messageModel.create(obj)
}
}