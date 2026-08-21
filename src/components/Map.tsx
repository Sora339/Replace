'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStateStore, eventsStore, currentEventIndexStore, cycleCountStore, buildDefaultEvents, EVENTS_COUNT, bossSpriteStore, type EventType } from '../store/game';

const eventPresentation: Record<EventType, { label: string; icon: string }> = {
  battle: { label: '戦闘', icon: '/asset/ui/attack.svg' },
  shop: { label: 'ショップ', icon: '/asset/ui/store.svg' },
  reward: { label: 'アイテム入手', icon: '/asset/ui/element.svg' },
  upgrade: { label: 'アイテム強化', icon: '/asset/ui/behavior.svg' },
};

export default function Map({ isModal = false }: { isModal?: boolean }) {
  const events = useStore(eventsStore);
  const currentIndex = useStore(currentEventIndexStore);
  const gameState = useStore(gameStateStore);
  const isBoss = gameState === 'BOSS';
  const cycleCount = useStore(cycleCountStore);
  const bossSprite = useStore(bossSpriteStore);

  // Responsive sizing
  const baseSize = isModal ? 540 : 480; // target pixel size before viewport clamping
  const maxVw = isModal ? 92 : 88;      // clamp to viewport width %
  const maxVh = isModal ? 75 : 78;      // clamp to viewport height % to avoid squish
  const boxSizeCssBase = `min(${baseSize}px, ${maxVw}vw, ${maxVh}vh)`;
  const boxSizeCss = `calc(0.9 * ${boxSizeCssBase})`; // overall 90% scale without distorting layout maths

  const containerRef = useRef<HTMLDivElement>(null);
  const [boxSizePx, setBoxSizePx] = useState(baseSize);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.getBoundingClientRect().width;
        setBoxSizePx(width || baseSize);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [baseSize]);

  const ringMargin = Math.max(28, boxSizePx * 0.07); // padding between ring and box edge
  const radius = boxSizePx / 2 - ringMargin;
  const center = { x: boxSizePx / 2, y: boxSizePx / 2 };

  // Ensure event circles are available while a saved game is loading.
  useEffect(() => {
    if (events.length === 0) {
      const base = buildDefaultEvents();
      eventsStore.set(base);
      currentEventIndexStore.set(0);
    }
  }, [events.length]);

  return (
    <div className={`flex flex-col items-center justify-center h-full px-4 md:px-8 ${isModal ? 'bg-transparent' : 'bg-gray-800'} text-white ${isModal ? 'overflow-y-auto' : ''}`}>
      {/* 周回数表示（ボス戦中は非表示） */}
      {events.length > 0 && !isBoss && (
        <div className="mb-4 flex flex-col items-center">
          <div className="text-3xl font-bold text-yellow-400">
            {cycleCount}周目 / 3周
          </div>
          <span className="-mt-1 text-3xl font-bold leading-none text-yellow-400" aria-label="右回り">→</span>
        </div>
      )}

      <div
        className="relative"
        ref={containerRef}
        style={{ width: boxSizeCss, height: boxSizeCss, aspectRatio: '1 / 1' }}
      >
        {/* Connecting Lines (Simplified ring) */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-600 pointer-events-none" style={{ margin: `${ringMargin}px` }}></div>

        {/* Central Boss/Start Node */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex items-center justify-center z-10 border-4 border-gray-500 ${isBoss ? 'bg-yellow-300 ring-4 ring-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.8)] scale-105' : 'bg-gray-300'}`}>
          <img src={bossSprite} alt="Boss" className="w-32 h-32" />
        </div>

        {/* Event Nodes */}
        {events.length > 0 && events.map((event, index) => {
          const angle = (index / EVENTS_COUNT) * 2 * Math.PI - Math.PI / 2; // Start from top
          const x = center.x + radius * Math.cos(angle);
          const y = center.y + radius * Math.sin(angle);

          const isCurrent = index === currentIndex;
          const isPast = index < currentIndex;
          // セーブデータの移行中など、想定外の値でもマップ描画を止めない。
          const presentation = eventPresentation[event] ?? eventPresentation.battle;

          return (
            <div
              key={index}
              className={`absolute w-[72px] h-[72px] rounded-full flex items-center justify-center border-2
                        ${isCurrent ? 'bg-yellow-400 border-yellow-600 scale-125 z-20' :
                  isPast ? 'bg-gray-600 border-gray-700' : 'bg-white border-gray-300'}
                        transition-all duration-500`}
              style={{ left: x - 36, top: y - 36 }}
              aria-label={presentation.label}
              title={presentation.label}
            >
              <img
                src={presentation.icon}
                alt={presentation.label}
                className="w-8 h-8"
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-200" aria-label="イベントアイコンの凡例">
        {Object.values(eventPresentation).map(({ label, icon }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-white">
              <img src={icon} alt="" className="w-5 h-5" />
            </span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
