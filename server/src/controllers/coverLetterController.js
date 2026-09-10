import {
  createCoverLetter,
  getCoverLettersByUser,
  getCoverLetterById,
  updateCoverLetter,
  deleteCoverLetter,
  generateCoverLetterContent
} from '../services/coverLetterService.js';
import { generateCoverLetterPdf } from '../services/coverLetterPdfService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

import Resume from '../models/Resume.js';

export const generateCoverLetterText = async (req, res, next) => {
  try {
    const {
      candidateName,
      jobTitle,
      companyName,
      recipientName,
      recipientTitle,
      jobDescription,
      topSkills,
      topExperience,
      resumeId,
      tone
    } = req.body;

    let skills = Array.isArray(topSkills) ? [...topSkills] : [];
    let experience = topExperience || null;
    let name = candidateName;

    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
      if (resume) {
        if (!name && resume.personalInfo?.fullName) {
          name = resume.personalInfo.fullName;
        }
        if (skills.length === 0 && Array.isArray(resume.skills)) {
          skills = resume.skills.map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean);
        }
        if (!experience && Array.isArray(resume.experience) && resume.experience.length > 0) {
          experience = resume.experience[0];
        }
      }
    }

    const generated = generateCoverLetterContent({
      candidateName: name,
      jobTitle,
      companyName,
      recipientName,
      recipientTitle,
      jobDescription,
      topSkills: skills,
      topExperience: experience,
      tone: tone || 'professional'
    });

    return sendSuccess(res, 'Cover letter text generated successfully', generated, 200);
  } catch (error) {
    next(error);
  }
};

export const createNewCoverLetter = async (req, res, next) => {
  try {
    const coverLetter = await createCoverLetter(req.user._id, req.body);
    return sendSuccess(res, 'Cover letter created successfully', coverLetter, 201);
  } catch (error) {
    next(error);
  }
};

export const getCoverLetters = async (req, res, next) => {
  try {
    const coverLetters = await getCoverLettersByUser(req.user._id);
    return sendSuccess(res, 'Cover letters retrieved successfully', coverLetters, 200);
  } catch (error) {
    next(error);
  }
};

export const getSingleCoverLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const coverLetter = await getCoverLetterById(id, req.user._id);

    if (!coverLetter) {
      return sendError(res, 'Cover letter not found', 404);
    }

    return sendSuccess(res, 'Cover letter retrieved successfully', coverLetter, 200);
  } catch (error) {
    next(error);
  }
};

export const updateSingleCoverLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateCoverLetter(id, req.user._id, req.body);

    if (!updated) {
      return sendError(res, 'Cover letter not found or not authorized', 404);
    }

    return sendSuccess(res, 'Cover letter updated successfully', updated, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteSingleCoverLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteCoverLetter(id, req.user._id);

    if (!deleted) {
      return sendError(res, 'Cover letter not found or not authorized', 404);
    }

    return sendSuccess(res, 'Cover letter deleted successfully', { id: deleted._id }, 200);
  } catch (error) {
    next(error);
  }
};

export const downloadCoverLetterPdf = async (req, res, next) => {
  try {
    const { id } = req.params;
    const letter = await getCoverLetterById(id, req.user._id);

    if (!letter) {
      return sendError(res, 'Cover letter not found', 404);
    }

    const pdfBuffer = await generateCoverLetterPdf(letter);

    const safeTitle = (letter.title || 'CoverLetter').replace(/[^a-zA-Z0-9-_]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
