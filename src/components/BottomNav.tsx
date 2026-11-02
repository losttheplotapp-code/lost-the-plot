import { memo } from 'react';
import { Newspaper, Lightbulb, Trophy, User, Settings } from 'lucide-react';
import type { TabId } from '../types';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

const tabs: { id: TabId; label: string; icon: typeof Newspaper }[] = [
  { id: 'feed', label: 'Feed', icon: Newspaper },
  { id: 'pitch', label: 'Pitch Board', icon: Lightbulb },
  { id: 'challenges', label: 'Challenges', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
];

export const BottomNav = memo(function BottomNav({ activeTab, onTabChange, isAdmin, onToggleAdmin }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-white/5">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{ touchAction: 'manipulation' }}
              className="group relative flex flex-1 flex-col items-center gap-0.5 py-1.5"
            >
              <div
                className={`spring-tap flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-100 ${
                  active ? 'gold-gradient text-cinema-950 gold-glow' : 'text-cinema-400 group-hover:text-cinema-200'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors duration-100 ${
                  active ? 'text-gold-accent' : 'text-cinema-500'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mx-auto max-w-md px-4 pb-1">
        <button
          onClick={onToggleAdmin}
          style={{ touchAction: 'manipulation' }}
          className="spring-tap flex items-center gap-1.5 py-0.5 text-[9px] font-bold transition-colors duration-200"
        >
          <Settings className={`h-3 w-3 ${isAdmin ? 'text-red-400' : 'text-cinema-600'}`} />
          <span className={isAdmin ? 'text-red-400' : 'text-cinema-600'}>
            Test Mode: {isAdmin ? 'Admin' : 'User'}
          </span>
        </button>
      </div>
    </nav>
  );
});
