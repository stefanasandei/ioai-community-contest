export type SectionAccent = 'blue' | 'teal' | 'orange' | 'pink' | 'purple';

import type { LearnItem, PracticeStatus } from './types';

export interface ReferenceTask {
  id: string;
  task: string;
  taskUrl?: string;
  competition: string;
  solutionUrl?: string;
  difficulty?: PracticeStatus;
  learn: LearnItem[];
}

export interface ReferenceSection {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  accent: SectionAccent;
  type: 'ML' | 'NLP' | 'CV' | 'AUDIO' | 'RL';
  tasks: ReferenceTask[];
}

import refSections from './referenceSections.json';
export const referenceSections = refSections as ReferenceSection[];

export const totalTaskCount = referenceSections.reduce(
  (sum, s) => sum + s.tasks.length,
  0,
);

import type { Task } from './types';

export const referenceToTask = (
  ref: ReferenceTask,
  section: ReferenceSection,
  difficulty?: PracticeStatus,
): Task => {
  const url = ref.taskUrl ?? '';
  const isNitro = url.includes('nitro');
  const isKilonova = url.includes('kilonova');
  return {
    name: ref.task,
    type: ref.learn.map((i) => i.topic).join(' & '),
    author: ref.competition,
    kaggle: isNitro || isKilonova ? undefined : url || undefined,
    nitroJudge: isNitro ? url : undefined,
    source: isKilonova ? url : undefined,
    solution: ref.solutionUrl ?? 'todo',
    practiceStatus: difficulty,
  };
};
