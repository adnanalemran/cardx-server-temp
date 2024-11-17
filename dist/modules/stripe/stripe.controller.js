"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Stripe = require('stripe');
// Replace with your Stripe Secret Key
const stripe = new Stripe("pk_live_51IuddrCDEtPXdFQTU1c0COn1ZxtcBR6DnP5OEECG06jB8cvfCONqkVipqRoLt10upCd8Tm6bMruYHGUurSwsjPIC00j2qARSiA");
const payment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, paymentMethodId } = req.body;
    try {
        // Create a new customer in Stripe
        const customer = yield stripe.customers.create({
            payment_method: paymentMethodId,
            email: email,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
        // Create the subscription with a 7-day trial
        const subscription = yield stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: 'price_1QGfW1CDEtPXdFQTxdYOitMF' }],
            trial_period_days: 7,
            expand: ['latest_invoice.payment_intent'],
        });
        console.log(subscription);
        res.status(200).json({
            subscriptionId: subscription === null || subscription === void 0 ? void 0 : subscription.id,
            clientSecret: subscription === null || subscription === void 0 ? void 0 : subscription.latest_invoice,
        });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({ error: { message: errorMessage } });
    }
}));
exports.StripeController = {
    payment
};
