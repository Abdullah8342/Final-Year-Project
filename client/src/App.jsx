import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from './components/ToastContainer'
import { Home } from './pages/public/Home'
import Aboutus from './pages/public/Aboutus'
import { Contactus } from './pages/public/Contactus'
import Profile from './pages/private/Profile'
import { Login } from './pages/public/Login'
import Register from './pages/public/Register'
import { ForgotPassword } from './pages/public/ForgotPassword'
import Services from './pages/public/Services'

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </ToastProvider>
  )
}

export default App
