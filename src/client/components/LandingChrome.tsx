import type { ReactNode } from 'react';
import avatarUrl from '../assets/landing/avatar.jpg';
import bgFlagsUrl from '../assets/landing/bg-flags.jpg';
import logoUrl from '../assets/landing/logo-wordmark.png';
import { Icon } from './Icon.js';

type LandingChromeProps = {
  children: ReactNode;
  onLeaderboard: () => void;
  onSettings: () => void;
  onLogoClick?: () => void;
};

export function LandingChrome({
  children,
  onLeaderboard,
  onSettings,
  onLogoClick,
}: LandingChromeProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background text-on-background">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 19, 45, 0.7), rgba(0, 19, 45, 0.75)), url(${bgFlagsUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="landing-shader-fallback pointer-events-none absolute inset-0 z-10" />
      <div className="landing-energy-streak pointer-events-none absolute inset-0 z-10" />

      <div className="relative z-20 mx-auto flex h-full w-full max-w-[880px] flex-col">
        <header className="flex w-full shrink-0 items-center justify-between px-margin-mobile py-2 md:px-margin-desktop md:py-base">
          {onLogoClick ? (
            <button type="button" className="shrink-0" onClick={onLogoClick} aria-label="Home">
              <img alt="Flag Blitz" className="h-8 object-contain md:h-10" src={logoUrl} />
            </button>
          ) : (
            <img alt="Flag Blitz" className="h-8 object-contain md:h-10" src={logoUrl} />
          )}
          <div className="flex items-center gap-3 md:gap-md">
            <button
              type="button"
              className="text-[22px] text-primary transition-all hover:brightness-110"
              aria-label="Leaderboard"
              onClick={onLeaderboard}
            >
              <Icon name="leaderboard" />
            </button>
            <button
              type="button"
              className="text-[22px] text-primary transition-all hover:brightness-110"
              aria-label="Settings"
              onClick={onSettings}
            >
              <Icon name="settings" />
            </button>
            <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant">
              <img alt="" className="h-full w-full object-cover" src={avatarUrl} />
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
