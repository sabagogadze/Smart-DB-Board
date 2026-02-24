import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, Plug, Wind, ChefHat, WashingMachine, 
  Utensils, Bath, TreePine, Coffee, Plus, Trash2, 
  Zap, Shield, Info, ShoppingCart
} from 'lucide-react';

type PointType = 'lighting' | 'socket' | 'appliance';

interface PredefinedPoint {
  id: string;
  name: string;
  powerKw: number;
  type: PointType;
  isWet: boolean;
  isDedicated: boolean;
  icon: React.ElementType;
}

const PREDEFINED_POINTS: PredefinedPoint[] = [
  { id: 'light', name: 'განათება', powerKw: 0.1, type: 'lighting', isWet: false, isDedicated: false, icon: Lightbulb },
  { id: 'socket', name: 'შტეფსელი (მშრალი)', powerKw: 2.0, type: 'socket', isWet: false, isDedicated: false, icon: Plug },
  { id: 'ac', name: 'კონდიციონერი', powerKw: 2.5, type: 'appliance', isWet: false, isDedicated: true, icon: Wind },
  { id: 'oven', name: 'ელ. ღუმელი', powerKw: 3.0, type: 'appliance', isWet: false, isDedicated: true, icon: ChefHat },
  { id: 'washing_machine', name: 'სარეცხი მანქანა', powerKw: 2.0, type: 'appliance', isWet: true, isDedicated: true, icon: WashingMachine },
  { id: 'dishwasher', name: 'ჭურჭლის სარეცხი', powerKw: 2.0, type: 'appliance', isWet: true, isDedicated: true, icon: Utensils },
  { id: 'bathroom', name: 'აბაზანა', powerKw: 2.0, type: 'socket', isWet: true, isDedicated: true, icon: Bath },
  { id: 'outdoor', name: 'გარე პერიმეტრი', powerKw: 1.0, type: 'socket', isWet: true, isDedicated: true, icon: TreePine },
  { id: 'kettle', name: 'ჩაიდანი', powerKw: 2.0, type: 'appliance', isWet: false, isDedicated: false, icon: Coffee },
];

interface Module {
  id: string;
  name: string;
  type: 'main' | 'relay' | 'mcb' | 'rcbo';
  amperage: number;
  poles: number;
  modulesCount: number;
  productId: string;
  description: string;
  isWet?: boolean;
}

const getBreakerAmperage = (powerKw: number, type: PointType) => {
  const amps = (powerKw * 1000) / 230;
  const sizes = [10, 16, 20, 25, 32, 40, 50, 63];
  let recommended = sizes.find(s => s >= amps) || 63;
  if (type === 'socket' && recommended < 16) recommended = 16;
  if (type === 'lighting' && recommended < 10) recommended = 10;
  return recommended;
};

function generateModules(groups: (PredefinedPoint & { instanceId: string })[], includeRelay: boolean): Module[] {
  const totalPowerKw = groups.reduce((sum, g) => sum + g.powerKw, 0);
  const totalAmps = (totalPowerKw * 1000) / 230;
  // Apply a diversity factor of 0.8 for the main breaker, minimum 25A
  const designAmps = totalAmps > 0 ? Math.max(totalAmps * 0.8, 25) : 25; 
  const mainSizes = [25, 32, 40, 50, 63];
  let mainAmperage = mainSizes.find(s => s >= designAmps) || 63;
  if (groups.length === 0) mainAmperage = 63;

  const modules: Module[] = [];
  
  modules.push({
    id: 'main',
    name: 'მთავარი ამომრთველი',
    type: 'main',
    amperage: mainAmperage,
    poles: 2,
    modulesCount: 2,
    productId: `main-mcb-${mainAmperage}a-2p`,
    description: `2-პოლუსიანი შემყვანი ავტომატი ${mainAmperage}A`
  });

  if (includeRelay) {
    const relayAmperage = mainAmperage <= 40 ? 40 : 63;
    modules.push({
      id: 'relay',
      name: 'ძაბვის რელე',
      type: 'relay',
      amperage: relayAmperage,
      poles: 2,
      modulesCount: 2,
      productId: `voltage-relay-${relayAmperage}a`,
      description: `ძაბვის დამცავი რელე ${relayAmperage}A`
    });
  }

  groups.forEach((g) => {
    const amp = getBreakerAmperage(g.powerKw, g.type);
    if (g.isWet) {
      modules.push({
        id: g.instanceId,
        name: g.name,
        type: 'rcbo',
        amperage: amp,
        poles: 2,
        modulesCount: 2,
        productId: `rcbo-${amp}a-30ma-c`,
        description: `დიფ. ავტომატი 30mA, Type C, ${amp}A`,
        isWet: true
      });
    } else {
      modules.push({
        id: g.instanceId,
        name: g.name,
        type: 'mcb',
        amperage: amp,
        poles: 1,
        modulesCount: 1,
        productId: `mcb-${amp}a-1p-c`,
        description: `Type C, ${amp}A`
      });
    }
  });

  return modules;
}

const ModuleBlock = ({ module }: { module: Module }) => {
  const width = module.modulesCount * 44; // 44px per module
  
  const isDiff = module.type === 'rcbo';
  const isMain = module.type === 'main';
  const isRelay = module.type === 'relay';

  let bgColor = 'bg-[#141414]';
  let borderColor = 'border-[#2a2a2a]';
  let accentColor = 'bg-zinc-600';
  let textColor = 'text-zinc-300';

  if (isDiff) {
    borderColor = 'border-blue-500/40';
    accentColor = 'bg-blue-500';
    bgColor = 'bg-[#0a101a]';
    textColor = 'text-blue-200';
  } else if (isMain) {
    borderColor = 'border-[#00ff88]/40';
    accentColor = 'bg-[#00ff88]';
    bgColor = 'bg-[#0a1a10]';
    textColor = 'text-[#00ff88]';
  } else if (isRelay) {
    borderColor = 'border-orange-500/40';
    accentColor = 'bg-orange-500';
    bgColor = 'bg-[#1a100a]';
    textColor = 'text-orange-200';
  }

  return (
    <div 
      className={`relative flex flex-col items-center justify-between h-36 border ${borderColor} ${bgColor} rounded-md shadow-lg transition-all hover:border-opacity-100`}
      style={{ width: `${width}px` }}
      title={module.description}
    >
      <div className={`w-full h-1.5 ${accentColor} rounded-t-md opacity-90`} />
      
      <div className="w-5 h-8 bg-[#080808] rounded-sm mt-3 border border-[#2a2a2a] shadow-inner flex items-center justify-center">
         <div className={`w-full h-1/2 ${isMain ? 'bg-[#00ff88]' : 'bg-red-500'} rounded-sm`} />
      </div>

      <div className="flex flex-col items-center text-center px-1 pb-3 w-full">
        <span className={`text-[11px] font-mono font-bold leading-tight mt-2 ${textColor}`}>{module.amperage}A</span>
        <span className="text-[9px] text-zinc-500 leading-tight truncate w-full mt-1 px-1">{module.name}</span>
      </div>
    </div>
  )
}

export default function App() {
  const [groups, setGroups] = useState<(PredefinedPoint & { instanceId: string })[]>([]);
  const [includeRelay, setIncludeRelay] = useState(true);

  const addGroup = (point: PredefinedPoint) => {
    const count = groups.filter(g => g.id === point.id).length;
    const newName = count > 0 ? `${point.name} (ჯგუფი ${count + 1})` : point.name;
    setGroups([...groups, { ...point, name: newName, instanceId: `${point.id}_${Date.now()}` }]);
  };

  const removeGroup = (instanceId: string) => {
    setGroups(groups.filter(g => g.instanceId !== instanceId));
  };

  const updateGroup = (instanceId: string, updates: Partial<PredefinedPoint>) => {
    setGroups(groups.map(g => g.instanceId === instanceId ? { ...g, ...updates } : g));
  };

  const modules = useMemo(() => generateModules(groups, includeRelay), [groups, includeRelay]);
  const totalModulesCount = modules.reduce((sum, m) => sum + m.modulesCount, 0);
  
  const boardSizes = [8, 12, 18, 24, 36, 48, 72];
  const recommendedSize = boardSizes.find(s => s >= totalModulesCount) || 72;

  const totalPrice = modules.reduce((sum, m) => {
    if (m.type === 'main') return sum + 45;
    if (m.type === 'relay') return sum + 85;
    if (m.type === 'rcbo') return sum + 65;
    return sum + 12;
  }, 0);

  const handleCheckout = () => {
    const checkoutData = {
      modules: modules.map(m => ({
        productId: m.productId,
        quantity: 1,
        name: m.name
      })),
      recommendedBoardSize: recommendedSize,
      totalPrice
    };
    console.log("Checkout Data (JSON):", JSON.stringify(checkoutData, null, 2));
    alert("კოდი დაგენერირებულია! იხილეთ კონსოლი (F12) JSON ფორმატისთვის.");
  };

  // Chunk modules into rows of max 12 modules
  const rows: Module[][] = [];
  let currentRow: Module[] = [];
  let currentWidth = 0;
  const MAX_ROW_MODULES = 12;

  modules.forEach(m => {
    if (currentWidth + m.modulesCount > MAX_ROW_MODULES && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [m];
      currentWidth = m.modulesCount;
    } else {
      currentRow.push(m);
      currentWidth += m.modulesCount;
    }
  });
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Sidebar - Points Selection */}
      <div className="w-full md:w-80 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col h-screen shrink-0">
        <div className="p-6 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="text-[#00ff88] w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-white">Poweron.ge</h1>
          </div>
          <p className="text-sm text-zinc-400">Smart DB Configurator</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">წერტილების დამატება</h2>
          {PREDEFINED_POINTS.map(point => (
            <button
              key={point.id}
              onClick={() => addGroup(point)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#141414] border border-[#1a1a1a] hover:border-[#00ff88]/50 hover:bg-[#1a241c] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${point.isWet ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-300'} group-hover:text-[#00ff88]`}>
                  <point.icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-zinc-200">{point.name}</div>
                  <div className="text-xs text-zinc-500">{point.powerKw} kW {point.isWet && '• სველი'}</div>
                </div>
              </div>
              <Plus className="w-4 h-4 text-zinc-600 group-hover:text-[#00ff88]" />
            </button>
          ))}
        </div>
      </div>

      {/* Center - Visual Board */}
      <div className="flex-1 flex flex-col h-screen relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] via-[#080808] to-[#050505]">
        <div className="p-6 flex justify-between items-center border-b border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-md z-10">
          <h2 className="text-lg font-medium text-zinc-200">ვიზუალური ფარი</h2>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Shield className="w-4 h-4 text-[#00ff88]" />
            <span>Type C დაცვა</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 flex items-start justify-center custom-scrollbar">
          {/* DIN Rail Container */}
          <div className="w-full max-w-3xl bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-8 shadow-2xl">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative flex justify-center w-full mb-8 last:mb-0">
                {/* DIN Rail Background Line for this row */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-4 bg-zinc-800/50 border-y border-zinc-700/50 rounded-sm z-0" />
                
                <div className="relative z-10 flex gap-[1px]">
                  {row.map((m, i) => (
                    <ModuleBlock key={`${m.id}_${i}`} module={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Summary */}
      <div className="w-full md:w-96 bg-[#0d0d0d] border-l border-[#1a1a1a] flex flex-col h-screen shrink-0">
        <div className="p-6 border-b border-[#1a1a1a]">
          <h2 className="text-lg font-medium text-zinc-200">სპეციფიკაცია</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#141414] border border-[#1a1a1a] rounded-xl p-4">
              <div className="text-xs text-zinc-500 mb-1">მოდულები</div>
              <div className="text-2xl font-mono text-white">{totalModulesCount}</div>
            </div>
            <div className="bg-[#141414] border border-[#1a1a1a] rounded-xl p-4">
              <div className="text-xs text-zinc-500 mb-1">რეკომენდებული ფარი</div>
              <div className="text-2xl font-mono text-[#00ff88]">{recommendedSize}</div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-[#141414] border border-[#1a1a1a] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-medium text-zinc-200">ძაბვის რელე</div>
                <div className="text-[10px] text-zinc-500">იცავს ტექნიკას ძაბვის ცვალებადობისგან</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={includeRelay}
                onChange={(e) => setIncludeRelay(e.target.checked)}
              />
              <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ff88]"></div>
            </label>
          </div>

          {/* Selected Points List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-zinc-400">ჯგუფები</h3>
              <span className="text-xs bg-[#1a1a1a] text-zinc-400 px-2 py-1 rounded-full">{groups.length}</span>
            </div>
            <div className="space-y-3">
              {groups.length === 0 ? (
                <div className="text-sm text-zinc-600 italic text-center py-4">ჯერ არ დაგიმატებიათ ჯგუფები</div>
              ) : (
                groups.map(g => (
                  <div key={g.instanceId} className="bg-[#141414] border border-[#1a1a1a] rounded-lg p-3 group-item">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 w-full pr-2">
                        <g.icon className="w-4 h-4 text-zinc-500 shrink-0 mt-1" />
                        <input 
                          type="text" 
                          value={g.name}
                          onChange={(e) => updateGroup(g.instanceId, { name: e.target.value })}
                          className="bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-[#00ff88] outline-none text-sm text-zinc-200 w-full transition-colors pb-0.5"
                        />
                      </div>
                      <button 
                        onClick={() => removeGroup(g.instanceId)}
                        className="text-zinc-600 hover:text-red-400 transition-colors p-1 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between pl-6">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-zinc-500">სიმძლავრე:</label>
                        <div className="flex items-center gap-1">
                          <input 
                            type="number" 
                            step="0.1"
                            min="0.1"
                            value={g.powerKw}
                            onChange={(e) => updateGroup(g.instanceId, { powerKw: parseFloat(e.target.value) || 0 })}
                            className="w-14 bg-[#080808] border border-zinc-700 rounded px-1.5 py-0.5 text-xs text-zinc-300 focus:border-[#00ff88] outline-none"
                          />
                          <span className="text-xs text-zinc-500">kW</span>
                        </div>
                      </div>
                      <label className="flex items-center gap-1.5 cursor-pointer group/wet">
                        <input 
                          type="checkbox" 
                          checked={g.isWet}
                          onChange={(e) => updateGroup(g.instanceId, { isWet: e.target.checked })}
                          className="hidden"
                        />
                        <div className={`w-3 h-3 rounded-sm border flex items-center justify-center transition-colors ${g.isWet ? 'bg-blue-500 border-blue-500' : 'border-zinc-600 group-hover/wet:border-blue-400'}`}>
                          {g.isWet && <Shield className="w-2 h-2 text-white" />}
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider ${g.isWet ? 'text-blue-400' : 'text-zinc-500'}`}>დიფ. დაცვა</span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Logic Info */}
          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 shrink-0" />
            <div className="text-xs text-blue-200/70 leading-relaxed">
              სისტემა ავტომატურად ითვლის ამომრთველის ამპერაჟს სიმძლავრის მიხედვით. შეგიძლიათ შეცვალოთ ჯგუფის სახელი, სიმძლავრე და ჩართოთ/გამორთოთ დიფერენციალური დაცვა.
            </div>
          </div>
        </div>

        {/* Checkout Footer */}
        <div className="p-6 border-t border-[#1a1a1a] bg-[#0a0a0a]">
          <div className="flex items-end justify-between mb-4">
            <div className="text-sm text-zinc-500">ჯამური ფასი</div>
            <div className="text-3xl font-mono text-white">₾{totalPrice}</div>
          </div>
          <button 
            onClick={handleCheckout}
            className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>კალათაში დამატება</span>
          </button>
        </div>
      </div>

    </div>
  );
}
