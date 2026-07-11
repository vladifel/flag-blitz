import { GAME_MODES } from '../../../shared/constants.js';
import type { GameMode } from '../../../shared/types.js';
import { LandingChrome } from '../LandingChrome.js';
import { LogoWordmark } from '../LogoWordmark.js';
import { ModeCard } from '../ModeCard.js';

type MenuScreenProps = {
  onStart: (mode: GameMode) => void;
  onLeaderboard: () => void;
  onSettings: () => void;
  onBack?: () => void;
};

export function MenuScreen({ onStart, onLeaderboard, onSettings, onBack }: MenuScreenProps) {
  const gridModes = GAME_MODES.filter((m) => m.mode !== 'suddendeath');
  const suddenDeath = GAME_MODES.find((m) => m.mode === 'suddendeath')!;

  return (
    <LandingChrome
      onLeaderboard={onLeaderboard}
      onSettings={onSettings}
      {...(onBack ? { onLogoClick: onBack } : {})}
    >
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-sm overflow-y-auto px-margin-mobile py-sm md:gap-md md:px-0 md:py-base">
        <div className="flex shrink-0 justify-center py-1">
          <LogoWordmark />
        </div>

        <div className="flex shrink-0 items-center gap-sm">
          <h2 className="shrink-0 font-headline-md text-sm uppercase tracking-tight text-on-surface md:text-headline-md">
            Select Game Mode
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-outline-variant/50 to-transparent" />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-sm md:gap-md">
          {gridModes.map((modeConfig) => (
            <ModeCard key={String(modeConfig.mode)} {...modeConfig} onPress={onStart} />
          ))}
        </div>

        <div className="w-full shrink-0">
          <ModeCard {...suddenDeath} variant="wide" onPress={onStart} />
        </div>
      </main>
    </LandingChrome>
  );
}
