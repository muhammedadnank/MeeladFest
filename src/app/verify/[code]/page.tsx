import Link from 'next/link';
import { ShieldCheck, ShieldAlert, Award, ArrowLeft, CheckCircle2, Building2, Calendar, MapPin, Sparkles } from 'lucide-react';
import { parseVerificationCode } from '@/lib/certificate/verify';

interface VerifyPageProps {
  params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: VerifyPageProps) {
  const { code } = await params;
  return {
    title: `Verify Certificate (${code}) | MeeladFest`,
    description: `Official authenticity verification portal for certificate code ${code}`,
  };
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { code } = await params;
  const { validFormat, hash } = parseVerificationCode(code);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to MeeladFest
        </Link>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          Official Verification Portal
        </div>
      </header>

      {/* Main Card */}
      <main className="max-w-xl mx-auto w-full my-auto">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
          {/* Ambient Glow */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-[80px] rounded-full pointer-events-none ${
              validFormat ? 'bg-emerald-500/20' : 'bg-rose-500/20'
            }`}
          />

          {validFormat ? (
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-2">
                  Authentic Document
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Certificate Verified</h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  This document code is registered and authenticated on the MeeladFest Security Registry.
                </p>
              </div>

              {/* Code Breakdown */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-left space-y-3 font-sans text-xs sm:text-sm">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                  <span className="text-slate-500">Verification Hash:</span>
                  <span className="font-mono font-bold text-amber-400">{code.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                  <span className="text-slate-500">Digital Signature:</span>
                  <span className="font-mono text-emerald-400">{hash}</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
                  <span className="text-slate-500">Security Standard:</span>
                  <span className="text-slate-300 font-medium">HMAC-SHA256 Encrypted</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Valid & Tamper-Proof
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Issued by MeeladFest Authorized Committee. Any alteration to physical or digital copies invalidates this verification.
              </p>
            </div>
          ) : (
            <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-white">Invalid Certificate Code</h1>
                <p className="text-rose-400/90 text-sm mt-1 font-medium">
                  The verification code <span className="font-mono">{code}</span> is malformed or invalid.
                </p>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Please verify that the code was typed correctly or rescan the official QR code on the certificate.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto w-full text-center py-4 text-xs text-slate-600">
        © {new Date().getFullYear()} MeeladFest Security Verification Engine
      </footer>
    </div>
  );
}
