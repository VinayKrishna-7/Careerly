import { DEFAULT_SECTION_ORDER, TEMPLATES } from '../config/constants.js';

export const getDefaultResumeData = (title = 'Software Engineer Resume', template = TEMPLATES.MODERN, user = null) => {
  return {
    title,
    template,
    personalInfo: {
      fullName: user?.name || 'Alex Morgan',
      jobTitle: 'Senior Full Stack Software Engineer',
      email: user?.email || 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      website: 'https://alexmorgan.dev',
      linkedin: 'https://linkedin.com/in/alexmorgan',
      github: 'https://github.com/alexmorgan',
      photoUrl: ''
    },
    summary:
      'Results-driven Senior Full Stack Engineer with 6+ years of experience architecting high-scale web applications, microservices, and interactive SaaS platforms. Proficient in React, Node.js, TypeScript, and cloud infrastructure with a demonstrated track record of improving application throughput by 40% and delivering reliable user-first solutions.',
    experience: [
      {
        company: 'CloudScale Technologies',
        position: 'Lead Full Stack Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: '',
        current: true,
        description:
          '• Architected and launched a real-time analytics dashboard serving 120k+ daily active enterprise users using React, Node.js, and Redis caching.\n• Spearheaded microservices refactor that reduced API p99 latency from 450ms to 85ms.\n• Mentored 8 junior and mid-level software engineers across agile sprints and code reviews.'
      },
      {
        company: 'Innovate Digital Labs',
        position: 'Senior Frontend Developer',
        location: 'Austin, TX',
        startDate: '2019-06',
        endDate: '2022-02',
        current: false,
        description:
          '• Developed responsive, accessible customer portal components with React, Redux Toolkit, and Tailwind CSS.\n• Integrated automated CI/CD pipeline tests increasing unit test coverage from 62% to 91%.\n• Collaborated closely with product designers to implement reusable design system design tokens.'
      }
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2015-09',
        endDate: '2019-05',
        current: false,
        gpa: '3.85 / 4.0',
        description: 'Dean’s Honor List (4 semesters), Lead Teaching Assistant for Data Structures & Algorithms.'
      }
    ],
    skills: [
      { name: 'JavaScript, TypeScript, Python, SQL, HTML5/CSS3', level: 'Expert', category: 'Programming Languages' },
      { name: 'React, Next.js, Node.js, Express, Tailwind CSS, Redux', level: 'Expert', category: 'Frameworks & Libraries' },
      { name: 'MongoDB, PostgreSQL, Redis', level: 'Advanced', category: 'Databases' },
      { name: 'Docker, AWS, Git, CI/CD, Jest, REST APIs, GraphQL', level: 'Advanced', category: 'Tools & Platforms' }
    ],
    projects: [
      {
        title: 'DevSync - Collaborative Real-Time Code Editor',
        role: 'Creator & Lead Architect',
        liveUrl: 'https://devsync-demo.io',
        githubUrl: 'https://github.com/alexmorgan/devsync',
        startDate: '2023-01',
        endDate: '2023-08',
        description:
          '• Built browser-based collaborative code workspace with CRDTs and WebSockets supporting 50+ concurrent editors per room.\n• Integrated syntax highlighting, in-browser compilation sandbox, and instant audio channel communication.',
        technologies: ['React', 'WebSockets', 'Node.js', 'Redis', 'Docker']
      },
      {
        title: 'AI Resume Score Analyzer',
        role: 'Solo Developer',
        liveUrl: 'https://resumescore.dev',
        githubUrl: 'https://github.com/alexmorgan/resume-score',
        startDate: '2022-09',
        endDate: '2022-12',
        description:
          '• Engineered ATS scoring algorithm parsing PDF resumes against job descriptions with 94% accuracy score matching.',
        technologies: ['TypeScript', 'FastAPI', 'Python', 'Tailwind CSS']
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-04',
        expiryDate: '2026-04',
        credentialId: 'AWS-ASA-94821',
        credentialUrl: 'https://aws.amazon.com/verification'
      },
      {
        name: 'Meta Certified Front-End Developer',
        issuer: 'Meta / Coursera',
        issueDate: '2021-11',
        expiryDate: '',
        credentialId: 'META-FE-5510',
        credentialUrl: 'https://coursera.org/verify'
      }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Professional' },
      { language: 'German', proficiency: 'Basic' }
    ],
    achievements: [
      {
        title: '1st Place Winner - Global Hackathon 2023',
        date: '2023-10',
        issuer: 'TechCrunch Disrupt',
        description: 'Built decentralized identity verification tool among 450+ international developer teams.'
      }
    ],
    interests: [
      {
        name: 'Open Source Development',
        keywords: ['GitHub Contributor', 'Web Standards']
      },
      {
        name: 'Mountain Biking & Marathons',
        keywords: ['Endurance Training', 'Trail Navigation']
      }
    ],
    sectionOrder: DEFAULT_SECTION_ORDER,
    sectionTitles: {
      summary: 'Professional summary',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      certifications: 'Certifications',
      languages: 'Languages',
      achievements: 'Achievements & Activities',
      interests: 'Interests'
    },
    sectionVisibility: {
      summary: true,
      experience: true,
      education: true,
      skills: true,
      projects: true,
      certifications: true,
      languages: true,
      achievements: true,
      interests: true
    },
    settings: {
      primaryColor: '#2563eb',
      secondaryColor: '#475569',
      textColor: '#1e293b',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      fontSize: 'medium',
      lineSpacing: 'normal',
      pageMargin: 'normal',
      headerLayout: 'left',
      showIcons: true,
      showPhotos: false
    }
  };
};
