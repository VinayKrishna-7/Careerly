// Comprehensive cross-industry power action verbs for accurate ATS analysis
const POWER_VERBS = new Set([
  // Leadership & Management
  'led', 'spearheaded', 'managed', 'orchestrated', 'directed', 'mentored',
  'coordinated', 'championed', 'oversaw', 'facilitated', 'guided', 'delegated',
  'supervised', 'recruited', 'founded', 'advised', 'empowered',

  // Engineering, Development & Architecture
  'architected', 'engineered', 'developed', 'built', 'deployed', 'automated',
  'refactored', 'designed', 'implemented', 'integrated', 'configured',
  'migrated', 'debugged', 'programmed', 'constructed', 'standardized',
  'assembled', 'containerized', 'virtualized', 'provisioned',

  // Impact, Growth & Optimization
  'optimized', 'reduced', 'increased', 'accelerated', 'streamlined',
  'maximized', 'scaled', 'boosted', 'enhanced', 'improved', 'transformed',
  'minimized', 'generated', 'modernized', 'consolidated', 'strengthened',
  'revamped', 'upgraded', 'outperformed',

  // Research, Analysis & Strategy
  'analyzed', 'researched', 'formulated', 'evaluated', 'identified',
  'audited', 'modeled', 'discovered', 'forecasted', 'calculated',
  'assessed', 'synthesized', 'investigated', 'benchmarked', 'quantified',

  // Execution, Collaboration & Delivery
  'delivered', 'executed', 'launched', 'published', 'produced', 'authored',
  'initiated', 'established', 'negotiated', 'presented', 'collaborated',
  'partnered', 'trained', 'authored', 'maintained', 'achieved', 'secured'
]);

// Extended noise / stop words to filter out non-essential terms
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'can', 'did', 'do', 'does', 'doing', 'don',
  'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his',
  'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  's', 'same', 'she', 'should', 'so', 'some', 'such', 't', 'than', 'that', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
  'will', 'with', 'you', 'your', 'yours', 'yourself', 'yourselves', 'looking',
  'role', 'team', 'work', 'working', 'ability', 'experience', 'responsible',
  'requirements', 'qualifications', 'duties', 'must', 'plus', 'including', 'years',
  'etc', 'e.g', 'i.e', 'well', 'also', 'candidate', 'ideal', 'apply', 'opportunity',
  'strong', 'good', 'great', 'join', 'company', 'environment', 'culture'
]);

// Extract unigrams and bigrams from job description or resume
const extractMeaningfulTerms = (text) => {
  if (!text || typeof text !== 'string') return [];

  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = clean.split(' ').filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  const termMap = new Map();

  // 1. Single keywords
  for (const word of words) {
    if (word.length >= 3 || word === 'c#' || word === 'c++' || word === 'r' || word === 'go' || word === 'ui' || word === 'ux' || word === 'ai' || word === 'ml' || word === 'qa') {
      termMap.set(word, (termMap.get(word) || 0) + 1);
    }
  }

  // 2. Meaningful 2-word phrases
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (bigram.length >= 6) {
      termMap.set(bigram, (termMap.get(bigram) || 0) + 2); // weight phrases higher
    }
  }

  return Array.from(termMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term);
};

// Flatten all resume text into a single searchable corpus
const getResumeCorpus = (resume) => {
  if (!resume) return '';
  const parts = [];

  if (resume.personalInfo) {
    parts.push(
      resume.personalInfo.fullName,
      resume.personalInfo.jobTitle,
      resume.personalInfo.location
    );
  }
  if (resume.summary) {
    parts.push(resume.summary);
  }
  if (Array.isArray(resume.experience)) {
    resume.experience.forEach((exp) => {
      parts.push(exp.position, exp.company, exp.location, exp.description);
    });
  }
  if (Array.isArray(resume.skills)) {
    resume.skills.forEach((skill) => {
      parts.push(skill.name, skill.category);
    });
  }
  if (Array.isArray(resume.projects)) {
    resume.projects.forEach((proj) => {
      parts.push(proj.title, proj.role, proj.description, ...(proj.technologies || []));
    });
  }
  if (Array.isArray(resume.education)) {
    resume.education.forEach((edu) => {
      parts.push(edu.institution, edu.degree, edu.fieldOfStudy, edu.gpa, edu.description);
    });
  }
  if (Array.isArray(resume.certifications)) {
    resume.certifications.forEach((c) => parts.push(c.name, c.issuer));
  }
  if (Array.isArray(resume.achievements)) {
    resume.achievements.forEach((a) => parts.push(a.title, a.issuer, a.description));
  }
  if (Array.isArray(resume.languages)) {
    resume.languages.forEach((l) => parts.push(l.language, l.proficiency));
  }
  if (Array.isArray(resume.interests)) {
    resume.interests.forEach((it) => parts.push(it.name));
  }

  return parts.filter(Boolean).join(' ');
};

export const calculateAtsScore = (resume, jobDescription = '') => {
  const resumeText = getResumeCorpus(resume);
  const resumeTextLower = resumeText.toLowerCase();

  const strengths = [];
  const improvements = [];

  // ==========================================
  // 1. KEYWORD & SKILLS MATCH EVALUATION
  // ==========================================
  let keywordScore = 70;
  let matchedKeywords = [];
  let missingKeywords = [];

  const hasJobDescription = jobDescription && jobDescription.trim().length > 25;

  if (hasJobDescription) {
    const jdTerms = extractMeaningfulTerms(jobDescription).slice(0, 35);

    if (jdTerms.length > 0) {
      jdTerms.forEach((term) => {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|\\b|\\s)${escaped}(\\b|\\s|$)`, 'i');
        if (regex.test(resumeTextLower)) {
          matchedKeywords.push(term);
        } else {
          missingKeywords.push(term);
        }
      });

      const matchRatio = matchedKeywords.length / jdTerms.length;
      keywordScore = Math.min(100, Math.round(matchRatio * 100));

      if (matchRatio >= 0.7) {
        strengths.push(`Exceptional keyword alignment: matched ${matchedKeywords.length} of ${jdTerms.length} target job description terms.`);
      } else if (matchRatio >= 0.45) {
        strengths.push(`Solid job match: ${matchedKeywords.length} key requirements identified in your profile.`);
        if (missingKeywords.length > 0) {
          improvements.push(`Improve job match by integrating target keywords: ${missingKeywords.slice(0, 5).join(', ')}.`);
        }
      } else {
        improvements.push(
          `Low keyword match against target Job Description (${Math.round(matchRatio * 100)}%). Incorporate: ${missingKeywords.slice(0, 6).join(', ')}.`
        );
      }
    }
  } else {
    // When no JD is provided, evaluate resume's native keyword density, skill richness & internal coherence
    const declaredSkills = Array.isArray(resume.skills)
      ? resume.skills.map((s) => s.name?.trim()).filter(Boolean)
      : [];

    const projectTechs = Array.isArray(resume.projects)
      ? resume.projects.flatMap((p) => p.technologies || []).filter(Boolean)
      : [];

    const allSkillsList = Array.from(new Set([...declaredSkills, ...projectTechs]));

    if (allSkillsList.length >= 10) {
      keywordScore = 95;
      matchedKeywords = allSkillsList.slice(0, 15);
      strengths.push(`Rich technical & domain skill vocabulary (${allSkillsList.length} skills & technologies identified).`);
    } else if (allSkillsList.length >= 6) {
      keywordScore = 82;
      matchedKeywords = allSkillsList;
      strengths.push(`Strong skills portfolio (${allSkillsList.length} skills detected).`);
      improvements.push('Add 3–5 additional specialized tools, methodologies, or frameworks to maximize ATS indexability.');
    } else if (allSkillsList.length >= 2) {
      keywordScore = 65;
      matchedKeywords = allSkillsList;
      improvements.push('Expand your Skills section to include at least 8–12 relevant domain skills and tools.');
    } else {
      keywordScore = 40;
      improvements.push('No technical or professional skills found in your Skills section. Add your core competencies.');
    }

    // Contextualization check: are declared skills mentioned in experience bullet points?
    if (declaredSkills.length > 0 && Array.isArray(resume.experience) && resume.experience.length > 0) {
      const expText = resume.experience.map((e) => e.description || '').join(' ').toLowerCase();
      const contextualizedCount = declaredSkills.filter((s) => expText.includes(s.toLowerCase())).length;
      if (contextualizedCount >= 3) {
        strengths.push(`Excellent keyword contextualization: ${contextualizedCount} skills are backed by real work experience bullets.`);
      }
    }
  }

  // ==========================================
  // 2. QUANTIFIABLE IMPACT & METRICS
  // ==========================================
  let impactScore = 50;
  // Match numbers with units: %, $, €, £, x, k, M, ms, years, users, clients, points
  const metricMatches = resumeText.match(/\b\d+(\.\d+)?(%|\+|x|k|m|ms|s|gb|tb|\$|€|£)?\b/gi) || [];
  const metricCount = metricMatches.length;

  if (metricCount >= 8) {
    impactScore = 100;
    strengths.push(`Outstanding quantifiable impact: ${metricCount} measurable data points (metrics, percentages, scale) found.`);
  } else if (metricCount >= 4) {
    impactScore = 85;
    strengths.push(`Good measurable accomplishments (${metricCount} data points included across your roles).`);
  } else if (metricCount >= 2) {
    impactScore = 68;
    improvements.push('Add more measurable metrics and business outcomes (e.g. "reduced load time by 30%", "managed $50K budget").');
  } else {
    impactScore = 45;
    improvements.push('Add quantifiable numbers and metrics to your experience bullets to prove measurable achievements.');
  }

  // ==========================================
  // 3. ACTION VERB STRENGTH & DENSITY
  // ==========================================
  let actionVerbCount = 0;
  POWER_VERBS.forEach((verb) => {
    const reg = new RegExp(`\\b${verb}\\b`, 'i');
    if (reg.test(resumeTextLower)) {
      actionVerbCount++;
    }
  });

  let actionVerbScore = 50;
  if (actionVerbCount >= 8) {
    actionVerbScore = 100;
    strengths.push(`High action verb density (${actionVerbCount} distinct power verbs driving accomplishment bullets).`);
  } else if (actionVerbCount >= 4) {
    actionVerbScore = 80;
  } else {
    actionVerbScore = 55;
    improvements.push('Start your bullet points with strong active verbs (e.g. "Architected", "Engineered", "Optimized", "Spearheaded").');
  }

  const combinedImpactScore = Math.round((impactScore * 0.6) + (actionVerbScore * 0.4));

  // ==========================================
  // 4. STRUCTURE & CONTACT COMPLETENESS
  // ==========================================
  let structurePoints = 0;

  // Personal Info
  if (resume.personalInfo?.fullName && resume.personalInfo.fullName.trim().includes(' ')) {
    structurePoints += 15;
  } else if (resume.personalInfo?.fullName) {
    structurePoints += 8;
  }

  if (resume.personalInfo?.jobTitle) structurePoints += 10;
  if (resume.personalInfo?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personalInfo.email)) structurePoints += 10;
  if (resume.personalInfo?.phone) structurePoints += 10;
  if (resume.personalInfo?.location) structurePoints += 5;
  if (resume.personalInfo?.linkedin || resume.personalInfo?.github || resume.personalInfo?.website) structurePoints += 10;

  // Professional Summary
  if (resume.summary && resume.summary.trim().length >= 40) {
    structurePoints += 15;
    strengths.push('Clean, well-defined professional summary included.');
  } else {
    improvements.push('Include a 2–3 sentence professional summary highlighting your core strengths.');
  }

  // Experience
  if (Array.isArray(resume.experience) && resume.experience.length >= 2) {
    structurePoints += 15;
  } else if (Array.isArray(resume.experience) && resume.experience.length === 1) {
    structurePoints += 10;
  } else {
    improvements.push('Add work experience entries with clear job positions, company names, and bullet accomplishments.');
  }

  // Education
  if (Array.isArray(resume.education) && resume.education.length > 0) {
    structurePoints += 10;
  } else {
    improvements.push('Add your degree or educational credentials in the Education section.');
  }

  // Skills Section
  if (Array.isArray(resume.skills) && resume.skills.length >= 5) {
    structurePoints += 10;
  }

  const structureScore = Math.min(100, Math.max(20, structurePoints));

  // ==========================================
  // 5. BREVITY & WORD DENSITY
  // ==========================================
  const words = resumeText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  let brevityScore = 80;

  if (wordCount >= 280 && wordCount <= 750) {
    brevityScore = 100;
    strengths.push(`Optimal document length (${wordCount} words) — ideal for 1-page recruiter scan and high ATS parsability.`);
  } else if (wordCount >= 180 && wordCount < 280) {
    brevityScore = 75;
    improvements.push(`Resume content is slightly concise (${wordCount} words). Add more bullet detail to projects or experience.`);
  } else if (wordCount > 750) {
    brevityScore = 70;
    improvements.push(`Resume is comprehensive (${wordCount} words). Ensure bullets are concise to prevent multi-page overflow.`);
  } else {
    brevityScore = 50;
    improvements.push(`Resume is too brief (${wordCount} words). Add detailed descriptions of your past projects, duties, and skills.`);
  }

  // ==========================================
  // FINAL WEIGHTED OVERALL ATS SCORE
  // ==========================================
  let overallScore = 0;
  if (hasJobDescription) {
    overallScore = Math.round(
      keywordScore * 0.40 +
      combinedImpactScore * 0.25 +
      structureScore * 0.25 +
      brevityScore * 0.10
    );
  } else {
    overallScore = Math.round(
      keywordScore * 0.30 +
      combinedImpactScore * 0.30 +
      structureScore * 0.30 +
      brevityScore * 0.10
    );
  }

  return {
    overallScore: Math.max(15, Math.min(99, overallScore)),
    categoryScores: {
      keywords: keywordScore,
      impact: combinedImpactScore,
      structure: structureScore,
      brevity: brevityScore
    },
    metricsFound: metricCount,
    actionVerbsFound: actionVerbCount,
    wordCount,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 15),
    strengths: Array.from(new Set(strengths)).slice(0, 4),
    improvements: Array.from(new Set(improvements)).slice(0, 4)
  };
};
