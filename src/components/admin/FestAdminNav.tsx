'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  ListOrdered,
  Calendar,
  UserCheck,
  Users2,
  Trophy,
  UserPlus,
  Radio,
  Image as ImageIcon,
  HelpCircle,
  MessageSquare,
  History,
  ExternalLink,
} from 'lucide-react';

interface FestAdminNavProps {
  festId: string;
  slug?: string;
  festName?: string;
  activeTab?: string;
  permissions?: {
    isOwner: boolean;
    canManageParticipants: boolean;
    canManageResults: boolean;
    canManageUpdates: boolean;
    canManageGallery: boolean;
  };
}

export default function FestAdminNav({ festId, slug = '', festName = 'Fest Admin', permissions }: FestAdminNavProps) {
  const pathname = usePathname();

  const isOwner = permissions?.isOwner ?? true;
  const canParticipants = permissions?.canManageParticipants ?? true;
  const canResults = permissions?.canManageResults ?? true;
  const canUpdates = permissions?.canManageUpdates ?? true;
  const canGallery = permissions?.canManageGallery ?? true;

  const links = [
    { label: 'Overview', href: `/dashboard/fests/${festId}`, icon: LayoutDashboard, show: true },
    { label: 'Teams', href: `/dashboard/fests/${festId}/teams`, icon: Users, show: isOwner },
    { label: 'Categories', href: `/dashboard/fests/${festId}/categories`, icon: FolderTree, show: isOwner },
    { label: 'Items', href: `/dashboard/fests/${festId}/items`, icon: ListOrdered, show: isOwner },
    { label: 'Schedule', href: `/dashboard/fests/${festId}/programs`, icon: Calendar, show: isOwner },
    { label: 'Participants', href: `/dashboard/fests/${festId}/participants`, icon: UserCheck, show: canParticipants },
    { label: 'Group Entries', href: `/dashboard/fests/${festId}/group-entries`, icon: Users2, show: canParticipants },
    { label: 'Enter Results', href: `/dashboard/fests/${festId}/results`, icon: Trophy, show: canResults },
    { label: 'Live Updates', href: `/dashboard/fests/${festId}/updates`, icon: Radio, show: canUpdates },
    { label: 'Gallery', href: `/dashboard/fests/${festId}/gallery`, icon: ImageIcon, show: canGallery },
    { label: 'Sub-Admins', href: `/dashboard/fests/${festId}/subadmins`, icon: UserPlus, show: isOwner },
    { label: 'FAQs', href: `/dashboard/fests/${festId}/faqs`, icon: HelpCircle, show: isOwner },
    { label: 'Feedback', href: `/dashboard/fests/${festId}/feedback`, icon: MessageSquare, show: isOwner },
    { label: 'Activity Log', href: `/dashboard/fests/${festId}/activity-log`, icon: History, show: isOwner },
  ];

  return (
    <div className="bg-emerald-950 border-b border-emerald-800/60 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] text-gold-500 font-medium uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
            Fest Admin Portal
          </div>
          <h1 className="text-xl font-amiri font-bold text-white tracking-wide">{festName}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/fests/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 text-xs font-medium rounded-lg border border-emerald-700/50 transition-colors"
          >
            Public Site <ExternalLink className="w-3.5 h-3.5 text-gold-500" />
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 text-xs font-medium rounded-lg border border-emerald-700/50 transition-colors"
          >
            Switch Fest
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-emerald-900/60">
        {links
          .filter((l) => l.show)
          .map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'bg-gold-500 text-emerald-950 font-semibold shadow-sm'
                    : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            );
          })}
      </div>
    </div>
  );
}

