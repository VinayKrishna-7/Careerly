import { z } from 'zod';

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  jobTitle: z.string().optional(),
  email: z.string().email('Valid email required').or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
  photoUrl: z.string().optional()
});

export const experienceItemSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position title is required'),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  description: z.string().optional()
});

export const educationItemSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  gpa: z.string().optional(),
  description: z.string().optional()
});

export const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.string().default('Intermediate'),
  category: z.string().default('General')
});

export const projectItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Project title is required'),
  role: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([])
});

export const certificationItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional()
});

export const languageItemSchema = z.object({
  id: z.string().optional(),
  language: z.string().min(1, 'Language is required'),
  proficiency: z.string().default('Fluent')
});

export const achievementItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Achievement title is required'),
  date: z.string().optional(),
  issuer: z.string().optional(),
  description: z.string().optional()
});

export const interestItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Interest is required'),
  keywords: z.array(z.string()).default([])
});
