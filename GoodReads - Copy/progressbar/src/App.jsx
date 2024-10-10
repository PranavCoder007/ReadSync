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
const FirstNameContext = createContext();
const App = () => {
  const [firstName,setFirstName] =useState("");
  const [roomCode,setRoomCode] = useState("");
  return (
    <FirstNameContext.Provider value={{ firstName,setFirstName,roomCode,setRoomCode}}>
      <RouterProvider router={router}/>
    </FirstNameContext.Provider> 
  )
}
export {FirstNameContext}
export default App


