import { useEffect, useState ,createContext} from "react";
import Library from './library.jsx'
import Home from './Homepage.jsx'
import {BrowserRouter, createBrowserRouter , RouterProvider ,Routes, Route} from "react-router-dom";
import Navbar from './Components/Navbar/Navbar'
import Login from './Login.jsx'
import Bookinfo from "./bookinfo.jsx";
const router = createBrowserRouter(
  [
    {
        path: '/' ,
        element: <Login/>
    },
    {
      path:'/Homepage',
      element:<Home/>
    },
    {
        path:'/Library',
        element:<Library/>
    },
    {
      path:'/bookinfo',
      element:<Bookinfo/>
    },
    
  ]
)
const UserContext = createContext();
const App = () => {
  const [userId,setUserId] =useState("");
  const [token, setToken] = useState("");
  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken }}>
      <RouterProvider router={router}/>
    </UserContext.Provider> 
  )
}
export {UserContext}
export default App


