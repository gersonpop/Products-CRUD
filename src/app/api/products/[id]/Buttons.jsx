'use client'

import axios from "axios"
import { useRouter } from "next/navigation"



function Buttons({ product }) {
    const router = useRouter()

    async function _delete() {

        if (confirm('¿Estás seguro de eliminar el producto ')) {
            const res = await axios.delete(`../api/products/${product.id}`)
            if (res.status === 204) {
                router.push('/')
                router.refresh()
            }
        }
    }

 
         function _edit() {
                   router.push(`/products/edit/${product.id}`)
        }


    return (
        <div className=" flex justify-end items-center gap-4 pt-2">
            <button className=" bg-red-500 hover:bg-red-700 py-2 px-3 rounded text-white" onClick={_delete}>Borrar</button>
            <button className=" bg-gray-500 hover:bg-gray-700 py-2 px-3 rounded text-white" onClick={_edit} >Editar</button>
        </div>
    )
}

export default Buttons