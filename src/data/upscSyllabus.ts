/**
 * Official UPSC Civil Services Examination (CSE) Syllabus Framework
 * Used for Syllabus Mapping, Exploration, and Static Knowledge Linking.
 */

export interface SyllabusSection {
  id: string;
  paper: 'Prelims' | 'GS1' | 'GS2' | 'GS3' | 'GS4' | 'Essay';
  title: string;
  description: string;
  topics: {
    id: string;
    name: string;
    subtopics: string[];
    staticCore: string[];
  }[];
}

export const UPSC_SYLLABUS: SyllabusSection[] = [
  {
    id: 'prelims-gs1',
    paper: 'Prelims',
    title: 'Prelims Paper I (General Studies)',
    description: 'Current events of national & international importance, history, geography, polity, economy, ecology & science.',
    topics: [
      {
        id: 'prelims-currentevents',
        name: 'Current events of National and International Importance',
        subtopics: ['Bilateral summits', 'Multilateral agreements', 'National flagship schemes', 'Prizes & honours', 'Major international indices'],
        staticCore: ['Key historical treaties', 'Geneva conventions', 'NITI Aayog indices']
      },
      {
        id: 'prelims-polity',
        name: 'Indian Polity and Governance',
        subtopics: ['Constitution', 'Political System', 'Panchayati Raj', 'Public Policy', 'Rights Issues'],
        staticCore: ['Articles 1-395', 'Basic Structure Doctrine', '73rd/74th Constitutional Amendments', 'Representation of People Act 1951']
      },
      {
        id: 'prelims-economy',
        name: 'Economic and Social Development',
        subtopics: ['Sustainable Development', 'Poverty alleviation', 'Inclusion & Financial inclusion', 'Demographics', 'Social Sector Initiatives'],
        staticCore: ['Fiscal policy & Budget', 'Monetary Policy Framework', 'Inflation & CPI/WPI', 'External sector & BoP', 'Banking reforms']
      },
      {
        id: 'prelims-environment',
        name: 'General issues on Environmental Ecology, Bio-diversity and Climate Change',
        subtopics: ['National Parks & Wildlife Sanctuaries', 'Ramsar Sites', 'Critically endangered species', 'UNFCCC COP decisions', 'Pollution norms'],
        staticCore: ['Wildlife Protection Act 1972', 'Environment Protection Act 1986', 'Biological Diversity Act 2002', 'Forest Conservation Act']
      },
      {
        id: 'prelims-science',
        name: 'General Science and Technology',
        subtopics: ['Space technology (ISRO missions)', 'Defence acquisitions & indigenous missiles', 'Biotechnology & CRISPR', 'IT & Artificial Intelligence', 'Renewable & Nuclear energy'],
        staticCore: ['Basic physics/chemistry/biology principles', 'Semiconductor technology', 'Supercomputing mission']
      }
    ]
  },
  {
    id: 'mains-gs1',
    paper: 'GS1',
    title: 'General Studies I: Heritage, Culture, History & Geography',
    description: 'Indian Heritage and Culture, History and Geography of the World and Society.',
    topics: [
      {
        id: 'gs1-culture',
        name: 'Indian Art Forms, Literature & Architecture from ancient to modern times',
        subtopics: ['Temple architecture', 'Classical dances & music', 'Folk traditions', 'Bhakti & Sufi movements', 'Cave architecture'],
        staticCore: ['Nagara/Dravida/Vesara styles', 'UNESCO World Heritage Sites', 'ASI monuments regulations']
      },
      {
        id: 'gs1-modernhistory',
        name: 'Modern Indian History from mid-18th century until Independence',
        subtopics: ['Significant events', 'Freedom struggle personalities & contributions', 'Colonial economic policies', 'Social reform movements'],
        staticCore: ['Revolt of 1857', 'Gandhian phases', 'Constitutional developments under British rule (Acts of 1909, 1919, 1935)']
      },
      {
        id: 'gs1-society',
        name: 'Indian Society: Diversity, Women, Population, Poverty, Urbanization, Globalization',
        subtopics: ['Salient features of Indian Society', 'Role of women and women’s organizations', 'Urbanization issues & remedies', 'Communalism, Regionalism & Secularism'],
        staticCore: ['Demographic dividend', 'Care economy', 'Caste census debate', 'Smart Cities & urban governance']
      },
      {
        id: 'gs1-geography',
        name: 'Physical Geography & Distribution of Key Natural Resources',
        subtopics: ['Earthquakes, Tsunami, Volcanic activity, Cyclone', 'Monsoon dynamics & El Nino / La Nina', 'Critical mineral reserves', 'Location of primary/secondary/tertiary sector industries'],
        staticCore: ['Plate tectonics', 'Continental drift', 'Global ocean conveyor belt', 'Deep sea mining regulations']
      }
    ]
  },
  {
    id: 'mains-gs2',
    paper: 'GS2',
    title: 'General Studies II: Governance, Constitution, Polity, Social Justice & IR',
    description: 'Governance, Constitution, Polity, Social Justice and International Relations.',
    topics: [
      {
        id: 'gs2-constitution',
        name: 'Indian Constitution: Historical underpinnings, Evolution, Features, Amendments, Basic Structure',
        subtopics: ['Separation of powers & dispute redressal', 'Comparison of Indian constitutional scheme with others', 'Federalism & Inter-state councils', 'Judicial Review & Judicial Activism'],
        staticCore: ['Articles 12-35 (Fundamental Rights)', 'Articles 36-51 (DPSPs)', '7th Schedule distribution', 'Kesavananda Bharati case']
      },
      {
        id: 'gs2-polity-organs',
        name: 'Parliament and State Legislatures, Executive and the Judiciary',
        subtopics: ['Parliamentary committees system', 'Anti-Defection Law (10th Schedule)', 'Subordinate judiciary reforms & pendency', 'Tribunals and quasi-judicial bodies'],
        staticCore: ['Collegium system vs NJAC', 'Article 142 complete justice', 'Money Bill certification', 'Office of Profit']
      },
      {
        id: 'gs2-governance',
        name: 'Governance, Transparency, Accountability, E-governance, Citizen Charters, Role of Civil Services',
        subtopics: ['Digital Public Infrastructure (India Stack)', 'RTI Act implementation & exemptions', 'Whistleblowers protection', 'Lateral entry in civil services', 'Mission Karmayogi'],
        staticCore: ['2nd Administrative Reforms Commission (ARC)', 'Lokpal and Lokayuktas Act 2013', 'Sevottam model']
      },
      {
        id: 'gs2-socialjustice',
        name: 'Welfare Schemes for Vulnerable Sections, Health, Education, Human Resources',
        subtopics: ['National Health Policy & PM-JAY', 'National Education Policy 2020', 'Issues relating to poverty and hunger (Global Hunger Index)', 'Vulnerable sections (SC/ST/OBC/Minorities/Differently abled)'],
        staticCore: ['National Food Security Act 2013', 'POSHAN Abhiyaan', 'Right to Education Act 2009', 'Forest Rights Act 2006']
      },
      {
        id: 'gs2-ir',
        name: 'India and its Neighborhood- Relations, Bilateral, Regional & Global Groupings',
        subtopics: ['Neighborhood First Policy', 'Act East & Look West', 'Quad, BRICS, SCO, G20, I2U2', 'BIMSTEC vs SAARC', 'Indian Ocean Region security (SAGAR)'],
        staticCore: ['UNSC reforms & India membership', 'Indo-Pacific maritime security', 'WTO dispute settlement', 'FTAs & CEPA agreements']
      }
    ]
  },
  {
    id: 'mains-gs3',
    paper: 'GS3',
    title: 'General Studies III: Technology, Economic Development, Biodiversity, Environment, Security & Disaster',
    description: 'Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management.',
    topics: [
      {
        id: 'gs3-economy',
        name: 'Indian Economy & Issues relating to Planning, Mobilization of Resources, Growth, Development and Employment',
        subtopics: ['GDP computation methodology', 'Inclusive growth & job creation', 'Government budgeting & Fiscal Responsibility (FRBM Act)', 'Direct & Indirect Taxes (GST reforms)'],
        staticCore: ['Monetary policy committee', 'NPA resolution & Insolvency and Bankruptcy Code (IBC)', 'Capital expenditure vs revenue expenditure']
      },
      {
        id: 'gs3-agriculture',
        name: 'Major Crops, Cropping Patterns, Irrigation, Storage, Transport & Marketing, e-technology, MSP & Subsidies',
        subtopics: ['Minimum Support Price (MSP) legal guarantee debates', 'Precision farming & drones', 'PDS reforms & Food Processing sector', 'Millets promotion (Shree Anna)'],
        staticCore: ['Ashok Dalwai committee on doubling farmers income', 'PM KISAN & PM Fasal Bima Yojana', 'National Mission on Natural Farming']
      },
      {
        id: 'gs3-scitech',
        name: 'Science and Technology- Developments and their Applications in Everyday Life, Indigenization of Technology',
        subtopics: ['AI & Quantum Computing National Mission', 'Green Hydrogen Mission', 'Semiconductor manufacturing (India Semiconductor Mission)', 'Space exploration (Gaganyaan, Chandrayaan, Aditya-L1)'],
        staticCore: ['Intellectual Property Rights (IPR)', 'Anusandhan National Research Foundation (ANRF)', 'Critical technologies export controls']
      },
      {
        id: 'gs3-environment',
        name: 'Conservation, Environmental Pollution and Degradation, Environmental Impact Assessment (EIA)',
        subtopics: ['Panchamrit targets & Net Zero 2070', 'Carbon Credit Trading Scheme', 'Air Quality Management in NCR', 'Single Use Plastic ban & Extended Producer Responsibility (EPR)'],
        staticCore: ['National Green Tribunal (NGT) powers', 'EIA Notification 2006 & amendments', 'Ramsar wetlands conservation norms']
      },
      {
        id: 'gs3-disaster',
        name: 'Disaster and Disaster Management',
        subtopics: ['Glacial Lake Outburst Floods (GLOFs)', 'Urban flooding & drainage planning', 'Heatwaves declaration as disaster', 'Earthquake building codes'],
        staticCore: ['Sendai Framework for Disaster Risk Reduction', 'Disaster Management Act 2005', 'NDMA guidelines']
      },
      {
        id: 'gs3-security',
        name: 'Internal Security Challenges, Border Management, Cyber Security, Money Laundering, Extremism',
        subtopics: ['Left Wing Extremism (LWE) mitigation', 'Border infrastructure (Vibrant Villages Programme)', 'Cyber threats to critical information infrastructure (CERT-In)', 'PMLA provisions & Supreme Court rulings', 'Maritime border security'],
        staticCore: ['Unlawful Activities Prevention Act (UAPA)', 'Armed Forces Special Powers Act (AFSPA)', 'Financial Action Task Force (FATF) standards']
      }
    ]
  },
  {
    id: 'mains-gs4',
    paper: 'GS4',
    title: 'General Studies IV: Ethics, Integrity and Aptitude',
    description: 'Ethics and Human Interface, Attitude, Aptitude and Foundational Values for Civil Service, Emotional Intelligence, Case Studies.',
    topics: [
      {
        id: 'gs4-ethics-human',
        name: 'Ethics and Human Interface: Essence, Determinants, Consequences, Dimensions',
        subtopics: ['Ethics in private and public relationships', 'Human Values - lessons from great leaders, reformers, administrators', 'Role of family, society, and educational institutions in inculcating values'],
        staticCore: ['Deontological vs Consequentialist ethics', 'Virtue ethics of Aristotle', 'Gandhian Talisman', 'Constitutional morality']
      },
      {
        id: 'gs4-civil-service',
        name: 'Attitude, Aptitude and Foundational Values for Civil Service',
        subtopics: ['Integrity, Impartiality, Non-partisanship', 'Objectivity, Dedication to public service', 'Empathy, Tolerance and Compassion towards the weaker sections'],
        staticCore: ['Nolan Committee Seven Principles of Public Life', 'Code of Conduct vs Code of Ethics', 'All India Services Conduct Rules 1968']
      },
      {
        id: 'gs4-governance-probity',
        name: 'Probity in Governance: Concept of Public Service, Philosophical Basis, Information Sharing, Work Culture',
        subtopics: ['Quality of service delivery', 'Utilization of public funds', 'Challenges of corruption & Prevention of Corruption Act', 'Conflict of Interest management'],
        staticCore: ['Central Vigilance Commission (CVC) role', 'Whistleblower protection', 'Social Audit mechanisms']
      },
      {
        id: 'gs4-case-studies',
        name: 'Case Studies on Above Issues',
        subtopics: ['Ethical dilemmas in public administration', 'Balancing development with displacement', 'Handling political pressure', 'Disaster relief distribution fairness'],
        staticCore: ['Stakeholder matrix analysis', 'Law vs Conscience resolution framework', 'Utilitarian vs Rights-based trade-offs']
      }
    ]
  },
  {
    id: 'mains-essay',
    paper: 'Essay',
    title: 'Essay Paper (250 Marks)',
    description: 'Candidates are required to write essays on multiple topics. They will be expected to keep close to the subject of the essay.',
    topics: [
      {
        id: 'essay-philosophical',
        name: 'Philosophical & Abstract Essays (Section A)',
        subtopics: ['Ethics and human nature', 'Wisdom vs Knowledge', 'Individual liberty vs collective good', 'History, art and human condition'],
        staticCore: ['Multi-dimensional frameworks (PESTLE + Ethical)', 'Quotes from Kabir, Tagore, Gandhi, Ambedkar, Western philosophers']
      },
      {
        id: 'essay-socio-economic',
        name: 'Socio-Economic & Policy Essays (Section B)',
        subtopics: ['Democracy and institutions', 'Technological transformation and ethics', 'Women empowerment and justice', 'Climate change and human survival'],
        staticCore: ['Anecdotes, empirical data, government reports (NITI Aayog, Economic Survey)']
      }
    ]
  }
];
