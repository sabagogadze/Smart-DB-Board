import React from 'react';

/**
 * Realistic DIN Rail Component
 */
export const DinRail = () => {
  return (
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[84px] md:h-[120px] bg-gradient-to-b from-[#9ca3af] via-[#e5e7eb] to-[#6b7280] shadow-[0_10px_20px_rgba(0,0,0,0.3),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-3px_5px_rgba(0,0,0,0.5)] flex items-center overflow-hidden border-y border-gray-400 z-0">
      
      {/* Inner recessed track of the DIN rail */}
      <div className="w-full h-[42px] md:h-[60px] bg-gradient-to-b from-[#8a92a1] via-[#cbd5e1] to-[#94a3b8] shadow-[inset_0_5px_8px_rgba(0,0,0,0.4),inset_0_-4px_6px_rgba(0,0,0,0.1)] flex items-center justify-around px-2 gap-2 md:gap-4">
        
        {/* Mounting Slots (Oval holes) */}
        {[...Array(30)].map((_, i) => (
          <div 
            key={`slot-${i}`} 
            className="min-w-[28px] md:min-w-[40px] w-[28px] md:w-[40px] h-[12px] md:h-[18px] bg-[#121212] rounded-full shadow-[inset_0_3px_6px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.5)] border border-black/80"
          ></div>
        ))}
      </div>

      {/* Subtle highlight line on the bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/40"></div>
    </div>
  );
};
