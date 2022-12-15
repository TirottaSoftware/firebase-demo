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

    switch (event.type) {
        case "checkout.session.completed":
            console.log("Subscription Created.")

            const userEmail = event.data.object.customer_details.email;
            const customerId = event.data.object.customer_details.customer;

            console.log({ user: { email: userEmail, customerId } })

            break;
    }

    console.log(event)

    res.send({ received: true })
}

export default handler;