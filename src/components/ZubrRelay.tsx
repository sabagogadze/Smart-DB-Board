import React from 'react';

const ZubrRelay = () => {
 return (
   <div className="flex flex-col items-center select-none relative z-10">
     {/* Main Device Container - Height adjusted to 340px */}
     <div className="relative w-40 h-[340px] bg-[#f2f2f2] rounded-sm shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-gray-400 flex flex-col items-center">
       
       {/* --- TOP TERMINALS SECTION --- */}
       <div className="w-full h-20 flex justify-between px-3 pt-2 relative">
         
         {/* Left Terminal (1 L) */}
         <div className="flex flex-col items-center">
           <div className="flex justify-between w-full px-1 mb-0.5 text-[9px] font-bold text-gray-500">
             <span>1</span>
           </div>
           {/* Screw */}
           <div className="w-10 h-10 bg-[#e0e0e0] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center relative z-10">
              <div 
                className="relative w-7 h-7 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                style={{ background: 'conic-gradient(from 120deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
              >
                 <div className="absolute w-[2px] h-4 bg-[#333] rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                 <div className="absolute w-[2px] h-4 bg-[#333] -rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
              </div>
           </div>
           <span className="text-[10px] font-bold text-gray-500 mt-0.5">L</span>
           <div className="w-[1px] h-3 bg-gray-400 mt-0.5"></div>
         </div>

         {/* Center Down Arrow */}
         <div className="absolute left-1/2 -translate-x-1/2 top-4 opacity-40">
           <svg width="12" height="14" viewBox="0 0 14 16" fill="none" stroke="black" strokeWidth="1.5">
             <path d="M7 0 V12 M3 8 L7 13 L11 8"/>
           </svg>
         </div>

         {/* Right Terminal (3 N) */}
         <div className="flex flex-col items-center">
           <div className="flex justify-end w-full px-1 mb-0.5 text-[9px] font-bold text-gray-500">
             <span>3</span>
           </div>
           {/* Screw */}
           <div className="w-10 h-10 bg-[#e0e0e0] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center relative z-10">
              <div 
                className="relative w-7 h-7 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                style={{ background: 'conic-gradient(from 45deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
              >
                 <div className="absolute w-[2px] h-4 bg-[#333] rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                 <div className="absolute w-[2px] h-4 bg-[#333] -rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
              </div>
           </div>
           <span className="text-[10px] font-bold text-gray-500 mt-0.5">N</span>
           <div className="w-[1px] h-3 bg-gray-400 mt-0.5"></div>
         </div>
       </div>


       {/* --- PROTRUDING CENTER MONITOR & BUTTONS --- */}
       <div className="absolute top-[20%] left-[4%] right-[4%] h-[180px] bg-gradient-to-b from-[#fefefe] to-[#f4f4f4] rounded-sm shadow-[0_10px_15px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,1)] border border-gray-300 z-20 flex flex-col items-center pt-3">
         
         {/* Glowing Red Monitor */}
         <div className="relative flex items-center justify-center w-full mb-4">
           <span 
             className="font-mono text-[40px] font-semibold tracking-widest text-[#ff3333] leading-none"
             style={{
               textShadow: '0 0 8px rgba(255, 0, 0, 0.8), 0 0 15px rgba(255, 0, 0, 0.4), 0 0 2px rgba(255,0,0,0.9)'
             }}
           >
             220
           </span>
           <span className="absolute right-3 top-1 text-[10px] font-bold text-gray-800">V</span>
         </div>

         {/* Buttons Layout */}
         <div className="w-full px-3 flex flex-col gap-1.5">
           
           {/* Top Row: [ - ]  LED  [ + ] */}
           <div className="flex justify-between items-center relative">
             {/* (-) Button */}
             <div className="w-9 h-6 bg-[#fdfdfd] rounded-[3px] border border-gray-300 shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_1px_white] flex items-center justify-center cursor-pointer active:translate-y-[1px] active:shadow-none">
                <div className="w-3 h-[1.5px] bg-gray-600 rounded-full"></div>
             </div>
             
             {/* LED & Switch Line */}
             <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 mt-2">
                <div className="flex items-end mb-0.5">
                  <div className="w-1.5 h-[1px] bg-gray-500"></div>
                  <div className="w-2 h-[1px] bg-gray-500 origin-bottom-left -rotate-30 -ml-[1px]"></div>
                  <div className="w-1.5 h-[1px] bg-gray-500"></div>
                </div>
                <div className="w-[5px] h-[2px] bg-[#4ade80] rounded-[1px] shadow-[0_0_4px_rgba(74,222,128,0.8)]"></div>
             </div>

             {/* (+) Button */}
             <div className="w-9 h-6 bg-[#fdfdfd] rounded-[3px] border border-gray-300 shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_1px_white] flex items-center justify-center relative cursor-pointer active:translate-y-[1px] active:shadow-none">
                <div className="absolute w-3 h-[1.5px] bg-gray-600 rounded-full"></div>
                <div className="absolute h-3 w-[1.5px] bg-gray-600 rounded-full"></div>
             </div>
           </div>

           {/* Bottom Row: [ Menu ]  [ i ] */}
           <div className="flex justify-between items-center mt-0.5">
             {/* (Menu) Button */}
             <div className="w-9 h-6 bg-[#fdfdfd] rounded-[3px] border border-gray-300 shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_1px_white] flex flex-col items-center justify-center gap-[1.5px] cursor-pointer active:translate-y-[1px] active:shadow-none">
                <div className="w-3 h-[1px] bg-gray-600 rounded-full"></div>
                <div className="w-3 h-[1px] bg-gray-600 rounded-full"></div>
                <div className="w-3 h-[1px] bg-gray-600 rounded-full"></div>
             </div>

             {/* (i) Button */}
             <div className="w-9 h-6 bg-[#fdfdfd] rounded-[3px] border border-gray-300 shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_1px_white] flex items-center justify-center cursor-pointer active:translate-y-[1px] active:shadow-none">
                <span className="font-serif font-bold text-[12px] text-gray-600 italic leading-none pb-[1px]">i</span>
             </div>
           </div>

         </div>

         {/* Branding */}
         <div className="mt-auto mb-1.5 text-[9px] text-gray-700 tracking-tight flex gap-1 items-baseline">
           <span className="font-bold text-[10px]">ZUBR</span>
           <span className="text-gray-600">D2-63red</span>
           <span className="font-bold text-gray-600 ml-0.5">63 A</span>
         </div>

       </div>


       {/* --- BOTTOM TERMINALS SECTION --- */}
       <div className="absolute bottom-0 w-full h-20 flex justify-between px-3 pb-2">
         
         {/* Left Terminal (2 L) */}
         <div className="flex flex-col items-center justify-end">
           {/* Schematic Line Up */}
           <div className="flex flex-col items-center mb-0.5">
              <div className="w-[1px] h-2 bg-gray-400"></div>
              <div className="w-1.5 h-[1px] bg-gray-400 origin-bottom-left -rotate-45 ml-1.5"></div>
              <div className="w-[1px] h-2 bg-gray-400"></div>
           </div>
           
           <div className="flex justify-between w-full px-1 mb-[1px] text-[9px] font-bold text-gray-500">
             <span className="mt-0.5">L</span>
           </div>
           {/* Screw */}
           <div className="w-10 h-10 bg-[#e0e0e0] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center relative z-10">
              <div 
                className="relative w-7 h-7 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                style={{ background: 'conic-gradient(from 180deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
              >
                 <div className="absolute w-[2px] h-4 bg-[#333] rotate-12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                 <div className="absolute w-[2px] h-4 bg-[#333] -rotate-[78deg] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
              </div>
           </div>
           <div className="w-full flex justify-start pl-1 mt-0.5 text-[9px] font-bold text-gray-500">
             <span>2</span>
           </div>
         </div>

         {/* Center Down Arrow */}
         <div className="absolute left-1/2 -translate-x-1/2 bottom-6 opacity-40">
           <svg width="12" height="14" viewBox="0 0 14 16" fill="none" stroke="black" strokeWidth="1.5">
             <path d="M7 0 V12 M3 8 L7 13 L11 8"/>
           </svg>
         </div>

         {/* Right Empty Space */}
         <div className="w-10 h-10"></div>
       </div>

     </div>
   </div>
 );
};

export default ZubrRelay;
