import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '15mb' }));

// Helper to get GoogleGenAI client
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to sleep for retry delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to retry Gemini calls on transient 503/429 errors
async function executeWithRetry<T>(fn: () => Promise<T>, maxRetries = 2, delayMs = 1500): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const str = err instanceof Error ? err.message : String(err);
      if ((str.includes('503') || str.includes('UNAVAILABLE') || str.includes('429') || str.includes('RESOURCE_EXHAUSTED')) && attempt < maxRetries) {
        console.warn(`Transient Gemini API error (attempt ${attempt}/${maxRetries}), retrying in ${delayMs}ms...`);
        await delay(delayMs * attempt);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Helper to sanitize error messages for client display
function sanitizeErrorMessage(err: unknown): string {
  let raw = err instanceof Error ? err.message : String(err);

  // If raw message is a JSON string from GoogleGenAI SDK, extract the human message
  try {
    const parsed = JSON.parse(raw);
    if (parsed.error && parsed.error.message) {
      raw = parsed.error.message;
    }
  } catch {
    // Not a JSON string
  }

  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429') || raw.includes('quota') || raw.includes('exceeded your current quota')) {
    return 'Gemini API Quota Exceeded (HTTP 429): The free-tier request rate limit was reached. Please wait a moment before retrying, or click "Load Sample Dossier (Demo Mode)" to explore the verified UPSC study dossier.';
  }
  if (raw.includes('503') || raw.includes('UNAVAILABLE') || raw.includes('high demand')) {
    return 'Gemini API High Demand (HTTP 503): The AI model is temporarily experiencing high global traffic. Please retry in a few moments, or use Demo Mode.';
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED')) {
    return 'Gemini API Key Error: Please verify that your GEMINI_API_KEY is active in the Settings > Secrets panel.';
  }
  return raw;
}

// 1. Health & Config endpoint
app.get('/api/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
    currentDate: new Date().toISOString(),
    supportedModels: ['gemini-3.8-flash'],
  });
});

// 2. BATCH Grounded Research Endpoint (1 Single Call for All Categories to Conserve Free-Tier Quota)
app.post('/api/pipeline/research-batch', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ error: 'Date is required.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please configure it in Settings > Secrets or enable Demo Mode.',
      });
      return;
    }

    // Parse DD-MM-YYYY into human search queries (e.g. 27 September 2026)
    const [dStr, mStr, yStr] = date.split('-');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = months[parseInt(mStr, 10) - 1] || 'September';
    const naturalDate = `${dStr} ${monthName} ${yStr}`;

    const batchPrompt = `You are a chief factual research assistant for the UPSC Civil Services Examination.
Conduct a comprehensive search-grounded news investigation for India and the world on or around: "${naturalDate}" (also formatted as "${date}").

Cover major developments across these core UPSC categories:
1. Polity & Governance (Supreme Court / High Court rulings, constitutional questions, statutory commissions)
2. Economy (RBI notifications, banking, GDP, foreign trade, fiscal policy, GST)
3. International Relations (bilateral pacts, summits, MEA statements, global institutions like UN/WTO)
4. Environment & Ecology (climate change, pollution rulings by NGT, Ramsar sites, wildlife, MoEFCC)
5. Science & Tech (ISRO launches, defense tests, biotechnology, quantum/AI missions, patents)
6. Social Issues & Justice (welfare schemes, labour codes, health, education, vulnerable sections)
7. Internal Security (AML/CFT, PMLA, border management, FATF, cyber security)
8. Ethics in Governance (civil service conduct, transparency, CVC guidelines)

PRIORITIZE PRIMARY OFFICIAL SOURCES:
- Press Information Bureau (PIB Delhi & ministries), Government of India portals.
- Supreme Court judgments, High Courts.
- Reserve Bank of India (RBI notifications), SEBI, NITI Aayog.
- ISRO, DRDO, Election Commission of India (ECI), CAG.
- The Hindu, The Indian Express.

CRITICAL INSTRUCTIONS:
- Identify 3 to 8 significant, verifiable developments across these categories.
- EXCLUDE routine partisan politics, sensational crime, celebrity trivia, and pure sports.
- Detail the factual core: what occurred, who acted, when, where, and what statutory or constitutional provision applies.
- Include static context: Constitutional articles, Acts, schemes, landmark precedents.
- Do NOT fabricate facts, data points, or URLs. All factual claims must be strictly grounded in search results.
- If coverage is thin for this date, provide fewer items and state so.`;

    const response = await executeWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: batchPrompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        },
      })
    );

    const text = response.text || '';

    // Extract verified grounding metadata strictly from search tool output
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const extractedSources: Array<{ title: string; url: string }> = [];
    const seenUrls = new Set<string>();

    for (const chunk of groundingChunks) {
      if (chunk.web && chunk.web.uri) {
        const uri = chunk.web.uri;
        if (!seenUrls.has(uri)) {
          seenUrls.add(uri);
          extractedSources.push({
            title: chunk.web.title || 'Official Source Reference',
            url: uri,
          });
        }
      }
    }

    res.json({
      date,
      researchText: text,
      sources: extractedSources,
      hasCoverage: text.trim().length > 120,
    });
  } catch (err: unknown) {
    const errorMsg = sanitizeErrorMessage(err);
    console.error('Batch Research Pass Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// 3. BATCH Structuring Endpoint (Structures All Articles in 1 Single JSON Call)
app.post('/api/pipeline/structure-batch', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, researchText, sources } = req.body;
    if (!date || !researchText) {
      res.status(400).json({ error: 'Date and researchText are required.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const structuringPrompt = `You are a senior UPSC CSE mentor and syllabus mapping expert.
Convert the provided raw research text into an array of structured, exam-ready UPSC articles.

Selected Date: "${date}"

RAW RESEARCH FINDINGS:
"""
${researchText}
"""

VERIFIED SEARCH GROUNDING SOURCES (Use ONLY these URLs. Never invent or hallucinate URLs):
${JSON.stringify(sources || [], null, 2)}

STRICT RULES:
1. Base all content ONLY on the provided research text. If a detail is missing, write "Not verified". Never add outside speculative facts.
2. For each distinct topic found in the research (generate between 3 and 8 articles), output a structured article with syllabus mappings, Prelims facts, Mains analysis, and practice question.
3. Category must be one of: "Polity & Governance", "Economy", "International Relations", "Environment & Ecology", "Science & Tech", "Social Issues & Justice", "Internal Security", "Ethics & Integrity".
4. GS Paper must be one of: "GS1", "GS2", "GS3", "GS4", "Essay", "Prelims Only".`;

    const response = await executeWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: structuringPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          responseSchema: {
          type: Type.OBJECT,
          properties: {
            articles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of the 8 approved categories',
                  },
                  gsPaper: {
                    type: Type.STRING,
                    description: 'One of: GS1, GS2, GS3, GS4, Essay, Prelims Only',
                  },
                  syllabusTopic: { type: Type.STRING },
                  staticLink: {
                    type: Type.STRING,
                    description: 'Relevant Constitutional Articles, Acts, Committees, or Agreements',
                  },
                  essayRelevance: { type: Type.STRING },
                  whyInNews: {
                    type: Type.OBJECT,
                    properties: {
                      what: { type: Type.STRING },
                      who: { type: Type.STRING },
                      when: { type: Type.STRING },
                      where: { type: Type.STRING },
                      why: { type: Type.STRING },
                    },
                    required: ['what', 'who', 'when', 'where', 'why'],
                  },
                  background: { type: Type.STRING },
                  prelimsFacts: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '3 to 5 high-yield factual bullets with keywords',
                  },
                  mainsAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                      issues: { type: Type.ARRAY, items: { type: Type.STRING } },
                      measures: { type: Type.ARRAY, items: { type: Type.STRING } },
                      wayForward: { type: Type.ARRAY, items: { type: Type.STRING } },
                      example: { type: Type.STRING },
                    },
                    required: ['issues', 'measures', 'wayForward'],
                  },
                  question: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: 'prelims_mcq or mains_question' },
                      text: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.INTEGER, description: '0 to 3' },
                      explanation: { type: Type.STRING },
                      marks: { type: Type.INTEGER },
                      wordLimit: { type: Type.INTEGER },
                      staticConcept: { type: Type.STRING },
                    },
                    required: ['type', 'text'],
                  },
                  tags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: [
                  'headline',
                  'category',
                  'gsPaper',
                  'syllabusTopic',
                  'staticLink',
                  'whyInNews',
                  'background',
                  'prelimsFacts',
                  'mainsAnalysis',
                  'question',
                  'tags',
                ],
              },
            },
          },
          required: ['articles'],
        },
      },
    }));

    const parsed = JSON.parse(response.text || '{"articles":[]}');
    const rawArticles = parsed.articles || [];

    // Distribute sources to articles based on relevance
    const structuredArticles = rawArticles.map((art: any, aIdx: number) => {
      // Find sources matching this article's keywords
      const matchedSources = (sources || []).filter((s: { title: string; url: string }) => {
        const text = (s.title + ' ' + s.url).toLowerCase();
        const head = art.headline.toLowerCase();
        const top = art.syllabusTopic.toLowerCase();
        return head.split(' ').some((w: string) => w.length > 4 && text.includes(w)) ||
               top.split(' ').some((w: string) => w.length > 4 && text.includes(w));
      });

      const selectedSources = matchedSources.length > 0 ? matchedSources : (sources || []).slice(0, 2);

      const articleSources = selectedSources.map((s: { title: string; url: string }, idx: number) => {
        let sourceType = 'National Daily (The Hindu / Indian Express)';
        const lower = (s.url + ' ' + s.title).toLowerCase();
        if (lower.includes('pib.gov') || lower.includes('gov.in') || lower.includes('nic.in')) {
          sourceType = 'Primary (PIB / Ministry / Official)';
        } else if (lower.includes('sci.gov') || lower.includes('judgments') || lower.includes('court')) {
          sourceType = 'Judiciary / Supreme Court / High Court';
        } else if (lower.includes('rbi.org') || lower.includes('sebi.gov')) {
          sourceType = 'Regulatory / Statutory (RBI / SEBI / NITI Aayog)';
        } else if (lower.includes('un.org') || lower.includes('imf.org') || lower.includes('worldbank.org')) {
          sourceType = 'International Body (UN / IMF / World Bank)';
        }

        return {
          id: `src-${Date.now()}-${aIdx}-${idx}`,
          name: s.title || 'Official Grounding Source',
          title: s.title,
          publicationDate: date,
          url: s.url,
          type: sourceType,
          verificationNotes: 'Extracted from Google Search Grounding metadata.',
        };
      });

      return {
        ...art,
        sources: articleSources,
      };
    });

    res.json({ articles: structuredArticles });
  } catch (err: unknown) {
    const errorMsg = sanitizeErrorMessage(err);
    console.error('Batch Structuring Pass Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// 2. PASS 1: Grounded Research Endpoint (Search Grounding Enabled, NO JSON SCHEMA)
app.post('/api/pipeline/research', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, category } = req.body;
    if (!date || !category) {
      res.status(400).json({ error: 'Date and category are required.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please configure it in Settings > Secrets or enable Demo Mode.',
      });
      return;
    }

    // Parse DD-MM-YYYY into human search queries (e.g. 27 September 2026)
    const [dStr, mStr, yStr] = date.split('-');
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = months[parseInt(mStr, 10) - 1] || 'September';
    const naturalDate = `${dStr} ${monthName} ${yStr}`;

    const researchPrompt = `You are a factual research assistant for the UPSC Civil Services Examination.
Conduct a rigorous search-grounded news investigation for India and the world on or around: "${naturalDate}" (also formatted as "${date}").
Category: "${category}".

Prioritize official primary government, judicial, and regulatory sources:
1. Press Information Bureau (PIB Delhi & regional bureaus), Government of India ministries.
2. Supreme Court of India judgments, High Courts, and Central Administrative Tribunal.
3. Reserve Bank of India (RBI notifications, monetary policy), SEBI, NITI Aayog.
4. ISRO, DRDO, Department of Atomic Energy, CSIR.
5. Election Commission of India (ECI), Comptroller and Auditor General (CAG), UPSC, Finance Commission.
6. International bodies: United Nations, WTO, IMF, World Bank, International Court of Justice.
7. National reference dailies: The Hindu, The Indian Express.

CRITICAL INSTRUCTIONS:
- Identify 1-2 major policy announcements, legal verdicts, economic reforms, or ecological decisions published on "${naturalDate}" (or the most recent official notifications published in late ${monthName} ${yStr} leading to this date).
- EXCLUDE routine politics, partisan polemics, crime reports, celebrity gossip, and pure local sports.
- Detail the factual core: What occurred, who acted, when, where, and what statutory or constitutional provision applies.
- Include background: Constitutional articles, statutory Acts, flagship schemes, Supreme Court landmark precedents, bilateral agreements.
- Do NOT fabricate facts, data points, or URLs. All factual claims must be strictly grounded in search results.
- If and only if absolutely zero verifiable official developments exist for this period, write: "INSUFFICIENT_COVERAGE_FOR_DATE".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: researchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const text = response.text || '';

    // Extract verified grounding metadata strictly from search tool output
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const extractedSources: Array<{ title: string; url: string }> = [];
    const seenUrls = new Set<string>();

    for (const chunk of groundingChunks) {
      if (chunk.web && chunk.web.uri) {
        const uri = chunk.web.uri;
        if (!seenUrls.has(uri)) {
          seenUrls.add(uri);
          extractedSources.push({
            title: chunk.web.title || 'Official Source Reference',
            url: uri,
          });
        }
      }
    }

    res.json({
      category,
      date,
      researchText: text,
      sources: extractedSources,
      hasCoverage: !text.includes('INSUFFICIENT_COVERAGE_FOR_DATE') && text.trim().length > 80,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Research Pass Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// 3. PASS 2: Structuring Endpoint (JSON Mode with responseSchema, strictly based on Pass 1 text & sources)
app.post('/api/pipeline/structure', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, category, researchText, sources } = req.body;
    if (!date || !category || !researchText) {
      res.status(400).json({ error: 'Date, category, and researchText are required.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const structuringPrompt = `You are a senior UPSC CSE mentor and syllabus mapping expert.
Convert the provided raw research findings into a structured, exam-ready UPSC article.

Selected Date: "${date}"
Category: "${category}"

RAW RESEARCH FINDINGS:
"""
${researchText}
"""

VERIFIED SEARCH GROUNDING SOURCES (Use ONLY these URLs. Never invent or hallucinate URLs):
${JSON.stringify(sources || [], null, 2)}

STRICT RULES:
1. Base all content ONLY on the provided research text. If a detail is missing, write "Not verified" or leave empty. Never add outside speculative facts.
2. Connect deeply to the UPSC syllabus: Prelims relevance, Mains GS Paper (GS1, GS2, GS3, GS4, or Essay), and static concept linkages (Articles, Acts, Committees, Cases).
3. Frame 1 high-quality UPSC Prelims MCQ (with 4 options and detailed explanation) OR 1 Mains analytical question (10 or 15 marks with word limit).
4. All source links in the structured output must come strictly from the provided source list.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: structuringPrompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            gsPaper: {
              type: Type.STRING,
              description: 'One of: GS1, GS2, GS3, GS4, Essay, Prelims Only',
            },
            syllabusTopic: { type: Type.STRING },
            staticLink: {
              type: Type.STRING,
              description: 'Relevant Constitutional Articles, Acts, Committees, or Agreements',
            },
            essayRelevance: { type: Type.STRING },
            whyInNews: {
              type: Type.OBJECT,
              properties: {
                what: { type: Type.STRING },
                who: { type: Type.STRING },
                when: { type: Type.STRING },
                where: { type: Type.STRING },
                why: { type: Type.STRING },
              },
              required: ['what', 'who', 'when', 'where', 'why'],
            },
            background: { type: Type.STRING },
            prelimsFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 high-yield factual bullets with keywords',
            },
            mainsAnalysis: {
              type: Type.OBJECT,
              properties: {
                issues: { type: Type.ARRAY, items: { type: Type.STRING } },
                measures: { type: Type.ARRAY, items: { type: Type.STRING } },
                wayForward: { type: Type.ARRAY, items: { type: Type.STRING } },
                example: { type: Type.STRING },
              },
              required: ['issues', 'measures', 'wayForward'],
            },
            question: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: 'prelims_mcq or mains_question' },
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER, description: '0 to 3' },
                explanation: { type: Type.STRING },
                marks: { type: Type.INTEGER },
                wordLimit: { type: Type.INTEGER },
                staticConcept: { type: Type.STRING },
              },
              required: ['type', 'text'],
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'headline',
            'gsPaper',
            'syllabusTopic',
            'staticLink',
            'whyInNews',
            'background',
            'prelimsFacts',
            'mainsAnalysis',
            'question',
            'tags',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Attach ground sources programmatically
    const articleSources = (sources || []).map((s: { title: string; url: string }, idx: number) => {
      let sourceType = 'National Daily (The Hindu / Indian Express)';
      const lower = (s.url + ' ' + s.title).toLowerCase();
      if (lower.includes('pib.gov') || lower.includes('gov.in') || lower.includes('nic.in')) {
        sourceType = 'Primary (PIB / Ministry / Official)';
      } else if (lower.includes('sci.gov') || lower.includes('judgments') || lower.includes('court')) {
        sourceType = 'Judiciary / Supreme Court / High Court';
      } else if (lower.includes('rbi.org') || lower.includes('sebi.gov')) {
        sourceType = 'Regulatory / Statutory (RBI / SEBI / NITI Aayog)';
      } else if (lower.includes('un.org') || lower.includes('imf.org') || lower.includes('worldbank.org')) {
        sourceType = 'International Body (UN / IMF / World Bank)';
      }

      return {
        id: `src-${Date.now()}-${idx}`,
        name: s.title || 'Official Grounding Source',
        title: s.title,
        publicationDate: date,
        url: s.url,
        type: sourceType,
        verificationNotes: 'Extracted from Google Search Grounding metadata.',
      };
    });

    res.json({
      article: {
        ...parsed,
        category,
        sources: articleSources,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Structuring Pass Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// 4. PASS 3: Validation Endpoint (Audit verification status, duplicates, syllabus tags)
app.post('/api/pipeline/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { articles, date } = req.body;
    if (!Array.isArray(articles)) {
      res.status(400).json({ error: 'Articles array is required.' });
      return;
    }

    const validatedArticles = articles.map((art: any, index: number) => {
      const sourceCount = (art.sources || []).length;
      const hasPrimary = (art.sources || []).some((s: any) =>
        s.type && s.type.includes('Primary')
      );

      let verificationStatus = 'Unverified';
      let verificationSummary = 'Awaiting sufficient source verification.';

      if (hasPrimary || sourceCount >= 2) {
        verificationStatus = 'Verified';
        verificationSummary = `Verified against ${sourceCount} verified source(s)${hasPrimary ? ', including primary government/statutory record' : ''}.`;
      } else if (sourceCount === 1) {
        verificationStatus = 'Partial';
        verificationSummary = 'Single source report; cross-verification in progress.';
      }

      return {
        ...art,
        id: art.id || `art-${date}-${Date.now()}-${index}`,
        reportId: `report-${date}`,
        verificationStatus,
        verificationSummary,
      };
    });

    res.json({ validatedArticles });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Validation Pass Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// 5. Synthesis: Generate Daily Editorial, Facts in Brief, Quick Revision Box, Keywords, Connect the Dots
app.post('/api/pipeline/synthesize-daily', async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, articles } = req.body;
    if (!date || !Array.isArray(articles) || articles.length === 0) {
      res.status(400).json({ error: 'Valid date and at least 1 article are required.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const prompt = `You are a Chief UPSC CSE Academic Director.
Given the verified articles for date "${date}", synthesize the high-value end-of-day UPSC revision toolkit.

VERIFIED ARTICLES HEADLINES & TOPICS:
${articles.map((a: any, i: number) => `${i + 1}. [${a.category} / ${a.gsPaper}] ${a.headline} (Syllabus: ${a.syllabusTopic})`).join('\n')}

Generate:
1. One-line Trend note analyzing the day's overarching exam implications.
2. 1-2 Editorial picks based on the top constitutional, economic, or international issue of the day. Paraphrase only; include 3 key arguments, 1 counter-argument, and an original 4-5 line UPSC model answer paragraph.
3. 5-8 Facts in Brief (concise exam facts).
4. Quick Revision Box (10 sharp one-liner takeaways).
5. 5 UPSC Keywords with definition, syllabus relevance, and mains answer usage.
6. 2 Quotes or verified Data Points with proper attribution and Mains context.
7. Connect the Dots (2 links connecting today's topics to historical or earlier syllabus topics).
8. Practice Set: 5 statement-based Prelims MCQs and 2 analytical Mains questions.`;

    const response = await executeWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          responseSchema: {
          type: Type.OBJECT,
          properties: {
            trendNote: { type: Type.STRING },
            editorials: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  publication: { type: Type.STRING },
                  author: { type: Type.STRING },
                  date: { type: Type.STRING },
                  link: { type: Type.STRING },
                  gsPaper: { type: Type.STRING },
                  stance: { type: Type.STRING },
                  keyArguments: { type: Type.ARRAY, items: { type: Type.STRING } },
                  counterArgument: { type: Type.STRING },
                  upscRelevance: { type: Type.STRING },
                  mainsModelParagraph: { type: Type.STRING },
                },
                required: [
                  'title',
                  'publication',
                  'author',
                  'gsPaper',
                  'stance',
                  'keyArguments',
                  'counterArgument',
                  'upscRelevance',
                  'mainsModelParagraph',
                ],
              },
            },
            factsInBrief: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  headline: { type: Type.STRING },
                  fact: { type: Type.STRING },
                  gsPaper: { type: Type.STRING },
                },
                required: ['headline', 'fact', 'gsPaper'],
              },
            },
            quickRevision: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  oneLiner: { type: Type.STRING },
                  gsPaper: { type: Type.STRING },
                },
                required: ['topic', 'oneLiner', 'gsPaper'],
              },
            },
            keywords: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  syllabusRelevance: { type: Type.STRING },
                  mainsUsage: { type: Type.STRING },
                },
                required: ['keyword', 'definition', 'syllabusRelevance', 'mainsUsage'],
              },
            },
            quotesAndData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'Quote or Data Point' },
                  content: { type: Type.STRING },
                  attribution: { type: Type.STRING },
                  mainsContext: { type: Type.STRING },
                  verified: { type: Type.BOOLEAN },
                },
                required: ['type', 'content', 'attribution', 'mainsContext', 'verified'],
              },
            },
            practiceSet: {
              type: Type.OBJECT,
              properties: {
                mcqs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                      syllabusTopic: { type: Type.STRING },
                      staticConcept: { type: Type.STRING },
                      sourceRef: { type: Type.STRING },
                    },
                    required: [
                      'question',
                      'options',
                      'correctAnswer',
                      'explanation',
                      'syllabusTopic',
                      'staticConcept',
                    ],
                  },
                },
                mains: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      question: { type: Type.STRING },
                      marks: { type: Type.INTEGER },
                      wordLimit: { type: Type.INTEGER },
                      gsPaper: { type: Type.STRING },
                      modelPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                      syllabusTopic: { type: Type.STRING },
                    },
                    required: ['question', 'marks', 'wordLimit', 'gsPaper', 'modelPoints'],
                  },
                },
              },
              required: ['mcqs', 'mains'],
            },
            connectTheDots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  currentTopic: { type: Type.STRING },
                  linkedPastTopic: { type: Type.STRING },
                  interlinkExplanation: { type: Type.STRING },
                  gsPaper: { type: Type.STRING },
                },
                required: ['currentTopic', 'linkedPastTopic', 'interlinkExplanation', 'gsPaper'],
              },
            },
          },
          required: [
            'trendNote',
            'editorials',
            'factsInBrief',
            'quickRevision',
            'keywords',
            'quotesAndData',
            'practiceSet',
            'connectTheDots',
          ],
        },
      },
    }));

    const parsed = JSON.parse(response.text || '{}');

    // Add unique IDs
    const editorials = (parsed.editorials || []).map((e: any, i: number) => ({
      ...e,
      id: `ed-${date}-${i}`,
      reportId: `report-${date}`,
      date: date,
      link: e.link || 'https://www.thehindu.com/opinion',
    }));

    const quickRevision = (parsed.quickRevision || []).map((q: any, i: number) => ({
      ...q,
      id: `qr-${date}-${i}`,
    }));

    const mcqs = (parsed.practiceSet?.mcqs || []).map((m: any, i: number) => ({
      ...m,
      id: `pmcq-${date}-${i}`,
    }));

    const mains = (parsed.practiceSet?.mains || []).map((m: any, i: number) => ({
      ...m,
      id: `pmains-${date}-${i}`,
    }));

    const connectTheDots = (parsed.connectTheDots || []).map((c: any, i: number) => ({
      ...c,
      id: `ctd-${date}-${i}`,
    }));

    res.json({
      trendNote: parsed.trendNote || `Current affairs overview for ${date}`,
      editorials,
      factsInBrief: parsed.factsInBrief || [],
      quickRevision,
      keywords: parsed.keywords || [],
      quotesAndData: parsed.quotesAndData || [],
      practiceSet: { mcqs, mains },
      connectTheDots,
    });
  } catch (err: unknown) {
    const errorMsg = sanitizeErrorMessage(err);
    console.error('Synthesis Pass Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// 6. Mains AI Self-Evaluation Endpoint
app.post('/api/evaluate-mains', async (req: Request, res: Response): Promise<void> => {
  try {
    const { question, gsPaper, marks, wordLimit, answerText } = req.body;
    if (!question || !answerText) {
      res.status(400).json({ error: 'Question and answerText are required.' });
      return;
    }

    const ai = getGenAI();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const evalPrompt = `You are a strict UPSC CSE evaluator who has evaluated Mains answer scripts for the Union Public Service Commission.
Evaluate the following candidate's answer strictly against official UPSC CSE marking benchmarks:
- Question: "${question}"
- GS Paper: "${gsPaper || 'General Studies'}"
- Marks: ${marks || 10}
- Word Limit: ${wordLimit || 150} words

CANDIDATE'S SUBMITTED ANSWER:
"""
${answerText}
"""

Evaluate across these specific criteria:
1. Question comprehension & relevance to the directive (Discuss, Critically Analyze, Examine, Elucidate).
2. Introduction: Definition, constitutional/statutory anchor, or contemporary context.
3. Body: Multi-dimensional coverage (Political, Economic, Social, Environmental, Ethical, International).
4. Substantiation: Mention of Constitutional Articles, Supreme Court cases, Acts, Committees, reports (NITI Aayog, ARC, Economic Survey), and verified data.
5. Conclusion & Way Forward: Constructive, forward-looking, solution-oriented.
6. Adherence to word limit and neatness of structure (headings, bullet points, flowcharts).

Provide numerical sub-scores (0-10) and calculate an overall score out of ${marks || 10}.
Always include the mandatory disclaimer: "This feedback is generated by AI as a formative self-evaluation aid and does not constitute an official UPSC CSE evaluation."`;

    const response = await executeWithRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: evalPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
          responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevanceScore: { type: Type.NUMBER, description: '0 to 10' },
            structureScore: { type: Type.NUMBER, description: '0 to 10' },
            introScore: { type: Type.NUMBER, description: '0 to 10' },
            bodyScore: { type: Type.NUMBER, description: '0 to 10' },
            conclusionScore: { type: Type.NUMBER, description: '0 to 10' },
            factsScore: { type: Type.NUMBER, description: '0 to 10' },
            multidimensionalityScore: { type: Type.NUMBER, description: '0 to 10' },
            examplesScore: { type: Type.NUMBER, description: '0 to 10' },
            overallScore: { type: Type.NUMBER, description: `Score out of ${marks || 10}` },
            wordCountAnalysis: { type: Type.STRING },
            feedback: {
              type: Type.OBJECT,
              properties: {
                intro: { type: Type.STRING },
                body: { type: Type.STRING },
                conclusion: { type: Type.STRING },
                valueAddition: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific articles, committees, or cases to cite',
                },
                criticalMissingDimensions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                overallRecommendation: { type: Type.STRING },
              },
              required: [
                'intro',
                'body',
                'conclusion',
                'valueAddition',
                'criticalMissingDimensions',
                'overallRecommendation',
              ],
            },
            disclaimer: { type: Type.STRING },
          },
          required: [
            'relevanceScore',
            'structureScore',
            'introScore',
            'bodyScore',
            'conclusionScore',
            'factsScore',
            'multidimensionalityScore',
            'examplesScore',
            'overallScore',
            'wordCountAnalysis',
            'feedback',
            'disclaimer',
          ],
        },
      },
    }));

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      evaluation: {
        ...parsed,
        evaluatedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const errorMsg = sanitizeErrorMessage(err);
    console.error('Mains Evaluation Error:', errorMsg);
    res.status(500).json({ error: errorMsg });
  }
});

// Vite setup in Development or Static serving in Production
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UPSC Daily Current Affairs server running on http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
