import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <main class="h-80 w-full flex flex-col justify-center items-center my-40">
            <h1 class="text-9xl font-extrabold text-black tracking-widest">404</h1>
            <div class="bg-[#4169e1] px-2 text-sm text-white rounded rotate-12 absolute">
                Page Not Found
            </div>
            <div class="mt-5">
                <span class="relative inline-block text-sm font-medium text-[#4169e1] bg- group active:text-[#4169e1] focus:outline-none focus:ring">
                    <span
                        class="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#4169e1] group-hover:translate-y-0 group-hover:translate-x-0"></span>
                    <Link to="/" className="relative block px-8 py-3 bg-[#ffffff] hover:bg-[#4169e1] hover:text-white ease-in-out duration-300 border border-current">
                        Go Home
                    </Link>
                </span>
            </div>
        </main>
    )
}

export default NotFound;