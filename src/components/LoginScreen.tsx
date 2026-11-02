import { useState } from 'react';
import { Film, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onSignIn: () => void;
  onSkip: () => void;
}

export function LoginScreen({ onSignIn, onSkip }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleSignIn = () => {
    setIsExiting(true);
    setTimeout(onSignIn, 500);
  };

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(onSkip, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cinema-radial px-6 transition-all duration-500 ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient film grain overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cinema-950/40 via-transparent to-cinema-950/60" />

      {/* Logo + title */}
      <div className="relative mb-8 flex flex-col items-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl gold-gradient gold-glow animate-pulse-glow">
          <Film className="h-8 w-8 text-cinema-950" />
        </div>
        <h1 className="text-center text-4xl font-black tracking-tight text-cinema-50">
          Lost The Plot
        </h1>
        <p className="mt-1.5 text-center text-sm font-medium uppercase tracking-[0.2em] text-gold-accent">
          Rewrite the movies.
        </p>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-sm rounded-3xl border border-amber-500/70 glass-panel p-6 animate-slide-up" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
        {/* Email */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-cinema-400">
            Email Address
          </label>
          <div className="input-focus-glow flex items-center gap-2.5 rounded-xl border border-amber-500/70 bg-cinema-900/50 px-3.5 py-3" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
            <Mail className="h-4 w-4 flex-shrink-0 text-cinema-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="writer@losttheplot.app"
              style={{ fontSize: '16px', touchAction: 'manipulation' }}
              className="flex-1 bg-transparent text-sm text-cinema-50 placeholder-cinema-600 outline-none"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-cinema-400">
            Password
          </label>
          <div className="input-focus-glow flex items-center gap-2.5 rounded-xl border border-amber-500/70 bg-cinema-900/50 px-3.5 py-3" style={{ borderColor: 'rgba(245, 158, 11, 0.7)' }}>
            <Lock className="h-4 w-4 flex-shrink-0 text-cinema-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ fontSize: '16px', touchAction: 'manipulation' }}
              className="flex-1 bg-transparent text-sm text-cinema-50 placeholder-cinema-600 outline-none"
              autoComplete="current-password"
            />
            <button
              onClick={() => setShowPassword((s) => !s)}
              style={{ touchAction: 'manipulation' }}
              className="flex-shrink-0 text-cinema-500 transition-colors hover:text-cinema-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Sign In button */}
        <button
          onClick={handleSignIn}
          style={{ touchAction: 'manipulation' }}
          className="spring-tap flex w-full items-center justify-center gap-2 rounded-xl gold-gradient py-3.5 text-sm font-bold text-cinema-950 transition-all hover:opacity-90 gold-glow"
        >
          Sign In
          <ArrowRight className="h-4 w-4" />
        </button>

        {/* Skip to Preview */}
        <button
          onClick={handleSkip}
          style={{ touchAction: 'manipulation' }}
          className="mt-3 w-full text-center text-[11px] font-medium text-cinema-500 transition-colors hover:text-cinema-300"
        >
          Skip to Preview
        </button>
      </div>

      {/* Footer tag */}
      <p className="relative mt-6 text-center text-[10px] text-cinema-600">
        Where movie lovers fix what Hollywood broke.
      </p>
    </div>
  );
}
