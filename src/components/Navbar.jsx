import Link from 'next/link'

function Navbar() {
    return (
        <nav className=' bg-zinc-950 px-20 py-4'>
            <div className="flex justify-between items-center text-white container mx-auto">
                <h3 className=' text-xl'><Link href='/' className=' text-white hover:text-gray-300 hover:cursor-pointer'>
                            Next MySQL
                        </Link></h3>
                <ul>
                    <li>
                        <Link href='/products/new' className=' text-sky-500 hover:text-sky-300 hover:cursor-pointer'>
                            New
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar