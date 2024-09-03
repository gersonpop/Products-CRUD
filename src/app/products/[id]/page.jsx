import Buttons from "@/app/api/products/[id]/Buttons"
import axios from "axios"

async function loadProduct(productId) {
    const { data } = await axios.get(`http://localhost:3000/api/products/${productId}`)
    return data
}


async function ProductoPage({ params }) {

    const product = await loadProduct(params.id)
    

    return (
        <section className="flex justify-center items-center h-[calc(100vh-10rem)]">
            <div className="flex items-center w-4/6 justify-center">
            <div className=" p-6 bg-white  text-black w-1/3">
                <h3 className="text-2xl font-bold mb-3">{product.name}</h3>
                <h4 className=" text-4xl font-bold">$ {product.price}</h4>
                <p className=" text-slate-700"> {product.description}</p>
            <Buttons product={product}/>
            </div>
            <img src={product.filepath} alt={product.name} className="w-1/3" />
            </div>
            
        </section>
    )
}

export default ProductoPage