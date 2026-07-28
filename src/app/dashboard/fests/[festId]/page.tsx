import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import Fest from '@/models/Fest';
import Team from '@/models/Team';
import Item from '@/models/Item';
import Participant from '@/models/Participant';
import Result from '@/models/Result';
import { getFestPermission } from '@/lib/permissions';
import FestAdminNav from '@/components/admin/FestAdminNav';
import { Users, ListOrdered, UserCheck, Trophy, ArrowRight, Shield } from 'lucide-react';

interface PageProps {
  params: Promise<{ festId: string }>;
}

export default async function FestDashboardOverviewPage({ params }: PageProps) {
  const { festId } = await params;
  await connectDB();

  const fest = await Fest.findById(festId);
  if (!fest) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const { isOwner, canManageParticipants, canManageResults, canManageUpdates, canManageGallery } =
    await getFestPermission(session?.user?.id, festId);

  const [teamsCount, itemsCount, participantsCount, resultsCount] = await Promise.all([
    Team.countDocuments({ festId }),
    Item.countDocuments({ festId }),
    Participant.countDocuments({ festId }),
    Result.countDocuments({ festId }),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <FestAdminNav
        festId={festId}
        slug={fest.slug}
        festName={fest.festName}
        permissions={{
          isOwner,
          canManageParticipants,
          canManageResults,
          canManageUpdates,
          canManageGallery,
        }}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Teams
              </span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-slate-100">{teamsCount}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Items
              </span>
              <ListOrdered className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-3xl font-black text-slate-100">{itemsCount}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Participants
              </span>
              <UserCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-slate-100">{participantsCount}</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Results Entered
              </span>
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-slate-100">{resultsCount}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100">Management Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canManageParticipants && (
              <Link
                href={`/dashboard/fests/${festId}/participants`}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-200 group-hover:text-emerald-400 transition">
                    Participant Registration
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-xs text-slate-400">
                  Register individual participants and assign them to items.
                </p>
              </Link>
            )}

            {canManageResults && (
              <Link
                href={`/dashboard/fests/${festId}/results`}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-200 group-hover:text-emerald-400 transition">
                    Enter Results
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-xs text-slate-400">
                  Record item positions and calculate team points automatically.
                </p>
              </Link>
            )}

            {isOwner && (
              <Link
                href={`/dashboard/fests/${festId}/teams`}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-200 group-hover:text-emerald-400 transition">
                    Teams & Setup
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-xs text-slate-400">
                  Manage festival teams, categories, and item configurations.
                </p>
              </Link>
            )}
          </div>
        </div>

        {/* Fest Details Summary */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" /> Fest Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-slate-300">
            <div>
              <span className="block text-xs text-slate-500 font-semibold">Madrasa / Inst</span>
              {fest.madrasaName}
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-semibold">Area & District</span>
              {fest.area}, {fest.district}
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-semibold">Event Date</span>
              {fest.date ? new Date(fest.date).toLocaleDateString() : 'TBD'}
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-semibold">Public Slug</span>
              <span className="font-mono text-emerald-400">/{fest.slug}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-500 font-semibold">Status</span>
              <span
                className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                  fest.isActive
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {fest.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
