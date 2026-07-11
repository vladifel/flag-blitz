type LogoWordmarkProps = {
  className?: string;
};

export function LogoWordmark({ className = '' }: LogoWordmarkProps) {
  return (
    <div
      className={`select-none bg-gradient-to-r from-[#ff535b] via-[#ffb3b1] to-[#f47d00] bg-clip-text font-display-hero text-3xl font-black uppercase italic leading-none tracking-tighter text-transparent drop-shadow-[0_0_18px_rgba(255,83,91,0.35)] md:text-4xl ${className}`}
    >
      Flag Blitz
    </div>
  );
}
