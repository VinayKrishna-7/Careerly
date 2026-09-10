import mongoose from 'mongoose';
import { TEMPLATES, DEFAULT_SECTION_ORDER } from '../config/constants.js';

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' }
  },
  { _id: true }
);

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    gpa: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { _id: true }
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    level: { type: String, default: 'Intermediate' }, // Beginner, Intermediate, Advanced, Expert
    category: { type: String, default: 'General' }
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    role: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: [{ type: String }]
  },
  { _id: true }
);

const certificationSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    issuer: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' }
  },
  { _id: true }
);

const languageSchema = new mongoose.Schema(
  {
    language: { type: String, default: '' },
    proficiency: { type: String, default: 'Fluent' } // Native, Fluent, Professional, Intermediate, Basic
  },
  { _id: true }
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    date: { type: String, default: '' },
    issuer: { type: String, default: '' },
    description: { type: String, default: '' }
  },
  { _id: true }
);

const interestSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    keywords: [{ type: String }]
  },
  { _id: true }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      trim: true,
      default: 'My Professional Resume'
    },
    template: {
      type: String,
      enum: Object.values(TEMPLATES),
      default: TEMPLATES.MODERN
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      photoUrl: { type: String, default: '' }
    },
    summary: {
      type: String,
      default: ''
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    projects: [projectSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    achievements: [achievementSchema],
    interests: [interestSchema],
    sectionOrder: {
      type: [String],
      default: DEFAULT_SECTION_ORDER
    },
    sectionTitles: {
      summary: { type: String, default: 'Professional summary' },
      experience: { type: String, default: 'Experience' },
      education: { type: String, default: 'Education' },
      skills: { type: String, default: 'Skills' },
      projects: { type: String, default: 'Projects' },
      certifications: { type: String, default: 'Certifications' },
      languages: { type: String, default: 'Languages' },
      achievements: { type: String, default: 'Achievements & Activities' },
      interests: { type: String, default: 'Interests' }
    },
    sectionVisibility: {
      summary: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      certifications: { type: Boolean, default: true },
      languages: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      interests: { type: Boolean, default: true }
    },
    settings: {
      type: new mongoose.Schema(
        {
          primaryColor: { type: String, default: '#2563eb' },
          secondaryColor: { type: String, default: '#475569' },
          textColor: { type: String, default: '#1e293b' },
          backgroundColor: { type: String, default: '#ffffff' },
          fontFamily: { type: String, default: 'Inter' },
          fontSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium'
          },
          sectionTitleFontSize: { type: Number, default: 14 },
          sectionTitleColor: { type: String, default: '' },
          sectionTitleFontWeight: { type: String, default: '800' },
          bodyFontSize: { type: Number, default: 12 },
          bodyFontWeight: { type: String, default: '400' },
          nameFontSize: { type: Number, default: 24 },
          roleFontSize: { type: Number, default: 14 },
          roleFontWeight: { type: String, default: '700' },
          contactFontSize: { type: Number, default: 11 },
          contactFontWeight: { type: String, default: '400' },
          linksFontSize: { type: Number, default: 11 },
          linksFontWeight: { type: String, default: '600' },
          projectLinkStyle: { type: String, default: 'name' },
          contactLinkStyle: { type: String, default: 'name' },
          lineSpacing: {
            type: String,
            enum: ['compact', 'normal', 'relaxed'],
            default: 'normal'
          },
          pageMargin: {
            type: String,
            enum: ['compact', 'normal', 'wide'],
            default: 'normal'
          },
          headerLayout: {
            type: String,
            enum: ['left', 'center', 'right', 'sidebar'],
            default: 'left'
          },
          showIcons: { type: Boolean, default: true },
          showPhotos: { type: Boolean, default: false }
        },
        { _id: false, strict: false }
      ),
      default: () => ({})
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    publicSlug: {
      type: String,
      sparse: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for user query performance
resumeSchema.index({ userId: 1, updatedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
