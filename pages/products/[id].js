import { Button, Card, Loading } from "@nextui-org/react";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import { db } from '../../firebase'

const stripePromise = loadStripe(process.env.stripe_public_key)

function Product({ product, loading }) {
    const handleCheckout = async () => {
        const stripe = await stripePromise

        const checkoutSession = await axios.post('/api/checkout').then(res => {
            console.log(res)
            return res.data;
        })

        const result = await stripe.redirectToCheckout({
            sessionId: checkoutSession
        })

        if (result.error) alert(result.error.message)

        axios.get('/api/createUser').then(res => console.log(res))
    }


    return (
        <div>
            {
                loading ?
                    <Loading /> :
                    <Card>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <Button onPress={handleCheckout}>{product.price}</Button>
                    </Card>
            }
        </div>
    )
}

export default Product

// export async function getStaticPaths(ctx) {
//     const querySnapshot = await getDocs(collection(db, "products"));

//     const paths = querySnapshot.docs.map((doc) => {
//         return ({ params: { id: doc.id } });
//     });

//     console.log(paths)

//     return {
//         paths,
//         fallback: false
//     }
// }

export async function getServerSideProps(ctx) {
    const id = ctx.params["id"]
    const docRef = await doc(db, "products", id);
    const docSnap = await (await getDoc(docRef)).data()

    if (docSnap) {
        return {
            props: {
                product: docSnap,
                loading: false
            }
        }
    }
    else {
        return {
            props: {
                loading: true
            }
        }
    }
}