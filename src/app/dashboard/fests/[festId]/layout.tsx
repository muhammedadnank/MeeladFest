'use client';

import { useState, useEffect, use } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  Layers,
  Award,
  UserCheck,
  Trophy,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Loader2,
  Menu,
  X,
  Building2,
  ExternalLink,
} from 'lucide-react';

interface FestDetails {
  _id: string;
  slug: string;
  festName: string;
  madrasaName: string;
  area: string;
  district: string;
}

interface FestPermissions {
  isOwner: boolean;
  role: 'owner' | 'subadmin' | null;
  canParticipants: boolean;
  canResults: boolean;
  canUpdates: boolean;
  canGallery: boolean;
  hasAccess: boolean;
}

export default function FestDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ festId: string }>;
}) {
  const { festId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [fest, setFest] = useState<FestDetails | null>(null);
  const [permissions, setPermissions] = useState<FestPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchFestInfo();
    }
  }, [status, festId, router]);

  const fetchFestInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/fests/${festId}`);
      const data = await res.json();

      if (res.ok) {
        setFest(data.fest);
        setPermissions(data.permissions);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading Festival Space...</p>
        </div>
      </div>
    );
  }

  if (!fest || !permissions?.hasAccess) {
    return null;
  }

  const navItems = [
    {
      name: 'Overview & Admins',
      href: `/dashboard/fests/${festId}`,
      icon: Building2,
      show: true,
    },
    {
      name: 'Teams',
      href: `/dashboard/fests/${festId}/teams`,
      icon: Users,
      show: true,
    },
    {
      name: 'Categories',
      href: `/dashboard/fests/${festId}/categories`,
      icon: Layers,
      show: true,
    },
    {
      name: 'Items / Contests',
      href: `/dashboard/fests/${festId}/items`,
      icon: Award,
      show: true,
    },
    {
      name: 'Participants',
      href: `/dashboard/fests/${festId}/participants`,
      icon: UserCheck,
      show: permissions.isOwner || permissions.canParticipants,
    },
    {
      name: 'Results & Ranks',
      href: `/dashboard/fests/${festId}/results`,
      icon: Trophy,
      show: permissions.isOwner || permissions.canResults,
    },
    {
      name: 'Gallery',
      href: `/dashboard/fests/${festId}/gallery`,
      icon: ImageIcon,
      show: permissions.isOwner || permissions.canGallery,
    },
    {
      name: 'Live Updates',
      href: `/dashboard/fests/${festId}/updates`,
      icon: MessageSquare,
      show: permissions.isOwner || permissions.canUpdates,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden border-b border-slate-800 bg-slate-900/80 px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/80"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h2 className="text-sm font-bold text-white line-clamp-1">{fest.festName}</h2>
            <p className="text-[10px] text-slate-400">{fest.madrasaName}</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Fests
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900/90 md:bg-slate-900/60 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Fest Header Info */}
          <div className="p-5 border-b border-slate-800/80">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors mb-3 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Festivals
            </Link>

            <h1 className="text-lg font-extrabold text-white tracking-tight leading-snug line-clamp-1">
              {fest.festName}
            </h1>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{fest.madrasaName}</p>

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  permissions.isOwner
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                {permissions.isOwner ? 'Owner' : 'Sub-Admin'}
              </span>

              <Link
                href={`/fests/${fest.slug}`}
                target="_blank"
                className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                title="View Public Site"
              >
                <ExternalLink className="w-3 h-3" />
                Public Page
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems
              .filter((item) => item.show)
              .map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
