import { z } from 'zod';
import { TEMPLATES } from '../config/constants.js';

export const createResumeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title cannot be empty').max(100).optional(),
    template: z.enum(Object.values(TEMPLATES)).optional()
  })
});

export const updateResumeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(100).optional(),
    template: z.enum(Object.values(TEMPLATES)).optional(),
    personalInfo: z
      .object({
        fullName: z.string().optional(),
        jobTitle: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
        website: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        photoUrl: z.string().optional()
      })
      .optional(),
    summary: z.string().optional(),
    experience: z.array(z.any()).optional(),
    education: z.array(z.any()).optional(),
    skills: z.array(z.any()).optional(),
    projects: z.array(z.any()).optional(),
    certifications: z.array(z.any()).optional(),
    languages: z.array(z.any()).optional(),
    achievements: z.array(z.any()).optional(),
    interests: z.array(z.any()).optional(),
    sectionOrder: z.array(z.string()).optional(),
    sectionTitles: z.record(z.string()).optional(),
    sectionVisibility: z.record(z.boolean()).optional(),
    settings: z
      .object({
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        textColor: z.string().optional(),
        backgroundColor: z.string().optional(),
        fontFamily: z.string().optional(),
        fontSize: z.string().optional(),
        sectionTitleFontSize: z.number().optional(),
        sectionTitleColor: z.string().optional(),
        sectionTitleFontWeight: z.string().optional(),
        bodyFontSize: z.number().optional(),
        bodyFontWeight: z.string().optional(),
        nameFontSize: z.number().optional(),
        roleFontSize: z.number().optional(),
        roleFontWeight: z.string().optional(),
        contactFontSize: z.number().optional(),
        contactFontWeight: z.string().optional(),
        linksFontSize: z.number().optional(),
        linksFontWeight: z.string().optional(),
        projectLinkStyle: z.string().optional(),
        contactLinkStyle: z.string().optional(),
        lineSpacing: z.string().optional(),
        pageMargin: z.string().optional(),
        headerLayout: z.string().optional(),
        showIcons: z.boolean().optional(),
        showPhotos: z.boolean().optional()
      })
      .passthrough()
      .optional(),
    isPublic: z.boolean().optional()
  })
});

export const renameResumeSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).trim().min(1, 'Title cannot be empty').max(100)
  })
});
