import React from 'react';
import { Home, Radio, Library, Search } from 'lucide-react';
import { AppTab } from '../types.ts';

interface BottomNavBarProps {
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs: { id: AppTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mix', label: 'Mix', icon: Radio },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'search', label: 'Search', icon: Search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/60 backdrop-blur-2xl border-t border-white/10 select-none pb-safe shadow-[0_-12px_36px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-all cursor-pointer ${
                isActive ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'
              }`}
              aria-label={tab.label}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'liquid-glass-pill text-white shadow-[0_0_16px_rgba(255,255,255,0.25)] scale-105'
                    : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${isActive ? 'text-white font-semibold' : 'text-neutral-500'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
