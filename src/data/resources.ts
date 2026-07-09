export type ResourceType =
  | 'article'
  | 'video'
  | 'course'
  | 'documentation'
  | 'book'
  | 'notebook'
  | 'interactive'
  | 'tool'
  | 'other';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  difficulty?: Difficulty;
  description?: string;
  author?: string;
  source?: string;
  tags?: string[];
  free?: boolean;
  featured?: boolean;
}

export interface GeneralCategory {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  icon?: string;
  accent?: string;
  order: number;
  guideMdxPath: string;
  resources: Resource[];
}

export interface SyllabusSubsection {
  id: string;
  title: string;
  description: string;
  order: number;
  guideMdxPath: string;
  resources: Resource[];
}

export interface SyllabusSection {
  id: string;
  title: string;
  shortTitle?: string;
  description: string;
  order: number;
  guideMdxPath: string;
  subsections: SyllabusSubsection[];
}

export interface ResourcesData {
  general: GeneralCategory[];
  syllabus: SyllabusSection[];
}

import resourcesData from './resources.json';

export const resources = resourcesData as ResourcesData;

export const getGeneralCategoryById = (id: string): GeneralCategory | undefined =>
  resources.general.find((c) => c.id === id);

export const getSyllabusSectionById = (id: string): SyllabusSection | undefined =>
  resources.syllabus.find((s) => s.id === id);

export const getSyllabusSubsection = (
  section: SyllabusSection,
  subsectionId: string,
): SyllabusSubsection | undefined =>
  section.subsections.find((sub) => sub.id === subsectionId);

export const getSortedGeneralCategories = (): GeneralCategory[] =>
  [...resources.general].sort((a, b) => a.order - b.order);

export const getSortedSyllabusSections = (): SyllabusSection[] =>
  [...resources.syllabus].sort((a, b) => a.order - b.order);

export const getSortedSubsections = (section: SyllabusSection): SyllabusSubsection[] =>
  [...section.subsections].sort((a, b) => a.order - b.order);

export const getAllResources = (): Resource[] => {
  const generalResources = resources.general.flatMap((c) => c.resources);
  const syllabusResources = resources.syllabus.flatMap((s) =>
    s.subsections.flatMap((sub) => sub.resources),
  );
  return [...generalResources, ...syllabusResources];
};

export const getFeaturedResources = (): Resource[] =>
  getAllResources().filter((r) => r.featured);

export const searchResources = (query: string): Resource[] => {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return [];

  const matches = (text?: string) => text?.toLowerCase().includes(normalized);

  return getAllResources().filter(
    (r) =>
      matches(r.title) ||
      matches(r.description) ||
      matches(r.source) ||
      matches(r.author) ||
      r.tags?.some((tag) => matches(tag)),
  );
};

export const resourceTypeLabel: Record<ResourceType, string> = {
  article: 'Article',
  video: 'Video',
  course: 'Course',
  documentation: 'Docs',
  book: 'Book',
  notebook: 'Notebook',
  interactive: 'Interactive',
  tool: 'Tool',
  other: 'Resource',
};

export const difficultyLabel: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};
