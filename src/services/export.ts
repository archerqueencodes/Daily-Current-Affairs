/**
 * Export Engine: Print-Optimized HTML/PDF, Markdown, and Microsoft Word (.docx)
 * Strictly preserves headings, syllabus mappings, numbering, tables, and clickable source links.
 */

import { DailyReport, NewsArticle, EditorialPick } from '../types';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} from 'docx';

export type ExportScope =
  | 'complete'
  | 'prelims_only'
  | 'mains_only'
  | 'editorials'
  | 'revision_sheet'
  | 'practice_questions';

// Download utility
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const ExportService = {
  // 1. Generate Markdown
  generateMarkdown(report: DailyReport, scope: ExportScope = 'complete'): string {
    const lines: string[] = [];

    lines.push(`# UPSC DAILY CURRENT AFFAIRS - ${report.reportDate}`);
    lines.push(`**Exam Trend Note:** ${report.trendNote}`);
    lines.push(`*Generated on:* ${new Date(report.createdAt).toLocaleDateString('en-GB')}`);
    lines.push('');
    lines.push('---');
    lines.push('');

    // Articles filter
    if (scope === 'complete' || scope === 'prelims_only' || scope === 'mains_only') {
      lines.push('## CURRENT AFFAIRS & SYLLABUS MAPPING');
      lines.push('');

      report.articles.forEach((art, idx) => {
        lines.push(`### ${idx + 1}. ${art.headline}`);
        lines.push(`- **Category:** ${art.category} | **GS Paper:** ${art.gsPaper}`);
        lines.push(`- **Syllabus Topic:** ${art.syllabusTopic}`);
        lines.push(`- **Static Link:** ${art.staticLink}`);
        if (art.essayRelevance) {
          lines.push(`- **Essay Relevance:** ${art.essayRelevance}`);
        }
        lines.push(`- **Verification:** ${art.verificationStatus} (${art.verificationSummary})`);
        lines.push('');

        if (scope !== 'mains_only') {
          lines.push(`#### Why in News?`);
          lines.push(`* ${art.whyInNews.what}`);
          lines.push(`* **Who/Where/When:** ${art.whyInNews.who}, ${art.whyInNews.where} (${art.whyInNews.when})`);
          lines.push(`* **Why it matters:** ${art.whyInNews.why}`);
          lines.push('');

          lines.push(`#### Background & Static Link`);
          lines.push(art.background);
          lines.push('');

          lines.push(`#### Key Facts for Prelims`);
          art.prelimsFacts.forEach((fact) => lines.push(`- ${fact}`));
          lines.push('');
        }

        if (scope !== 'prelims_only') {
          lines.push(`#### Mains Dimensions & Analysis`);
          lines.push(`**Key Issues & Challenges:**`);
          art.mainsAnalysis.issues.forEach((issue) => lines.push(`* ${issue}`));
          lines.push('');

          lines.push(`**Government Measures:**`);
          art.mainsAnalysis.measures.forEach((measure) => lines.push(`* ${measure}`));
          lines.push('');

          lines.push(`**Way Forward:**`);
          art.mainsAnalysis.wayForward.forEach((wf) => lines.push(`* ${wf}`));
          lines.push('');

          if (art.mainsAnalysis.example) {
            lines.push(`**Verified Case/Example:** ${art.mainsAnalysis.example}`);
            lines.push('');
          }
        }

        // Question
        lines.push(`#### Exam Practice Question`);
        if (art.question.type === 'prelims_mcq') {
          lines.push(`**Prelims MCQ:** ${art.question.text}`);
          (art.question.options || []).forEach((opt, optIdx) => {
            const letter = String.fromCharCode(65 + optIdx);
            lines.push(`  (${letter}) ${opt}`);
          });
          lines.push(`*Correct Answer:* Option ${String.fromCharCode(65 + (art.question.correctAnswer || 0))}`);
          lines.push(`*Explanation:* ${art.question.explanation}`);
        } else {
          lines.push(`**Mains Question (${art.question.marks || 10} Marks, ${art.question.wordLimit || 150} Words):**`);
          lines.push(art.question.text);
        }
        lines.push('');

        // Sources
        lines.push(`#### Verified Sources`);
        art.sources.forEach((src) => {
          lines.push(`- [${src.title}](${src.url}) (${src.name} - ${src.publicationDate}) [${src.type}]`);
        });
        lines.push('');
        lines.push('---');
        lines.push('');
      });
    }

    // Editorials
    if ((scope === 'complete' || scope === 'editorials') && report.editorials.length > 0) {
      lines.push('## EDITORIAL ANALYSIS');
      lines.push('');
      report.editorials.forEach((ed, idx) => {
        lines.push(`### ${idx + 1}. ${ed.title}`);
        lines.push(`- **Publication:** ${ed.publication} | **Author:** ${ed.author} | **GS:** ${ed.gsPaper}`);
        lines.push(`- **Stance:** ${ed.stance}`);
        lines.push(`- **UPSC Relevance:** ${ed.upscRelevance}`);
        lines.push('');
        lines.push('**Key Arguments:**');
        ed.keyArguments.forEach((arg) => lines.push(`* ${arg}`));
        lines.push('');
        lines.push(`**Counter-Argument:** ${ed.counterArgument}`);
        lines.push('');
        lines.push(`**Model Mains Synthesis Paragraph:**`);
        lines.push(`> "${ed.mainsModelParagraph}"`);
        lines.push('');
        lines.push(`*Source:* [${ed.title}](${ed.link})`);
        lines.push('');
        lines.push('---');
        lines.push('');
      });
    }

    // Revision Sheet
    if (scope === 'complete' || scope === 'revision_sheet') {
      lines.push('## QUICK REVISION SHEET & FACTS IN BRIEF');
      lines.push('');
      lines.push('### Facts in Brief');
      report.factsInBrief.forEach((f) => {
        lines.push(`- **${f.headline}** [${f.gsPaper}]: ${f.fact}`);
      });
      lines.push('');

      lines.push('### Quick Revision Takeaways');
      report.quickRevision.forEach((qr, i) => {
        lines.push(`${i + 1}. **${qr.topic}** [${qr.gsPaper}]: ${qr.oneLiner}`);
      });
      lines.push('');

      lines.push('### UPSC High-Yield Keywords');
      report.keywords.forEach((k) => {
        lines.push(`- **${k.keyword}**: ${k.definition} (*Relevance:* ${k.syllabusRelevance} | *Mains Usage:* ${k.mainsUsage})`);
      });
      lines.push('');

      lines.push('### Attributed Quotes & Empirical Data');
      report.quotesAndData.forEach((qd) => {
        lines.push(`> "${qd.content}"`);
        lines.push(`— *${qd.attribution}* (${qd.type})`);
        lines.push(`*Mains Context:* ${qd.mainsContext}`);
        lines.push('');
      });
      lines.push('');

      lines.push('### Connect the Dots (Inter-Topic Linkages)');
      report.connectTheDots.forEach((ctd) => {
        lines.push(`- **${ctd.currentTopic}** ↔ **${ctd.linkedPastTopic}** [${ctd.gsPaper}]`);
        lines.push(`  ${ctd.interlinkExplanation}`);
      });
      lines.push('');
    }

    // Practice Questions
    if (scope === 'complete' || scope === 'practice_questions') {
      lines.push('## DAILY PRACTICE SET');
      lines.push('');
      lines.push('### Prelims Practice Questions');
      report.practiceSet.mcqs.forEach((mcq, i) => {
        lines.push(`**Q${i + 1}.** ${mcq.question}`);
        mcq.options.forEach((opt, idx) => {
          lines.push(`   (${String.fromCharCode(65 + idx)}) ${opt}`);
        });
        lines.push(`*Answer:* Option ${String.fromCharCode(65 + mcq.correctAnswer)}`);
        lines.push(`*Explanation:* ${mcq.explanation}`);
        lines.push(`*Static Concept:* ${mcq.staticConcept}`);
        lines.push('');
      });

      lines.push('### Mains Practice Questions');
      report.practiceSet.mains.forEach((mains, i) => {
        lines.push(`**Q${i + 1} (${mains.gsPaper}, ${mains.marks} Marks, ${mains.wordLimit} Words):**`);
        lines.push(mains.question);
        lines.push('*Model Structuring Points:*');
        mains.modelPoints.forEach((pt) => lines.push(`- ${pt}`));
        lines.push('');
      });
    }

    return lines.join('\n');
  },

  // Download Markdown file
  downloadMarkdown(report: DailyReport, scope: ExportScope = 'complete') {
    const md = this.generateMarkdown(report, scope);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    downloadBlob(blob, `UPSC-Notes-${report.reportDate}-${scope}.md`);
  },

  // 2. Generate and Download DOCX using 'docx' library
  async downloadDOCX(report: DailyReport, scope: ExportScope = 'complete') {
    const docChildren: any[] = [];

    // Title & Header
    docChildren.push(
      new Paragraph({
        text: 'UPSC DAILY CURRENT AFFAIRS',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: `EXAM-READY KNOWLEDGE DOSSIER | DATE: ${report.reportDate}`,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: `Daily Trend Analysis: ${report.trendNote}`,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: '' })
    );

    // Articles
    if (scope === 'complete' || scope === 'prelims_only' || scope === 'mains_only') {
      docChildren.push(
        new Paragraph({
          text: 'Current Affairs & Syllabus Mapping',
          heading: HeadingLevel.HEADING_1,
        })
      );

      report.articles.forEach((art, idx) => {
        docChildren.push(
          new Paragraph({
            text: `${idx + 1}. ${art.headline}`,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Category: ', bold: true }),
              new TextRun(art.category),
              new TextRun({ text: ' | GS Paper: ', bold: true }),
              new TextRun(art.gsPaper),
              new TextRun({ text: ' | Verification: ', bold: true }),
              new TextRun(art.verificationStatus),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Syllabus Topic: ', bold: true }),
              new TextRun(art.syllabusTopic),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Static Core: ', bold: true }),
              new TextRun(art.staticLink),
            ],
          }),
          new Paragraph({ text: '' })
        );

        if (scope !== 'mains_only') {
          docChildren.push(
            new Paragraph({
              text: 'Key Facts for Prelims',
              heading: HeadingLevel.HEADING_3,
            })
          );
          art.prelimsFacts.forEach((fact) => {
            docChildren.push(
              new Paragraph({
                text: `• ${fact}`,
              })
            );
          });
          docChildren.push(new Paragraph({ text: '' }));
        }

        if (scope !== 'prelims_only') {
          docChildren.push(
            new Paragraph({
              text: 'Mains Dimensions & Analysis',
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              children: [new TextRun({ text: 'Issues & Challenges:', bold: true })],
            })
          );
          art.mainsAnalysis.issues.forEach((issue) => {
            docChildren.push(new Paragraph({ text: `• ${issue}` }));
          });

          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: 'Government Measures:', bold: true })],
            })
          );
          art.mainsAnalysis.measures.forEach((m) => {
            docChildren.push(new Paragraph({ text: `• ${m}` }));
          });

          docChildren.push(
            new Paragraph({
              children: [new TextRun({ text: 'Way Forward:', bold: true })],
            })
          );
          art.mainsAnalysis.wayForward.forEach((wf) => {
            docChildren.push(new Paragraph({ text: `• ${wf}` }));
          });
          docChildren.push(new Paragraph({ text: '' }));
        }

        // Sources table
        const tableRows = [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 3000, type: WidthType.DXA },
                children: [new Paragraph({ text: 'Source Name', style: 'TableHeading' })],
              }),
              new TableCell({
                width: { size: 6000, type: WidthType.DXA },
                children: [new Paragraph({ text: 'Official URL', style: 'TableHeading' })],
              }),
            ],
          }),
          ...art.sources.map(
            (s) =>
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: s.name })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: s.url })],
                  }),
                ],
              })
          ),
        ];

        docChildren.push(
          new Paragraph({ text: 'Verified Sources:', heading: HeadingLevel.HEADING_4 }),
          new Table({
            rows: tableRows,
            width: { size: 9000, type: WidthType.DXA },
          }),
          new Paragraph({ text: '' })
        );
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren,
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    downloadBlob(buffer, `UPSC-Notes-${report.reportDate}-${scope}.docx`);
  },

  // 3. Print-Optimized A4 View (Invokes browser print dialog with styled printable layout)
  printDocument(report: DailyReport, scope: ExportScope = 'complete') {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to open the print-optimized view.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>UPSC Notes - ${report.reportDate}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 14mm;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      color: #111827;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 0;
    }
    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 18px;
    }
    .header-title {
      font-size: 18pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 4px 0;
    }
    .header-sub {
      font-size: 10pt;
      color: #4b5563;
      margin-bottom: 8px;
    }
    .trend-badge {
      background: #f1f5f9;
      border-left: 3px solid #b45309;
      padding: 6px 10px;
      font-size: 9.5pt;
      font-style: italic;
    }
    h2 {
      font-size: 13pt;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-top: 18px;
      color: #0f172a;
      page-break-after: avoid;
    }
    h3 {
      font-size: 11pt;
      margin-top: 14px;
      margin-bottom: 4px;
      color: #1e293b;
      page-break-after: avoid;
    }
    .article-meta {
      font-size: 9pt;
      color: #475569;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 8px 12px;
      margin: 8px 0;
      font-size: 10pt;
    }
    ul, ol {
      margin: 4px 0 10px 20px;
      padding: 0;
    }
    li {
      margin-bottom: 3px;
    }
    .source-link {
      font-size: 8.5pt;
      color: #1d4ed8;
      text-decoration: underline;
      word-break: break-all;
    }
    .page-break {
      page-break-before: always;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div class="header-title">UPSC Daily Current Affairs Dossier</div>
    <div class="header-sub">Official Syllabus Mapped Notes | Date: <strong>${report.reportDate}</strong> | Total Articles: ${report.totalArticles}</div>
    <div class="trend-badge"><strong>Trend Note:</strong> ${report.trendNote}</div>
  </div>

  ${(scope === 'complete' || scope === 'prelims_only' || scope === 'mains_only') ? `
    <h2>Syllabus-Mapped Core Articles</h2>
    ${report.articles
      .map(
        (art, idx) => `
      <div style="margin-bottom: 22px; page-break-inside: avoid;">
        <h3>${idx + 1}. ${art.headline}</h3>
        <div class="article-meta">
          <strong>Category:</strong> ${art.category} | <strong>GS Paper:</strong> ${art.gsPaper} | <strong>Status:</strong> ${art.verificationStatus}
        </div>
        <div class="box">
          <div><strong>Syllabus:</strong> ${art.syllabusTopic}</div>
          <div><strong>Static Link:</strong> ${art.staticLink}</div>
        </div>

        ${scope !== 'mains_only' ? `
          <div><strong>Prelims High-Yield Facts:</strong></div>
          <ul>
            ${art.prelimsFacts.map((f) => `<li>${f}</li>`).join('')}
          </ul>
        ` : ''}

        ${scope !== 'prelims_only' ? `
          <div><strong>Mains Dimensions:</strong></div>
          <ul>
            ${art.mainsAnalysis.issues.map((i) => `<li><strong>Issue:</strong> ${i}</li>`).join('')}
            ${art.mainsAnalysis.measures.map((m) => `<li><strong>Government Measure:</strong> ${m}</li>`).join('')}
            ${art.mainsAnalysis.wayForward.map((w) => `<li><strong>Way Forward:</strong> ${w}</li>`).join('')}
          </ul>
        ` : ''}

        <div style="font-size: 9pt; color: #64748b; margin-top: 6px;">
          <strong>Verified Sources:</strong> ${art.sources.map((s) => `<a class="source-link" href="${s.url}">${s.name}</a>`).join(', ')}
        </div>
      </div>
    `
      )
      .join('')}
  ` : ''}

  ${(scope === 'complete' || scope === 'revision_sheet') ? `
    <div class="page-break"></div>
    <h2>Quick Revision Box & High-Yield Key Takeaways</h2>
    <ol>
      ${report.quickRevision.map((q) => `<li><strong>${q.topic} [${q.gsPaper}]:</strong> ${q.oneLiner}</li>`).join('')}
    </ol>

    <h2>UPSC High-Yield Keywords</h2>
    <ul>
      ${report.keywords.map((k) => `<li><strong>${k.keyword}:</strong> ${k.definition} <em>(Mains Usage: ${k.mainsUsage})</em></li>`).join('')}
    </ul>

    <h2>Empirical Data & Quotes</h2>
    ${report.quotesAndData
      .map(
        (qd) => `
      <div class="box">
        <div>"${qd.content}"</div>
        <div style="text-align: right; font-size: 9pt; margin-top: 4px;">— <strong>${qd.attribution}</strong></div>
      </div>
    `
      )
      .join('')}
  ` : ''}

  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  },
};
