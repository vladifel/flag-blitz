import { useEffect, useState } from 'react';
import { getFlagBlobUrl, resolveFlagUrl } from '../flagCache.js';
import { Icon } from './Icon.js';

type FlagImageProps = {
  code: string;
  className?: string;
};

export function FlagImage({ code, className }: FlagImageProps) {
  const [src, setSrc] = useState<string | null>(() => getFlagBlobUrl(code) ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!code) {
      setSrc(null);
      setFailed(false);
      return;
    }

    let cancelled = false;
    setFailed(false);

    const cached = getFlagBlobUrl(code);
    if (cached) {
      setSrc(cached);
      return;
    }

    setSrc(null);

    void resolveFlagUrl(code)
      .then((url) => {
        if (!cancelled) {
          setSrc(url);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [code]);

  if (!code) {
    return null;
  }

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-white/10 bg-surface-container-high/80 ${className ?? ''}`}
      >
        <Icon name="flag" className="text-3xl text-on-surface-variant opacity-40" />
      </div>
    );
  }

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-white/10 bg-surface-container-high/50 ${className ?? ''}`}
      >
        <span className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return <img src={src} alt="" className={className} decoding="sync" loading="eager" />;
}
