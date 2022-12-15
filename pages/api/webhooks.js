import initStripe from 'stripe'
import { buffer } from 'micro'

export const config = { api: { bodyParser: false } }

const handler = async (req, res) => {
    console.log("event received.")

    const stripe = initStripe(process.env.STRIPE_SECRET);
    const signature = req.headers['stripe-signature'];
    const signingSecret = process.env.STRIPE_SIGNING_SECRET;
    const reqBuffer = await buffer(req);

    let event;

    try {
        event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret)
    }
    catch (error) {
        console.log(error)
        return res.status(400).send('Webhook error: ' + error.message);
    }

    let details
    switch (event.type) {
        case "customer.subscription.created":
            console.log("Subscription Created.")
            details = event.data
            await supabase
                .from('customer')
                .update({
                    is_subscribed: true,
                    interval: event.data.object.items.data[0].plan.interval
                })
                .eq('stripe_id', event.data.object.customer);
            break;
    }

    console.log(details)

    res.send({ received: true })
}

export default handler;