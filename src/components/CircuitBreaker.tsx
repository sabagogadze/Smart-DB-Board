import React, { useState } from 'react';

export const CircuitBreaker = ({ 
  amperage = "40", 
  type = "C", 
  model = "SH 202", 
  voltage = "400V",
  poles = 2,
  initialOn = true 
}: {
  amperage?: string;
  type?: string;
  model?: string;
  voltage?: string;
  poles?: number;
  initialOn?: boolean;
}) => {
  const [isOn, setIsOn] = useState(initialOn);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative flex bg-[#e2e2e2] p-0.5 rounded-sm shadow-[0_20px_35px_rgba(0,0,0,0.3),0_5px_15px_rgba(0,0,0,0.2)] border border-gray-400/80">
        {[...Array(poles)].map((_, i) => (
          <div 
            key={i}
            className={`
              relative w-20 h-[340px] bg-[#f4f4f4] border-gray-300 border-r
              flex flex-col items-center py-4
              ${i === 0 ? 'rounded-l-sm border-l' : ''}
              ${i === poles - 1 ? 'rounded-r-sm' : ''}
            `}
            style={{
              backgroundImage: 'linear-gradient(to right, #dbdbdb 0%, #ffffff 15%, #f4f4f4 50%, #ffffff 85%, #dbdbdb 100%)'
            }}
          >
            {/* Vertical Body Split Line (Manufacturing seam typical for 1-pole breakers) */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/10 shadow-[1px_0_0_rgba(255,255,255,0.7)] z-0 pointer-events-none"></div>

            {/* Top Terminal (Screw) */}
            <div className="w-14 h-14 bg-[#e5e5e5] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center mb-6 z-10">
               <div 
                 className="relative w-10 h-10 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                 style={{ background: 'conic-gradient(from 120deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
               >
                  <div className="absolute w-[3px] h-6 bg-[#333] rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                  <div className="absolute w-[3px] h-6 bg-[#333] -rotate-45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                  <div className="w-5 h-5 rounded-full border border-gray-600/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] pointer-events-none"></div>
               </div>
            </div>

            {/* Placeholder for the absolute Red Stripe to maintain spacing */}
            <div className="w-full h-[22px] mb-2 z-10"></div>

            {/* Product Details (Dynamic for 1 or 2 poles) */}
            <div className="w-full px-2 flex justify-between text-gray-500 font-sans leading-none h-20 relative z-10">
              {/* Left side: Schematic (on pole 0 if 1-pole, or pole 1 if 2-pole) */}
              {( (poles === 1 && i === 0) || (poles === 2 && i === 1) ) && (
                <div className={`mt-2 opacity-60 ${poles === 1 ? 'scale-[0.85] origin-top-left absolute left-2' : 'flex justify-center w-full scale-125'}`}>
                   <svg width="24" height="40" viewBox="0 0 24 40" fill="none" stroke="#333" strokeWidth="0.8">
                      <path d="M6 4 V12 M6 12 L14 20 M6 28 V36" />
                      {poles === 2 && <path d="M18 4 V12 M18 12 L22 20 M18 28 V36" />}
                      <circle cx="6" cy="4" r="1" fill="#333" />
                      {poles === 2 && <circle cx="18" cy="4" r="1" fill="#333" />}
                      <text x="2" y="38" fontSize="6" fill="#333" stroke="none">2</text>
                      {poles === 2 && <text x="14" y="38" fontSize="6" fill="#333" stroke="none">4</text>}
                      {poles === 1 && <text x="1" y="4" fontSize="6" fill="#333" stroke="none">1</text>}
                   </svg>
                </div>
              )}
              
              {/* Right side: Text details (only on first pole) */}
              {i === 0 && (
                <div className="flex flex-col ml-auto">
                  <span className="text-[9px] text-gray-400 self-end mr-1">{model}</span>
                  <span className="text-[12px] font-bold text-gray-700 self-end mr-1">{type} {amperage}</span>
                  <span className="text-[9px] text-gray-400 self-end mr-1">~ {voltage}</span>
                  <div className="self-end mr-1 mt-1 border border-gray-400 px-0.5 text-[8px] font-bold text-gray-700">
                    6000 <span className="font-normal border-l border-gray-400 pl-0.5 ml-0.5">3</span>
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Switch Cavity / Deep Recess */}
            <div className="relative w-full h-24 flex justify-center mt-2 overflow-hidden z-10">
              {/* The deep dark recess */}
              <div className="absolute top-0 bottom-0 w-11 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] shadow-[inset_0_8px_10px_rgba(0,0,0,0.9)] rounded-sm flex flex-col justify-between py-1.5 border-t border-gray-600">
                  <span className="text-[6px] font-bold text-gray-500 text-center tracking-widest opacity-60">0 OFF</span>
                  <span className="text-[6px] font-bold text-gray-500 text-center tracking-widest opacity-60">I ON</span>
              </div>
              
              {/* White inner side-walls (guards) inside the cavity */}
              <div className="absolute top-0 bottom-0 left-[14px] w-[11px] bg-gradient-to-r from-[#e5e5e5] to-[#acacac] border-r border-[#555] shadow-[inset_-1px_0_3px_rgba(0,0,0,0.3),2px_0_4px_rgba(0,0,0,0.7)] z-0 rounded-bl-md"></div>
              <div className="absolute top-0 bottom-0 right-[14px] w-[11px] bg-gradient-to-l from-[#e5e5e5] to-[#acacac] border-l border-[#555] shadow-[inset_1px_0_3px_rgba(0,0,0,0.3),-2px_0_4px_rgba(0,0,0,0.7)] z-0 rounded-br-md"></div>
            </div>

            {/* Horizontal Body Split Line */}
            <div className="w-full h-[2px] bg-gradient-to-b from-gray-400 to-white opacity-60 mt-2 mb-2 shadow-[0_1px_1px_rgba(0,0,0,0.1)] z-10"></div>

            {/* Bottom Terminal (Screw) */}
            <div className="mt-auto w-14 h-14 bg-[#e5e5e5] rounded-sm shadow-[inset_0_4px_6px_rgba(0,0,0,0.2)] border border-gray-300 flex items-center justify-center z-10">
               <div 
                 className="relative w-10 h-10 rounded-full border border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.9)] flex items-center justify-center"
                 style={{ background: 'conic-gradient(from 45deg, #9ca3af 0%, #f3f4f6 30%, #6b7280 50%, #f3f4f6 70%, #9ca3af 100%)' }}
               >
                  <div className="absolute w-[3px] h-6 bg-[#333] rotate-12 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                  <div className="absolute w-[3px] h-6 bg-[#333] -rotate-[78deg] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] rounded-sm"></div>
                  <div className="w-5 h-5 rounded-full border border-gray-600/60 shadow-[inset_0_2px_3px_rgba(0,0,0,0.4)] pointer-events-none"></div>
               </div>
            </div>
          </div>
        ))}

        {/* Unified Red ABB Stripe */}
        <div className="absolute top-[80px] left-[2px] right-[2px] h-[22px] bg-[#ff0000] z-10 flex items-center px-3 shadow-[0_2px_3px_rgba(0,0,0,0.1)] pointer-events-none">
          <span className="text-[14px] font-black text-white italic tracking-tighter mt-[1px]">ABB</span>
        </div>

        {/* Unified Toggle Handle Assembly */}
        <div 
          onClick={() => setIsOn(!isOn)}
          className={`
            absolute left-0 right-0 h-16 flex justify-center z-20 cursor-pointer 
            transition-all duration-200 ease-in-out
            ${isOn ? 'top-[44%] -translate-y-2' : 'top-[53%] translate-y-0'}
          `}
        >
          {/* Main cylindrical handle */}
          <div className="relative w-[92%] h-10 mt-auto bg-gradient-to-b from-[#5c5c5c] via-[#2a2a2a] to-[#111] rounded-[4px] shadow-[0_12px_15px_-3px_rgba(0,0,0,0.8),inset_0_2px_1px_rgba(255,255,255,0.25)] border-t border-gray-500 border-b border-black">
            
            {/* Connectors going into the cavities */}
            {[...Array(poles)].map((_, idx) => (
               <div 
                 key={`connector-${idx}`} 
                 className="absolute -top-[10px] w-7 h-[14px] bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] z-[-1] rounded-t-sm border border-b-0 border-[#111] shadow-[inset_0_2px_2px_rgba(255,255,255,0.1)]" 
                 style={{ left: `${(100/poles) * idx + (100/poles/2)}%`, transform: 'translateX(-50%)' }}
               ></div>
            ))}

            {/* Indentations on the cylinder */}
            {[...Array(poles)].map((_, idx) => (
              <div 
                key={`indent-${idx}`}
                className="absolute top-0 bottom-0 w-4 bg-black/40 shadow-[inset_0_3px_6px_rgba(0,0,0,0.8)] border-x border-black/50"
                style={{ left: `${(100/poles) * idx + (100/poles/2)}%`, transform: 'translateX(-50%)' }}
              ></div>
            ))}
            
            {/* Locking mechanism pin on the right edge */}
            <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-gradient-to-b from-[#444] to-[#111] rounded-r-sm shadow-[2px_0_3px_rgba(0,0,0,0.4)] border border-l-0 border-black"></div>
            <div className="absolute -right-[5px] top-[75%] w-[4px] h-[3px] bg-[#111] rounded-full shadow-[0_1px_1px_rgba(255,255,255,0.2)]"></div>
          </div>
        </div>

      </div>
    </div>
  );
};
