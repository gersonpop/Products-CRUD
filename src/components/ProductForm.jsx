"use client"

import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react"

function ProductForm() {
  const [product, setproduct] = useState({
    name: "",
    description: '',
    price: 0
  })
  const [file, setFile] = useState(null)
  const form = useRef(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      axios.get(`../../api/products/${params.id}`)
        .then(res => {
          console.log(res)
          setproduct({
            name: res.data.name,
            price: res.data.price,
            description: res.data.description
          })
        })
    }


  }, [])



  const handleChange = (e) => {
    setproduct({
      ...product,
      [e.target.name]: [e.target.value]
    })

  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    let res = ""
    const formData = new FormData()
    formData.append('name', product.name)
    formData.append('price', product.price)
    formData.append('description', product.description)

    if (file)
      formData.append('image', file)
    
    if (!params.id) {
      res = await axios.post('../../api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

    }
    else {
      res = await axios.put(`../../api/products/${params.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

    }


    form.current.reset()
    router.push('/')
    router.refresh()

  }
  return (
    <div className="">
      <form onSubmit={handleSubmit} ref={form} className=" bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4" >
        <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Nombre </label>
        <input value={product.name} name="name" className=" text-black shadow appearance-none border rounded w-full py-2 px-3" onChange={handleChange} type="text" placeholder="name" autoFocus />

        <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Precio</label>
        <input value={product.price} name='price' className=" text-black shadow appearance-none border rounded w-full py-2 px-3" onChange={handleChange} type="text" placeholder="00.00" />

        <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="description">Descripción</label>
        <textarea value={product.description} name="description" rows={3} className=" text-black shadow appearance-none border rounded w-full py-2 px-3" onChange={handleChange} placeholder="desciption" />
        <label className=" block text-gray-700 text-sm font-bold mb-2" htmlFor="productImage">Imagen </label>
        <input name='productImage' className=" text-black shadow appearance-none border rounded w-full py-2 px-3 mb-2" onChange={(e) => { setFile(e.target.files[0]) }} type="file" placeholder="select image..." />
        {file && <img className="w-64 h-64 object-contain mx-auto" src={URL.createObjectURL(file)} />}
        {console.log(product.filepath)}
        {product.filepath && <img className="w-64 h-64 object-contain mx-auto" src={product.filepath} />}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">{params.id ? 'Actualizar Producto' : 'Crear Producto'}</button>
      </form>

    </div>
  )
}

export default ProductForm