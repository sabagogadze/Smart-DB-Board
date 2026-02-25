import React, { useState, useMemo, useEffect } from 'react';
import { 
  Lightbulb, Plug, Wind, ChefHat, WashingMachine, 
  Utensils, Bath, TreePine, Coffee, Plus, Trash2, 
  Zap, Shield, Info, ShoppingCart, Flame,
  ChevronUp, ChevronDown, List, X,
  Sofa, BedDouble, Home, LayoutDashboard, Settings2, Minus,
  GitMerge, Share2, Printer, Check
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
  hasRcbo?: boolean;
}

interface RoomAppliance {
  id: string;
  catalogId: string;
  powerKw: number;
}

interface Room {
  id: string;
  name: string;
  type: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'other';
  lightingCount: number;
  socketCount: number;
  appliances: RoomAppliance[];
}

const APPLIANCE_CATALOG = [
  { id: 'ac', name: 'კონდიციონერი', defaultPower: 2.5, isWet: false, icon: Wind },
  { id: 'fridge', name: 'მაცივარი', defaultPower: 0.5, isWet: false, icon: ChefHat },
  { id: 'oven', name: 'ელ. ღუმელი', defaultPower: 3.0, isWet: false, icon: ChefHat },
  { id: 'washing_machine', name: 'სარეცხი მანქანა', defaultPower: 2.0, isWet: true, icon: WashingMachine },
  { id: 'dishwasher', name: 'ჭურჭლის სარეცხი', defaultPower: 2.0, isWet: true, icon: Utensils },
  { id: 'boiler', name: 'გათბობის ქვაბი', defaultPower: 2.0, isWet: true, icon: Flame },
  { id: 'kettle', name: 'ჩაიდანი', defaultPower: 2.0, isWet: false, icon: Coffee },
];

const ROOM_TYPES = [
  { id: 'living', name: 'მისაღები', icon: Sofa },
  { id: 'bedroom', name: 'საძინებელი', icon: BedDouble },
  { id: 'kitchen', name: 'სამზარეულო', icon: ChefHat },
  { id: 'bathroom', name: 'აბაზანა', icon: Bath },
  { id: 'other', name: 'სხვა ოთახი', icon: Home },
];

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
  { id: 'boiler', name: 'გათბობის ქვაბი', powerKw: 2.0, type: 'appliance', isWet: true, isDedicated: true, icon: Flame },
];

interface Module {
  id: string;
  name: string;
  type: 'main' | 'relay' | 'mcb' | 'rcbo' | 'rccb';
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

const getCableSize = (amps: number) => {
  if (amps <= 10) return '3x1.5 მმ²';
  if (amps <= 16) return '3x2.5 მმ²';
  if (amps <= 25) return '3x4.0 მმ²';
  if (amps <= 32) return '3x6.0 მმ²';
  if (amps <= 40) return '3x10.0 მმ²';
  return '3x16.0 მმ²';
};

function generateModules(
  groups: (PredefinedPoint & { instanceId: string })[], 
  includeRelay: boolean, 
  mainProtection: 'mcb' | 'rcbo' | 'mcb_rccb',
  mainAmperage: number
): Module[] {
  const modules: Module[] = [];
  
  if (mainProtection === 'rcbo') {
    modules.push({
      id: 'main',
      name: 'მთავარი დიფ. ავტომატი',
      type: 'rcbo',
      amperage: mainAmperage,
      poles: 2,
      modulesCount: 2,
      productId: `main-rcbo-${mainAmperage}a-2p`,
      description: `2-პოლუსიანი შემყვანი დიფ. ავტომატი ${mainAmperage}A`
    });
  } else {
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
  }

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

  if (mainProtection === 'mcb_rccb') {
    modules.push({
      id: 'rccb',
      name: 'გაჟონვის რელე',
      type: 'rccb',
      amperage: 63,
      poles: 2,
      modulesCount: 2,
      productId: 'rccb-63a-2p-30ma',
      description: 'გაჟონვის რელე (RCCB) 63A 30mA'
    });
  }

  groups.forEach((g) => {
    const amp = getBreakerAmperage(g.powerKw, g.type);
    
    // Rule: If main protection is RCBO or RCCB, we don't need individual RCBOs
    const needsRcbo = g.hasRcbo && mainProtection === 'mcb';

    if (needsRcbo) {
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

const ModuleBlock = ({ 
  module, 
  onDragStart, 
  onDrop, 
  onDragOver 
}: { 
  module: Module;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
}) => {
  const width = module.modulesCount * 44; // 44px per module
  
  const isDiff = module.type === 'rcbo';
  const isMain = module.type === 'main';
  const isRelay = module.type === 'relay';
  const isRccb = module.type === 'rccb';
  const isFixed = ['main', 'relay', 'rccb'].includes(module.id);

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
  } else if (isRccb) {
    borderColor = 'border-purple-500/40';
    accentColor = 'bg-purple-500';
    bgColor = 'bg-[#150a1a]';
    textColor = 'text-purple-200';
  }

  return (
    <div 
      draggable={!isFixed}
      onDragStart={(e) => { if (!isFixed && onDragStart) onDragStart(e, module.id); }}
      onDrop={(e) => { if (!isFixed && onDrop) onDrop(e, module.id); }}
      onDragOver={(e) => { if (!isFixed) { e.preventDefault(); if (onDragOver) onDragOver(e); } }}
      className={`relative flex flex-col items-center justify-between h-36 border ${borderColor} ${bgColor} rounded-md shadow-lg transition-all hover:border-opacity-100 ${!isFixed ? 'cursor-grab active:cursor-grabbing hover:-translate-y-1' : ''}`}
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
  const [viewMode, setViewMode] = useState<'wizard' | 'expert'>('wizard');
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [groups, setGroups] = useState<(PredefinedPoint & { instanceId: string })[]>([]);
  const [includeRelay, setIncludeRelay] = useState(true);
  const [diversityFactor, setDiversityFactor] = useState(0.8);
  const [mainProtection, setMainProtection] = useState<'mcb' | 'rcbo' | 'mcb_rccb'>('mcb');
  const [showBom, setShowBom] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Load configuration from URL hash
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(hash)));
        if (decoded.groups) setGroups(decoded.groups);
        if (decoded.rooms) setRooms(decoded.rooms);
        if (decoded.includeRelay !== undefined) setIncludeRelay(decoded.includeRelay);
        if (decoded.diversityFactor) setDiversityFactor(decoded.diversityFactor);
        if (decoded.mainProtection) setMainProtection(decoded.mainProtection);
        if (decoded.viewMode) setViewMode(decoded.viewMode);
      } catch (e) {
        console.error('Failed to parse shared config', e);
      }
    }
  }, []);

  const handleShare = () => {
    const state = {
      groups,
      rooms,
      includeRelay,
      diversityFactor,
      mainProtection,
      viewMode
    };
    const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPowerKw = groups.reduce((sum, g) => sum + g.powerKw, 0);
  const designPowerKw = totalPowerKw * diversityFactor;
  const isOverLimit = designPowerKw > 10;
  
  const totalAmps = (totalPowerKw * 1000) / 230;
  const designAmps = totalAmps > 0 ? Math.max(totalAmps * diversityFactor, 25) : 25; 
  const mainSizes = [25, 32, 40, 50, 63];
  let calculatedMainAmperage = mainSizes.find(s => s >= designAmps) || 63;
  if (groups.length === 0) calculatedMainAmperage = 63;

  const effectiveMainProtection = (mainProtection === 'rcbo' && calculatedMainAmperage > 40) ? 'mcb' : mainProtection;

  const addGroup = (point: PredefinedPoint) => {
    const count = groups.filter(g => g.id === point.id).length;
    const newName = count > 0 ? `${point.name} (ჯგუფი ${count + 1})` : point.name;
    setGroups([...groups, { 
      ...point, 
      name: newName, 
      instanceId: `${point.id}_${Date.now()}`,
      hasRcbo: point.isWet && point.type !== 'lighting'
    }]);
  };

  const removeGroup = (instanceId: string) => {
    setGroups(groups.filter(g => g.instanceId !== instanceId));
  };

  const updateGroup = (instanceId: string, updates: Partial<PredefinedPoint>) => {
    setGroups(groups.map(g => g.instanceId === instanceId ? { ...g, ...updates } : g));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === targetId) return;

    const draggedIndex = groups.findIndex(g => g.instanceId === draggedId);
    const targetIndex = groups.findIndex(g => g.instanceId === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newGroups = [...groups];
    const [draggedItem] = newGroups.splice(draggedIndex, 1);
    newGroups.splice(targetIndex, 0, draggedItem);
    setGroups(newGroups);
  };

  const moveGroup = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newGroups = [...groups];
      [newGroups[index - 1], newGroups[index]] = [newGroups[index], newGroups[index - 1]];
      setGroups(newGroups);
    } else if (direction === 'down' && index < groups.length - 1) {
      const newGroups = [...groups];
      [newGroups[index + 1], newGroups[index]] = [newGroups[index], newGroups[index + 1]];
      setGroups(newGroups);
    }
  };

  const addRoom = (type: Room['type']) => {
    const typeDef = ROOM_TYPES.find(t => t.id === type);
    const count = rooms.filter(r => r.type === type).length + 1;
    setRooms([...rooms, {
      id: `room_${Date.now()}`,
      name: `${typeDef?.name} ${count}`,
      type,
      lightingCount: 1,
      socketCount: 2,
      appliances: []
    }]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const generateFromWizard = () => {
    const newGroups: (PredefinedPoint & { instanceId: string })[] = [];
    
    rooms.forEach(room => {
      const isWetRoom = room.type === 'bathroom' || room.type === 'kitchen';
      
      if (room.lightingCount > 0) {
        newGroups.push({
          id: 'light',
          name: `${room.name} (განათება)`,
          powerKw: Number((room.lightingCount * 0.05).toFixed(2)) || 0.1,
          type: 'lighting',
          isWet: isWetRoom,
          isDedicated: false,
          icon: Lightbulb,
          hasRcbo: false,
          instanceId: `light_${room.id}_${Date.now()}`
        });
      }
      
      if (room.socketCount > 0) {
        newGroups.push({
          id: 'socket',
          name: `${room.name} (შტეფსელები)`,
          powerKw: Math.max(2.0, room.socketCount * 0.2),
          type: 'socket',
          isWet: isWetRoom,
          isDedicated: false,
          icon: Plug,
          hasRcbo: isWetRoom,
          instanceId: `socket_${room.id}_${Date.now()}`
        });
      }
      
      room.appliances.forEach(app => {
        const catalogApp = APPLIANCE_CATALOG.find(a => a.id === app.catalogId);
        if (catalogApp) {
          newGroups.push({
            id: catalogApp.id,
            name: `${room.name} - ${catalogApp.name}`,
            powerKw: app.powerKw,
            type: 'appliance',
            isWet: catalogApp.isWet || isWetRoom,
            isDedicated: true,
            icon: catalogApp.icon,
            hasRcbo: catalogApp.isWet || isWetRoom,
            instanceId: `app_${app.id}_${Date.now()}`
          });
        }
      });
    });
    
    setGroups(newGroups);
    setViewMode('expert');
  };

  const modules = useMemo(() => generateModules(groups, includeRelay, effectiveMainProtection, calculatedMainAmperage), [groups, includeRelay, effectiveMainProtection, calculatedMainAmperage]);
  const totalModulesCount = modules.reduce((sum, m) => sum + m.modulesCount, 0);
  
  const boardSizes = [8, 12, 18, 24, 36, 48, 72];
  const recommendedSize = boardSizes.find(s => s >= totalModulesCount) || 72;

  const bomItems = useMemo(() => {
    const items: Record<string, { name: string, quantity: number, description: string }> = {};
    modules.forEach(m => {
      if (items[m.productId]) {
        items[m.productId].quantity += 1;
      } else {
        items[m.productId] = { name: m.name, quantity: 1, description: m.description };
      }
    });
    return Object.values(items);
  }, [modules]);

  // Shopify Configuration
  const SHOPIFY_DOMAIN = 'poweron.ge'; // TODO: შეცვალეთ თქვენი მაღაზიის დომენით
  
  // რეალური Variant ID-ები
  const SHOPIFY_VARIANT_MAP: Record<string, string> = {
    'main-mcb-63a-2p': '46062741881080',
    'main-mcb-50a-2p': '46062741717240',
    'main-mcb-40a-2p': '46062741618936',
    'main-mcb-32a-2p': '46062741487864',
    'main-mcb-25a-2p': '46062741356792',
    'main-rcbo-40a-2p': 'TODO_RCBO_40A', // TODO: ჩაანაცვლეთ რეალური ID-ით
    'main-rcbo-32a-2p': 'TODO_RCBO_32A', // TODO: ჩაანაცვლეთ რეალური ID-ით
    'main-rcbo-25a-2p': 'TODO_RCBO_25A', // TODO: ჩაანაცვლეთ რეალური ID-ით
    'rccb-63a-2p-30ma': '46065226940664',
    'voltage-relay-63a': '45888242123000',
    'voltage-relay-40a': '45888210698488',
    'mcb-10a-1p-c': '46062740537592',
    'mcb-16a-1p-c': '46062740668664',
    'mcb-20a-1p-c': '46062740734200',
    'mcb-25a-1p-c': '46062740799736',
    'mcb-32a-1p-c': '46062740930808',
    'mcb-40a-1p-c': '46062741029112',
    'rcbo-10a-30ma-c': '46064925409528', // TODO: ჩაანაცვლეთ 10A დიფ-ავტომატის რეალური ID-ით
    'rcbo-16a-30ma-c': '46064925475064',
    'rcbo-20a-30ma-c': '46064925606136',
    'rcbo-25a-30ma-c': '46064925671672',
    'rcbo-32a-30ma-c': '46064925802744',
    'rcbo-40a-30ma-c': '46064925901048',
  };

  const handleCheckout = () => {
    // 1. დავაჯგუფოთ მოდულები და დავითვალოთ რაოდენობა
    const cartItems: Record<string, number> = {};
    
    modules.forEach(m => {
      const variantId = SHOPIFY_VARIANT_MAP[m.productId];
      if (variantId) {
        cartItems[variantId] = (cartItems[variantId] || 0) + 1;
      } else {
        console.warn(`Variant ID ვერ მოიძებნა პროდუქტისთვის: ${m.productId}`);
      }
    });

    // 2. შევქმნათ Shopify Permalink (ფორმატი: variant_id:quantity,variant_id:quantity)
    const itemsString = Object.entries(cartItems)
      .map(([id, qty]) => `${id}:${qty}`)
      .join(',');

    if (itemsString) {
      const url = `https://${SHOPIFY_DOMAIN}/cart/${itemsString}`;
      setCheckoutUrl(url);
    } else {
      alert("კალათა ცარიელია ან პროდუქტების Variant ID-ები არ არის მითითებული კოდში.");
    }
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
    <div className="w-full">
      {/* Main App UI (Hidden during print) */}
      <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col md:h-screen md:overflow-hidden print:hidden">
        
        {/* Top Header */}
        <header className="flex items-center justify-between p-4 border-b border-[#1a1a1a] bg-[#0d0d0d] shrink-0 sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Zap className="text-[#00ff88] w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">Poweron.ge</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] text-zinc-300 transition-colors text-sm"
            >
              {copied ? <Check className="w-4 h-4 text-[#00ff88]" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden md:inline">{copied ? 'დაკოპირდა' : 'გაზიარება'}</span>
            </button>
            <div className="flex bg-[#141414] p-1 rounded-lg border border-[#2a2a2a]">
              <button 
                onClick={() => setViewMode('wizard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'wizard' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden md:inline">მარტივი კითხვარი</span>
                <span className="md:hidden">კითხვარი</span>
              </button>
              <button 
                onClick={() => setViewMode('expert')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'expert' ? 'bg-[#2a2a2a] text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Settings2 className="w-4 h-4" />
                <span className="hidden md:inline">ექსპერტის რეჟიმი</span>
                <span className="md:hidden">ექსპერტი</span>
              </button>
            </div>
          </div>
        </header>

      <main className="flex-1 flex flex-col md:flex-row md:overflow-hidden">
        {viewMode === 'wizard' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0a0a] custom-scrollbar">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">მარტივი კითხვარი</h2>
                <p className="text-zinc-400 text-sm md:text-base">დაამატეთ ოთახები და მიუთითეთ წერტილების რაოდენობა. სისტემა ავტომატურად ააწყობს ფარს.</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {ROOM_TYPES.map(rt => (
                  <button key={rt.id} onClick={() => addRoom(rt.id as any)} className="bg-[#141414] hover:bg-[#1a241c] hover:border-[#00ff88]/50 border border-[#1a1a1a] text-zinc-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-sm">
                    <rt.icon className="w-4 h-4" />
                    {rt.name} +
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {rooms.map(room => (
                  <div key={room.id} className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1a1a1a]">
                      <input 
                        type="text" 
                        value={room.name}
                        onChange={(e) => updateRoom(room.id, { name: e.target.value })}
                        className="bg-transparent font-semibold text-lg text-white outline-none border-b border-transparent focus:border-[#00ff88] w-full mr-2"
                      />
                      <button onClick={() => removeRoom(room.id)} className="text-zinc-600 hover:text-red-400 p-1">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400 flex items-center gap-2"><Lightbulb className="w-4 h-4"/> განათება</span>
                        <div className="flex items-center gap-3 bg-[#080808] rounded-lg p-1 border border-[#1a1a1a]">
                          <button onClick={() => updateRoom(room.id, { lightingCount: Math.max(0, room.lightingCount - 1) })} className="p-1 text-zinc-500 hover:text-white"><Minus className="w-4 h-4"/></button>
                          <span className="w-4 text-center text-sm font-mono">{room.lightingCount}</span>
                          <button onClick={() => updateRoom(room.id, { lightingCount: room.lightingCount + 1 })} className="p-1 text-zinc-500 hover:text-white"><Plus className="w-4 h-4"/></button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400 flex items-center gap-2"><Plug className="w-4 h-4"/> შტეფსელები</span>
                        <div className="flex items-center gap-3 bg-[#080808] rounded-lg p-1 border border-[#1a1a1a]">
                          <button onClick={() => updateRoom(room.id, { socketCount: Math.max(0, room.socketCount - 1) })} className="p-1 text-zinc-500 hover:text-white"><Minus className="w-4 h-4"/></button>
                          <span className="w-4 text-center text-sm font-mono">{room.socketCount}</span>
                          <button onClick={() => updateRoom(room.id, { socketCount: room.socketCount + 1 })} className="p-1 text-zinc-500 hover:text-white"><Plus className="w-4 h-4"/></button>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#1a1a1a]">
                        <span className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">დამატებითი ტექნიკა</span>
                        <div className="space-y-2">
                          {room.appliances.map(app => {
                            const catalogApp = APPLIANCE_CATALOG.find(a => a.id === app.catalogId);
                            return (
                              <div key={app.id} className="flex items-center justify-between bg-[#080808] p-2 rounded-lg border border-[#1a1a1a]">
                                <span className="text-xs text-zinc-300 truncate pr-2">{catalogApp?.name}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    value={app.powerKw}
                                    onChange={(e) => {
                                      const newApps = room.appliances.map(a => a.id === app.id ? { ...a, powerKw: parseFloat(e.target.value) || 0 } : a);
                                      updateRoom(room.id, { appliances: newApps });
                                    }}
                                    className="w-12 bg-transparent border-b border-zinc-700 text-xs text-center text-[#00ff88] outline-none focus:border-[#00ff88]"
                                  />
                                  <span className="text-[10px] text-zinc-600">kW</span>
                                  <button onClick={() => {
                                    updateRoom(room.id, { appliances: room.appliances.filter(a => a.id !== app.id) });
                                  }} className="text-zinc-600 hover:text-red-400 ml-1"><X className="w-3 h-3"/></button>
                                </div>
                              </div>
                            );
                          })}
                          
                          <select 
                            className="w-full bg-[#080808] border border-[#1a1a1a] text-zinc-400 text-xs rounded-lg p-2 outline-none focus:border-[#00ff88]"
                            value=""
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const catalogApp = APPLIANCE_CATALOG.find(a => a.id === e.target.value);
                              if (catalogApp) {
                                updateRoom(room.id, {
                                  appliances: [...room.appliances, { id: `app_${Date.now()}`, catalogId: catalogApp.id, powerKw: catalogApp.defaultPower }]
                                });
                              }
                            }}
                          >
                            <option value="">+ ტექნიკის დამატება</option>
                            {APPLIANCE_CATALOG.map(ca => (
                              <option key={ca.id} value={ca.id}>{ca.name} ({ca.defaultPower}kW)</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {rooms.length > 0 && (
                <div className="flex justify-center pb-12">
                  <button onClick={generateFromWizard} className="bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold px-8 py-4 rounded-xl flex items-center gap-2 shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all hover:scale-105">
                    <Zap className="w-5 h-5" /> ფარის ავტომატური გენერაცია
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Points Selection */}
            <div className="w-full md:w-80 bg-[#0d0d0d] border-b md:border-b-0 md:border-r border-[#1a1a1a] flex flex-col md:h-full shrink-0 order-2 md:order-1">
              <div className="flex-1 overflow-y-auto p-3 md:p-4 custom-scrollbar">
                <h2 className="text-[10px] md:text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 md:mb-4 px-2">ჯგუფების დამატება</h2>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {PREDEFINED_POINTS.map(point => (
                    <button
                      key={point.id}
                      onClick={() => addGroup(point)}
                      className="w-full flex items-center justify-between p-2 md:p-3 rounded-xl bg-[#141414] border border-[#1a1a1a] hover:border-[#00ff88]/50 hover:bg-[#1a241c] transition-all group"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`p-1.5 md:p-2 rounded-lg ${point.isWet ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-300'} group-hover:text-[#00ff88]`}>
                          <point.icon className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs md:text-sm font-medium text-zinc-200 truncate max-w-[80px] md:max-w-none">{point.name}</div>
                          <div className="text-[9px] md:text-xs text-zinc-500">{point.powerKw} kW {point.isWet && '• სველი'}</div>
                        </div>
                      </div>
                      <Plus className="w-3 h-3 md:w-4 md:h-4 text-zinc-600 group-hover:text-[#00ff88] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Visual Board */}
            <div className="w-full md:flex-1 flex flex-col md:h-full relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] via-[#080808] to-[#050505] order-1 md:order-2 min-h-[400px] md:min-h-0">
              <div className="p-4 md:p-6 flex justify-between items-center border-b border-[#1a1a1a] bg-[#080808]/80 backdrop-blur-md z-10">
          <h2 className="text-base md:text-lg font-medium text-zinc-200">ვიზუალური ფარი</h2>
          <div className="flex items-center gap-2 text-xs md:text-sm text-zinc-400">
            <Shield className="w-3 h-3 md:w-4 md:h-4 text-[#00ff88]" />
            <span>Type C დაცვა</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-start justify-center custom-scrollbar min-h-[40vh] md:min-h-0">
          {/* DIN Rail Container */}
          <div className="w-full overflow-x-auto custom-scrollbar pb-6">
            <div className="min-w-max bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-6 md:p-8 shadow-2xl mx-auto">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative flex justify-center w-full mb-8 last:mb-0">
                  {/* DIN Rail Background Line for this row */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-4 bg-zinc-800/50 border-y border-zinc-700/50 rounded-sm z-0" />
                  
                  <div className="relative z-10 flex gap-[1px]">
                    {row.map((m, i) => (
                      <ModuleBlock 
                        key={`${m.id}_${i}`} 
                        module={m} 
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

            {/* Right Sidebar - Summary */}
            <div className="w-full md:w-96 bg-[#0d0d0d] border-t md:border-t-0 md:border-l border-[#1a1a1a] flex flex-col md:h-full shrink-0 order-3">
              <div className="p-4 md:p-6 border-b border-[#1a1a1a]">
          <h2 className="text-base md:text-lg font-medium text-zinc-200">სპეციფიკაცია</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
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
          <div className="space-y-4">
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

            <div className="bg-[#141414] border border-[#1a1a1a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-zinc-200">ერთდროულობის კოეფიციენტი</div>
                <div className="text-sm font-mono text-[#00ff88]">{diversityFactor.toFixed(2)}</div>
              </div>
              <input 
                type="range" 
                min="0.4" 
                max="1.0" 
                step="0.05" 
                value={diversityFactor}
                onChange={(e) => setDiversityFactor(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
              />
              <div className="text-[10px] text-zinc-500 mt-2">განსაზღვრავს ერთდროულად ჩართული ტექნიკის ალბათობას</div>
            </div>

            <div className="bg-[#141414] border border-[#1a1a1a] rounded-xl p-4">
              <div className="text-sm font-medium text-zinc-200 mb-3">მთავარი დაცვა</div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="mainProt" checked={mainProtection === 'mcb'} onChange={() => setMainProtection('mcb')} className="accent-[#00ff88] w-4 h-4" />
                  <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">სტანდარტული (MCB)</span>
                </label>
                <label className={`flex items-center gap-2 ${calculatedMainAmperage > 40 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'}`}>
                  <input type="radio" name="mainProt" checked={mainProtection === 'rcbo'} onChange={() => setMainProtection('rcbo')} disabled={calculatedMainAmperage > 40} className="accent-[#00ff88] w-4 h-4 disabled:accent-zinc-600" />
                  <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">დიფ. ავტომატი (RCBO) {calculatedMainAmperage > 40 && '- max 40A'}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="radio" name="mainProt" checked={mainProtection === 'mcb_rccb'} onChange={() => setMainProtection('mcb_rccb')} className="accent-[#00ff88] w-4 h-4" />
                  <span className="text-xs text-zinc-300 group-hover:text-white transition-colors">MCB + გაჟონვის რელე (RCCB)</span>
                </label>
              </div>
            </div>

            {isOverLimit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-red-400 shrink-0" />
                <div className="text-xs text-red-200/90 leading-relaxed">
                  ყურადღება: თქვენი საანგარიშო სიმძლავრე ({designPowerKw.toFixed(1)} kW) აჭარბებს დისტრიბუტორის მიერ მოწოდებულ 10 kW-ს. გთხოვთ, შეამციროთ დატვირთვა ან მოითხოვოთ სიმძლავრის გაზრდა.
                </div>
              </div>
            )}
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
                groups.map((g, index) => (
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
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="flex flex-col">
                          <button 
                            onClick={() => moveGroup(index, 'up')} 
                            disabled={index === 0} 
                            className="text-zinc-600 hover:text-white disabled:opacity-30 p-0.5"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => moveGroup(index, 'down')} 
                            disabled={index === groups.length - 1} 
                            className="text-zinc-600 hover:text-white disabled:opacity-30 p-0.5"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeGroup(g.instanceId)}
                          className="text-zinc-600 hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pl-6">
                      <div className="flex items-center gap-2">
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
                        <span className="text-xs font-mono text-zinc-500 bg-[#080808] px-2 py-1 rounded border border-[#1a1a1a]">
                          {getBreakerAmperage(g.powerKw, g.type)}A
                        </span>
                        <span className="text-[10px] font-mono text-blue-400/70 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20" title="რეკომენდებული კაბელის კვეთა">
                          {getCableSize(getBreakerAmperage(g.powerKw, g.type))}
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-[#1a1a1a] w-full flex justify-between items-center">
                        <label className={`flex items-center gap-2 text-xs ${mainProtection !== 'mcb' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                          <input 
                            type="checkbox" 
                            checked={!!g.hasRcbo && mainProtection === 'mcb'} 
                            disabled={mainProtection !== 'mcb'}
                            onChange={(e) => updateGroup(g.instanceId, { hasRcbo: e.target.checked })}
                            className="accent-[#00ff88] w-3.5 h-3.5 rounded-sm bg-zinc-800 border-zinc-700"
                          />
                          <span className="text-zinc-400">RCBO</span>
                        </label>
                      </div>
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
              <div className="p-4 md:p-6 border-t border-[#1a1a1a] bg-[#0a0a0a] flex flex-col gap-3">
                <div className="flex gap-2 md:gap-3">
                  <button 
                    onClick={() => setShowDiagram(true)}
                    className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <GitMerge className="w-4 h-4" />
                    <span className="hidden md:inline">სქემა</span>
                  </button>
                  <button 
                    onClick={() => setShowBom(true)}
                    className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden md:inline">BOM</span>
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="flex-1 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden md:inline">PDF</span>
                  </button>
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
          </>
        )}
      </main>

      {/* BOM Modal */}
      {showBom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 md:p-6 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <List className="w-5 h-5 text-[#00ff88]" />
                მასალების სია (BOM)
              </h3>
              <button onClick={() => setShowBom(false)} className="text-zinc-500 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs md:text-sm text-zinc-400 min-w-[400px]">
                  <thead className="text-[10px] md:text-xs text-zinc-500 uppercase bg-[#1a1a1a] sticky top-0">
                    <tr>
                      <th className="px-3 md:px-4 py-3 rounded-tl-lg">დასახელება</th>
                      <th className="px-3 md:px-4 py-3">აღწერილობა</th>
                      <th className="px-3 md:px-4 py-3 text-center rounded-tr-lg">რაოდენობა</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-[#1a1a1a] last:border-0 hover:bg-[#1a1a1a]/50">
                        <td className="px-3 md:px-4 py-3 font-medium text-zinc-200">{item.name}</td>
                        <td className="px-3 md:px-4 py-3 text-[10px] md:text-xs">{item.description}</td>
                        <td className="px-3 md:px-4 py-3 text-center font-mono text-[#00ff88]">{item.quantity} ც</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 pt-4 border-t border-[#1a1a1a] flex justify-end">
              <button 
                onClick={() => setShowBom(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors text-sm"
              >
                დახურვა
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagram Modal */}
      {showDiagram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-4 md:p-6 max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-[#00ff88]" />
                Single Line Diagram
              </h3>
              <button onClick={() => setShowDiagram(false)} className="text-zinc-500 hover:text-white p-1">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#0a0a0a] rounded-xl border border-[#1a1a1a]">
              <div className="min-w-[600px] flex flex-col items-center py-8">
                
                {/* Grid Connection */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border-2 border-zinc-600 flex items-center justify-center text-zinc-400 font-mono text-xs">
                    L, N
                  </div>
                  <div className="w-0.5 h-8 bg-zinc-600"></div>
                </div>

                {/* Main Breaker */}
                <div className="flex flex-col items-center">
                  <div className={`px-6 py-3 rounded-lg border-2 ${mainProtection === 'rcbo' ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]'} font-mono text-sm text-center`}>
                    {mainProtection === 'rcbo' ? 'RCBO' : 'MCB'}<br/>
                    {calculatedMainAmperage}A, 2P
                  </div>
                  <div className="w-0.5 h-8 bg-zinc-600"></div>
                </div>

                {/* Voltage Relay */}
                {includeRelay && (
                  <div className="flex flex-col items-center">
                    <div className="px-6 py-3 rounded-lg border-2 border-orange-500 bg-orange-500/10 text-orange-400 font-mono text-sm text-center">
                      V-Relay<br/>
                      {calculatedMainAmperage <= 40 ? 40 : 63}A
                    </div>
                    <div className="w-0.5 h-8 bg-zinc-600"></div>
                  </div>
                )}

                {/* RCCB (if selected) */}
                {mainProtection === 'mcb_rccb' && (
                  <div className="flex flex-col items-center">
                    <div className="px-6 py-3 rounded-lg border-2 border-purple-500 bg-purple-500/10 text-purple-400 font-mono text-sm text-center">
                      RCCB<br/>
                      63A, 30mA
                    </div>
                    <div className="w-0.5 h-8 bg-zinc-600"></div>
                  </div>
                )}

                {/* Busbar */}
                <div className="w-full max-w-2xl h-1 bg-zinc-600 relative my-4">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0.5 h-4 bg-zinc-600"></div>
                </div>

                {/* Branches */}
                <div className="flex justify-between w-full max-w-2xl px-4 gap-4">
                  {groups.map((g, idx) => {
                    const amp = getBreakerAmperage(g.powerKw, g.type);
                    const isRcbo = g.hasRcbo && mainProtection === 'mcb';
                    
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div className="w-0.5 h-6 bg-zinc-600"></div>
                        <div className={`w-full py-2 rounded border ${isRcbo ? 'border-blue-500/50 bg-blue-500/10 text-blue-300' : 'border-zinc-600 bg-zinc-800 text-zinc-300'} font-mono text-[10px] text-center mb-2`}>
                          {isRcbo ? 'RCBO' : 'MCB'}<br/>
                          {amp}A
                        </div>
                        <div className="w-0.5 h-6 bg-zinc-600 border-l border-dashed border-zinc-500"></div>
                        <div className="mt-2 text-[10px] text-zinc-400 text-center max-w-[60px] break-words">
                          {g.name}
                        </div>
                        <div className="mt-1 text-[9px] text-blue-400/70 font-mono">
                          {getCableSize(amp)}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
            
            <div className="mt-4 md:mt-6 pt-4 border-t border-[#1a1a1a] flex justify-end">
              <button 
                onClick={() => setShowDiagram(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg transition-colors text-sm"
              >
                დახურვა
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#00ff88]/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-8 h-8 text-[#00ff88]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">კალათა მზადაა!</h3>
            <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
              თქვენი ელექტრო ფარის კონფიგურაცია წარმატებით შეიქმნა. დააჭირეთ ქვემოთ მოცემულ ღილაკს, რათა გადახვიდეთ Shopify-ს კალათაში და დაასრულოთ შეკვეთა.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <a 
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setCheckoutUrl(null)}
                className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-black font-semibold py-4 rounded-xl flex items-center justify-center transition-colors"
              >
                გადასვლა გადახდაზე
              </a>
              <button 
                onClick={() => setCheckoutUrl(null)}
                className="w-full bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium py-4 rounded-xl transition-colors"
              >
                გაუქმება
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Printable Report (Hidden on screen, visible on print) */}
      <div className="hidden print:block text-black bg-white p-8 font-sans w-full min-h-screen">
        <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Zap className="w-8 h-8" /> Poweron.ge
            </h1>
            <p className="text-gray-600 mt-1">ელექტრო ფარის სპეციფიკაცია</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            თარიღი: {new Date().toLocaleDateString('ka-GE')}
          </div>
        </div>

        {/* Diagram */}
        <h2 className="text-xl font-bold mb-6">ერთხაზიანი სქემა (Single Line Diagram)</h2>
        <div className="flex flex-col items-center mb-12">
          {/* Grid Connection */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center font-mono text-xs font-bold">
              L, N
            </div>
            <div className="w-0.5 h-8 bg-black"></div>
          </div>

          {/* Main Breaker */}
          <div className="flex flex-col items-center">
            <div className="px-6 py-3 rounded-lg border-2 border-black font-mono text-sm text-center font-bold">
              {mainProtection === 'rcbo' ? 'RCBO' : 'MCB'}<br/>
              {calculatedMainAmperage}A, 2P
            </div>
            <div className="w-0.5 h-8 bg-black"></div>
          </div>

          {/* Voltage Relay */}
          {includeRelay && (
            <div className="flex flex-col items-center">
              <div className="px-6 py-3 rounded-lg border-2 border-black font-mono text-sm text-center font-bold">
                V-Relay<br/>
                {calculatedMainAmperage <= 40 ? 40 : 63}A
              </div>
              <div className="w-0.5 h-8 bg-black"></div>
            </div>
          )}

          {/* RCCB (if selected) */}
          {mainProtection === 'mcb_rccb' && (
            <div className="flex flex-col items-center">
              <div className="px-6 py-3 rounded-lg border-2 border-black font-mono text-sm text-center font-bold">
                RCCB<br/>
                63A, 30mA
              </div>
              <div className="w-0.5 h-8 bg-black"></div>
            </div>
          )}

          {/* Branches */}
          <div className="flex flex-wrap justify-center w-full border-t-4 border-black pt-4 mt-4 relative gap-y-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-1 h-4 bg-black"></div>
            
            {groups.map((g, idx) => {
              const amp = getBreakerAmperage(g.powerKw, g.type);
              const isRcbo = g.hasRcbo && mainProtection === 'mcb';
              const cable = getCableSize(amp);
              
              return (
                <div key={idx} className="flex flex-col items-center w-24 px-1">
                  <div className="w-0.5 h-4 bg-black absolute top-0"></div>
                  <div className="w-full py-2 mt-4 rounded border-2 border-black font-mono text-[10px] text-center mb-2 font-bold bg-white z-10">
                    {isRcbo ? 'RCBO' : 'MCB'}<br/>
                    {amp}A
                  </div>
                  <div className="w-0.5 h-6 bg-black border-l-2 border-dashed border-black"></div>
                  <div className="mt-2 text-[10px] text-center break-words font-medium leading-tight">
                    {g.name}
                  </div>
                  <div className="mt-1 text-[9px] text-gray-600 font-mono font-bold">
                    {cable}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOM */}
        <h2 className="text-xl font-bold mb-4">მასალების სია (BOM)</h2>
        <table className="w-full text-left text-sm mb-12 border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-2">დასახელება</th>
              <th className="py-2">აღწერილობა</th>
              <th className="py-2 text-center">რაოდენობა</th>
            </tr>
          </thead>
          <tbody>
            {bomItems.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-300">
                <td className="py-2 font-medium">{item.name}</td>
                <td className="py-2 text-gray-600">{item.description}</td>
                <td className="py-2 text-center font-mono font-bold">{item.quantity} ც</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="text-center text-xs text-gray-400 mt-12 pt-4 border-t border-gray-200">
          გენერირებულია Poweron.ge-ს ჭკვიანი კონფიგურატორის მიერ
        </div>
      </div>

    </div>
  );
}
