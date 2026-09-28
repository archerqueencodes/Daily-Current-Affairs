/**
 * Authentic UPSC CSE Exam-Grade Sample Dataset
 * Clearly marked with isSample: true and watermarked "SAMPLE - NOT REAL NEWS".
 * Used only when the user explicitly enables Demo Mode in Settings or tests UI.
 */

import { DailyReport } from '../types';

export const SAMPLE_DAILY_REPORT_27_09_2026: DailyReport = {
  id: 'report-2026-09-27-sample',
  reportDate: '27-09-2026',
  trendNote:
    'Focus on Supreme Court constitutional bench ruling on federal regulatory powers, RBI climate stress testing framework, and India-Central Asia energy corridor pact.',
  researchStatus: 'completed',
  totalArticles: 9,
  isSample: true,
  estimatedReadingTimeMinutes: 18,
  createdAt: '2026-09-27T08:00:00.000Z',
  updatedAt: '2026-09-27T08:00:00.000Z',
  articles: [
    {
      id: 'art-2026-09-27-01',
      reportId: 'report-2026-09-27-sample',
      headline:
        'Supreme Court 7-Judge Bench Upholds State Taxation Powers on Mines and Mineral Rights under Entry 50 of List II',
      category: 'Polity & Governance',
      gsPaper: 'GS2',
      syllabusTopic: 'Issues and challenges pertaining to the federal structure, devolution of powers and finances',
      staticLink:
        'Article 246 (Distribution of Legislative Powers), Seventh Schedule (Entry 54 List I vs Entry 50 List II), Mines and Minerals (Development and Regulation) Act 1957',
      essayRelevance: 'Fiscal federalism as the bedrock of co-operative and competitive nation building',
      whyInNews: {
        what: 'A 7-judge Constitution Bench ruled 8:1 that royalty paid by mining leaseholders is not a tax, affirming state legislatures competence to tax mineral rights.',
        who: 'Supreme Court of India (Chief Justice of India bench)',
        when: 'September 2026',
        where: 'New Delhi (Supreme Court)',
        why: 'Overrules the 1989 India Cement precedent; significantly empowers mineral-rich states (Odisha, Jharkhand, Chhattisgarh) to augment own source revenues.',
      },
      background:
        'In India Cement Ltd. v. State of Tamil Nadu (1989), a 7-judge bench had held royalty to be a tax. This led to decades of legal ambiguity regarding whether the Parliamentary MMDR Act completely occupied the legislative field under Entry 54 of List I, divesting States of Entry 50 List II powers.',
      prelimsFacts: [
        'Royalty under Section 9 of the MMDR Act 1957 is a contractual or statutory consideration for mineral extraction, not a tax.',
        'Entry 50 of List II empowers States to levy taxes on mineral rights subject to limitations imposed by Parliament by law relating to mineral development.',
        'Parliamentary limitation under Entry 50 List II must be express and cannot be inferred merely from the enactment of regulatory laws.',
        'The ruling has prospective as well as regulated staggered retrospective application for tax assessments.',
      ],
      mainsAnalysis: {
        issues: [
          'Risk of disparate tax burdens across mineral-rich States impacting input costs for capital-intensive industries (Steel, Aluminium, Cement).',
          'Potential litigation over retrospective tax demands threatening ease of doing business.',
          'Uneven bargaining power between mining corporations and provincial revenue authorities.',
        ],
        measures: [
          'Establishment of an Inter-State Mineral Council under Article 263 to harmonize state royalty top-up rates.',
          'Ministry of Mines standard operating guidelines for transparent cesses and local district mineral foundation (DMF) deductions.',
        ],
        wayForward: [
          'Anchor cooperative fiscal federalism by establishing model ceiling rates through the GST Council or a dedicated statutory forum.',
          'Mandate that proceeds from mineral cesses be ring-fenced for environmental remediation and tribal livelihood restoration.',
        ],
        example:
          'Jharkhand and Odisha state mining revenues projected to increase by 18-22%, augmenting fiscal space for social infrastructure under State Budgets.',
      },
      question: {
        type: 'prelims_mcq',
        text: 'With reference to the legislative powers regarding mines and minerals in India, consider the following statements:\n1. Royalty paid by a mining leaseholder is treated as a tax under the Constitution of India.\n2. State legislatures have the power to levy taxes on mineral rights under Entry 50 of List II, subject to limitations imposed by Parliament.\nWhich of the statements given above is/are correct?',
        options: ['1 only', '2 only', 'Both 1 and 2', 'Neither 1 nor 2'],
        correctAnswer: 1,
        explanation:
          'Statement 1 is incorrect: The Supreme Court Constitution Bench held that royalty is not a tax but a contractual/statutory payment for extraction. Statement 2 is correct: Entry 50 of List II specifically assigns taxes on mineral rights to the States, subject to any limitations imposed by Parliament.',
        staticConcept: 'Seventh Schedule Legislative Entries & Article 246',
      },
      sources: [
        {
          id: 'src-01-1',
          name: 'Supreme Court of India',
          title: 'Judgement in Civil Appeal No. 4056/1999 (Mineral Area Development Authority vs Steel Authority of India)',
          publicationDate: '26-09-2026',
          url: 'https://main.sci.gov.in/judgments',
          type: 'Judiciary / Supreme Court / High Court',
          verificationNotes: 'Certified copy of Constitution Bench majority judgment verified.',
        },
        {
          id: 'src-01-2',
          name: 'Press Information Bureau (PIB)',
          title: 'Ministry of Mines statement on the Supreme Court ruling regarding State mineral taxation',
          publicationDate: '26-09-2026',
          url: 'https://pib.gov.in/PressReleasePage.aspx',
          type: 'Primary (PIB / Ministry / Official)',
          verificationNotes: 'Official press briefing from Shastri Bhawan.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Verified against official Supreme Court judgment text and Ministry of Mines press briefing.',
      tags: ['Federalism', 'Supreme Court', 'Taxation', 'MMDR Act', 'List II Entry 50'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-02',
      reportId: 'report-2026-09-27-sample',
      headline:
        'Reserve Bank of India Releases Mandatory Climate Risk Disclosure and Stress-Testing Norms for Regulated Entities',
      category: 'Economy',
      gsPaper: 'GS3',
      syllabusTopic: 'Indian Economy and issues relating to planning, mobilization of resources, growth and banking sector',
      staticLink:
        'Banking Regulation Act 1949, Task Force on Climate-related Financial Disclosures (TCFD), Network for Greening the Financial System (NGFS)',
      essayRelevance: 'Greening the financial engine: Balancing high economic growth with ecological prudence',
      whyInNews: {
        what: 'RBI mandated all Scheduled Commercial Banks and Tier-IV NBFCs to conduct regular climate stress tests and disclose Scope 1, 2, and financed Scope 3 emissions.',
        who: 'Reserve Bank of India (Department of Regulation)',
        when: 'September 2026',
        where: 'Mumbai (RBI Central Office)',
        why: 'Safeguarding financial stability from physical risks (extreme weather, floods) and transition risks (carbon borders, stranded assets).',
      },
      background:
        'The RBI joined the Network for Greening the Financial System (NGFS) in 2021 and issued discussion papers on climate risk. With Indian banks facing exposure to carbon-intensive thermal power, steel, and cement sectors, mandatory framework adoption aligns with global Basel Committee guidelines.',
      prelimsFacts: [
        'Regulated entities must implement Governance, Strategy, Risk Management, and Metrics & Targets (4 TCFD pillars).',
        'Applies to all domestic Scheduled Commercial Banks (excluding RRBs) and deposit-taking NBFCs with asset size > ₹5,000 crore.',
        'Mandates internal scenario analysis based on IPCC Representative Concentration Pathways (RCP 2.6 and RCP 8.5).',
        'Phased compliance begins April 1, 2027 for baseline disclosures.',
      ],
      mainsAnalysis: {
        issues: [
          'High compliance costs for medium-sized private and public sector lenders lacking ESG carbon accounting expertise.',
          'Data asymmetry regarding financed emissions from MSMEs and unorganized supply chain vendors.',
          'Potential credit rationing for legacy energy infrastructure during India’s energy transition phase.',
        ],
        measures: [
          'RBI establishing a dedicated Climate Risk Capacity Building Center in collaboration with CAFRAL.',
          'Standardized reporting templates aligned with SEBI’s Business Responsibility and Sustainability Reporting (BRSR) Core.',
        ],
        wayForward: [
          'Develop an Indian Green Taxonomy with unambiguous criteria to prevent greenwashing while ensuring capital flows to transition activities.',
          'Deploy sovereign green blended-finance guarantees to derisk bank lending for renewable energy and green hydrogen ventures.',
        ],
        example:
          'State Bank of India and HDFC Bank pilot tests revealed potential credit risk uptick of 40-70 bps under extreme heatwave disruption scenarios.',
      },
      question: {
        type: 'mains_question',
        text: 'Assess the vulnerability of the Indian banking sector to physical and transition climate risks. How far do the recent regulatory guidelines by the Reserve Bank of India contribute towards building financial sector resilience? (15 Marks, 250 Words)',
        marks: 15,
        wordLimit: 250,
        staticConcept: 'Financial Stability & Macro-prudential Regulation',
      },
      sources: [
        {
          id: 'src-02-1',
          name: 'Reserve Bank of India',
          title: 'Notification: Disclosure Framework on Climate-related Financial Risks 2026',
          publicationDate: '26-09-2026',
          url: 'https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx',
          type: 'Regulatory / Statutory (RBI / SEBI / NITI Aayog)',
          verificationNotes: 'RBI Official Notification published on portal.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Verified directly from the RBI Department of Regulation notification.',
      tags: ['RBI', 'Climate Risk', 'Banking', 'Green Finance', 'TCFD'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-03',
      reportId: 'report-2026-09-27-sample',
      headline:
        'India and Uzbekistan Finalize Trilateral Transit and Critical Minerals Sourcing Framework via Chabahar Port',
      category: 'International Relations',
      gsPaper: 'GS2',
      syllabusTopic: 'Bilateral, regional and global groupings and agreements involving India and/or affecting India’s interests',
      staticLink:
        'Chabahar Agreement (India-Iran-Afghanistan 2016), International North-South Transport Corridor (INSTC), Ashgabat Agreement',
      essayRelevance: 'Connectivity as destiny: Securing India’s continental strategic depth',
      whyInNews: {
        what: 'India and Uzbekistan signed a 10-year trade facilitation roadmap granting direct freight access to Tashkent through Chabahar’s Shahid Beheshti terminal.',
        who: 'Ministry of External Affairs (India) & Ministry of Investments (Uzbekistan)',
        when: 'September 2026',
        where: 'Tashkent, Uzbekistan',
        why: 'Bypasses overland reliance on Pakistan and counters Chinese BRI dominance in Central Asia while securing uranium and copper supplies.',
      },
      background:
        'India entered a long-term 10-year bilateral contract with Iran in May 2024 for operating the Chabahar port. Uzbekistan, a double-landlocked nation, has been seeking warm-water maritime access to South Asian and Southeast Asian trade hubs.',
      prelimsFacts: [
        'Uzbekistan is one of only two double-landlocked countries in the world (the other being Liechtenstein).',
        'The agreement utilizes the INSTC multi-modal corridor combining maritime, rail, and road transit across Iran.',
        'India’s critical mineral exploration agency KABIL gains exploratory rights for lithium and tungsten concessions in Navoi region.',
        'India has extended a $450 million Line of Credit (LoC) for multimodal dry ports along the corridor.',
      ],
      mainsAnalysis: {
        issues: [
          'Secondary sanction risks from western governments regarding commercial transactions involving Iranian infrastructure.',
          'Underdeveloped rail gauge alignment between Russian broad-gauge in Central Asia and standard gauge in Iran.',
          'Security instability in contiguous Afghan transit routes.',
        ],
        measures: [
          'US sanctions waiver carve-out maintained specifically for Chabahar under the Iran Freedom and Counter-Proliferation Act.',
          'Implementation of paperless customs clearance using TIR (Transports Internationaux Routiers) carnets.',
        ],
        wayForward: [
          'Speed up the Chabahar-Zahedan railway track completion to connect directly with the Iranian national rail grid.',
          'Expand the India-Central Asia dialogue into a dedicated economic security council meeting biannually.',
        ],
        example:
          'Transit cargo time from Mumbai to Tashkent expected to drop from 38 days (via St. Petersburg/Suez) to 14 days via Chabahar.',
      },
      question: {
        type: 'prelims_mcq',
        text: 'Consider the following statements regarding the International North-South Transport Corridor (INSTC):\n1. It connects Mumbai to Saint Petersburg via Iran and the Caspian Sea.\n2. Uzbekistan is a littoral state of the Caspian Sea.\n3. The Ashgabat Agreement facilitates the transit of goods between Central Asia and the Persian Gulf.\nWhich of the statements given above are correct?',
        options: ['1 and 2 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
        correctAnswer: 1,
        explanation:
          'Statement 1 is correct: INSTC is a 7,200-km multi-mode network connecting India, Iran, Azerbaijan, Russia, and Central Asia. Statement 2 is incorrect: Uzbekistan is double-landlocked and does not touch the Caspian Sea (littoral states are Russia, Kazakhstan, Turkmenistan, Iran, Azerbaijan). Statement 3 is correct: Ashgabat agreement establishes an international transport corridor between Central Asia and the Persian Gulf.',
        staticConcept: 'INSTC & Central Asia Geopolitics',
      },
      sources: [
        {
          id: 'src-03-1',
          name: 'Ministry of External Affairs (MEA)',
          title: 'Joint Statement on the 3rd India-Uzbekistan Strategic Connectivity Framework',
          publicationDate: '26-09-2026',
          url: 'https://mea.gov.in/bilateral-documents.htm',
          type: 'Primary (PIB / Ministry / Official)',
          verificationNotes: 'Official MEA bilateral document repository.',
        },
        {
          id: 'src-03-2',
          name: 'The Hindu',
          title: 'India, Uzbekistan ink pact on Chabahar transit and critical mineral supply',
          publicationDate: '27-09-2026',
          url: 'https://www.thehindu.com/news/national',
          type: 'National Daily (The Hindu / Indian Express)',
          verificationNotes: 'Reported by diplomatic correspondent with MEA confirmation.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Double-verified via MEA official press communique and The Hindu diplomatic dispatch.',
      tags: ['INSTC', 'Chabahar', 'Central Asia', 'Critical Minerals', 'Uzbekistan'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-04',
      reportId: 'report-2026-09-27-sample',
      headline:
        'National Green Tribunal Imposes Moratorium on Commercial Groundwater Extraction in Over-Exploited Aquifers',
      category: 'Environment & Ecology',
      gsPaper: 'GS3',
      syllabusTopic: 'Conservation, environmental pollution and degradation, environmental impact assessment',
      staticLink:
        'Central Ground Water Authority (CGWA) guidelines, Environment (Protection) Act 1986, Public Trust Doctrine (M.C. Mehta v. Kamal Nath)',
      essayRelevance: 'Water as a commons: Reconciling industrial appetite with human survival',
      whyInNews: {
        what: 'NGT Principal Bench prohibited new NOCs for commercial borewells in "Critical" and "Over-exploited" assessment units without 100% verified artificial recharge.',
        who: 'National Green Tribunal (Principal Bench, New Delhi)',
        when: 'September 2026',
        where: 'New Delhi',
        why: 'Over 14% of India’s 7,000+ groundwater assessment blocks show annual extraction exceeding natural recharge, threatening water security in Punjab, Haryana, and Rajasthan.',
      },
      background:
        'Under the Dynamic Ground Water Resource Assessment Report 2023, India is the world’s largest extractor of groundwater, withdrawing over 245 billion cubic meters annually, representing 25% of global groundwater extraction. Most goes to water-intensive paddy and sugarcane cultivation.',
      prelimsFacts: [
        'Central Ground Water Authority (CGWA) was constituted under Section 3(3) of the Environment (Protection) Act, 1986.',
        'India’s total annual groundwater recharge is estimated at approximately 449 billion cubic meters.',
        'Paddy cultivation in Punjab-Haryana draws 3,000–5,000 liters of groundwater per kilogram of rice produced.',
        'Digital piezometers with telemetry systems are now mandatory for all industries extracting > 10 cubic meters/day.',
      ],
      mainsAnalysis: {
        issues: [
          'Adverse economic impact on agro-processing, textile, and beverage manufacturing clusters located in dry belts.',
          'Inadequate monitoring capacity of state groundwater boards to prevent illegal unmetered submersible pumps.',
          'Free or subsidized electricity tariffs creating disincentives for micro-irrigation adoption.',
        ],
        measures: [
          'Implementation of Atal Bhujal Yojana (ABHY) focusing on community-led groundwater demand management across 7 states.',
          'Jal Shakti Abhiyan: Catch the Rain campaign enforcing rooftop rainwater harvesting compliance.',
        ],
        wayForward: [
          'Shift agricultural power subsidies from free electricity to direct benefit transfer (DBT) paired with solarized metering (PM-KUSUM Component C).',
          'Promote crop diversification into millets (Shree Anna), pulses, and oilseeds under state crop diversification schemes.',
        ],
        example:
          'Maharashtra’s Jalyukt Shivar 2.0 watershed intervention reversed water table declines in over 1,800 drought-prone Marathwada villages.',
      },
      question: {
        type: 'prelims_mcq',
        text: 'Under which of the following Acts was the Central Ground Water Authority (CGWA) established?\n(a) The Water (Prevention and Control of Pollution) Act, 1974\n(b) The Environment (Protection) Act, 1986\n(c) The Disaster Management Act, 2005\n(d) The National Green Tribunal Act, 2010',
        options: [
          'The Water (Prevention and Control of Pollution) Act, 1974',
          'The Environment (Protection) Act, 1986',
          'The Disaster Management Act, 2005',
          'The National Green Tribunal Act, 2010',
        ],
        correctAnswer: 1,
        explanation:
          'Option (b) is correct: The Central Ground Water Authority (CGWA) was constituted under sub-section (3) of Section 3 of the Environment (Protection) Act, 1986, following the Supreme Court judgment in Vellore Citizens Welfare Forum v. Union of India.',
        staticConcept: 'Environmental Regulatory Institutions of India',
      },
      sources: [
        {
          id: 'src-04-1',
          name: 'National Green Tribunal',
          title: 'Order in Original Application No. 176/2025 regarding Groundwater Conservation Guidelines',
          publicationDate: '26-09-2026',
          url: 'https://greentribunal.gov.in/judgments',
          type: 'Judiciary / Supreme Court / High Court',
          verificationNotes: 'Direct bench ruling copy inspected.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Verified against NGT Principal Bench certified order and CGWA compliance circular.',
      tags: ['Groundwater', 'NGT', 'Environment Protection Act', 'Atal Bhujal Yojana'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-05',
      reportId: 'report-2026-09-27-sample',
      headline:
        'ISRO Successfully Demonstrates Indigenous Cryogenic Upper Stage Re-ignition for Dual-Orbit Satellite Placement',
      category: 'Science & Tech',
      gsPaper: 'GS3',
      syllabusTopic: 'Achievements of Indians in science & technology; indigenization of technology and developing new technology',
      staticLink:
        'Geosynchronous Satellite Launch Vehicle (GSLV Mk III / LVM3), Cryogenic Upper Stage (C25), Gaganyaan Human Spaceflight Mission',
      essayRelevance: 'Scientific self-reliance: From technological denial regimes to frontier space leadership',
      whyInNews: {
        what: 'ISRO executed a dual-restart test of the indigenous CE-20 cryogenic engine in vacuum chamber conditions, enabling single-launch deployment into multiple orbits.',
        who: 'Indian Space Research Organisation (Liquid Propulsion Systems Centre, Mahendragiri)',
        when: 'September 2026',
        where: 'Mahendragiri, Tamil Nadu',
        why: 'Crucial for commercial rideshares, lunar sample return (Chandrayaan-4), and India’s planned Bharatiya Antariksh Station (BAS).',
      },
      background:
        'Cryogenic engines burn liquid oxygen (-183°C) and liquid hydrogen (-253°C). In the 1990s, India faced US sanction regimes obstructing Russian cryogenic tech transfer. Through sustained indigenous R&D, ISRO developed the CE-7.5 and high-thrust CE-20 engine for LVM3.',
      prelimsFacts: [
        'The CE-20 cryogenic engine operates on a Gas Generator Cycle, producing over 200 kilonewtons of nominal thrust.',
        'Cryogenic propellants provide higher specific impulse (fuel efficiency) compared to solid and hypergolic liquid propellants.',
        'The dual burn capability allows the upper stage to alter orbital inclination and deploy co-passenger satellites at distinct altitudes.',
        'Supports payloads up to 4,500 kg to Geosynchronous Transfer Orbit (GTO).',
      ],
      mainsAnalysis: {
        issues: [
          'High production cycle times limiting launch cadence compared to global commercial space operators (e.g. SpaceX Falcon 9).',
          'Need to accelerate domestic private industry manufacturing (NewSpace India Limited consortia).',
        ],
        measures: [
          'Technology transfer of LVM3 production to the Indian industrial consortium of HAL and L&T.',
          'IN-SPACe single-window regulatory authorization encouraging private propulsion startups.',
        ],
        wayForward: [
          'Operationalize semi-cryogenic engine (SCE-200 utilizing refined kerosene Isrosene and liquid oxygen) to boost heavy lift capacity to 6 tonnes to GTO.',
          'Expand India’s share in the $400 billion global space economy from current ~2% to 8-10% by 2035.',
        ],
        example:
          'LVM3 commercial launches for OneWeb constellations previously demonstrated reliability; multi-orbit capability opens lucrative polar and mid-inclination constellation deployment contracts.',
      },
      question: {
        type: 'prelims_mcq',
        text: 'With reference to rocket propulsion systems, consider the following statements:\n1. Cryogenic rocket engines utilize liquid hydrogen as fuel and liquid oxygen as oxidizer.\n2. Cryogenic engines offer lower specific impulse compared to solid propellant rocket motors.\n3. The CE-20 engine powers the upper stage of the Launch Vehicle Mark-3 (LVM3).\nWhich of the statements given above are correct?',
        options: ['1 and 2 only', '1 and 3 only', '2 and 3 only', '1, 2 and 3'],
        correctAnswer: 1,
        explanation:
          'Statement 1 is correct: Cryogenic engines burn liquid hydrogen (-253°C) and liquid oxygen (-183°C). Statement 2 is incorrect: Cryogenic engines deliver the highest specific impulse (efficiency) among chemical rocket engines, far superior to solid motors. Statement 3 is correct: The CE-20 engine powers the C25 cryogenic stage of LVM3.',
        staticConcept: 'Space Technology & Rocket Propulsion Principles',
      },
      sources: [
        {
          id: 'src-05-1',
          name: 'Press Information Bureau (PIB)',
          title: 'Department of Space: ISRO qualifies CE-20 Cryogenic Engine for multi-orbit mission capability',
          publicationDate: '26-09-2026',
          url: 'https://pib.gov.in/PressReleasePage.aspx',
          type: 'Primary (PIB / Ministry / Official)',
          verificationNotes: 'PIB release for Department of Space.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Cross-checked with ISRO official portal mission update and PIB Department of Space dispatch.',
      tags: ['ISRO', 'LVM3', 'Cryogenic Engine', 'Gaganyaan', 'Space Technology'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-06',
      reportId: 'report-2026-09-27-sample',
      headline:
        'Union Cabinet Approves National Gig and Platform Workers Social Security and Welfare Fund under Social Security Code 2020',
      category: 'Social Issues & Justice',
      gsPaper: 'GS2',
      syllabusTopic: 'Welfare schemes for vulnerable sections of the population by the Centre and States and the performance of these schemes',
      staticLink:
        'Code on Social Security 2020 (Sections 112-114), NITI Aayog Report "Booming Gig and Platform Economy" (2022), Directive Principles (Article 39, Article 42, Article 43)',
      essayRelevance: 'Dignity in algorithmic labor: Bridging precariousness and social protection in the 21st century',
      whyInNews: {
        what: 'Cabinet approved institutionalization of the National Social Security Board for Gig Workers with 1-2% turnover cess on aggregator platforms (delivery, mobility, logistics).',
        who: 'Union Cabinet chaired by the Prime Minister',
        when: 'September 2026',
        where: 'New Delhi',
        why: 'Over 10 million platform workers in India face occupational hazards, irregular incomes, and absence of health insurance, maternity benefits, or pensions.',
      },
      background:
        'The Code on Social Security 2020 explicitly recognized "gig workers" and "platform workers" for the first time in Indian statutory jurisprudence. However, operational rules and the aggregator contribution mechanism remained un-notified until now.',
      prelimsFacts: [
        'A "gig worker" is defined as a person who performs work or participates in a work arrangement and earns from such activities outside of traditional employer-employee relationship.',
        'Aggregator contribution is capped by statute at 1% to 2% of the annual turnover of the aggregator, not exceeding 5% of the total amount payable to gig workers.',
        'Registration is integrated through the e-Shram portal with a unique 12-digit Universal Account Number (UAN).',
        'Provides occupational accident insurance, health cover via PM-JAY, and old-age retirement savings match.',
      ],
      mainsAnalysis: {
        issues: [
          'Ambiguity in tracking multi-homing gig workers who simultaneously operate on competing apps (e.g. food delivery and ride hailing).',
          'Resistance from platform startups claiming compressed operating margins could hike customer consumer charges.',
          'Algorithmic opacity regarding arbitrary deactivation of worker accounts without natural justice.',
        ],
        measures: [
          'Mandatory appellate grievance redressal mechanism before deplatforming a registered worker.',
          'Model state welfare board framework inspired by Rajasthan Platform Based Gig Workers Act 2023.',
        ],
        wayForward: [
          'Codify statutory limits on daily driving/delivery hours to curtail algorithmic exploitation and vehicular accidents.',
          'Transition to portable social protection where benefits follow the worker across platforms and jurisdictions.',
        ],
        example:
          'Rajasthan Gig Workers Welfare Board successfully collected ₹78 crore in transaction-based fee levies in its first operational year.',
      },
      question: {
        type: 'mains_question',
        text: 'The gig economy offers flexibility and employment opportunities, but often at the cost of income security and social protection. Critically analyze the provisions of the Code on Social Security, 2020 concerning platform workers. (10 Marks, 150 Words)',
        marks: 10,
        wordLimit: 150,
        staticConcept: 'Labor Reforms, Article 43 Living Wage & Social Security Code',
      },
      sources: [
        {
          id: 'src-06-1',
          name: 'Press Information Bureau (PIB)',
          title: 'Cabinet approves operational framework for Gig Workers Social Security Welfare Fund',
          publicationDate: '26-09-2026',
          url: 'https://pib.gov.in/PressReleasePage.aspx',
          type: 'Primary (PIB / Ministry / Official)',
          verificationNotes: 'Cabinet briefing statement.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Confirmed from Union Cabinet decision communique and Ministry of Labour & Employment notification.',
      tags: ['Gig Economy', 'Social Security Code 2020', 'e-Shram', 'Labour Reforms', 'NITI Aayog'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-07',
      reportId: 'report-2026-09-27-sample',
      headline:
        'Financial Action Task Force (FATF) Mutual Evaluation Report Commends India’s AML/CFT Framework While Noting Need for Faster Non-Profit Risk Audits',
      category: 'Internal Security',
      gsPaper: 'GS3',
      syllabusTopic: 'Money-laundering and its prevention; role of external state and non-state actors in creating challenges to internal security',
      staticLink:
        'Prevention of Money Laundering Act (PMLA) 2002, Unlawful Activities (Prevention) Act 1967, Financial Intelligence Unit - India (FIU-IND)',
      essayRelevance: 'Shielding national sovereignty against illicit financial flows and terror financing syndicates',
      whyInNews: {
        what: 'FATF adopted India’s 4th round Mutual Evaluation Report, placing India in the elite "Regular Follow-Up" category alongside only 4 other G20 nations.',
        who: 'Financial Action Task Force (Plenary Session)',
        when: 'September 2026',
        where: 'Paris, France',
        why: 'Vindicates India’s measures against terror funding, hawala networks, and political corruption while recommending proportional risk-based scrutiny of non-profit entities (NPOs).',
      },
      background:
        'India’s previous FATF mutual evaluation occurred in 2010. The 4th round evaluation assessed India on 40 Technical Recommendations and 11 Immediate Outcomes of effectiveness across asset recovery, beneficial ownership disclosure, and counter-terror financing.',
      prelimsFacts: [
        'FATF is an inter-governmental body established in 1989 by the G7 Summit in Paris.',
        'India became a member of FATF in 2010.',
        'The FATF Secretariat is housed at the OECD headquarters in Paris.',
        '"Regular Follow-Up" is the highest rating category under FATF evaluations, requiring reporting once every 3 years.',
      ],
      mainsAnalysis: {
        issues: [
          'Balancing vigorous counter-terror financing enforcement with the operational freedom of civil society and human rights non-profits.',
          'Proliferation of dark web cryptocurrency tumblers and peer-to-peer crypto betting syndicates evading traditional banking FIU scrutiny.',
        ],
        measures: [
          'Enforcement Directorate registration of Virtual Digital Asset Service Providers (VDASPs) under PMLA reporting obligations.',
          'Strengthening of the multi-agency coordination group (MAC) integrating FIU-IND, CBI, NIA, and CBDT.',
        ],
        wayForward: [
          'Adopt granular risk-based guidelines for NPOs rather than blanket FCRA bank account restrictions, in line with FATF Recommendation 8.',
          'Deepen international cross-border asset repatriation treaties under the United Nations Convention Against Corruption (UNCAC).',
        ],
        example:
          'FIU-IND suspicious transaction reporting helped neutralize cross-border narco-terror hawala syndicates running through Southeast Asian mule accounts.',
      },
      question: {
        type: 'prelims_mcq',
        text: 'Consider the following statements regarding the Financial Action Task Force (FATF):\n1. It was established by the G20 Leaders Summit in response to the 2008 global financial crisis.\n2. Its Secretariat is located at the OECD headquarters in Paris.\n3. The "Black List" formally refers to High-Risk Jurisdictions subject to a Call for Action.\nWhich of the statements given above are correct?',
        options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
        correctAnswer: 1,
        explanation:
          'Statement 1 is incorrect: FATF was established in 1989 by the G7 Summit held in Paris to examine measures to combat money laundering. Statement 2 is correct: Its Secretariat is located at OECD headquarters in Paris. Statement 3 is correct: The FATF Black List is officially known as "High-Risk Jurisdictions subject to a Call for Action".',
        staticConcept: 'FATF & International Security Architecture',
      },
      sources: [
        {
          id: 'src-07-1',
          name: 'Press Information Bureau (PIB)',
          title: 'Department of Revenue: FATF adopts landmark Mutual Evaluation Report on India',
          publicationDate: '26-09-2026',
          url: 'https://pib.gov.in/PressReleasePage.aspx',
          type: 'Primary (PIB / Ministry / Official)',
          verificationNotes: 'Joint Department of Revenue and MEA release.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Corroborated with FATF Paris Plenary public outcome release and Ministry of Finance statement.',
      tags: ['FATF', 'Money Laundering', 'PMLA', 'Terror Financing', 'Internal Security'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-08',
      reportId: 'report-2026-09-27-sample',
      headline:
        'Ethical Dilemmas in Generative AI in Public Administration: Central Vigilance Commission Issues Advisory on Algorithmic Bias in Beneficiary Targeting',
      category: 'Ethics & Integrity',
      gsPaper: 'GS4',
      syllabusTopic: 'Ethics in public administration; ethical dilemmas in government and private institutions; probity in governance',
      staticLink:
        'Nolan Committee Principles (Objectivity & Accountability), 2nd ARC 4th Report "Ethics in Governance", Article 14 (Equality before Law)',
      essayRelevance: 'Silicon algorithms vs human compassion: Preserving the soul of civil service',
      whyInNews: {
        what: 'CVC issued comprehensive ethical guidelines warning departments against fully automated exclusion of citizens from welfare rolls without human-in-the-loop review.',
        who: 'Central Vigilance Commission (CVC)',
        when: 'September 2026',
        where: 'New Delhi',
        why: 'Reports of automated facial authentication and biometric mismatch algorithms triggering erroneous cancellation of rations and widow pensions.',
      },
      background:
        'As state departments integrate automated algorithmic scoring for scheme eligibility (e.g. predictive analytics for PDS leakages), false positive exclusions disproportionately hurt marginalized, elderly, and rural citizens who lack digital literacy to challenge algorithmic decisions.',
      prelimsFacts: [
        'CVC was set up on the recommendations of the Santhanam Committee on Prevention of Corruption (1964).',
        'CVC was granted statutory status by the Central Vigilance Commission Act, 2003.',
        'The Commission consists of a Central Vigilance Commissioner (Chairperson) and not more than two Vigilance Commissioners.',
        'Ethical principle of "Right to Explanation" is mandated for any algorithmic decision affecting citizen entitlements.',
      ],
      mainsAnalysis: {
        issues: [
          'Dehumanization of public service delivery when discretion and empathy are replaced by black-box algorithms.',
          'Technological bias embedded in training data reflecting historical discrimination.',
          'Violation of natural justice (Audi Alteram Partem) when beneficiaries cannot appeal algorithmic disqualifications.',
        ],
        measures: [
          'Mandatory algorithmic auditing by third-party public academic institutions (IITs/IIMs).',
          'Establishment of offline, non-digital grievance tribunals with guaranteed 7-day turnaround.',
        ],
        wayForward: [
          'Apply the Nolan Committee principle of Objectivity: Technology should assist human decision-makers, not supplant constitutional duty of care.',
          'Adopt the "Precautionary Principle in Welfare": In case of algorithmic uncertainty, presumption of eligibility must prevail to prevent destitution.',
        ],
        example:
          'District Administration in Telengana implemented hybrid verification where biometric failures automatically trigger physical doorstep verification by Gram Panchayat officers.',
      },
      question: {
        type: 'mains_question',
        text: 'The increasing use of Artificial Intelligence and automated decision systems in public welfare delivery risks replacing administrative empathy with mechanical exclusion. Discuss the ethical dilemmas involved and suggest a normative framework to ensure that technology serves constitutional morality. (15 Marks, 250 Words)',
        marks: 15,
        wordLimit: 250,
        staticConcept: 'Ethical Governance, Nolan Principles & Constitutional Morality',
      },
      sources: [
        {
          id: 'src-08-1',
          name: 'Central Vigilance Commission',
          title: 'Circular No. 12/09/2026: Ethical Standards and Algorithmic Accountability in Public Procurement and Welfare Delivery',
          publicationDate: '26-09-2026',
          url: 'https://cvc.gov.in/guidelines',
          type: 'Constitutional Body (ECI / UPSC / CAG)',
          verificationNotes: 'Official statutory circular from Satarkata Bhawan.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Verified from official Central Vigilance Commission portal advisory.',
      tags: ['CVC', 'Ethics', 'Algorithmic Bias', 'Nolan Principles', 'Public Administration'],
      isSample: true,
    },
    {
      id: 'art-2026-09-27-09',
      reportId: 'report-2026-09-27-sample',
      headline:
        'India Achieves 100% Phase-Out of Hydrochlorofluorocarbons (HCFC-141b) Ahead of Montreal Protocol Timeline',
      category: 'Environment & Ecology',
      gsPaper: 'GS3',
      syllabusTopic: 'Conservation, environmental pollution and degradation, environmental impact assessment',
      staticLink:
        'Montreal Protocol on Substances that Deplete the Ozone Layer (1987), Kigali Amendment 2016, Ozone Cell (MoEFCC)',
      essayRelevance: 'Multilateral environmental agreements that work: Lessons from the ozone recovery triumph',
      whyInNews: {
        what: 'Ministry of Environment, Forest and Climate Change announced zero consumption and production of HCFC-141b, a prominent blowing agent for rigid polyurethane foam.',
        who: 'MoEFCC Ozone Cell',
        when: 'September 2026',
        where: 'New Delhi',
        why: 'Fulfills India’s Stage-II Hydrochlorofluorocarbons Phase-out Management Plan (HPMP) and helps heal the stratospheric ozone layer.',
      },
      background:
        'India has been a Party to the Vienna Convention (1985) and Montreal Protocol (1987) since 1992. While developing countries were permitted extended phase-out windows, India spearheaded early voluntary conversion of small and medium enterprises (MSMEs) to non-ozone depleting cyclopentane technology.',
      prelimsFacts: [
        'HCFC-141b has an Ozone Depletion Potential (ODP) of 0.11 and significant Global Warming Potential.',
        'The Montreal Protocol is the only UN environmental treaty ratified by all 198 member countries of the United Nations.',
        'The Kigali Amendment (2016) brought Hydrofluorocarbons (HFCs) under the Protocol’s phase-down ambit to avert 0.5°C global warming.',
        'Ozone layer is located predominantly in the lower stratosphere (15 to 35 km above Earth’s surface).',
      ],
      mainsAnalysis: {
        issues: [
          'High capital costs of next-generation low-GWP hydrofluoroolefins (HFOs) controlled by foreign chemical patent holders.',
          'Energy efficiency penalties during initial refrigerant retrofit transitions in tropical ambient cooling conditions.',
        ],
        measures: [
          'MoEFCC technology transfer grants under the Multilateral Fund (MLF) of the Montreal Protocol.',
          'India Cooling Action Plan (ICAP) synchronizing ozone protection with cold-chain logistics and thermal comfort for all.',
        ],
        wayForward: [
          'Incentivize indigenous development of eco-friendly hydrocarbon refrigerants (e.g. propane R-290).',
          'Strengthen Customs and border monitoring to eradicate illicit black-market trade in phased-out halons and refrigerants.',
        ],
        example:
          'Indian domestic foam manufacturing sector eliminated over 7,500 metric tonnes of HCFC-141b annually without closure of any MSME unit.',
      },
      question: {
        type: 'prelims_mcq',
        text: 'The Kigali Amendment to the Montreal Protocol aims to phase down which of the following substances?\n(a) Chlorofluorocarbons (CFCs)\n(b) Hydrochlorofluorocarbons (HCFCs)\n(c) Hydrofluorocarbons (HFCs)\n(d) Methyl Bromide',
        options: [
          'Chlorofluorocarbons (CFCs)',
          'Hydrochlorofluorocarbons (HCFCs)',
          'Hydrofluorocarbons (HFCs)',
          'Methyl Bromide',
        ],
        correctAnswer: 2,
        explanation:
          'Option (c) is correct: The Kigali Amendment (2016) amended the Montreal Protocol to explicitly include Hydrofluorocarbons (HFCs). While HFCs do not deplete the ozone layer, they are potent greenhouse gases with global warming potentials thousands of times higher than carbon dioxide.',
        staticConcept: 'Montreal Protocol, Kigali Amendment & International Treaties',
      },
      sources: [
        {
          id: 'src-09-1',
          name: 'Press Information Bureau (PIB)',
          title: 'MoEFCC announces complete phase-out of ozone-depleting substance HCFC-141b in Indian industry',
          publicationDate: '26-09-2026',
          url: 'https://pib.gov.in/PressReleasePage.aspx',
          type: 'Primary (PIB / Ministry / Official)',
          verificationNotes: 'MoEFCC Ozone Cell verified announcement.',
        },
      ],
      verificationStatus: 'Verified',
      verificationSummary: 'Confirmed through official MoEFCC Ozone Cell compliance record and UNEP Ozone Secretariat reporting.',
      tags: ['Montreal Protocol', 'Kigali Amendment', 'Ozone Layer', 'MoEFCC', 'Environment'],
      isSample: true,
    },
  ],
  editorials: [
    {
      id: 'ed-2026-09-27-01',
      reportId: 'report-2026-09-27-sample',
      title: 'The Federal Balance in Sub-Soil Taxation: Why States Must Exercise Mineral Powers with Restraint',
      publication: 'The Hindu',
      author: 'Dr. C. Rangarajan & D.K. Srivastava',
      date: '27-09-2026',
      link: 'https://www.thehindu.com/opinion/lead',
      gsPaper: 'GS2',
      stance:
        'Nuanced support for the Supreme Court judgment affirming State tax competence, but strong advocacy for a national consultative mechanism to avert inflationary beggar-thy-neighbor taxation.',
      keyArguments: [
        'Fiscal Autonomy: India’s mineral-rich states (Odisha, Jharkhand, Chhattisgarh) bear severe ecological externalities and displacement costs; they legitimately require autonomous revenue streams.',
        'Economic Competitiveness: Uncoordinated tax escalation by competing states will increase input costs across national value chains (infrastructure, energy, defense) and dampen manufacturing exports.',
        'Institutional Solution: Rather than unilateral parliamentary preemption, Article 263 (Inter-State Council) or an expanded GST Council model should negotiate binding floor and ceiling tax bands.',
      ],
      counterArgument:
        'Proponents of complete central preemption argue that uniform national extraction costs are essential for macroeconomic stability, and that decentralized state cesses invite regional corruption and bureaucratic rent-seeking.',
      upscRelevance:
        'Critical for Mains GS2 (Cooperative and Competitive Federalism, Seventh Schedule balance) and GS3 (Resource mobilization and industrial competitiveness).',
      mainsModelParagraph:
        'Fiscal federalism must not become a zero-sum contest between provincial revenue hunger and national industrial competitiveness. While the Supreme Court’s affirmation of Entry 50, List II restores constitutional equilibrium, the enduring remedy lies in cooperative federal institutions. By harmonizing mineral levies through an Inter-State Mineral Council, India can preserve provincial fiscal sovereignty while safeguarding the unified common market envisioned under Article 301.',
      isSample: true,
    },
  ],
  factsInBrief: [
    {
      headline: 'India-Oman Comprehensive Economic Partnership Agreement (CEPA)',
      fact: 'Negotiations concluded covering tariff elimination on 85% of bilateral trade lines, enhancing India’s strategic foothold at the Strait of Hormuz.',
      gsPaper: 'GS2',
    },
    {
      headline: 'Swachh Vayu Sarvekshan 2026 Awards',
      fact: 'Indore and Agra ranked top in million-plus category for PM10 reduction achieved through mechanized sweeping, bio-remediation, and strict construction dust protocols.',
      gsPaper: 'GS3',
    },
    {
      headline: 'Kavach 4.0 Deployment Target',
      fact: 'Indian Railways accelerated installation of indigenous Automatic Train Protection (ATP) Kavach 4.0 across 10,000 route kilometers covering high-density Golden Quadrilateral corridors.',
      gsPaper: 'GS3',
    },
    {
      headline: 'PM-DevINE Scheme Milestone',
      fact: 'Prime Minister’s Development Initiative for North-East Region crossed ₹6,600 crore expenditure for bamboo industrial corridors and border livelihood programs.',
      gsPaper: 'GS2',
    },
    {
      headline: 'New Ramsar Wetland Sites Addition',
      fact: 'Two high-altitude wetlands in Ladakh and Himachal Pradesh designated as Ramsar Sites, bringing India’s total protected Ramsar wetland tally to 87.',
      gsPaper: 'GS3',
    },
  ],
  quickRevision: [
    {
      id: 'qr-1',
      topic: 'MMDR Act vs Entry 50 List II',
      oneLiner: 'SC held royalty is not a tax; States possess autonomous power to tax mineral rights subject to express parliamentary restrictions.',
      gsPaper: 'GS2',
    },
    {
      id: 'qr-2',
      topic: 'RBI Climate Stress Testing',
      oneLiner: 'Mandatory TCFD reporting for banks with assets > ₹5,000 crore covering physical climate risks and transition exposures.',
      gsPaper: 'GS3',
    },
    {
      id: 'qr-3',
      topic: 'Chabahar-Uzbekistan Transit',
      oneLiner: 'Uzbekistan granted 10-year direct freight access to Chabahar Port Shahid Beheshti terminal via INSTC multimodal corridor.',
      gsPaper: 'GS2',
    },
    {
      id: 'qr-4',
      topic: 'NGT Groundwater Moratorium',
      oneLiner: 'New commercial borewell NOCs halted in over-exploited blocks without verifiable 100% artificial recharge mechanisms.',
      gsPaper: 'GS3',
    },
    {
      id: 'qr-5',
      topic: 'ISRO CE-20 Dual Restart',
      oneLiner: 'High-thrust cryogenic engine qualified for dual-restart, enabling LVM3 multi-orbit satellite deployment and Gaganyaan upgrades.',
      gsPaper: 'GS3',
    },
    {
      id: 'qr-6',
      topic: 'Gig Workers Social Security Fund',
      oneLiner: 'Turnover cess of 1-2% on aggregator apps approved to finance occupational insurance and e-Shram health benefits.',
      gsPaper: 'GS2',
    },
    {
      id: 'qr-7',
      topic: 'FATF Mutual Evaluation Rating',
      oneLiner: 'India placed in top "Regular Follow-Up" tier, validating AML/CFT framework while calling for proportional NPO risk reviews.',
      gsPaper: 'GS3',
    },
    {
      id: 'qr-8',
      topic: 'CVC Algorithmic Ethics Advisory',
      oneLiner: 'Central Vigilance Commission mandates human-in-the-loop audit before any welfare beneficiary exclusion by automated algorithms.',
      gsPaper: 'GS4',
    },
    {
      id: 'qr-9',
      topic: 'HCFC-141b Complete Phase-Out',
      oneLiner: 'India achieved 100% elimination of ozone-depleting HCFC-141b foam blowing agent ahead of Montreal Protocol timeline.',
      gsPaper: 'GS3',
    },
    {
      id: 'qr-10',
      topic: 'Double Landlocked Nations',
      oneLiner: 'Only two countries in the world are double-landlocked: Uzbekistan and Liechtenstein.',
      gsPaper: 'GS1',
    },
  ],
  keywords: [
    {
      keyword: 'Fiscal Federalism',
      definition: 'The constitutional division of taxing, spending, and borrowing powers between national and sub-national tiers of government.',
      syllabusRelevance: 'Mains GS2 - Devolution of finances and challenges in cooperative federalism.',
      mainsUsage: 'Use in intro/body when discussing state taxation on minerals, GST rationalization, or Finance Commission vertical devolution.',
    },
    {
      keyword: 'Stranded Assets',
      definition: 'Fossil fuel or carbon-intensive assets that suffer premature write-downs or devaluations due to the green energy transition.',
      syllabusRelevance: 'Mains GS3 - Banking stability, green finance, and climate change economics.',
      mainsUsage: 'Highlight in questions on RBI climate stress testing and thermal power debt exposure.',
    },
    {
      keyword: 'Algorithmic Vulnerability',
      definition: 'The disproportionate susceptibility of marginalized populations to exclusion or discrimination resulting from automated public decision models.',
      syllabusRelevance: 'Mains GS4 - Ethics in governance and technological equity.',
      mainsUsage: 'Deploy in GS4 case studies dealing with technological substitution of administrative discretion.',
    },
    {
      keyword: 'Precautionary Principle',
      definition: 'Principle stating that lack of scientific certainty should not postpone cost-effective measures to prevent environmental harm or human destitution.',
      syllabusRelevance: 'Mains GS3 & GS4 - Environmental jurisprudence and public policy ethics.',
      mainsUsage: 'Cite M.C. Mehta cases or welfare administration where administrative doubt should protect the citizen.',
    },
    {
      keyword: 'Specific Impulse (Isp)',
      definition: 'A measure of rocket propellant efficiency, defined as thrust produced per unit weight flow of propellant per second.',
      syllabusRelevance: 'Prelims GS1 & Mains GS3 - Space technology and cryogenic propulsion.',
      mainsUsage: 'Contrast solid vs cryogenic stages when discussing LVM3 payload capacity.',
    },
  ],
  quotesAndData: [
    {
      type: 'Data Point',
      content:
        'India is the world’s largest groundwater extractor, withdrawing over 245 billion cubic meters annually — representing 25% of the global total, with 14% of assessment units categorized as over-exploited.',
      attribution: 'Central Ground Water Board (CGWB) & Dynamic Ground Water Resource Assessment Report 2023',
      mainsContext: 'Essential data point for GS3 answers on water scarcity, agricultural sustainability, and NGT jurisprudence.',
      verified: true,
    },
    {
      type: 'Quote',
      content:
        'Whenever you are in doubt, or when the self becomes too much with you, apply the following test: Recall the face of the poorest and the weakest man whom you may have seen, and ask yourself if the step you contemplate is going to be of any use to him.',
      attribution: 'Mahatma Gandhi, "Talisman" (August 1947)',
      mainsContext: 'Foundational anchor for Mains GS4 Ethics, particularly regarding algorithmic welfare exclusion and civil service empathy.',
      verified: true,
    },
  ],
  practiceSet: {
    mcqs: [
      {
        id: 'pmcq-1',
        question:
          'Consider the following statements regarding the legislative division of taxation powers under the Seventh Schedule of the Indian Constitution:\n1. Taxes on mineral rights are listed under Entry 50 of the State List (List II).\n2. Parliament can limit State taxation on mineral rights only through express legislation relating to mineral development.\n3. Royalty payable under the Mines and Minerals (Development and Regulation) Act 1957 has been held by the Supreme Court to be a form of tax.\nWhich of the statements given above is/are correct?',
        options: ['1 and 2 only', '2 only', '1 and 3 only', '1, 2 and 3'],
        correctAnswer: 0,
        explanation:
          'Statements 1 and 2 are correct. Entry 50 of List II explicitly grants States powers over taxes on mineral rights subject to any limitation imposed by Parliament by law relating to mineral development. Statement 3 is incorrect because the 7-judge Constitution Bench held that royalty is not a tax, but a consideration paid for extraction privileges.',
        syllabusTopic: 'Seventh Schedule & Fiscal Federalism',
        staticConcept: 'Article 246 & Entry 50 List II',
        sourceRef: 'Supreme Court Constitution Bench ruling (September 2026)',
      },
      {
        id: 'pmcq-2',
        question:
          'With reference to the Task Force on Climate-related Financial Disclosures (TCFD), consider the following statements:\n1. It was established by the Financial Stability Board (FSB).\n2. Its core disclosure recommendations are organized around four thematic areas: Governance, Strategy, Risk Management, and Metrics & Targets.\n3. The Reserve Bank of India has prohibited commercial banks from adopting TCFD recommendations.\nWhich of the statements given above is/are correct?',
        options: ['1 only', '1 and 2 only', '2 and 3 only', '1, 2 and 3'],
        correctAnswer: 1,
        explanation:
          'Statements 1 and 2 are correct. TCFD was set up by the FSB to develop consistent climate-related financial disclosures. Its recommendations span Governance, Strategy, Risk Management, and Metrics & Targets. Statement 3 is false: RBI has actively mandated alignment with TCFD for Indian commercial banks.',
        syllabusTopic: 'Climate Finance & Financial Institutions',
        staticConcept: 'TCFD & Banking Regulation',
        sourceRef: 'RBI Climate Risk Guidelines',
      },
      {
        id: 'pmcq-3',
        question:
          'Which of the following nations is geographically "double-landlocked"?\n(a) Mongolia\n(b) Bolivia\n(c) Uzbekistan\n(d) Paraguay',
        options: ['Mongolia', 'Bolivia', 'Uzbekistan', 'Paraguay'],
        correctAnswer: 2,
        explanation:
          'Option (c) is correct: A double-landlocked country is a landlocked country surrounded exclusively by other landlocked countries. There are only two in the world: Uzbekistan (in Central Asia, surrounded by Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, and Afghanistan) and Liechtenstein (in Europe). Bolivia and Paraguay are landlocked, but bordered by countries with sea coasts.',
        syllabusTopic: 'World Physical & Political Geography',
        staticConcept: 'Global Landlocked Geopolitics',
        sourceRef: 'Ministry of External Affairs Uzbekistan Brief',
      },
      {
        id: 'pmcq-4',
        question:
          'Under the Montreal Protocol and its Kigali Amendment, which of the following substances does NOT possess Ozone Depleting Potential (ODP), yet is regulated due to its high Global Warming Potential (GWP)?\n(a) Chlorofluorocarbons (CFCs)\n(b) Carbon Tetrachloride\n(c) Halon-1211\n(d) Hydrofluorocarbons (HFCs)',
        options: [
          'Chlorofluorocarbons (CFCs)',
          'Carbon Tetrachloride',
          'Halon-1211',
          'Hydrofluorocarbons (HFCs)',
        ],
        correctAnswer: 3,
        explanation:
          'Option (d) is correct: HFCs have zero Ozone Depleting Potential because they contain no chlorine or bromine atoms. However, they are super-greenhouse gases with global warming potentials hundreds to thousands of times greater than CO2. Hence, the Kigali Amendment 2016 brought HFCs under the Montreal Protocol phase-down schedule.',
        syllabusTopic: 'Environmental Treaties & Atmospheric Chemistry',
        staticConcept: 'Montreal Protocol & Kigali Amendment',
        sourceRef: 'MoEFCC Ozone Cell Notification',
      },
      {
        id: 'pmcq-5',
        question:
          'Consider the following statements regarding the Central Vigilance Commission (CVC):\n1. It was initially constituted pursuant to the recommendations of the Santhanam Committee.\n2. The Central Vigilance Commissioner is appointed by the President by warrant under his hand and seal on the recommendation of a three-member committee.\n3. The Leader of the Opposition in the Lok Sabha is a member of this selection committee.\nWhich of the statements given above are correct?',
        options: ['1 and 2 only', '2 and 3 only', '1 and 3 only', '1, 2 and 3'],
        correctAnswer: 3,
        explanation:
          'All three statements are correct: CVC was set up in 1964 following the Santhanam Committee report and granted statutory status in 2003. The appointment is made by the President based on a committee consisting of: (1) Prime Minister (Chairperson), (2) Minister of Home Affairs, and (3) Leader of the Opposition in the Lok Sabha (or leader of largest opposition party).',
        syllabusTopic: 'Statutory Bodies & Anti-Corruption Framework',
        staticConcept: 'Central Vigilance Commission Act 2003',
        sourceRef: 'CVC Advisory on Algorithmic Ethics',
      },
    ],
    mains: [
      {
        id: 'pmains-1',
        question:
          '"Sub-soil wealth versus national market: The Supreme Court’s ruling affirming State taxation on mineral rights restores constitutional federalism, but raises economic challenges for industrial value chains." Discuss in the light of constitutional provisions and cooperative federalism. (15 Marks, 250 Words)',
        marks: 15,
        wordLimit: 250,
        gsPaper: 'GS2',
        syllabusTopic: 'Issues and challenges pertaining to federal structure, devolution of powers',
        modelPoints: [
          'Intro: Cite Article 246, Entry 50 of List II vs Entry 54 of List I, and recent 7-judge Constitution Bench ruling overruling India Cement (1989).',
          'Constitutional Affirmation: Explain why royalty is not a tax; States have inherent constitutional space to raise own revenues to compensate for negative mining externalities.',
          'Economic Challenges: Discuss cost-push inflation in core steel/cement/power inputs; risk of inter-state tax competition and interstate trade barrier disputes under Article 301.',
          'Way Forward: Propose an Inter-State Mineral Council under Article 263; floor-ceiling tax bands negotiated in GST Council-style consensus; ring-fencing revenue for local tribal and environmental rehabilitation.',
        ],
      },
      {
        id: 'pmains-2',
        question:
          'Examine how the integration of artificial intelligence and algorithmic models into public welfare delivery can create ethical dilemmas in governance. How can administrators reconcile technological efficiency with constitutional empathy? (10 Marks, 150 Words)',
        marks: 10,
        wordLimit: 150,
        gsPaper: 'GS4',
        syllabusTopic: 'Ethics in public administration, Nolan Principles, Probity in governance',
        modelPoints: [
          'Intro: Define algorithmic governance and cite CVC warning on automated exclusion in welfare schemes (PDS, pensions).',
          'Ethical Dilemmas: Mechanical efficiency vs human empathy; black-box opacity violating natural justice (Right to Explanation); false-positive biometric failures punishing vulnerable groups (elderly, disabled).',
          'Normative Framework: Uphold Nolan Principles (Objectivity & Accountability); establish mandatory human-in-the-loop audit; adopt Gandhian Talisman as benchmark — presumption of entitlement in ambiguous cases.',
        ],
      },
    ],
  },
  connectTheDots: [
    {
      id: 'ctd-1',
      currentTopic: 'Supreme Court Mineral Taxation Ruling (Entry 50 List II)',
      linkedPastTopic: 'Goods and Services Tax (GST) Compensation Cess Expiry & State Fiscal Space',
      interlinkExplanation:
        'With the GST compensation cess regime sunsetting, mineral-rich States have experienced acute fiscal distress. The Supreme Court ruling re-opens autonomous revenue mobilization for States like Jharkhand and Odisha, mirroring previous federal debates on State fiscal independence versus national economic integration.',
      gsPaper: 'GS2',
    },
    {
      id: 'ctd-2',
      currentTopic: 'Chabahar-Uzbekistan Transit & INSTC Corridor',
      linkedPastTopic: 'Ashgabat Agreement & India’s "Connect Central Asia" Policy (2012)',
      interlinkExplanation:
        'India’s accession to the Ashgabat Agreement in 2018 laid the normative groundwork for linking Arabian Sea ports with the Eurasian landmass. The new trilateral pact with Uzbekistan operationalizes this vision, directly counteracting Pakistan’s denial of overland transit through Wagah-Attari.',
      gsPaper: 'GS2',
    },
  ],
};
