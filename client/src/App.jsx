import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import {Toaster} from "react-hot-toast"
// import {assets} from "./assets/assets.js"

const App = () => {
  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain " >
      <Routes>
        <Toaster/>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  )
}

export default App
