import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Navbar from './components/navbar'
import OrderRepair from './components/orderrepair'
import CheckStatus from './pages/CheckStatus'
import Login from './pages/Login'
import Register from './pages/Register'
import Footer from './components/footer'
import {Routes,Route} from 'react-router'
import ForgotPassword from './pages/ForgotPassword'
import TechnicianPage from './pages/TechnicianPage'
import HomePageCustomer from './pages/HomepageCustomer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<OrderRepair />} />
          <Route path="/check-status" element={<CheckStatus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element = {<ForgotPassword/>} />
          <Route path="/technicianpage" element = {<TechnicianPage/>} />
          <Route path="/welcome" element = {<HomePageCustomer/>} />
        </Routes>
      <Footer></Footer>
          
    </>
  )
}

export default App
