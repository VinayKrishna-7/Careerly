import CoverLetter from '../models/CoverLetter.js';
import Resume from '../models/Resume.js';

// Comprehensive technical and engineering competency dictionaries
const TECH_KEYWORDS = [
  'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Svelte',
  'Node.js', 'Express', 'Express.js', 'NestJS', 'TypeScript', 'JavaScript',
  'Python', 'Django', 'FastAPI', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET', 'ASP.NET',
  'Go', 'Golang', 'Rust', 'Ruby', 'Ruby on Rails', 'PHP', 'Laravel',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'Prisma', 'Mongoose', 'SQL',
  'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s', 'Terraform', 'CI/CD', 'GitHub Actions', 'Jenkins',
  'GraphQL', 'REST', 'RESTful APIs', 'gRPC', 'WebSockets', 'Microservices', 'Serverless', 'Lambda',
  'Tailwind CSS', 'Redux', 'Zustand', 'HTML5', 'CSS3', 'Sass', 'Webpack', 'Vite',
  'Kafka', 'RabbitMQ', 'Spark', 'Hadoop', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Machine Learning', 'AI', 'LLM',
  'System Design', 'Distributed Systems', 'Performance Optimization', 'High Availability', 'Security', 'Agile', 'Scrum', 'TDD', 'Unit Testing'
];

// Fallback role skills dictionary when JD is absent and user has minimal skills listed
const ROLE_SKILL_MAP = {
  frontend: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'State Management', 'Responsive UI & Web Performance'],
  backend: ['Node.js', 'Express', 'RESTful APIs', 'PostgreSQL', 'Microservices Architecture', 'Database Optimization'],
  fullstack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'REST & GraphQL APIs', 'Cloud Deployment'],
  devops: ['AWS', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Terraform', 'Infrastructure as Code & Monitoring'],
  cloud: ['AWS', 'Cloud Architecture', 'Serverless', 'Docker', 'Kubernetes', 'High Availability Systems'],
  data: ['Python', 'SQL', 'Data Pipelines', 'ETL Processes', 'PostgreSQL', 'Data Modeling & Analytics'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Mobile Architecture', 'Offline Storage & APIs'],
  qa: ['Automated Testing', 'Cypress', 'Jest', 'Selenium', 'CI/CD Integration', 'Quality Assurance & TDD'],
  engineer: ['Modern Web Technologies', 'System Design', 'API Development', 'Clean Architecture', 'Continuous Delivery']
};

/**
 * Extract matched skills and requirements from Job Description
 */
const extractJdInsights = (jobDescription = '') => {
  if (!jobDescription || typeof jobDescription !== 'string') {
    return { detectedSkills: [], keyFocusAreas: [], highlights: [] };
  }

  const jdLower = jobDescription.toLowerCase();
  const detectedSkills = [];

  for (const tech of TECH_KEYWORDS) {
    // Exact word boundary regex check
    const escaped = tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(jobDescription)) {
      detectedSkills.push(tech);
    }
  }

  // Detect key focus areas/themes in JD
  const keyFocusAreas = [];
  if (/\b(microservice|distributed system|high throughput|low latency|scalab\w+)\b/i.test(jobDescription)) {
    keyFocusAreas.push('scalable distributed systems and low-latency architectures');
  }
  if (/\b(frontend|ui|ux|responsive|user interface|web application)\b/i.test(jobDescription)) {
    keyFocusAreas.push('intuitive, high-performance user interfaces and web applications');
  }
  if (/\b(api|rest|graphql|backend|server|endpoint)\b/i.test(jobDescription)) {
    keyFocusAreas.push('robust API development and high-throughput backend services');
  }
  if (/\b(cloud|aws|azure|gcp|docker|kubernetes|container|devops|ci\/cd)\b/i.test(jobDescription)) {
    keyFocusAreas.push('cloud infrastructure, containerization, and automated CI/CD workflows');
  }
  if (/\b(database|sql|nosql|postgres|mongo|data model|query optimiz\w+)\b/i.test(jobDescription)) {
    keyFocusAreas.push('optimized database design, data integrity, and performant query execution');
  }
  if (/\b(security|auth|oauth|jwt|compliance|vulnerabilit\w+)\b/i.test(jobDescription)) {
    keyFocusAreas.push('secure authentication protocols and software compliance standards');
  }
  if (/\b(cross-functional|collaborat\w+|agile|scrum|mentor\w+|lead\w+)\b/i.test(jobDescription)) {
    keyFocusAreas.push('cross-functional team collaboration, agile methodologies, and technical mentorship');
  }

  return {
    detectedSkills,
    keyFocusAreas
  };
};

/**
 * Infer relevant industry standard skills for a role title if candidate skills are sparse
 */
const getRoleDefaultSkills = (jobTitle = '') => {
  const title = (jobTitle || '').toLowerCase();
  if (title.includes('front')) return ROLE_SKILL_MAP.frontend;
  if (title.includes('back')) return ROLE_SKILL_MAP.backend;
  if (title.includes('full') || title.includes('stack')) return ROLE_SKILL_MAP.fullstack;
  if (title.includes('devops') || title.includes('site reliability') || title.includes('sre')) return ROLE_SKILL_MAP.devops;
  if (title.includes('cloud')) return ROLE_SKILL_MAP.cloud;
  if (title.includes('data') || title.includes('analyst') || title.includes('machine learning') || title.includes('ai')) return ROLE_SKILL_MAP.data;
  if (title.includes('mobile') || title.includes('ios') || title.includes('android')) return ROLE_SKILL_MAP.mobile;
  if (title.includes('qa') || title.includes('test') || title.includes('sdet')) return ROLE_SKILL_MAP.qa;
  return ROLE_SKILL_MAP.engineer;
};

export const generateCoverLetterContent = ({
  candidateName = 'Alex Morgan',
  jobTitle = 'Software Engineer',
  companyName = 'Innovate Tech',
  recipientName = '',
  recipientTitle = '',
  jobDescription = '',
  topSkills = [],
  topExperience = null,
  tone = 'professional' // 'professional' | 'enthusiastic' | 'confident'
}) => {
  const cleanTitle = (jobTitle || 'Software Engineer').trim();
  const cleanCompany = (companyName || 'your organization').trim();
  const rawCandidateName = (candidateName || 'Candidate').trim();

  const isJdProvided = jobDescription && jobDescription.trim().length > 25;
  const jdInsights = isJdProvided ? extractJdInsights(jobDescription) : { detectedSkills: [], keyFocusAreas: [] };

  // Prioritize skills: candidate's skills matched with JD skills, followed by unmatched candidate skills or extracted JD skills
  let consolidatedSkills = [];
  const candidateSkillsClean = Array.isArray(topSkills)
    ? topSkills.map((s) => (typeof s === 'string' ? s.trim() : s?.name?.trim())).filter(Boolean)
    : [];

  if (isJdProvided && jdInsights.detectedSkills.length > 0) {
    // Intersect candidate skills with JD detected skills if possible
    const matchingSkills = candidateSkillsClean.filter((cs) =>
      jdInsights.detectedSkills.some((ds) => ds.toLowerCase() === cs.toLowerCase())
    );
    const uniqueSkills = Array.from(new Set([...matchingSkills, ...jdInsights.detectedSkills, ...candidateSkillsClean]));
    consolidatedSkills = uniqueSkills.slice(0, 6);
  } else if (candidateSkillsClean.length > 0) {
    consolidatedSkills = candidateSkillsClean.slice(0, 6);
  } else {
    consolidatedSkills = getRoleDefaultSkills(cleanTitle);
  }

  const primarySkillsStr = consolidatedSkills.slice(0, 3).join(', ');
  const allSkillsStr = consolidatedSkills.join(', ');

  const expPosition = topExperience?.position || cleanTitle;
  const expCompany = topExperience?.company || '';
  const expContext = expCompany ? `as a ${expPosition} at ${expCompany}` : `as a ${expPosition}`;

  // 1. SALUTATION
  let salutation = 'Dear Hiring Team,';
  if (recipientName && recipientName.trim()) {
    salutation = `Dear ${recipientName.trim()},`;
  } else if (companyName && companyName.trim()) {
    salutation = `Dear Hiring Team at ${cleanCompany},`;
  }

  // 2. OPENING PARAGRAPH
  let openingParagraph = '';
  if (isJdProvided) {
    const focusPillar = jdInsights.keyFocusAreas[0] || 'building reliable, high-performance software systems';
    if (tone === 'enthusiastic') {
      openingParagraph = `I was thrilled to discover the ${cleanTitle} opportunity at ${cleanCompany}. With a comprehensive technical background in ${primarySkillsStr} and a deep dedication to ${focusPillar}, I am eager to bring my problem-solving abilities and engineering leadership to your team's immediate roadmap.`;
    } else if (tone === 'confident') {
      openingParagraph = `I am writing to submit my application for the ${cleanTitle} position at ${cleanCompany}. Having built a proven track record in ${primarySkillsStr} and delivered complex solutions centered on ${focusPillar}, I am positioned to make an immediate, measurable contribution to ${cleanCompany}'s engineering goals.`;
    } else {
      openingParagraph = `I am writing to express my strong interest in the ${cleanTitle} position at ${cleanCompany}. With proven expertise across ${primarySkillsStr} and hands-on experience in ${focusPillar}, I am confident that my technical skills and architectural discipline directly match the requirements outlined in your job opening.`;
    }
  } else {
    if (tone === 'enthusiastic') {
      openingParagraph = `I am excited to apply for the ${cleanTitle} role at ${cleanCompany}. With a robust foundation in ${primarySkillsStr} and a passion for engineering scalable, user-centric software, I am eager to contribute to the innovative initiatives at ${cleanCompany}.`;
    } else if (tone === 'confident') {
      openingParagraph = `I am writing to formally apply for the ${cleanTitle} position at ${cleanCompany}. Offering extensive experience in ${primarySkillsStr} and a track record of building performant, mission-critical systems, I am prepared to deliver high-quality results for your engineering organization.`;
    } else {
      openingParagraph = `I am writing to express my interest in the ${cleanTitle} position at ${cleanCompany}. With a solid engineering background in ${primarySkillsStr} and a focus on delivering scalable, robust solutions, I am well-prepared to contribute effectively to ${cleanCompany}'s technical objectives.`;
    }
  }

  // 3. BODY PARAGRAPH 1 (Technical Proficiency & Architecture Match)
  let body1 = '';
  if (isJdProvided) {
    const focusTech = consolidatedSkills.length > 0 ? consolidatedSkills.join(', ') : 'modern full-stack architecture';
    const focusArea1 = jdInsights.keyFocusAreas[0] || 'architecting robust features and streamlining API services';
    body1 = `Throughout my work ${expContext}, I have focused on solving challenging engineering problems by designing maintainable, efficient systems using ${focusTech}. In alignment with your requirements for ${focusArea1}, I have consistently prioritized clean code architecture, end-to-end type safety, and rigorous automated testing to ensure high availability and seamless user experiences.`;
  } else {
    const focusTech = allSkillsStr;
    body1 = `During my career ${expContext}, I have specialized in developing end-to-end solutions that balance rapid execution with long-term maintainability. Leveraging ${focusTech}, I routinely architect scalable components, optimize system performance, and uphold high engineering standards through automated testing, peer reviews, and clean design patterns.`;
  }

  // 4. BODY PARAGRAPH 2 (Impact, Team Collaboration & Business Value)
  let body2 = '';
  if (isJdProvided) {
    const secondaryFocus = jdInsights.keyFocusAreas[1] || jdInsights.keyFocusAreas[0] || 'cross-functional collaboration and delivery velocity';
    body2 = `In addition to hands-on development, I bring a collaborative mindset dedicated to bridging business requirements with sound technical execution. When addressing ${secondaryFocus}, I work closely with product managers, designers, and fellow engineers to eliminate technical debt, improve release cycles, and deliver features that directly drive key business metrics.`;
  } else {
    body2 = `Beyond core technical execution, I excel in cross-functional environments where clear communication and strategic problem-solving drive product excellence. I actively partner with product and design teams to refine user requirements, streamline release workflows, and ensure that every technical deliverable delivers tangible business value and a superior customer experience.`;
  }

  // 5. CLOSING PARAGRAPH
  let closingParagraph = '';
  if (tone === 'enthusiastic') {
    closingParagraph = `I would welcome the opportunity to discuss how my skill set in ${primarySkillsStr} and enthusiasm for technical excellence can support ${cleanCompany}'s upcoming milestones. Thank you for your time and consideration, and I look forward to speaking with you.`;
  } else if (tone === 'confident') {
    closingParagraph = `I welcome the opportunity to discuss how my background in ${primarySkillsStr} and track record of delivering high-impact solutions will benefit ${cleanCompany}. Thank you for your consideration, and I look forward to scheduling an interview.`;
  } else {
    closingParagraph = `I would welcome the opportunity to discuss how my technical expertise in ${primarySkillsStr} aligns with ${cleanCompany}'s engineering needs. Thank you for your time and consideration, and I look forward to the possibility of discussing this role in greater detail.`;
  }

  return {
    salutation,
    openingParagraph,
    bodyParagraphs: [body1, body2],
    closingParagraph,
    signoff: 'Sincerely,'
  };
};

export const createCoverLetter = async (userId, data) => {
  let senderInfo = data.senderInfo || {};
  let generatedText = null;

  // If a resumeId is provided, pull senderInfo and top skills
  let skills = [];
  let topExp = null;

  if (data.resumeId) {
    const resume = await Resume.findOne({ _id: data.resumeId, userId });
    if (resume) {
      if (!senderInfo.fullName) senderInfo.fullName = resume.personalInfo?.fullName || '';
      if (!senderInfo.email) senderInfo.email = resume.personalInfo?.email || '';
      if (!senderInfo.phone) senderInfo.phone = resume.personalInfo?.phone || '';
      if (!senderInfo.location) senderInfo.location = resume.personalInfo?.location || '';
      if (!senderInfo.website) senderInfo.website = resume.personalInfo?.website || '';
      if (!senderInfo.linkedin) senderInfo.linkedin = resume.personalInfo?.linkedin || '';

      if (Array.isArray(resume.skills)) {
        skills = resume.skills.map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
      }
      if (Array.isArray(resume.experience) && resume.experience.length > 0) {
        topExp = resume.experience[0];
      }
    }
  }

  // If body content is not explicitly provided, generate it automatically
  if (!data.openingParagraph) {
    generatedText = generateCoverLetterContent({
      candidateName: senderInfo.fullName || 'Candidate',
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      recipientName: data.recipientName,
      recipientTitle: data.recipientTitle,
      jobDescription: data.jobDescription,
      topSkills: skills.length > 0 ? skills : (data.topSkills || []),
      topExperience: topExp || data.topExperience,
      tone: data.tone || 'professional'
    });
  }

  const coverLetter = await CoverLetter.create({
    userId,
    resumeId: data.resumeId || null,
    title: data.title || `${data.companyName || 'Company'} Cover Letter`,
    jobTitle: data.jobTitle || '',
    companyName: data.companyName || '',
    companyAddress: data.companyAddress || '',
    recipientName: data.recipientName || 'Hiring Manager',
    recipientTitle: data.recipientTitle || 'Hiring Team',
    jobDescription: data.jobDescription || '',
    senderInfo,
    salutation: data.salutation || generatedText?.salutation || 'Dear Hiring Manager,',
    openingParagraph: data.openingParagraph || generatedText?.openingParagraph || '',
    bodyParagraphs: data.bodyParagraphs || generatedText?.bodyParagraphs || [],
    closingParagraph: data.closingParagraph || generatedText?.closingParagraph || '',
    signoff: data.signoff || generatedText?.signoff || 'Sincerely,',
    template: data.template || 'modern',
    settings: data.settings || {
      primaryColor: '#2563eb',
      secondaryColor: '#475569',
      textColor: '#1e293b',
      fontFamily: 'Inter',
      fontSize: 'medium',
      lineSpacing: 'normal',
      pageMargin: 'normal'
    }
  });

  return coverLetter;
};

export const getCoverLettersByUser = async (userId) => {
  return await CoverLetter.find({ userId }).sort({ updatedAt: -1 });
};

export const getCoverLetterById = async (id, userId) => {
  return await CoverLetter.findOne({ _id: id, userId });
};

export const updateCoverLetter = async (id, userId, updates) => {
  return await CoverLetter.findOneAndUpdate(
    { _id: id, userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
};

export const deleteCoverLetter = async (id, userId) => {
  return await CoverLetter.findOneAndDelete({ _id: id, userId });
};

