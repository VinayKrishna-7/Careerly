export const TEMPLATES = {
  MODERN: 'modern',
  PROFESSIONAL: 'professional',
  MINIMAL: 'minimal',
  CREATIVE: 'creative',
  MTECK: 'mteck',
  KNYTE: 'knyte',
  JAKES: 'jakes',
  ANUBHAV: 'anubhav',
  AUSTERE: 'austere'
};

export const TEMPLATE_METADATA = [
  {
    id: 'modern',
    name: 'Modern Accent',
    description: 'Clean header layout with prominent color accents, ideal for tech and creative professionals.',
    badge: 'Popular',
    previewColor: '#2563eb'
  },
  {
    id: 'professional',
    name: 'Executive Standard',
    description: 'Classic corporate style with crisp dividers, ideal for finance, legal, management, and consulting.',
    badge: 'Classic',
    previewColor: '#0f172a'
  },
  {
    id: 'minimal',
    name: 'Clean Minimalist',
    description: 'Ultra-clean high-density design, highly optimized for ATS scanners and multi-page compactness.',
    badge: 'ATS-Friendly',
    previewColor: '#475569'
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Distinctive top gradient header and pill tags, perfect for engineers, designers, and innovators.',
    badge: 'Creative',
    previewColor: '#7c3aed'
  },
  {
    id: 'mteck',
    name: "MTeck's Resume",
    description: 'Classic LaTeX & engineering standard with clean horizontal section rules, high density, and crisp tabular alignment.',
    badge: 'Engineering',
    previewColor: '#1e3a8a'
  },
  {
    id: 'knyte',
    name: 'Resume Knyte',
    description: 'Sleek executive tech leader layout with vertical accent markers, stylish tag pills, and modern hierarchy.',
    badge: 'Executive Tech',
    previewColor: '#047857'
  },
  {
    id: 'jakes',
    name: "Jake's Resume",
    description: 'The iconic Overleaf & CS gold-standard format with centered pipe contact info and bold rule dividers.',
    badge: 'Top Rated SWE',
    previewColor: '#18181b'
  },
  {
    id: 'anubhav',
    name: 'Anubhav Resume',
    description: 'Prestigious IIT & FAANG engineering format with grouped category skills, bracket tech highlights, and high impact.',
    badge: 'FAANG Standard',
    previewColor: '#b45309'
  },
  {
    id: 'austere',
    name: 'AustereCV',
    description: 'Refined Nordic editorial minimalism with airy typographic balance, subtle dividers, and pure elegance.',
    badge: 'Editorial Minimal',
    previewColor: '#334155'
  }
];

export const COLOR_PALETTES = [
  { name: 'Executive Navy', primary: '#0f172a', secondary: '#334155' },
  { name: 'Corporate Blue', primary: '#1e40af', secondary: '#3b82f6' },
  { name: 'Modern Sapphire', primary: '#2563eb', secondary: '#60a5fa' },
  { name: 'Slate Gray', primary: '#334155', secondary: '#64748b' },
  { name: 'Deep Emerald', primary: '#065f46', secondary: '#059669' },
  { name: 'Charcoal Black', primary: '#18181b', secondary: '#27272a' }
];

export const FONT_OPTIONS = [
  { id: 'Times New Roman', name: 'Times New Roman (Classic Formal Serif)', family: "'Times New Roman', Times, Georgia, serif" },
  { id: 'Inter', name: 'Inter (Modern Sans-Serif)', family: "'Inter', sans-serif" },
  { id: 'Roboto', name: 'Roboto (Universal ATS Standard)', family: "'Roboto', sans-serif" },
  { id: 'Calibri', name: 'Calibri (Clean Corporate Sans)', family: "Calibri, 'Segoe UI', Candara, sans-serif" },
  { id: 'Arial', name: 'Arial (Standard ATS Sans)', family: "Arial, 'Helvetica Neue', Helvetica, sans-serif" },
  { id: 'Helvetica', name: 'Helvetica (Iconic Swiss Sans)', family: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
  { id: 'Cambria', name: 'Cambria (Modern Academic Serif)', family: "Cambria, Georgia, 'Times New Roman', serif" },
  { id: 'Merriweather', name: 'Merriweather (Executive Editorial Serif)', family: "'Merriweather', serif" },
  { id: 'Poppins', name: 'Poppins (Geometric Modern Sans)', family: "'Poppins', sans-serif" },
  { id: 'Outfit', name: 'Outfit (Contemporary Tech Sans)', family: "'Outfit', sans-serif" },
  { id: 'Playfair Display', name: 'Playfair Display (Elegant Luxury Serif)', family: "'Playfair Display', Georgia, serif" },
  { id: 'Fira Code', name: 'Fira Code (Developer Monospace)', family: "'Fira Code', monospace" }
];

export const FONT_WEIGHT_OPTIONS = [
  { id: 'normal', name: 'Normal', value: '400', label: 'Normal (400)' },
  { id: 'medium', name: 'Medium', value: '500', label: 'Medium (500)' },
  { id: 'semibold', name: 'Semi-Bold', value: '600', label: 'Semi-Bold (600)' },
  { id: 'bold', name: 'Bold', value: '700', label: 'Bold (700)' },
  { id: 'extrabold', name: 'Extra-Bold', value: '800', label: 'Extra-Bold (800)' }
];

export const DEFAULT_STYLING_SETTINGS = {
  modern: {
    primaryColor: '#2563eb',
    secondaryColor: '#475569',
    textColor: '#1e293b',
    sectionTitleColor: '#2563eb',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Inter',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'left',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  professional: {
    primaryColor: '#0f172a',
    secondaryColor: '#334155',
    textColor: '#1e293b',
    sectionTitleColor: '#0f172a',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Times New Roman',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'center',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  minimal: {
    primaryColor: '#000000',
    secondaryColor: '#475569',
    textColor: '#171717',
    sectionTitleColor: '#000000',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Arial',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'left',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  creative: {
    primaryColor: '#7c3aed',
    secondaryColor: '#8b5cf6',
    textColor: '#1e293b',
    sectionTitleColor: '#7c3aed',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Inter',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'left',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  mteck: {
    primaryColor: '#1e3a8a',
    secondaryColor: '#334155',
    textColor: '#0f172a',
    sectionTitleColor: '#1e3a8a',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Roboto',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'center',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  knyte: {
    primaryColor: '#047857',
    secondaryColor: '#065f46',
    textColor: '#1e293b',
    sectionTitleColor: '#047857',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Inter',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'left',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  jakes: {
    primaryColor: '#000000',
    secondaryColor: '#334155',
    textColor: '#000000',
    sectionTitleColor: '#000000',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Times New Roman',
    pageMargin: 'normal',
    lineSpacing: 'compact',
    headerLayout: 'center',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  anubhav: {
    primaryColor: '#b45309',
    secondaryColor: '#475569',
    textColor: '#1e293b',
    sectionTitleColor: '#b45309',
    sectionTitleFontWeight: '800',
    bodyFontWeight: '400',
    roleFontWeight: '700',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 28,
    roleFontSize: 16,
    contactFontSize: 12.5,
    linksFontSize: 12.5,
    sectionTitleFontSize: 16,
    bodyFontSize: 13.5,
    fontFamily: 'Arial',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'left',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  },
  austere: {
    primaryColor: '#334155',
    secondaryColor: '#64748b',
    textColor: '#1e293b',
    sectionTitleColor: '#334155',
    sectionTitleFontWeight: '700',
    bodyFontWeight: '400',
    roleFontWeight: '600',
    contactFontWeight: '400',
    linksFontWeight: '600',
    nameFontSize: 26,
    roleFontSize: 15,
    contactFontSize: 12,
    linksFontSize: 12,
    sectionTitleFontSize: 15,
    bodyFontSize: 13,
    fontFamily: 'Calibri',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    headerLayout: 'left',
    projectLinkStyle: 'name',
    contactLinkStyle: 'name'
  }
};

export const HEADER_ALIGNMENT_OPTIONS = [
  { id: 'left', name: 'Left', label: 'Left Aligned', description: 'Classic left-aligned header' },
  { id: 'center', name: 'Middle', label: 'Middle (Centered)', description: 'Balanced centered header' },
  { id: 'right', name: 'Right', label: 'Right Aligned', description: 'Modern right-aligned header' }
];

export const getHeaderAlignment = (headerLayout, template = 'modern') => {
  const defaultLayout =
    template === 'jakes' || template === 'mteck' || template === 'professional' ? 'center' : 'left';
  const layout = headerLayout === 'middle' ? 'center' : headerLayout || defaultLayout;

  if (layout === 'center') {
    return {
      align: 'center',
      container: 'text-center items-center',
      contact: 'justify-center text-center',
      items: 'items-center justify-center'
    };
  }
  if (layout === 'right') {
    return {
      align: 'right',
      container: 'text-right items-end',
      contact: 'justify-end text-right',
      items: 'items-end justify-end'
    };
  }
  return {
    align: 'left',
    container: 'text-left items-start',
    contact: 'justify-start text-left',
    items: 'items-start justify-start'
  };
};

export const getDefaultSettings = (templateId = 'modern') => {
  return DEFAULT_STYLING_SETTINGS[templateId] || DEFAULT_STYLING_SETTINGS.modern;
};

export const NAME_FONT_SIZES = [24, 26, 28, 30, 32, 34, 36, 38, 40, 44];
export const ROLE_FONT_SIZES = [14, 15, 16, 17, 17.5, 18, 19, 20, 22, 24];
export const CONTACT_FONT_SIZES = [11, 12, 12.5, 13, 13.5, 14, 14.5, 15, 16];
export const LINKS_FONT_SIZES = [11, 12, 12.5, 13, 13.5, 14, 14.5, 15, 16];
export const SECTION_TITLE_FONT_SIZES = [14, 15, 16, 17, 17.5, 18, 19, 20, 22, 24];
export const BODY_FONT_SIZES = [12, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17, 18, 19, 20];

export const FONT_SIZE_CONFIG = {
  small: { base: 'text-[12px]', name: 'text-xl', sectionTitle: 'text-xs', body: 'text-[11.5px]' },
  medium: { base: 'text-[13.5px]', name: 'text-2xl', sectionTitle: 'text-sm', body: 'text-[12.5px]' },
  large: { base: 'text-[15px]', name: 'text-3xl', sectionTitle: 'text-base', body: 'text-[13.5px]' }
};

export const LINE_SPACING_CONFIG = {
  compact: 'leading-tight space-y-1',
  normal: 'leading-normal space-y-2',
  relaxed: 'leading-relaxed space-y-3'
};

export const MARGIN_CONFIG = {
  compact: 'p-5 sm:p-6',
  normal: 'p-6 sm:p-8',
  wide: 'p-8 sm:p-10'
};

export const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'achievements',
  'interests'
];

export const DEFAULT_SECTION_TITLES = {
  summary: 'Professional summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  achievements: 'Achievements & Activities',
  interests: 'Interests'
};

export const SECTION_NAMES = {
  summary: 'Professional summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  achievements: 'Achievements & Activities',
  interests: 'Interests'
};

