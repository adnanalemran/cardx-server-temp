import catchAsync from "../../utils/catchAsync";
const Stripe = require('stripe');

// Replace with your Stripe Secret Key
const stripe = new Stripe("pk_live_51IuddrCDEtPXdFQTU1c0COn1ZxtcBR6DnP5OEECG06jB8cvfCONqkVipqRoLt10upCd8Tm6bMruYHGUurSwsjPIC00j2qARSiA");

const payment = catchAsync(async (req, res) => {
    const { email, paymentMethodId } = req.body;

    try {
        // Create a new customer in Stripe
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email: email,
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Create the subscription with a 7-day trial
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: 'price_1QGfW1CDEtPXdFQTxdYOitMF' }], 
            trial_period_days: 7, 
            expand: ['latest_invoice.payment_intent'], 
        });

        console.log(subscription);
        res.status(200).json({
            subscriptionId: subscription?.id,
            clientSecret: subscription?.latest_invoice,
        });
    } catch (error) {
        const errorMessage = (error as any).message;
        res.status(400).json({ error: { message: errorMessage } });
    }
});


export const StripeController = {
    payment
};