const NoteSkeleton = () => {
  return (
    <div className="mt-[20px] rounded-2xl py-[20px] px-[20px] bg-white shadow-[0px_5px_15px_rgba(0,0,0,0.15)] animate-pulse">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-3"></div>

      <div className="h-3 bg-gray-300 rounded w-1/3 mt-4"></div>

      <div className="flex gap-[20px] mt-[15px]">
        <div className="h-[40px] w-[90px] bg-gray-300 rounded-xl"></div>
        <div className="h-[40px] w-[90px] bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );
};

export default NoteSkeleton