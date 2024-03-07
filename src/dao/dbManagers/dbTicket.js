import { ticketModel } from "../models/ticket.model.js";

export default class TicketDB {
  constructor() {}

  getAll = async () => {
    try {
      let tickets = await ticketModel.find();
      return tickets;
    } catch (error) {
      console.log(error);
    }
  };

  createOne = async (ticket) =>{
    try{
        let ticketCreated = await ticketModel.create(ticket);
        return ticketCreated;
    }catch(error){
        console.log(error);
    }
  }

}
