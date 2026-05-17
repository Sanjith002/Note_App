import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../common/LoadingSpinner";
import axios from "../api/axios"

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const queryClient = useQueryClient()
  const inputRef = useRef(null);

  const { mutate: register, isPending, isError, error,} = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        "/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return res.data;
    },

    onSuccess: () => {
      toast.success("Registration successful", {
      duration: 4000
    });
      queryClient.invalidateQueries({
				queryKey: ["authUser"]
			})
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("contact", contact);
    formData.append("password", password);

    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    register(formData);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(!showPassword);
    inputRef.current.focus();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="w-[400px] h-[450px] flex border-gray-600 rounded-2xl flex-col items-center justify-center gap-5 shadow-[0px_5px_15px_rgba(0,0,0,0.35)] bg-white">
          <div className="font-medium text-xl">REGISTER</div>
          <div className="flex flex-col gap-[10px]">
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="Username"
              className="outline-none border border-gray-300 rounded text-sm h-[35px] pl-[10px] "
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="outline-none border border-gray-300 rounded text-sm h-[35px] pl-[10px]"
            />
            <div className="border border-gray-300 rounded text-sm h-[35px] pl-[10px] flex items-center justify-between pr-[15px]">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="outline-none border-none w-full"
              />
              <button
                type="button"
                onClick={handleToggle}
                className="cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash size={17} />
                ) : (
                  <IoMdEye size={19} />
                )}
              </button>
            </div>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              type="text"
              placeholder="Contact (optional)"
              className="outline-none border border-gray-300 rounded text-sm h-[35px] pl-[10px]"
            />
            <input
              onChange={(e) => setProfileImage(e.target.files[0])}
              type="file"
              accept="image/*"
              className="p-1 w-full text-sm h-[35px]
             file:mr-3 file:py-1 file:px-3 
             file:rounded file:border-0 
             file:bg-gray-200 file:text-gray-700
             file:cursor-pointer"
            />
            {isError && <p className="text-[#C10115]">{error.response?.data?.message || "Something went wrong"}</p>}
            <div className="w-full flex justify-center">
              <button 
              type="submit"
              disabled={isPending}
              className="border w-fit px-3 mt-[5px] h-[35px] rounded-lg bg-black text-white cursor-pointer flex items-center justify-center min-w-[100px]">
                {isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span>Register</span>
                )}
              </button>
            </div>
            <div className="mt-[8px]">
              <span>Already have an account ?</span>{" "}
              <Link to={"/login"} className="text-[#082567] hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
