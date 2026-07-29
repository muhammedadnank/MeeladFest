'use client';

import React from 'react';
import { Trophy, Award, CalendarDays, Radio, Image as ImageIcon, HelpCircle, MessageSquare, ShieldCheck } from 'lucide-react';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: 'team-standings', label: 'Team Points', icon: Trophy },
    { id: 'championship', label: 'Championship', icon: Award },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'updates', label: 'Announcements', icon: Radio },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'certificates', label: 'Certificates', icon: ShieldCheck },
    { id: 'faq-feedback', label: 'FAQ & Feedback', icon: HelpCircle },
  ];

  return (
    <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-border-warm shadow-xs">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 py-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-950 text-gold-200 shadow-xs'
                    : 'text-text-dark/70 hover:bg-emerald-100/50 hover:text-emerald-950'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-200' : 'text-emerald-800'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
