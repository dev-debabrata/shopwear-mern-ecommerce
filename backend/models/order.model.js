import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                productId: {
                    type: String,
                    required: true,
                },

                name: {
                    type: String,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                },

                size: {
                    type: String,
                    default: "",
                },

                image: {
                    type: String,
                    default: "",
                },
            },
        ],

        address: {
            firstName: {
                type: String,
                required: true,
            },

            lastName: {
                type: String,
                required: true,
            },

            emailAddress: {
                type: String,
                required: true,
            },

            street: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            zipCode: {
                type: String,
                required: true,
            },

            country: {
                type: String,
                required: true,
            },

            mobile: {
                type: String,
                required: true,
            },
        },

        paymentMethod: {
            type: String,
            enum: ["cod", "razorpay", "stripe"],
            default: "cod",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },

        razorpayOrderId: {
            type: String,
            default: "",
        },

        razorpaySignature: {
            type: String,
            default: "",
        },

        orderStatus: {
            type: String,
            enum: [
                "Order Placed",
                "Processing",
                "Ready for Shipping",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
            ],
            default: "Order Placed",
        },

        subTotal: {
            type: Number,
            required: true,
        },

        shippingFee: {
            type: Number,
            required: true,
        },

        totalAmount: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;


// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//     {
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },

//         items: [
//             {
//                 productId: String,
//                 name: String,
//                 price: Number,
//                 quantity: Number,
//                 size: String,
//                 image: String,
//             },
//         ],

//         address: {
//             firstName: String,
//             lastName: String,
//             emailAddress: String,
//             street: String,
//             city: String,
//             state: String,
//             zipCode: String,
//             country: String,
//             mobile: String,
//         },

//         paymentMethod: {
//             type: String,
//             enum: ["cod", "razorpay", "stripe"],
//             default: "cod",
//         },

//         paymentStatus: {
//             type: String,
//             enum: ["pending", "paid"],
//             default: "pending",
//         },

//         orderStatus: {
//             type: String,
//             default: "Ready for Shipping",
//         },

//         subTotal: Number,
//         shippingFee: Number,
//         totalAmount: Number,
//     },
//     { timestamps: true }
// );

// const Order = mongoose.model("Order", orderSchema);

// export default Order;