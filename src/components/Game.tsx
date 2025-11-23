'use client';

import { useStore } from '@nanostores/react';
import { mainNodesStore, logStore } from '../store/game';
import { executeGameLoop } from '../lib/transpiler';
import Stats from './Stats';
import Editor from './Editor';
import Items from './Items';
import { useState } from 'react';

export default function Game() {
  const logs = useStore(logStore);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const nodes = mainNodesStore.get();
    await executeGameLoop(nodes);
    setIsRunning(false);
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white font-sans overflow-hidden">
      {/* Left Column: Stats & Visuals */}
      <div className="w-1/2 flex flex-col border-r border-gray-700">
        <div className="flex-grow relative h-2/3">
          <Stats />
        </div>
        
        <div className="p-4 bg-[#A86637] h-1/3 flex flex-col space-y-4">
          {/* Logs Overlay */}
          <div className="flex-1 overflow-y-auto min-h-0 bg-black/50 p-2 text-xs font-mono rounded">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
          <button 
            onClick={handleRun}
            disabled={isRunning}
            className={`px-12 py-4 h-20 mx-auto text-3xl font-bold rounded shadow-lg transition-all shrink-0 ${
              isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#538E3A] hover:bg-green-500 active:scale-95'
            }`}
          >
            {isRunning ? 'RUNNING...' : 'RUN'}
          </button>
        </div>
      </div>

      {/* Middle Column: Editor */}
      <div className="w-1/4 border-r border-gray-700">
        <Editor />
      </div>

      {/* Right Column: Items */}
      <div className="w-1/4">
        <Items />
      </div>
    </div>
  );
}
