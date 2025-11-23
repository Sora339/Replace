import { atom, map } from 'nanostores';

export type Entity = {
  hp: number;
  maxHp: number;
  atk: number;
  bp: number;
  maxBp: number;
};

export type NodeType = 'attack' | 'heal' | 'syntax' | 'behavior';

export type NodeItem = {
  id: string;
  label: string;
  code: string; // The actual code snippet
  type: NodeType;
  indent?: number; // For visual indentation if we want
};

export const playerStore = map<Entity>({
  hp: 120,
  maxHp: 120,
  atk: 20,
  bp: 10,
  maxBp: 10,
});

export const enemyStore = map<Entity>({
  hp: 10,
  maxHp: 10,
  atk: 20,
  bp: 5,
  maxBp: 5,
});

export const mainNodesStore = atom<NodeItem[]>([
  { id: '1', label: 'n=5', code: 'n=5', type: 'syntax' },
]);

// Initial available items
export const itemNodesStore = atom<NodeItem[]>([
  { id: 'item-1', label: 'atk()', code: 'await atk()', type: 'attack' },
  { id: 'item-2', label: 'atk++', code: 'atk_inc()', type: 'attack' },
  { id: 'item-3', label: 'n.times do', code: 'for(let i=0; i<n; i++) {', type: 'syntax' },
  { id: 'item-4', label: 'hp++', code: 'heal()', type: 'heal' },
  { id: 'item-5', label: 'end', code: '}', type: 'syntax' },
  { id: 'item-6', label: 'bp++', code: 'bp_inc()', type: 'behavior' },
]);

export const logStore = atom<string[]>([]);

export const addLog = (msg: string) => {
  logStore.set([...logStore.get(), msg]);
};
