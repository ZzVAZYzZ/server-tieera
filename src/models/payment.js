const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const paymentSchema = new mongoose.Schema(
    {
        payment_id: {
            type: String,
            unique: true,
            default: uuidv4,
            index: true,
        },
        order_id: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "vnd",
        },
        status: {
            type: String,
            enum: [
                "requires_payment_method",
                "requires_confirmation",
                "requires_action",
                "processing",
                "succeeded",
                "canceled",
            ],
            required: true,
        },
        paymentType: { 
            type: String, 
            enum: ["CreditCard", "QRCode"], 
            default: "CreditCard" 
        },
        payment_method: {
            type: String, // vd: "pm_1SPcBGQta3QlNKNmLaUzRKfS"
        },
        description: {
            type: String,
        },
        customer_name: {
            type: String,
        },
        customer_email: {
            type: String,
        },
        customer_address: {
            type: String,
            
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

module.exports = mongoose.model("Payment", paymentSchema);
