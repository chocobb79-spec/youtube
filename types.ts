export enum AppStep {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export interface TopicSuggestion {
  id: string;
  title: string;
  reason: string;
}

export interface ScriptAnalysis {
  structureSteps: string[];
  toneAndStyle: string;
  hookStrategy: string;
  suggestedTopics: TopicSuggestion[];
}
