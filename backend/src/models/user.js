import { Schema, model } from "mongoose";
import cartModel from "./cart.js";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    rol: {
        type: String,
        default: "User"
    },
    cart_id: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    }
});

userSchema.pre('save', async function (next) {
    try {
        if (!this.cart_id) {
            const newCart = await cartModel.create({products: []});
            this.cart_id = newCart._id;
        }
        next();
    } catch (e) {
        next(e);
    }
});

userSchema.pre('findOne', function(next) {
    this.populate('cart_id'); 
    next();
});

export const userModel = model("users", userSchema);
