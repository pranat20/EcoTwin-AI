import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Predict from "./pages/Predict"
import History from "./pages/History"
import Home from "./pages/Home"   

function App() {

  return (

    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route path="/home" element={<Home />} />   {/* IMPORTANT */}

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/predict" element={<Predict />} />

      <Route path="/history" element={<History />} />

    </Routes>

  )

}

export default App
