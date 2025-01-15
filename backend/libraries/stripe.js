const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET);

console.log(stripe);

module.exports = stripe;
