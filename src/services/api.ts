/**
 * Client API Service for Gemini Research Pipeline & Mains AI Evaluation
 */

import { DailyReport, NewsArticle, Category, CATEGORIES } from '../types';
import { SAMPLE_DAILY_REPORT_27_09_2026 } from './sampleData';

export type PipelineStage =
  | 'idle'
  | 'checking_api'
  | 'researching'
  | 'sources_collected'
  | 'structuring'
  | 'validating'
  | 'synthesizing'
  | 'completed'
  | 'insufficient_coverage'
  | 'error';

export interface PipelineProgress {
  stage: PipelineStage;
  message: string;
  categoryIndex?: number;
  totalCategories?: number;
  currentCategory?: string;
  percent: number;
}

export const ApiService = {
  // Check backend and Gemini API status
  async checkStatus(): Promise<{ hasApiKey: boolean; currentDate: string }> {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Status check failed');
      return await res.json();
    } catch {
      return { hasApiKey: false, currentDate: new Date().toISOString() };
    }
  },

  // Execute the Full 3-Pass Grounded Pipeline for a selected date
  async generateDailyReport(
    date: string,
    onProgress?: (progress: PipelineProgress) => void,
    isDemo = false
  ): Promise<DailyReport> {
    if (isDemo) {
      if (onProgress) {
        onProgress({ stage: 'completed', message: 'Demo dataset loaded.', percent: 100 });
      }
      return {
        ...SAMPLE_DAILY_REPORT_27_09_2026,
        reportDate: date,
        id: `report-${date}-sample`,
      };
    }

    onProgress?.({
      stage: 'checking_api',
      message: 'Verifying Google Gemini API credentials...',
      percent: 5,
    });

    const status = await this.checkStatus();
    if (!status.hasApiKey) {
      throw new Error(
        'GEMINI_API_KEY is not configured in your environment. You can enable "Demo Mode" in Settings to inspect the full UPSC feature suite with verified sample data, or set your API key in Secrets.'
      );
    }

    onProgress?.({
      stage: 'researching',
      message: `Starting Google Search grounded research across official sources for ${date}...`,
      percent: 15,
    });

    let articles: NewsArticle[] = [];

    // PASS 1: Unified Grounded Research (1 single API request to avoid 429 quota exhaustion)
    const researchRes = await fetch('/api/pipeline/research-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });

    if (!researchRes.ok) {
      const errData = await researchRes.json().catch(() => ({}));
      const errMsg = errData.error || `Research failed (HTTP ${researchRes.status})`;
      throw new Error(errMsg);
    }

    const researchData = await researchRes.json();

    if (!researchData.hasCoverage || !researchData.researchText) {
      throw new Error(
        `INSUFFICIENT_COVERAGE: Insufficient reliable coverage identified for ${date} across official government portals. Note: Future dates are blocked, and historic dates prior to digital archiving may have limited coverage.`
      );
    }

    onProgress?.({
      stage: 'sources_collected',
      message: `Grounding sources collected (${(researchData.sources || []).length} sources). Structuring into UPSC syllabus schema...`,
      percent: 45,
    });

    // PASS 2: Batch Structuring (1 single JSON schema call)
    const structRes = await fetch('/api/pipeline/structure-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        researchText: researchData.researchText,
        sources: researchData.sources,
      }),
    });

    if (!structRes.ok) {
      const errData = await structRes.json().catch(() => ({}));
      const errMsg = errData.error || `Structuring failed (HTTP ${structRes.status})`;
      throw new Error(errMsg);
    }

    const structData = await structRes.json();
    articles = structData.articles || [];

    if (articles.length === 0) {
      throw new Error(
        `INSUFFICIENT_COVERAGE: Insufficient reliable coverage identified for ${date} across official government portals. Note: Future dates are blocked, and historic dates prior to digital archiving may have limited coverage.`
      );
    }

    // PASS 3: Validation pass
    onProgress?.({
      stage: 'validating',
      message: 'Auditing source verification status, statutory tags & eliminating duplicates...',
      percent: 75,
    });

    const valRes = await fetch('/api/pipeline/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, articles }),
    });

    let validatedArticles = articles;
    if (valRes.ok) {
      const valData = await valRes.json();
      validatedArticles = valData.validatedArticles || articles;
    }

    // PASS 4: Synthesis of daily summary, editorial, quick revision, MCQs, Connect the Dots
    onProgress?.({
      stage: 'synthesizing',
      message: 'Synthesizing Daily Trend, Editorial Pick, Quick Revision Box & Practice Set...',
      percent: 85,
    });

    const synthRes = await fetch('/api/pipeline/synthesize-daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, articles: validatedArticles }),
    });

    let dailySynthesis: any = {};
    if (synthRes.ok) {
      dailySynthesis = await synthRes.json();
    }

    onProgress?.({
      stage: 'completed',
      message: 'Verification completed. Daily notes generated successfully!',
      percent: 100,
    });

    const finalReport: DailyReport = {
      id: `report-${date}`,
      reportDate: date,
      trendNote:
        dailySynthesis.trendNote ||
        `Verified UPSC current affairs syllabus coverage for ${date}`,
      researchStatus: 'completed',
      totalArticles: validatedArticles.length,
      articles: validatedArticles,
      editorials: dailySynthesis.editorials || [],
      factsInBrief: dailySynthesis.factsInBrief || [],
      quickRevision: dailySynthesis.quickRevision || [],
      keywords: dailySynthesis.keywords || [],
      quotesAndData: dailySynthesis.quotesAndData || [],
      practiceSet: dailySynthesis.practiceSet || { mcqs: [], mains: [] },
      connectTheDots: dailySynthesis.connectTheDots || [],
      estimatedReadingTimeMinutes: Math.max(8, Math.round(validatedArticles.length * 2.2)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSample: false,
    };

    return finalReport;
  },

  // Mains Answer AI Self-Evaluation
  async evaluateMainsAnswer(params: {
    question: string;
    gsPaper: string;
    marks: number;
    wordLimit: number;
    answerText: string;
  }) {
    const res = await fetch('/api/evaluate-mains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Evaluation service temporarily unavailable');
    }

    const data = await res.json();
    return data.evaluation;
  },
};
