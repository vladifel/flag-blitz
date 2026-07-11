import '@fontsource/montserrat/latin-700.css';
import '@fontsource/montserrat/latin-800.css';
import '@fontsource/montserrat/latin-900.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import './index.css';

import { useCallback, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { SubmitScoreBody } from '../shared/api.js';
import {
  createInitialState,
  elapsedSeconds,
  handleGuess,
  startGame,
} from '../shared/gameLogic.js';
import type { GameMode, GameState } from '../shared/types.js';
import { beginFlagPreload } from './flagCache.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { GameplayScreen } from './components/screens/GameplayScreen.js';
import { LandingScreen } from './components/screens/LandingScreen.js';
import { LeaderboardScreen } from './components/screens/LeaderboardScreen.js';
import { MenuScreen } from './components/screens/MenuScreen.js';
import { ResultsScreen } from './components/screens/ResultsScreen.js';
import { SettingsScreen } from './components/screens/SettingsScreen.js';

function showBootError(err: unknown): void {
  const root = document.getElementById('root');
  if (!root) {
    return;
  }
  const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  root.innerHTML = `<div style="box-sizing:border-box;height:100%;padding:24px;background:#00132d;color:#ffb3b1;font:14px/1.4 Inter,sans-serif;overflow:auto">
    <h1 style="color:#ff535b;font-size:18px;margin:0 0 12px">Flag Blitz failed to start</h1>
    <pre style="white-space:pre-wrap;word-break:break-word;margin:0;color:#d5e3ff">${message.replace(/</g, '&lt;')}</pre>
  </div>`;
}

try {
  void beginFlagPreload();
} catch (err) {
  console.error(err);
}

async function submitScoreToServer(
  mode: GameMode,
  correctAnswers: number,
  timeSeconds: number
): Promise<void> {
  const body: SubmitScoreBody = { mode, correctAnswers, timeSeconds };
  try {
    const res = await fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    console.error('Failed to submit score', err);
  }
}

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const lastSubmittedEndTime = useRef<number | null>(null);

  const goLanding = useCallback(() => {
    setGameState(createInitialState());
  }, []);

  const goModes = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      screen: 'menu',
    }));
  }, []);

  const goSettings = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      screen: 'settings',
    }));
  }, []);

  const goResume = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      screen: 'playing',
    }));
  }, []);

  const startMode = useCallback((mode: GameMode) => {
    lastSubmittedEndTime.current = null;
    setGameState({ ...createInitialState(), ...startGame(mode) });
  }, []);

  const goLeaderboard = useCallback((mode?: GameMode) => {
    setGameState((prev) => ({
      ...prev,
      screen: 'leaderboard',
      leaderboardMode: mode ?? prev.mode,
      leaderboardPage: 0,
    }));
  }, []);

  const onGuess = useCallback((selectedName: string) => {
    setGameState((prev) => {
      if (prev.screen !== 'playing') {
        return prev;
      }

      const result = handleGuess(prev, selectedName);
      const next: GameState = { ...prev, ...result.patch };

      if (
        result.type === 'gameover' &&
        next.endTime !== null &&
        lastSubmittedEndTime.current !== next.endTime
      ) {
        lastSubmittedEndTime.current = next.endTime;
        const timeSeconds = elapsedSeconds(next.startTime, next.endTime);
        void submitScoreToServer(next.mode, next.correctAnswers, timeSeconds);
      }

      return next;
    });
  }, []);

  const canResume =
    gameState.flags.length > 0 &&
    gameState.startTime !== null &&
    gameState.endTime === null;

  if (gameState.screen === 'landing') {
    return (
      <LandingScreen
        onPlay={goModes}
        onSettings={goSettings}
        onLeaderboard={() => goLeaderboard()}
      />
    );
  }

  if (gameState.screen === 'settings') {
    return (
      <SettingsScreen
        onHome={goLanding}
        onModes={goModes}
        onLeaderboard={() => goLeaderboard()}
        canResume={canResume}
        {...(canResume ? { onResume: goResume } : {})}
      />
    );
  }

  if (gameState.screen === 'menu') {
    return (
      <MenuScreen
        onStart={startMode}
        onLeaderboard={() => goLeaderboard()}
        onSettings={goSettings}
        onBack={goLanding}
      />
    );
  }

  if (gameState.screen === 'playing') {
    return (
      <GameplayScreen
        state={gameState}
        onGuess={onGuess}
        onQuit={goModes}
        onLeaderboard={() => goLeaderboard(gameState.mode)}
        onSettings={goSettings}
      />
    );
  }

  if (gameState.screen === 'results') {
    return (
      <ResultsScreen
        state={gameState}
        onPlayAgain={() => startMode(gameState.mode)}
        onChangeMode={goModes}
        onLeaderboard={() => goLeaderboard(gameState.mode)}
        onSettings={goSettings}
        onBack={goLanding}
      />
    );
  }

  return (
    <LeaderboardScreen
      state={gameState}
      onModeChange={(mode) =>
        setGameState((prev) => ({
          ...prev,
          leaderboardMode: mode,
          leaderboardPage: 0,
        }))
      }
      onPageChange={(page) => setGameState((prev) => ({ ...prev, leaderboardPage: page }))}
      onBack={goLanding}
      onSettings={goSettings}
      onStart={goModes}
    />
  );
}

try {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('Missing #root element');
  }
  createRoot(root).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (err) {
  showBootError(err);
}
