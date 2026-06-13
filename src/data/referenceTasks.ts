export type SectionAccent = 'blue' | 'teal' | 'orange' | 'pink' | 'purple';

export interface ReferenceTask {
  id: string;
  task: string;
  taskUrl?: string;
  competition: string;
  learn: string[];
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

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const splitLearn = (s: string): string[] =>
  s
    .split(/,|\s\+\s/)
    .map((t) => t.trim())
    .filter(Boolean);

const t = (
  competition: string,
  task: string,
  learn: string,
  taskUrl?: string,
): ReferenceTask => ({
  id: `${slug(competition)}-${slug(task)}`,
  task,
  taskUrl,
  competition,
  learn: splitLearn(learn),
});

export const referenceSections: ReferenceSection[] = [
  {
    id: 'tabular-ml',
    title: 'Tabular Machine Learning',
    shortTitle: 'Tabular ML',
    description:
      'Get familiar with classical machine learning models and tabular dataset processing. Start with dataset exploration, progress to feature engineering, continue with modelling, then deeper EDA, and end with brief theory tasks.',
    accent: 'blue',
    type: 'ML',
    tasks: [
      t('OJIA 2025', 'smart cargo', 'hello world - basic linear regression'),
      t('BCS Easter Round 2025', 'cybersecurity ai', 'data cleaning'),
      t('Local Stage Simulation 2026', 'transport', 'clustering (1)'),
      t('IOAI Day 2 2025', 'antique', 'clustering (2) + data exploration'),
      t('Simulare OJIA 1 2025', 'credit score', 'feature engineering (1)'),
      t('Simulare OJIA 2 2025', 'status pacient', 'feature engineering (2)'),
      t(
        'Local Stage Simulation 2026',
        'paintings',
        'data cleaning + feature engineering (3)',
      ),
      t('"Unirea" College Round 2026', 'bac under scrutiny', 'FE for time series'),
      t('Simulare OJIA 2 2025', 'pret casa', 'models (1) + FE recap'),
      t('Local Stage Simulation 2026', 'parkinson', 'models (2)'),
      t('BCS Easter Round 2025', 'brain anomaly detection', 'models (3)'),
      t(
        'ONIA Winter Warmup 2025',
        'rabbit exhibition',
        'models (4) + data cleaning',
      ),
      t(
        'IOAI Mock 2025',
        'chem simulation',
        'normalization, outliers, FE + models (5)',
      ),
      t('Georgia Round 1 2026', 'memory trace', 'model theory (1)'),
      t('Georgia Round 1 2026', 'planet x', 'model theory (2)'),
    ],
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    shortTitle: 'NLP',
    description:
      'From beginner texts in tabular datasets to deep learning generative models. For language processing, you can use NLTK.',
    accent: 'teal',
    type: 'NLP',
    tasks: [
      t('Nitro NLP 2025', 'mickey si donald', 'tfidf, models (1)'),
      t('BCS Intermediate 1 2025', 'are you a robot', 'language processing, tfidf'),
      t('ONIA 2025', 'om vs ai', 'text cleaning (1) + tfidf, models (2)'),
      t('ROAI 2025', 'toxic', 'text cleaning (2) + tfidf, models (3)'),
      t('MLCompete', 'verses author', 'nlp feature engineering, text cleaning (3)'),
      t('Algolymp Winter Round', 'Save the Christmas', 'named entity recognition'),
      t(
        'DecebalTech 2026',
        'Bazarul lui Riki',
        'latent semantic analysis (svd, proj, cos sim)',
      ),
      t('ROAI 2025', 'skeletons', 'recurrent neural networks, sequence data'),
      t('Poland Phase 2 2025', 'source extraction', 'embeddings (1)'),
      t(
        'MLCompete',
        'Residency Exam',
        'embeddings (2) - but with mid score',
        'https://platform.olimpiada-ai.ro/en/problems/43',
      ),
      t('NEOAI 2025', 'broken bert', 'embeddings (3)'),
      t('ROAI 2025', 'toxic (again)', 'model finetuning (1), Bert'),
      t(
        'MLCompete',
        'Text correction',
        'model finetuning (2), T5',
        'https://platform.olimpiada-ai.ro/en/problems/46',
      ),
      t('AICC Round 2', 'essay gap', 'model finetuning (3), Bert'),
      t(
        'MLCompete',
        'Residency Exam (again for full score)',
        'LLMs - local vLLM inference or using an API',
        'https://platform.olimpiada-ai.ro/en/problems/43',
      ),
      t(
        'NEOAI 2025',
        'evading ai text detection',
        'LLM steering + sparse autoencoders',
      ),
    ],
  },
  {
    id: 'cv',
    title: 'Computer Vision',
    shortTitle: 'CV',
    description:
      'For image processing tasks, we highly recommend solving them using only OpenCV.',
    accent: 'orange',
    type: 'CV',
    tasks: [
      t('MLCompete', 'Real Art vs. AI-Generated Art', 'CNN classification'),
      t('MLCompete', 'Saving Christmas', 'pretrained CNN regression'),
      t('ROAI 2025', 'hotspot', 'image preprocessing (1)'),
      t('ONIA 2025', 'notatie bizantina', 'image processing (2)'),
      t('Decebal Tech 2025', 'sami', 'image processing (3)'),
      t('Algolymp PreOJIA 11-12 2026', 'lunar craters', 'image processing (4)'),
      t('Poland Phase 2 2025', 'non-normal dist', 'encoder-decoder architecture'),
      t(
        'ONIA Winter Warmup 2025',
        'glitch hunter',
        'binary segmentation using UNet (1)',
      ),
      t(
        'IOAI At-Home 2025',
        'weather',
        'UNet (2) + advanced modules + TTA',
      ),
      t('IOAI At-Home 2025', 'radar', 'encoder-decoder, focal loss'),
      t('Spooky Round 2025', 'haunt me', 'object detection (1), faster rcnn'),
      t('Nitro NLP 2025', 'find the ducks', 'object detection (2), yolo'),
      t('AICC Round 2', 'face matching', 'CLIP (1), embeddings retrieval'),
      t('ONIA Winter Warmup 2025', 'magic of words', 'CLIP (2), finetune'),
      t('NEOAI 2025', 'cuties segmentation', 'CLIP (3), CLIPSeg'),
      t('IOAI Day 2 2025', 'restroom', 'CLIP (4), CLIPReID'),
      t('IOAI Day 2 2025', 'pixel', 'CLIP (5), MaskCLIP'),
      t('NEOAI 2025', 'hogspell challenge', 'stable diffusion finetune'),
      t('MLCompete', 'thousand rooms', 'vqa'),
    ],
  },
  {
    id: 'audio',
    title: 'Audio',
    shortTitle: 'Audio',
    description: '',
    accent: 'pink',
    type: 'AUDIO',
    tasks: [
      t('AICC Round 3', 'soud of nature', 'melspectogram classification'),
      t('Spooky Round 2025', 'creepy pizza', 'lstm for sound classification'),
      t('AICC Round 2', 'demixing audio', 'unet for sounds'),
    ],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    shortTitle: 'DL',
    description: '',
    accent: 'purple',
    type: 'ML',
    tasks: [
      t(
        'NEOAI 2025',
        'underfitting cv',
        'hyperparam tuning + KV divergence loss',
      ),
      t(
        'AICC Round 0',
        'find brain tumors',
        'self supervised learning (BYOL, FixMatch)',
      ),
      t('IOAI Mock 2025', 'grid collage', 'pseudo labeling'),
      t('AICC Round 1', 'the defected nuts', 'anomaly detection'),
      t('CEOAI Practice 1', 'star observatory', 'knowledge distillation'),
    ],
  },
];

export const totalTaskCount = referenceSections.reduce(
  (sum, s) => sum + s.tasks.length,
  0,
);

import type { PracticeStatus, Task } from './types';

export const referenceToTask = (
  ref: ReferenceTask,
  section: ReferenceSection,
  difficulty: PracticeStatus,
): Task => {
  const url = ref.taskUrl ?? '';
  const isNitro = url.includes('nitro');
  const isKilonova = url.includes('kilonova');
  return {
    name: ref.task,
    type: ref.learn.join(' & '),
    author: ref.competition,
    kaggle: isNitro || isKilonova ? undefined : url || undefined,
    nitroJudge: isNitro ? url : undefined,
    source: isKilonova ? url : undefined,
    solution: 'todo',
    practiceStatus: difficulty,
  };
};
