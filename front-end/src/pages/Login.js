import React, {useState} from "react";
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


export default function Login({setAuth}) {

    const [inputs, setInputs] = useState({
        email : "",
        password: "",
    })

    const {email, password } = inputs

    const onChange = e => {
        setInputs({...inputs, [e.target.name] : e.target.value})
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()

        const body = { email, password}
        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(body)
            })
        const parseRes = await response.json()
        console.log(parseRes)

        if (parseRes==="Incorrect Credentials" || parseRes==="Missing Credentials" || parseRes==="Server Error"){
            toast.error(parseRes)
            console.log(parseRes)
            return;
        }
        localStorage.setItem("token", parseRes.token)
        toast.success("Logged In Successfully")
        setAuth(true);

        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <div>
            <div className="flex flex-col items-center min-h-screen sm:justify-center sm:pt-0">
                <div>
                    <a href="/">
                        <h3 className="text-4xl font-bold text-[#4169e1]">
                            Login
                        </h3>
                    </a>
                </div>
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-50 shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={onSubmitForm}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Email:   
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="email"
                                    name="email"
                                    className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={email}
                                    onChange={e => onChange(e)}
                               />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="password"
                                    className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    value={password}
                                    onChange={e => onChange(e)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <a
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                                href="/signup"
                            >
                                Don't have an account yet?
                            </a>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}