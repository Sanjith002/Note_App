import React from 'react'
import { Link } from 'react-router-dom'
import { TbLogout } from "react-icons/tb";
import { HiMenu, HiX } from "react-icons/hi";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
    <>
      <nav className='flex justify-between pt-2 w-full items-center px-[50px] text-black py-[10px] shadow-[0px_5px_15px_rgba(0,0,0,0.35)]'>
        
        {/* Logo */}
        <div className='text-3xl font-medium'>
          NOTE
        </div>

        {/* Desktop Menu */}
        <div className='hidden md:flex justify-between gap-[30px] font-medium items-center'>
          <Link to="/profile">PROFILE</Link>
          <Link to="/dashboard">DASHBOARD</Link>
          <div>
            <TbLogout onClick={handleLogout} size={20} className='cursor-pointer' />
          </div>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className='md:hidden'>
          <HiMenu
            size={28}
            className='cursor-pointer'
            onClick={() => setMenuOpen(true)}
          />
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] max-w-[300px] bg-white z-50 shadow-[-5px_0px_15px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-in-out md:hidden
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close Button */}
        <div className='flex justify-end p-5'>
          <HiX
            size={28}
            className='cursor-pointer'
            onClick={() => setMenuOpen(false)}
          />
        </div>

        {/* Menu Items */}
        <div className='flex flex-col gap-[30px] px-8 pt-4 font-medium text-lg'>
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className='border-b pb-3'
          >
            PROFILE
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className='border-b pb-3'
          >
            DASHBOARD
          </Link>
          <div
            className='flex items-center gap-2 cursor-pointer'
            onClick={handleLogout}
          >
            <TbLogout size={20} />
            <span>LOGOUT</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar