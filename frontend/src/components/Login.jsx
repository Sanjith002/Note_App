import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../common/LoadingSpinner";
import axios from "../api/axios"

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient()
  const inputRef = useRef(null);

  const { mutate: login, isPending, isError, error,} = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/api/auth/login",data);
      return res.data;
    },

    onSuccess: () => {
      toast.success("Login successful", {
      duration: 4000
    });
      queryClient.invalidateQueries({
				queryKey: ["authUser"]
			})
    },

    onError: (error) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({username,password});
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(!showPassword);
    inputRef.current.focus();
  };
  return (
    <form onSubmit={handleSubmit}>
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[400px] h-[350px] flex  border-gray-600 rounded-2xl flex-col items-center justify-center gap-5 shadow-[0px_5px_15px_rgba(0,0,0,0.35)] bg-white">
        <div className="font-medium text-xl">LOGIN</div>
        <div className="flex flex-col gap-[10px]">
          <input
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            type="text"
            placeholder="Username or Email"
            className="outline-none border border-gray-300 rounded text-sm h-[35px] pl-[10px] "
          />
          <div className="border border-gray-300 rounded text-sm h-[35px] pl-[10px] flex items-center justify-between pr-[15px] mt-[10px]">
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
              {showPassword ? <FaEyeSlash size={17} /> : <IoMdEye size={19} />}
            </button>
          </div>
          {isError && <p className="text-[#C10115]">{error.response?.data?.message || "Something went wrong"}</p>}
          <div className="w-full flex justify-center">
            <button 
            type="submit"
            disabled={isPending}
            className="border w-fit px-3 mt-[5px] h-[35px] rounded-lg bg-black text-white cursor-pointer">
              {isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <span>Login</span>
                )}
            </button>
          </div>
          <div className="mt-[10px]">
            <span>Don't have an account ?</span>{" "}
            <Link to={"/register"} className="text-[#082567] hover:underline">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
    </form>
  );
};

export default Login;
