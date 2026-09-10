import * as resumeService from '../services/resumeService.js';
import { calculateAtsScore } from '../services/atsScoreService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getAllResumes = async (req, res, next) => {
  try {
    const result = await resumeService.getUserResumes(req.user._id, req.query);
    return sendSuccess(res, 'Resumes fetched successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

export const createResume = async (req, res, next) => {
  try {
    const resume = await resumeService.createResume(req.user._id, req.body, req.user);
    return sendSuccess(res, 'Resume created successfully', { resume }, 201);
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id, req.user._id);
    return sendSuccess(res, 'Resume fetched successfully', { resume }, 200);
  } catch (error) {
    next(error);
  }
};

export const updateResume = async (req, res, next) => {
  try {
    const resume = await resumeService.updateResume(req.params.id, req.user._id, req.body);
    return sendSuccess(res, 'Resume updated successfully', { resume }, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const result = await resumeService.deleteResume(req.params.id, req.user._id);
    return sendSuccess(res, 'Resume deleted successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

export const duplicateResume = async (req, res, next) => {
  try {
    const duplicate = await resumeService.duplicateResume(req.params.id, req.user._id);
    return sendSuccess(res, 'Resume duplicated successfully', { resume: duplicate }, 201);
  } catch (error) {
    next(error);
  }
};

export const renameResume = async (req, res, next) => {
  try {
    const { title } = req.body;
    const resume = await resumeService.renameResume(req.params.id, req.user._id, title);
    return sendSuccess(res, 'Resume renamed successfully', { resume }, 200);
  } catch (error) {
    next(error);
  }
};

export const getResumeScore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { jobDescription, resumeData } = req.body;
    let resume = resumeData;
    if (!resume || !resume.personalInfo) {
      resume = await resumeService.getResumeById(id, req.user._id);
    }
    const scoreData = calculateAtsScore(resume, jobDescription);
    return sendSuccess(res, 'ATS score calculated successfully', scoreData, 200);
  } catch (error) {
    next(error);
  }
};
