import snapshot from './tasks.json';
import { getSheetTasks } from '@/data/sheet/sheetUtils';

const normalizeUrl = (url: string) => url.trim()
  .replace(/[?#].*$/, '').replace(/\/overview\/?$/, '').replace(/\/$/, '')
  .replace('www.kaggle.com', 'kaggle.com');
const bankTasks = getSheetTasks();
const bankByUrl = new Map<string, typeof bankTasks>();
for (const task of bankTasks) {
  for (const url of task.link?.match(/https?:\/\/\S+/g) ?? []) {
    const key = normalizeUrl(url);
    const entries = bankByUrl.get(key) ?? [];
    if (!entries.includes(task)) entries.push(task);
    bankByUrl.set(key, entries);
  }
}

// These shared contest/folder URLs need an explicit problem identity.
const sharedLinkNames: Record<string, string> = {
  'Cosmic Probe: Star–Galaxy–Quasar Classification from SDSS Photometry': 'Cosmic Probe',
  'Spot the Spots: Individual Identification of Leopard Cats': 'Spot the Spots',
  'Who is the Best Pitcher (RAG over structured MLB JSON)': 'Who is the Best Pitcher?',
  'Who Speaks What?': 'Who Speaks What',
};

// Coordinates and memberships are the supplied task-map snapshot, without reclustering.
export const clusterNames = [
  'Generative vision & training', 'Model internals & control',
  'Retrieval & matching', 'Anomalies & audio', 'Visual perception',
  'Language & translation', 'Reasoning & games', 'Tabular & structured data',
];
export const colors = ['#a68bd3', '#dc9868', '#67b6a1', '#7ca7ce', '#d983ac', '#a4b863', '#64a572', '#d67e80'];
export const labelColors = ['#75608e', '#936742', '#477e70', '#506f8d', '#975a79', '#6d7f3d', '#426e49', '#945658'];
export interface MapTask {
  id: number;
  name: string;
  x: number;
  y: number;
  fine: number;
  cluster: number;
  url: string;
  contest: string;
}
export const fineClusters = snapshot.fine;
export const tasks: MapTask[] = snapshot.tasks.map((row, id) => {
  const sourceName = String(row[0]);
  const candidates = bankByUrl.get(normalizeUrl(String(row[4]))) ?? [];
  const bankTask = candidates.length === 1 ? candidates[0]
    : candidates.find(task => task.problem === (sharedLinkNames[sourceName] ?? sourceName));
  if (!bankTask) throw new Error(`Task map entry has no unique problem-bank match: ${sourceName}`);
  return {
    id, name: bankTask.problem, x: Number(row[1]), y: Number(row[2]),
    fine: Number(row[3]), cluster: snapshot.fine[Number(row[3])].c,
    url: String(row[4]), contest: bankTask.contest,
  };
});
export const clusters = snapshot.coarse.map((cluster, id) => ({
  id, name: clusterNames[id], description: cluster.d,
  tasks: tasks.filter(task => task.cluster === id),
}));
