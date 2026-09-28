/**
 * UPSC Daily Current Affairs - Domain Types & Data Contracts
 * Strict adherence to UPSC CSE Exam Architecture:
 * Prelims (GS1, CSAT), Mains (GS1, GS2, GS3, GS4, Essay), and Interview.
 */

export type Category =
  | 'Polity & Governance'
  | 'Economy'
  | 'International Relations'
  | 'Environment & Ecology'
  | 'Science & Tech'
  | 'Social Issues & Justice'
  | 'Internal Security'
  | 'Ethics & Integrity'
  | 'Editorials';

export const CATEGORIES: Category[] = [
  'Polity & Governance',
  'Economy',
  'International Relations',
  'Environment & Ecology',
  'Science & Tech',
  'Social Issues & Justice',
  'Internal Security',
  'Ethics & Integrity',
  'Editorials',
];

export type GSPaper = 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay' | 'Prelims Only';

export type VerificationStatus = 'Verified' | 'Partial' | 'Unverified';

export type SourceType =
  | 'Primary (PIB / Ministry / Official)'
  | 'Judiciary / Supreme Court / High Court'
  | 'Constitutional Body (ECI / UPSC / CAG)'
  | 'Regulatory / Statutory (RBI / SEBI / NITI Aayog)'
  | 'International Body (UN / IMF / World Bank)'
  | 'National Daily (The Hindu / Indian Express)'
  | 'Other Verified Media';

export interface Source {
  id: string;
  name: string;
  title: string;
  publicationDate: string;
  url: string;
  type: SourceType;
  verificationNotes?: string;
}

export interface MainsAnalysis {
  issues: string[];
  measures: string[];
  wayForward: string[];
  example?: string;
}

export type QuestionType = 'prelims_mcq' | 'mains_question';

export interface Question {
  type: QuestionType;
  text: string;
  options?: string[]; // 4 options for Prelims
  correctAnswer?: number; // 0-3 index
  explanation?: string;
  marks?: number; // 10 or 15 marks
  wordLimit?: number; // 150 or 250 words
  staticConcept?: string;
}

export interface NewsArticle {
  id: string;
  reportId: string;
  headline: string;
  category: Category;
  gsPaper: GSPaper;
  syllabusTopic: string;
  staticLink: string; // e.g. Articles, Acts, schemes, committees, agreements
  essayRelevance?: string;
  whyInNews: {
    what: string;
    who: string;
    when: string;
    where: string;
    why: string;
  };
  background: string;
  prelimsFacts: string[];
  mainsAnalysis: MainsAnalysis;
  question: Question;
  sources: Source[];
  verificationStatus: VerificationStatus;
  verificationSummary: string;
  tags: string[];
  isSample?: boolean;
}

export interface EditorialPick {
  id: string;
  reportId: string;
  title: string;
  publication: string;
  author: string;
  date: string;
  link: string;
  gsPaper: GSPaper;
  stance: string;
  keyArguments: string[];
  counterArgument: string;
  upscRelevance: string;
  mainsModelParagraph: string; // Original 4-5 line UPSC model answer synthesis
  isSample?: boolean;
}

export interface QuickRevisionItem {
  id: string;
  topic: string;
  oneLiner: string;
  gsPaper: GSPaper;
}

export interface UPSCKeyword {
  keyword: string;
  definition: string;
  syllabusRelevance: string;
  mainsUsage: string;
}

export interface QuoteOrDataPoint {
  type: 'Quote' | 'Data Point';
  content: string;
  attribution: string;
  mainsContext: string;
  verified: boolean;
}

export interface PracticeMCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  syllabusTopic: string;
  staticConcept: string;
  sourceRef: string;
}

export interface PracticeMainsQuestion {
  id: string;
  question: string;
  marks: number;
  wordLimit: number;
  gsPaper: GSPaper;
  modelPoints: string[];
  syllabusTopic: string;
}

export interface ConnectTheDots {
  id: string;
  currentTopic: string;
  linkedPastTopic: string;
  interlinkExplanation: string;
  gsPaper: GSPaper;
}

export type ResearchStatus =
  | 'idle'
  | 'researching'
  | 'sources_collected'
  | 'structuring'
  | 'validating'
  | 'completed'
  | 'partial'
  | 'insufficient_coverage'
  | 'error';

export interface DailyReport {
  id: string;
  reportDate: string; // DD-MM-YYYY format
  trendNote: string;
  researchStatus: ResearchStatus;
  totalArticles: number;
  articles: NewsArticle[];
  editorials: EditorialPick[];
  factsInBrief: Array<{ headline: string; fact: string; gsPaper: GSPaper }>;
  quickRevision: QuickRevisionItem[];
  keywords: UPSCKeyword[];
  quotesAndData: QuoteOrDataPoint[];
  practiceSet: {
    mcqs: PracticeMCQ[];
    mains: PracticeMainsQuestion[];
  };
  connectTheDots: ConnectTheDots[];
  estimatedReadingTimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  isSample?: boolean;
}

// User state & persistence models
export interface Bookmark {
  id: string;
  articleId: string;
  reportDate: string;
  headline: string;
  category: Category;
  gsPaper: GSPaper;
  savedAt: string;
  note?: string;
}

export interface UserNote {
  id: string;
  articleId?: string;
  articleHeadline?: string;
  reportDate: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ReadingStatus = 'unread' | 'read' | 'revision_due' | 'revised';

export interface UserProgress {
  articleId: string;
  reportDate: string;
  readingStatus: ReadingStatus;
  revisionDueAt?: string; // ISO date
  lastRevisedAt?: string;
  revisionCycle: number; // 0, 1, 2, 3...
  updatedAt: string;
}

export interface MCQAttempt {
  questionId: string;
  reportDate: string;
  selectedOption: number;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface MainsEvaluation {
  relevanceScore: number; // 0-10
  structureScore: number; // 0-10
  introScore: number; // 0-10
  bodyScore: number; // 0-10
  conclusionScore: number; // 0-10
  factsScore: number; // 0-10
  multidimensionalityScore: number; // 0-10
  examplesScore: number; // 0-10
  overallScore: number; // out of total marks
  wordCountAnalysis: string;
  feedback: {
    intro: string;
    body: string;
    conclusion: string;
    valueAddition: string[];
    criticalMissingDimensions: string[];
    overallRecommendation: string;
  };
  disclaimer: string;
  evaluatedAt: string;
}

export interface MainsDraft {
  id: string;
  questionId: string;
  questionText: string;
  gsPaper: GSPaper;
  marks: number;
  wordLimit: number;
  draftText: string;
  wordCount: number;
  aiEvaluation?: MainsEvaluation;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackFlag {
  id: string;
  articleId: string;
  reportDate: string;
  headline: string;
  flagType: 'incorrect_fact' | 'broken_source' | 'irrelevant' | 'duplicate' | 'missing_info';
  comment: string;
  createdAt: string;
}

export interface UserSettings {
  revisionIntervals: number[]; // e.g. [1, 3, 7, 30] in days
  demoMode: boolean; // default false
  modelChoice: string; // 'gemini-3.8-flash'
  theme: 'light' | 'dark';
  readingFontSize: 'normal' | 'large' | 'compact';
  readingFontFamily: 'sans' | 'serif';
}

export interface GlobalFilterState {
  searchQuery: string;
  category: Category | 'All';
  gsPaper: GSPaper | 'All';
  verificationStatus: VerificationStatus | 'All';
  sourceFilter: string;
  readFilter: 'all' | 'unread' | 'read' | 'revision_due';
  bookmarkedOnly: boolean;
  dateRange: {
    from?: string;
    to?: string;
  };
}
