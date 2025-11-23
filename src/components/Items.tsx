'use client';

import { useStore } from '@nanostores/react';
import { itemNodesStore, mainNodesStore } from '../store/game';

export default function Items() {
  const items = useStore(itemNodesStore);

  const addToMain = (index: number) => {
    const item = items[index];
    const newItems = [...items];
    newItems.splice(index, 1);
    itemNodesStore.set(newItems);

    mainNodesStore.set([...mainNodesStore.get(), item]);
  };

  return (
    <div className="flex flex-col bg-gray-600 p-4 h-full overflow-y-auto">
      <h2 className="text-2xl text-white mb-4 text-center">Item</h2>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => addToMain(index)}
            className="bg-[#D9D9D9] border-8 border-[#C4AE4B] p-4 rounded-xl shadow-md flex flex-col items-center justify-center gap-2 transition-transform active:scale-95 hover:bg-gray-50"
          >
            {/* Icon placeholder */}
            <div className="w-12 h-12">
               <img 
                 src={`/asset/ui/${item.type}.svg`} 
                 alt={item.type}
                 className="w-full h-full"
               />
            </div>
            <span className="font-mono font-bold text-gray-800">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
