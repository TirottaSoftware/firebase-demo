import initStripe from 'stripe'

export default async function handler(req, res) {

    const stripe = initStripe(process.env.STRIPE_SECRET)

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: 'https://firebase-demo-rho.vercel.app/',
        cancel_url: 'https://firebase-demo-rho.vercel.app/',
        line_items: [
            {
                'price': process.env.PRODUCT_ONE_ID,
                'quantity': 1
            }
        ]
    })
    res.send(session.id)
}