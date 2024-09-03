import Link from 'next/link'


function ProductCard({product}) {
    return (
        <Link href={`/products/${product.id}`} className=" text-black bg-white rounded-lg border-gray-800 mb-3  hover:bg-gray-100 hover:cursor-pointer ">
            {product.filepath&&(
                <img src={product.filepath} alt={product.name} className='w-full rounded-t-lg' />
            )}
            <div className='p-4'>
            <h1 className="text-lg font-bold">{product.name}</h1>
            <h2 className="text-sxl text-slate-600">{product.price}</h2>
            <p>{product.description}</p>
            </div>
        </Link>

    )
}

export default ProductCard