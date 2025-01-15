const { Schema, model } = require("mongoose");

const authSchema = new Schema(
  {
    username: {
      type: String,
      // unique: true,
      required: true,
      minLength: [3, "Your username more than 2 characters"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Your password more than 5 characters"],
    },
    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: {
        values: ["user", "admin"],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Auth", authSchema);
