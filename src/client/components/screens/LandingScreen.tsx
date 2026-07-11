import flagIconUrl from '../../assets/landing/flag-icon.png';
import { Icon } from '../Icon.js';
import { LandingChrome } from '../LandingChrome.js';

type LandingScreenProps = {
  onPlay: () => void;
  onLeaderboard: () => void;
  onSettings: () => void;
};

export function LandingScreen({ onPlay, onLeaderboard, onSettings }: LandingScreenProps) {
  return (
    <LandingChrome onLeaderboard={onLeaderboard} onSettings={onSettings}>
      <main className="flex min-h-0 w-full flex-1 flex-col items-center justify-center px-margin-mobile py-2 text-center md:px-gutter">
        <div className="flex w-full max-w-[28rem] flex-col items-center gap-3 md:gap-4">
          <div className="relative">
            <div className="landing-icon-aura absolute inset-0 rounded-full bg-primary/25 blur-2xl" />
            <img
              alt="Flag Icon"
              className="landing-pulse-glow relative z-10 h-16 w-16 object-contain md:h-28 md:w-28"
              src={flagIconUrl}
            />
          </div>

          <h1 className="w-full font-display-hero text-[22px] italic uppercase leading-[1.1] tracking-tighter text-white md:text-[40px]">
            THE ULTIMATE{' '}
            <span className="bg-gradient-to-r from-racing-red to-vibrant-orange bg-clip-text text-transparent">
              FLAG CHALLENGE
            </span>
          </h1>

          <p className="w-full text-center text-[13px] leading-relaxed text-on-surface-variant md:text-[16px] md:leading-normal">
            Push your reflexes to the limit in the world&apos;s fastest flag identification
            circuit. Compete globally, master modes, and claim your spot on the pro-circuit.
          </p>

          <button
            type="button"
            className="landing-game-button flex shrink-0 flex-nowrap items-center justify-center gap-2 whitespace-nowrap rounded-lg px-8 py-3 font-headline-md text-base uppercase tracking-[0.18em] text-white md:gap-3 md:px-10 md:py-4 md:text-headline-md"
            onClick={onPlay}
          >
            <span className="whitespace-nowrap">START PLAYING</span>
            <Icon name="play_arrow" className="text-[1.75rem] md:text-[2.25rem]" filled />
          </button>
        </div>
      </main>
    </LandingChrome>
  );
}
