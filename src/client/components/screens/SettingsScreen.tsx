import { Icon } from '../Icon.js';
import { LandingChrome } from '../LandingChrome.js';

type SettingsScreenProps = {
  onHome: () => void;
  onModes: () => void;
  onLeaderboard: () => void;
  onResume?: () => void;
  canResume?: boolean;
};

function PrefRow({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: 'home' | 'layers' | 'leaderboard' | 'sports_esports';
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="glass-row racing-border flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-surface-container-highest active:scale-[0.99] md:gap-4 md:px-6 md:py-4"
      onClick={onClick}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-highest text-primary md:h-12 md:w-12">
        <Icon name={icon} className="text-xl md:text-2xl" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-label-bold text-sm uppercase tracking-wider text-on-surface md:text-label-bold">
          {label}
        </span>
        <span className="block text-xs text-on-surface-variant md:text-sm">{hint}</span>
      </span>
      <Icon name="play_arrow" className="text-on-surface-variant/50" />
    </button>
  );
}

export function SettingsScreen({
  onHome,
  onModes,
  onLeaderboard,
  onResume,
  canResume = false,
}: SettingsScreenProps) {
  return (
    <LandingChrome onLeaderboard={onLeaderboard} onSettings={() => undefined} onLogoClick={onHome}>
      <main className="mx-auto flex min-h-0 w-full max-w-[28rem] flex-1 flex-col gap-3 overflow-y-auto px-margin-mobile py-3 md:gap-4 md:px-0 md:py-base">
        <div className="shrink-0 text-center">
          <p className="font-headline-md text-xs uppercase tracking-[0.3em] text-on-surface-variant opacity-80 md:text-sm">
            Preferences
          </p>
          <h1 className="mt-1 font-display-hero text-3xl italic uppercase tracking-tighter text-white md:text-4xl">
            Settings
          </h1>
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          {canResume && onResume && (
            <PrefRow
              icon="sports_esports"
              label="Resume Match"
              hint="Return to your in-progress run"
              onClick={onResume}
            />
          )}
          <PrefRow icon="home" label="Home" hint="Back to the landing screen" onClick={onHome} />
          <PrefRow
            icon="layers"
            label="Game Modes"
            hint="Pick Quick, Pro, Marathon, and more"
            onClick={onModes}
          />
          <PrefRow
            icon="leaderboard"
            label="Leaderboard"
            hint="Check global ranks"
            onClick={onLeaderboard}
          />
        </div>
      </main>
    </LandingChrome>
  );
}
