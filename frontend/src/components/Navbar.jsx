import React from 'react'
import { Link } from 'react-router-dom'
import { TbLogout } from "react-icons/tb";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const queryClient = useQueryClient()
  const {mutate: logout} = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/auth/logout")
      return res.data;
    },
    onSuccess: () => {
      toast.success("Logout successful")
      queryClient.invalidateQueries({
        queryKey: ["authUser"]
      })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  })
  
  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  }

  return (
    <nav className='flex justify-between pt-2 w-full items-center  px-[50px] text-black py-[10px] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]'>
      <div className='text-3xl font-medium'>
        NOTE
      </div>
      <div className='flex justify-between gap-[30px] font-medium items-center'>
        <Link to="/profile">PROFILE</Link>
        <Link to="/dashboard">DASHBOARD</Link>
        <div>
          <TbLogout onClick={handleLogout} size={20} className='cursor-pointer'/>
        </div>
      </div>
    </nav>
  )
}

export default Navbar