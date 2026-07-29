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
    <div className="min-h-screen bg-cream text-text-dark font-inter">
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
          <div className="bg-white border border-border-warm rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-950/60 uppercase tracking-wider">
                Total Teams
              </span>
              <Users className="w-5 h-5 text-emerald-800" />
            </div>
            <div className="text-3xl font-black text-emerald-950">{teamsCount}</div>
          </div>

          <div className="bg-white border border-border-warm rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-950/60 uppercase tracking-wider">
                Total Items
              </span>
              <ListOrdered className="w-5 h-5 text-emerald-800" />
            </div>
            <div className="text-3xl font-black text-emerald-950">{itemsCount}</div>
          </div>

          <div className="bg-white border border-border-warm rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-950/60 uppercase tracking-wider">
                Participants
              </span>
              <UserCheck className="w-5 h-5 text-gold-500" />
            </div>
            <div className="text-3xl font-black text-emerald-950">{participantsCount}</div>
          </div>

          <div className="bg-white border border-border-warm rounded-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-emerald-950/60 uppercase tracking-wider">
                Results Entered
              </span>
              <Trophy className="w-5 h-5 text-gold-500" />
            </div>
            <div className="text-3xl font-black text-emerald-950">{resultsCount}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="font-amiri text-2xl font-bold text-emerald-950">Management Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {canManageParticipants && (
              <Link
                href={`/dashboard/fests/${festId}/participants`}
                className="bg-white border border-border-warm rounded-card p-5 hover:border-emerald-800 transition group shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-emerald-950 group-hover:text-emerald-800 transition">
                    Participant Registration
                  </h3>
                  <ArrowRight className="w-4 h-4 text-emerald-800/40 group-hover:text-emerald-800 transition" />
                </div>
                <p className="text-xs text-text-dark/70">
                  Register individual participants and assign them to items.
                </p>
              </Link>
            )}

            {canManageResults && (
              <Link
                href={`/dashboard/fests/${festId}/results`}
                className="bg-white border border-border-warm rounded-card p-5 hover:border-emerald-800 transition group shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-emerald-950 group-hover:text-emerald-800 transition">
                    Enter Results
                  </h3>
                  <ArrowRight className="w-4 h-4 text-emerald-800/40 group-hover:text-emerald-800 transition" />
                </div>
                <p className="text-xs text-text-dark/70">
                  Record item positions and calculate team points automatically.
                </p>
              </Link>
            )}

            {isOwner && (
              <Link
                href={`/dashboard/fests/${festId}/teams`}
                className="bg-white border border-border-warm rounded-card p-5 hover:border-emerald-800 transition group shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-emerald-950 group-hover:text-emerald-800 transition">
                    Teams & Setup
                  </h3>
                  <ArrowRight className="w-4 h-4 text-emerald-800/40 group-hover:text-emerald-800 transition" />
                </div>
                <p className="text-xs text-text-dark/70">
                  Manage festival teams, categories, and item configurations.
                </p>
              </Link>
            )}
          </div>
        </div>

        {/* Fest Details Summary */}
        <div className="bg-white border border-border-warm rounded-card p-6 space-y-4 shadow-sm">
          <h2 className="font-amiri text-2xl font-bold text-emerald-950 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-500" /> Fest Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-text-dark">
            <div>
              <span className="block text-xs text-emerald-950/60 font-semibold">Madrasa / Inst</span>
              {fest.madrasaName}
            </div>
            <div>
              <span className="block text-xs text-emerald-950/60 font-semibold">Area & District</span>
              {fest.area}, {fest.district}
            </div>
            <div>
              <span className="block text-xs text-emerald-950/60 font-semibold">Event Date</span>
              {fest.date ? new Date(fest.date).toLocaleDateString() : 'TBD'}
            </div>
            <div>
              <span className="block text-xs text-emerald-950/60 font-semibold">Public Slug</span>
              <span className="font-mono text-emerald-800 font-semibold">/{fest.slug}</span>
            </div>
            <div>
              <span className="block text-xs text-emerald-950/60 font-semibold">Status</span>
              <span
                className={`inline-block px-2 py-0.5 text-xs font-bold rounded ${
                  fest.isActive
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-stone-100 text-stone-600'
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
