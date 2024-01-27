import React from "react";

const NFTPickerSkeleton = () => {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center gap-2 justify-center">
        <div className="animate-pulse w-1/2 h-11 rounded-md bg-slate-300"></div>
        <div className="w-[10%] h-3 bg-slate-300 rounded-sm"></div>
      </div>
      <div className="flex flex-wrap justify-center mt-10 gap-2">
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
        <div className="animate-pulse w-80 h-80 rounded-md bg-slate-300"></div>
      </div>
    </div>
  );
};

export default NFTPickerSkeleton;
