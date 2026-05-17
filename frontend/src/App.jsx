import React from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import { Toaster } from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import axios from "./api/axios"
import Profile from './components/Profile'
import LoadingSpinner from './common/LoadingSpinner'

const App = () => {
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/auth/me");
        return res.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    retry: false,
  })

  const authUser = isError ? null : user;

  if(isLoading){
    return(
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }
  return (
    <div>
      {authUser && <Navbar />} 
      <Routes>
        <Route path='/' element={authUser ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/register' element={!authUser ? <Register /> : <Navigate to="/" />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/dashboard' element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App