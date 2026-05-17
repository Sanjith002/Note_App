import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useRef, useState } from 'react'
import axios from '../api/axios'
import LoadingSpinner from '../common/LoadingSpinner'

const Profile = () => {
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {data: user, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/me")
      return res.data;
    },
    retry: false,
  })

  const {mutate: uploadProfile, isPending, isError, error} = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post("/api/auth/upload-profile-image",formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      return res.data;
    },
    onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["authUser"]
    });
    setPreview(null);
    setSelectedFile(null);
  }
  })

  if(isLoading){
    return(
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg"/>
      </div>
    )
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profile_image", selectedFile);

    uploadProfile(formData);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  return (
    <div className='flex h-screen justify-center items-center bg-gray-100'>
      <div className='w-[400px] pb-[25px] bg-white border border-gray-600 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]'>
        <p className='mt-[20px] font-medium text-xl text-center'>PROFILE</p>
        <div className='mt-[15px] pl-[25px] flex flex-col gap-[10px]'>
          <div><span className='font-semibold'>Username :</span> <span>{user?.username}</span></div>
          <div><span className='font-semibold'>Email :</span> <span>{user?.email}</span></div>
          <div><span className='font-semibold'>Contact :</span> <span>{user?.contact || "Not Given"}</span></div>
          <div className='w-full flex justify-center'>
            <img src={preview? preview : user?.profile_image ? `https://note-app-1-xwg7.onrender.com${user.profile_image}`: "/avatar-placeholder.png"} 
                 alt="profile" 
                 className="w-35 h-35 mt-[10px] rounded-full object-cover"/>
          </div>
          <div className='w-full flex justify-center'>
          {isError && <p className="text-[#C10115]">{error.response?.data?.message || "Something went wrong"}</p>}
          </div>
          <input 
          type="file" 
          accept='image/*' 
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden p-1 w-full text-sm h-[35px]
             file:mr-3 file:py-1 file:px-3 
             file:rounded file:border-0 
             file:bg-gray-200 file:text-gray-700
             file:cursor-pointer'/>
             
          <div className='w-full flex justify-center gap-[20px]'>  
          <button 
          onClick={handleButtonClick}
          disabled={isPending}
          className='border w-fit px-3 mt-[15px] h-[35px] text-sm bg-black text-white rounded-lg cursor-pointer'>{isPending? "Uploading..." : preview? "Change Image" : user.profile_image ? "Change profile image" : "Upload profile image"}</button>
          {preview && <button 
          onClick={handleUpload}
          disabled={isPending}
          className='border w-fit px-3 mt-[15px] h-[35px] text-sm bg-black text-white rounded-lg cursor-pointer'>{isPending ? "Uploading..." : "Save Image"}</button> }
          </div> 
        </div>
      </div>
    </div>
  )
}

export default Profile