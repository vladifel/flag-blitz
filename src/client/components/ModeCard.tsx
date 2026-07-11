import type { ModeIconName } from '../../shared/constants.js';
import type { GameMode } from '../../shared/types.js';
import { Icon } from './Icon.js';

type ModeCardProps = {
  mode: GameMode;
  label: string;
  description: string;
  estimate: string;
  icon: ModeIconName;
  badge?: string;
  accent?: 'primary' | 'secondary';
  variant?: 'grid' | 'wide';
  onPress: (mode: GameMode) => void;
};

export function ModeCard({
  mode,
  label,
  description,
  estimate,
  icon,
  badge,
  accent = 'primary',
  variant = 'grid',
  onPress,
}: ModeCardProps) {
  const titleColor = accent === 'secondary' ? 'text-secondary' : 'text-primary';
  const iconColor =
    accent === 'secondary'
      ? 'text-secondary/40 group-hover:text-secondary'
      : 'text-primary/40 group-hover:text-primary';

  const isWide = variant === 'wide';

  return (
    <button
      type="button"
      className={`card-glow mode-card-pattern inner-stroke group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container text-left transition-all active:scale-[0.98] ${
        isWide ? 'w-full min-h-[72px] p-sm md:p-md' : 'h-full min-h-0 p-sm md:p-md'
      }`}
      onClick={() => onPress(mode)}
    >
      <div className={isWide ? 'flex items-start justify-between gap-sm' : 'min-h-0'}>
        <div className={isWide ? 'min-w-0 flex-1' : ''}>
          <div className={`flex items-start justify-between ${isWide ? 'mb-0' : 'mb-1 md:mb-sm'}`}>
            <div className="flex min-w-0 items-center gap-1">
              <h3
                className={`truncate font-headline-md ${isWide ? 'text-base md:text-headline-md' : 'text-sm md:text-headline-md'} ${titleColor}`}
              >
                {label}
              </h3>
              {badge && (
                <span className="rounded-full bg-error-container px-1.5 py-0.5 text-[9px] font-bold uppercase text-on-error-container">
                  {badge}
                </span>
              )}
            </div>
            {!isWide && <Icon name={icon} className={`shrink-0 text-2xl md:text-3xl ${iconColor}`} />}
          </div>
          <p
            className={`text-on-surface-variant ${
              isWide
                ? 'mt-1 line-clamp-1 text-xs md:text-body-md'
                : 'line-clamp-2 text-[11px] leading-snug md:text-body-md'
            }`}
          >
            {description}
          </p>
        </div>
        {isWide && <Icon name={icon} className={`shrink-0 text-2xl md:text-3xl ${iconColor}`} />}
      </div>

      <div className={`flex items-center justify-between gap-2 ${isWide ? 'mt-2' : 'mt-1 md:mt-sm'}`}>
        <div className="font-label-bold text-[10px] text-secondary md:text-label-bold">{estimate}</div>
        <span className="landing-game-button flex shrink-0 flex-nowrap items-center justify-center gap-1 whitespace-nowrap rounded-md px-3 py-1.5 font-label-bold text-[10px] uppercase tracking-wider text-white md:gap-1.5 md:px-4 md:py-2 md:text-label-bold">
          <span>START</span>
          <Icon name="play_arrow" className="text-base md:text-lg" filled />
        </span>
      </div>
    </button>
  );
}
