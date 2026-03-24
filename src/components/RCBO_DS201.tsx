import React, { useState } from 'react';

const RCBO_DS201 = ({ amperage = "25", initialOn = false }) => {
 const [isOn, setIsOn] = useState(initialOn);

 return (
   <div className="flex flex-col items-center select-none relative z-10">
     <div className="relative flex bg-[#e2e2e2] p-0.5 rounded-sm shadow-[0_20px_35px_rgba(0,0,0,0.3),0_5px_15px_rgba(0,0,0,0.2)] border border-gray-400/80">
       
       {/* Main Body Container (2 Poles wide = w-40) */}
       <div 
         className="relative w-40 h-[340px] bg-[#f4f4f4] rounded-sm flex flex-col items-center py-2"
         style={{
           backgroundImage: 'linear-gradient(to right, #dbdbdb 0%, #ffffff 15%, #f4f4f4 50%, #ffffff 85%, #dbdbdb 100%)'
         }}
       >
         {/* Vertical Body Split Line (Manufacturing seam) */}
         <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/10 shadow-[1px_0_0_rgba(255,255,255,0.7)] z-0 pointer-events-none"></div>

         {/* TOP SECTION: Terminals & Labels */}
         <div className="w-full flex justify-between px-5 mb-2 z-10">
           {/* Pole 1: 1/2 */}
           <div className="flex flex-col items-center gap-1">
             <div className="w-10 h-10 bg-[#e5e5e5] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center">
                <div 
                  className="relative w-7 h-7 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                  style={{ background: 'conic-gradient(from 120deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
                >
                   <div className="absolute w-[2px] h-4 bg-[#333] rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="absolute w-[2px] h-4 bg-[#333] -rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="w-3 h-3 rounded-full border border-gray-600/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] pointer-events-none"></div>
                </div>
             </div>
             <span className="text-gray-500 font-sans text-[12px] tracking-widest mr-3">1/2</span>
           </div>

           {/* Pole 2: N */}
           <div className="flex flex-col items-center gap-1">
             <div className="w-10 h-10 bg-[#e5e5e5] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center">
                <div 
                  className="relative w-7 h-7 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                  style={{ background: 'conic-gradient(from 120deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
                >
                   <div className="absolute w-[2px] h-4 bg-[#333] rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="absolute w-[2px] h-4 bg-[#333] -rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="w-3 h-3 rounded-full border border-gray-600/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] pointer-events-none"></div>
                </div>
             </div>
             <span className="text-gray-500 font-sans text-[12px] ml-4">N</span>
           </div>
         </div>

         {/* RED ABB STRIPE */}
         <div className="w-full h-[20px] bg-[#ff0000] z-10 flex items-center px-4 shadow-[0_2px_3px_rgba(0,0,0,0.1)]">
           <span className="text-[12px] font-black text-white italic tracking-tighter mt-[1px]">ABB</span>
         </div>

         {/* MIDDLE SECTION: Test Button & Specs */}
         <div className="w-full px-3 py-1 flex justify-between h-20 relative z-10">
           {/* Left: Test Button & Snowflake */}
           <div className="w-1/2 flex flex-col items-center justify-start pt-0.5 relative">
             
             {/* TEST Button */}
             <div 
               className="w-9 h-4 bg-gradient-to-b from-[#f0f0f0] to-[#d4d4d4] rounded-full border border-gray-400 shadow-[0_3px_4px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center cursor-pointer active:shadow-inner active:translate-y-[1px] transition-all ml-4"
               onClick={() => setIsOn(false)}
             >
               <span className="text-[8px] font-bold text-gray-500 shadow-sm">T</span>
             </div>
             <span className="text-[6px] font-bold text-black mt-0.5 ml-4 tracking-wide">TEST</span>

             {/* Snowflake -25 Icon */}
             <div className="absolute left-0 top-1 flex items-center justify-center">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1">
                 <path d="M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93" />
                 <polygon points="12,2 10,6 14,6" fill="#555"/>
                 <polygon points="12,22 10,18 14,18" fill="#555"/>
               </svg>
               <span className="absolute text-[5px] font-bold text-black bg-[#f4f4f4] px-0.5">-25</span>
             </div>
           </div>

           {/* Right: Technical Specs */}
           <div className="w-1/2 flex flex-col pl-1 text-black font-sans leading-none gap-[2px]">
             <span className="text-[9px] font-bold tracking-wide">DS201</span>
             <div className="flex items-center gap-0.5">
               <span className="text-[10px] font-bold">C{amperage}</span>
               <div className="border border-gray-500 px-0.5 text-[7px] font-bold">
                 6000
               </div>
               <div className="border border-gray-500 px-0.5 text-[7px]">
                 3
               </div>
               <div className="border border-gray-500 px-0.5 text-[7px] flex items-center">
                 <svg width="7" height="5" viewBox="0 0 10 6" fill="none" stroke="black" strokeWidth="1">
                   <path d="M1 3 Q 3 1, 5 3 T 9 3" />
                 </svg>
               </div>
               <span className="text-[7px] font-bold">AC</span>
             </div>
             <span className="text-[7px] tracking-tight">I<span className="text-[5px]">Δ</span>n=0,03A Un=230V~</span>
             <span className="text-[6px] text-gray-500 tracking-tight mt-0.5">2CSR255080R1254</span>
           </div>
         </div>

         {/* TOGGLE SWITCH CAVITIES */}
         <div className="relative w-full h-20 flex justify-around px-2 mt-0.5 overflow-hidden z-10">
           {/* Left Cavity */}
           <div className="relative w-10 h-full bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] shadow-[inset_0_8px_10px_rgba(0,0,0,0.9)] rounded-sm flex flex-col justify-between py-1 border-t border-gray-600">
               <span className="text-[5px] font-bold text-gray-500 text-center tracking-widest opacity-60">0 OFF</span>
               <span className="text-[5px] font-bold text-gray-500 text-center tracking-widest opacity-60">I ON</span>
               <div className="absolute top-0 bottom-0 -left-[2px] w-[2px] bg-gradient-to-r from-[#e5e5e5] to-[#acacac] shadow-[2px_0_2px_rgba(0,0,0,0.5)] z-0"></div>
               <div className="absolute top-0 bottom-0 -right-[2px] w-[2px] bg-gradient-to-l from-[#e5e5e5] to-[#acacac] shadow-[-2px_0_2px_rgba(0,0,0,0.5)] z-0"></div>
           </div>

           {/* Right Cavity */}
           <div className="relative w-10 h-full bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] shadow-[inset_0_8px_10px_rgba(0,0,0,0.9)] rounded-sm flex flex-col justify-between py-1 border-t border-gray-600">
               <span className="text-[5px] font-bold text-gray-500 text-center tracking-widest opacity-60">0 OFF</span>
               <span className="text-[5px] font-bold text-gray-500 text-center tracking-widest opacity-60">I ON</span>
               <div className="absolute top-0 bottom-0 -left-[2px] w-[2px] bg-gradient-to-r from-[#e5e5e5] to-[#acacac] shadow-[2px_0_2px_rgba(0,0,0,0.5)] z-0"></div>
               <div className="absolute top-0 bottom-0 -right-[2px] w-[2px] bg-gradient-to-l from-[#e5e5e5] to-[#acacac] shadow-[-2px_0_2px_rgba(0,0,0,0.5)] z-0"></div>
           </div>
         </div>

         {/* INDICATOR WINDOWS */}
         <div className="w-full flex justify-around px-2 mt-1 z-10 relative">
           {/* Left Indicator */}
           <div className="w-10 flex justify-center">
              <div className={`w-4 h-2 rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.8)] transition-colors duration-300 ${isOn ? 'bg-[#ed1c24]' : 'bg-[#00a859]'}`}></div>
           </div>
           {/* Right Indicator & L284I text */}
           <div className="w-10 flex justify-center relative">
              <div className={`w-4 h-2 rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.8)] transition-colors duration-300 ${isOn ? 'bg-[#ed1c24]' : 'bg-[#00a859]'}`}></div>
              <span className="absolute -right-5 top-0 text-[5px] font-bold text-gray-500">L284I</span>
           </div>
         </div>

         {/* BOTTOM SECTION: Terminals & Labels */}
         <div className="w-full flex justify-between px-5 mt-auto mb-2 z-10">
           {/* Pole 1: 2/1 */}
           <div className="flex flex-col items-center gap-1">
             <span className="text-gray-500 font-sans text-[12px] tracking-widest mr-3">2/1</span>
             <div className="w-10 h-10 bg-[#e5e5e5] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center">
                <div 
                  className="relative w-7 h-7 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                  style={{ background: 'conic-gradient(from 45deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
                >
                   <div className="absolute w-[2px] h-4 bg-[#333] rotate-12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="absolute w-[2px] h-4 bg-[#333] -rotate-[78deg] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="w-3 h-3 rounded-full border border-gray-600/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] pointer-events-none"></div>
                </div>
             </div>
           </div>

           {/* Pole 2: N */}
           <div className="flex flex-col items-center gap-1">
             <span className="text-gray-500 font-sans text-[12px] ml-4">N</span>
             <div className="w-10 h-10 bg-[#e5e5e5] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center">
                <div 
                  className="relative w-7 h-7 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                  style={{ background: 'conic-gradient(from 45deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
                >
                   <div className="absolute w-[2px] h-4 bg-[#333] rotate-12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="absolute w-[2px] h-4 bg-[#333] -rotate-[78deg] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                   <div className="w-3 h-3 rounded-full border border-gray-600/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] pointer-events-none"></div>
                </div>
             </div>
           </div>
         </div>


         {/* ASYMMETRIC TOGGLE HANDLE */}
         <div 
           onClick={() => setIsOn(!isOn)}
           className={`
             absolute left-[12px] right-[12px] flex items-start z-20 cursor-pointer 
             transition-all duration-200 ease-in-out
             ${isOn ? 'top-[44%] -translate-y-3' : 'top-[50%] translate-y-0'}
           `}
         >
           {/* Left part of the handle (Standard height) */}
           <div className="w-1/2 h-8 bg-gradient-to-b from-[#4a4a4a] via-[#1a1a1a] to-[#0a0a0a] rounded-l-[3px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.8),inset_0_2px_1px_rgba(255,255,255,0.2)] border-t border-l border-gray-600/50 border-b border-black flex justify-center relative">
             <div className="absolute -top-[6px] w-5 h-[8px] bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] z-[-1] rounded-t-sm border border-b-0 border-[#111]"></div>
           </div>

           {/* Right part of the handle (Thicker/Extended with ridges) */}
           <div className="w-1/2 h-[46px] bg-gradient-to-b from-[#4a4a4a] via-[#1a1a1a] to-[#0a0a0a] rounded-r-[3px] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.8),inset_0_2px_1px_rgba(255,255,255,0.2),inset_-2px_0_2px_rgba(255,255,255,0.1)] border-t border-r border-gray-600/50 border-b border-black flex flex-col items-center justify-end pb-1 relative">
             <div className="absolute -top-[6px] w-5 h-[8px] bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] z-[-1] rounded-t-sm border border-b-0 border-[#111]"></div>
             
             {/* Horizontal Ridges (Grip) */}
             <div className="w-3/4 h-2.5 flex flex-col justify-between mb-0.5 opacity-80">
                <div className="w-full h-[1px] bg-black shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                <div className="w-full h-[1px] bg-black shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
                <div className="w-full h-[1px] bg-black shadow-[0_1px_0_rgba(255,255,255,0.1)]"></div>
             </div>
           </div>
         </div>

       </div>
     </div>
   </div>
 );
};

export default RCBO_DS201;
