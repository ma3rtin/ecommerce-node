import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
},
  role: {
    type:String,
    default: "user"
  }
});

userSchema.pre('find', function(){
    this.populate("cart.carts");
});


userSchema.pre('findOne', function(){
    this.populate("cart.carts");
});

export const userModel = mongoose.model(userCollection, userSchema);
