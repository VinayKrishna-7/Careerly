import mongoose from 'mongoose';
import { TEMPLATES } from '../config/constants.js';

const coverLetterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null
    },
    title: {
      type: String,
      required: [true, 'Cover letter title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      default: 'Job Application Cover Letter'
    },
    jobTitle: {
      type: String,
      trim: true,
      default: ''
    },
    companyName: {
      type: String,
      trim: true,
      default: ''
    },
    companyAddress: {
      type: String,
      trim: true,
      default: ''
    },
    recipientName: {
      type: String,
      trim: true,
      default: 'Hiring Team'
    },
    recipientTitle: {
      type: String,
      trim: true,
      default: 'Hiring Manager'
    },
    jobDescription: {
      type: String,
      default: ''
    },
    senderInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' }
    },
    letterDate: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
    },
    salutation: {
      type: String,
      default: 'Dear Hiring Manager,'
    },
    openingParagraph: {
      type: String,
      default: ''
    },
    bodyParagraphs: {
      type: [String],
      default: []
    },
    closingParagraph: {
      type: String,
      default: ''
    },
    signoff: {
      type: String,
      default: 'Sincerely,'
    },
    template: {
      type: String,
      enum: TEMPLATES,
      default: 'modern'
    },
    settings: {
      primaryColor: { type: String, default: '#2563eb' },
      secondaryColor: { type: String, default: '#475569' },
      textColor: { type: String, default: '#1e293b' },
      fontFamily: { type: String, default: 'Inter' },
      fontSize: { type: String, default: 'medium' },
      lineSpacing: { type: String, default: 'normal' },
      pageMargin: { type: String, default: 'normal' }
    }
  },
  {
    timestamps: true
  }
);

coverLetterSchema.index({ userId: 1, updatedAt: -1 });

const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);

export default CoverLetter;
