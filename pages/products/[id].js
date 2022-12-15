import { Card, Loading } from "@nextui-org/react";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from '../../firebase'

function Product({ product, loading }) {
    return (
        <div>
            {
                loading ?
                    <Loading /> :
                    <Card variant="flat">
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                    </Card>
            }
        </div>
    )
}

export default Product

export async function getStaticPaths(ctx) {
    const querySnapshot = await getDocs(collection(db, "products"));

    const paths = querySnapshot.docs.map((doc) => {
        return ({ params: { id: doc.id } });
    });

    console.log(paths)

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps(ctx) {
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