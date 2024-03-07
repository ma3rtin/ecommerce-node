import mongoose from "mongoose";

const ticketColletion = "tickets";

const ticketSchema = new mongoose.Schema({
    code:{
    type: String,
    unique: true
    },
    pucharse_datetime: {
        type: Date,
        default: Date.now
    },
    amount:{
        type:Number
    },
    purchaser:{
        type:String
    }
});

export const ticketModel = mongoose.model(ticketColletion, ticketSchema);