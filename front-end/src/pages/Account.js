import React, { useState, useEffect } from "react"


export default function Account({ setAuth }) {

  const [userdata, setUserdata] = useState({
    name: "",
    email: ""
  });


  async function getName() {
    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: { token: localStorage.getItem("token") }
      })

      const parseRes = await response.json()
      console.log(parseRes)
      setUserdata({
        name: parseRes.name,
        email: parseRes.email
      })
    } catch (err) {
      console.error(err.message);
    }
  }

  const logout = e => {
    e.preventDefault()
    localStorage.removeItem("token")
    setAuth(false)
  }

  useEffect(() => {
      getName()
  }, [])

  return (
    <div className="bg-stone-100 h-screen">
      <div className='px-5 py-10 mx-40'>
        <h1 className='text-3xl font-bold'>My Account</h1>
        <h1 className='text-2xl font-bold'>Name: {userdata.name}</h1>
        <h1 className='text-2xl font-bold'>Email: {userdata.email}</h1>
        <button onClick={e => logout(e)} className="bg-transparent my-10 hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded duration-300">Log out</button>
      </div>
    </div>
  );
}