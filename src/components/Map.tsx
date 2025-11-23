'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import { gameStateStore, eventsStore, currentEventIndexStore } from '../store/game';
import type { EventType } from '../store/game';

const EVENTS_COUNT = 8;

export default function Map({ isModal = false }: { isModal?: boolean }) {
  const events = useStore(eventsStore);
  const currentIndex = useStore(currentEventIndexStore);

  const buildEvents = (direction: 'left' | 'right') => {
    const newEvents: EventType[] = ['select']; // first is always selection
    for (let i = 1; i < EVENTS_COUNT; i++) {
        if (i === EVENTS_COUNT - 1) {
            newEvents.push('battle'); // Boss (treated as battle for now)
        } else {
             // Simple alternating pattern for demo
             if (direction === 'left') {
                 newEvents.push((i - 1) % 2 === 0 ? 'battle' : 'shop');
             } else {
                 newEvents.push((i - 1) % 2 === 0 ? 'shop' : 'battle');
             }
        }
    }
    return newEvents;
  };

  const generateEvents = (direction: 'left' | 'right') => {
    const newEvents = buildEvents(direction);
    eventsStore.set(newEvents);
    currentEventIndexStore.set(1); // skip select node
    const nextEvent = newEvents[1];
    if (nextEvent === 'battle') {
        gameStateStore.set('BATTLE');
    } else {
        gameStateStore.set('SHOP');
    }
  };

  // Responsive sizing
  const baseSize = isModal ? 540 : 480; // target pixel size before viewport clamping
  const maxVw = isModal ? 92 : 88;      // clamp to viewport width %
  const boxSizeCss = `min(${baseSize}px, ${maxVw}vw)`;

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

  // Ensure preview circles show before direction selection
  useEffect(() => {
    if (events.length === 0) {
      eventsStore.set(buildEvents('left'));
      currentEventIndexStore.set(0);
    }
  }, [events.length]);

  return (
    <div className={`flex flex-col items-center justify-center h-full px-4 md:px-8 ${isModal ? 'bg-transparent' : 'bg-gray-800'} text-white`}>
      <div 
        className="relative"
        ref={containerRef}
        style={{ width: boxSizeCss, height: boxSizeCss }}
      >
        {/* Connecting Lines (Simplified ring) */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-600 pointer-events-none" style={{ margin: `${ringMargin}px` }}></div>

        {/* Central Boss/Start Node */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center z-10 border-4 border-gray-500">
           <img src="/asset/enemy/enemy-01.svg" alt="Boss" className="w-32 h-32" />
        </div>

        {/* Event Nodes */}
        {events.length > 0 && events.map((event, index) => {
            const angle = (index / EVENTS_COUNT) * 2 * Math.PI - Math.PI / 2; // Start from top
            const x = center.x + radius * Math.cos(angle);
            const y = center.y + radius * Math.sin(angle);
            
            const isCurrent = index === currentIndex;
            const isPast = index < currentIndex;
            
            return (
                <div 
                    key={index}
                    className={`absolute w-16 h-16 rounded-full flex items-center justify-center border-2 
                        ${isCurrent ? 'bg-yellow-400 border-yellow-600 scale-125 z-20' : 
                          isPast ? 'bg-gray-600 border-gray-700' : 'bg-white border-gray-300'}
                        transition-all duration-500`}
                    style={{ left: x - 32, top: y - 32 }}
                >
                    <img 
                      src={
                        event === 'battle'
                          ? '/asset/ui/attack.svg'
                          : event === 'shop'
                            ? '/asset/ui/store.svg'
                            : '/asset/ui/select.svg'
                      } 
                      alt={event}
                      className="w-8 h-8"
                    />
                </div>
            );
        })}
      </div>

      {!isModal && (
          <div className="flex gap-8 mt-8">
              <button 
                  onClick={() => generateEvents('left')}
                  className="px-8 py-4 bg-[#538E3A] hover:bg-green-500 rounded text-xl font-bold"
              >
                  左回り
              </button>
              <div className="text-2xl font-bold self-center">OR</div>
              <button 
                  onClick={() => generateEvents('right')}
                  className="px-8 py-4 bg-[#538E3A] hover:bg-green-500 rounded text-xl font-bold"
              >
                  右回り
              </button>
          </div>
      )}
    </div>
  );
}
