'use client';

import { useState, useEffect, use } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Layers,
  Award,
  UserCheck,
  Trophy,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Loader2,
  Menu,
  X,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { GeometricPattern } from '@/components/ui/GeometricPattern';

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
      <div className="min-h-screen flex items-center justify-center bg-cream text-text-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-800 animate-spin" />
          <p className="text-sm text-emerald-950/70 font-medium">Loading Festival Space...</p>
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
    <div className="min-h-screen bg-cream text-text-dark flex flex-col md:flex-row font-inter">
      {/* Mobile Top Header */}
      <div className="md:hidden border-b border-emerald-900 bg-emerald-950 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-emerald-200 hover:text-white rounded-lg bg-emerald-900/60"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <h2 className="font-amiri text-base font-bold text-white line-clamp-1">{fest.festName}</h2>
            <p className="text-[10px] text-emerald-200/70">{fest.madrasaName}</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="text-xs text-gold-200 hover:text-white flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Fests
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-emerald-950 text-white border-r border-emerald-900 flex flex-col justify-between transition-transform duration-300 overflow-hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <GeometricPattern className="absolute -top-12 -left-12 w-48 h-48 opacity-[0.06] text-white pointer-events-none" />

        <div className="relative z-10">
          {/* Fest Header Info */}
          <div className="p-5 border-b border-emerald-900">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-200/80 hover:text-gold-200 transition-colors mb-3 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              All Festivals
            </Link>

            <h1 className="font-amiri text-xl font-bold text-white tracking-tight leading-snug line-clamp-1">
              {fest.festName}
            </h1>
            <p className="text-xs text-emerald-200/70 line-clamp-1 mt-0.5">{fest.madrasaName}</p>

            <div className="mt-3 flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  permissions.isOwner
                    ? 'bg-gold-500/20 text-gold-200 border border-gold-500/30'
                    : 'bg-emerald-100/20 text-emerald-200 border border-emerald-100/30'
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-gold-500" />
                {permissions.isOwner ? 'Owner' : 'Sub-Admin'}
              </span>

              <Link
                href={`/fests/${fest.slug}`}
                target="_blank"
                className="text-[11px] text-emerald-200/80 hover:text-gold-200 flex items-center gap-1 font-medium transition-colors"
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 text-xs transition-all ${
                      isActive
                        ? 'bg-emerald-800 text-gold-200 border-l-4 border-gold-500 font-semibold rounded-r-lg shadow-sm'
                        : 'text-emerald-100/70 hover:text-white hover:bg-emerald-900/50 rounded-lg font-medium'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-500' : 'text-emerald-400/80'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-emerald-900 flex items-center justify-between relative z-10 bg-emerald-950/80">
          <div className="truncate">
            <p className="text-xs font-semibold text-white truncate">{session?.user?.name}</p>
            <p className="text-[10px] text-emerald-200/70 truncate">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="p-2 text-emerald-200/80 hover:text-gold-500 hover:bg-emerald-900 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 bg-cream text-text-dark overflow-y-auto">{children}</main>
    </div>
  );
}
