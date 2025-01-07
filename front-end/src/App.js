import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
import { useState, useEffect, createContext } from "react"
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Charity from './pages/Charity';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import Following from './pages/Following';
import Account from './pages/Account';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AddCharity from './pages/AddCharity';
import UserHome from './pages/UserHome';


const tagContext = createContext(null)
function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tags, setTags] = useState([])

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean)
  }

  async function isAuth() {
    try {
      const response = await fetch("/api/user/is-verified", {
        method: "GET",
        headers: {
          token: localStorage.getItem("token")
        }
      })

      const parseRes = await response.json()

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    isAuth()
  }, [])

  useEffect(() => {
    console.log("app");
    console.log(tags)
  }, [tags])

  return (
    <div className="App">
      <BrowserRouter>
        <tagContext.Provider value={{ tags, setTags }}>
          <Navbar tags={tags} setTags={setTags} />
        </tagContext.Provider>
        <div className='pages'>
          <tagContext.Provider value={{ tags, setTags }}>
            <Routes>
              <Route exact path="/" element={isAuthenticated ? (<UserHome />) : (<Home />)} />
              <Route exact path="/charities" element={<Charity />} />
              <Route exact path="/search" element={<Search tags={tags} setTags={setTags} />} />
              <Route exact path="/addcharity" element={<AddCharity />} />

              <Route exact path="/myaccount" element={isAuthenticated ? (<Account setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
              }
              />
              <Route exact path="/following" element={isAuthenticated ? (<Following setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
              } />
              <Route exact path="/signup" element={!isAuthenticated ? (<SignUp setAuth={setAuth} />
              ) : (
                <Navigate to="/" />
              )
              } />
              <Route exact path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} />
              ) : (
                <Navigate to="/" />
              )
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </tagContext.Provider>
        </div>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export { App, tagContext };
