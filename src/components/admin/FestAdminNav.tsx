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
  slug: string;
  festName: string;
  permissions?: {
    isOwner: boolean;
    canManageParticipants: boolean;
    canManageResults: boolean;
    canManageUpdates: boolean;
    canManageGallery: boolean;
  };
}

export default function FestAdminNav({ festId, slug, festName, permissions }: FestAdminNavProps) {
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
    <div className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-0.5">
            Fest Management Portal
          </div>
          <h1 className="text-xl font-bold text-slate-100">{festName}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/fests/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            Public Page <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            Switch Fest
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/60">
        {links
          .filter((l) => l.show)
          .map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
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
