// Create a reference to the cities collection
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase'
import { Button, Card } from '@nextui-org/react';

export default function Home({ products }) {
  return (
    <div>
      {
        products.map(p => {
          return <a key={p.id} href={`/products/${p.id}`}>
            <Card>
              <Card.Body>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <Button>{p.price}</Button>
              </Card.Body>
            </Card>
          </a>
        })
      }
    </div >
  )
}

export async function getStaticProps() {
  const querySnapshot = await getDocs(collection(db, "products"));

  const products = querySnapshot.docs.map((doc) => {
    return ({ ...doc.data(), id: doc.id });
  });

  return {
    props: {
      products
    }
  }
}