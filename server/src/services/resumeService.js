import Resume from '../models/Resume.js';
import { getDefaultResumeData } from '../utils/defaultResumeData.js';

export const getUserResumes = async (userId, query = {}) => {
  const { search, template, sortBy = 'updatedAt', sortOrder = 'desc', page = 1, limit = 50 } = query;

  const filter = { userId };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { 'personalInfo.fullName': { $regex: search, $options: 'i' } },
      { 'personalInfo.jobTitle': { $regex: search, $options: 'i' } }
    ];
  }

  if (template && template !== 'all') {
    filter.template = template;
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const skip = (Number(page) - 1) * Number(limit);

  const [resumes, total] = await Promise.all([
    Resume.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit)),
    Resume.countDocuments(filter)
  ]);

  return {
    resumes,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    }
  };
};

export const createResume = async (userId, initialData = {}, user = null) => {
  const title = initialData.title || 'My Professional Resume';
  const template = initialData.template || 'modern';

  const defaultData = getDefaultResumeData(title, template, user);

  const resume = await Resume.create({
    ...defaultData,
    ...initialData,
    userId
  });

  return resume;
};

export const getResumeById = async (id, userId) => {
  const resume = await Resume.findOne({ _id: id, userId });
  if (!resume) {
    const error = new Error('Resume not found or you do not have permission to view it');
    error.statusCode = 404;
    throw error;
  }
  return resume;
};

export const updateResume = async (id, userId, updateData) => {
  // Prevent changing userId or _id
  delete updateData.userId;
  delete updateData._id;

  const resume = await Resume.findOneAndUpdate(
    { _id: id, userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!resume) {
    const error = new Error('Resume not found or you do not have permission to update it');
    error.statusCode = 404;
    throw error;
  }

  return resume;
};

export const deleteResume = async (id, userId) => {
  const resume = await Resume.findOneAndDelete({ _id: id, userId });
  if (!resume) {
    const error = new Error('Resume not found or you do not have permission to delete it');
    error.statusCode = 404;
    throw error;
  }
  return { id };
};

export const duplicateResume = async (id, userId) => {
  const original = await Resume.findOne({ _id: id, userId }).lean();
  if (!original) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  delete original._id;
  delete original.createdAt;
  delete original.updatedAt;
  delete original.publicSlug;

  original.title = `${original.title} (Copy)`;
  original.userId = userId;

  const duplicate = await Resume.create(original);
  return duplicate;
};

export const renameResume = async (id, userId, title) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: id, userId },
    { $set: { title } },
    { new: true }
  );

  if (!resume) {
    const error = new Error('Resume not found');
    error.statusCode = 404;
    throw error;
  }

  return resume;
};

export const getUserResumeStats = async (userId) => {
  const resumes = await Resume.find({ userId }).select('template updatedAt createdAt');
  const total = resumes.length;

  const templateCounts = resumes.reduce((acc, curr) => {
    acc[curr.template] = (acc[curr.template] || 0) + 1;
    return acc;
  }, {});

  const lastUpdated = resumes.length > 0
    ? resumes.reduce((latest, curr) => (new Date(curr.updatedAt) > new Date(latest.updatedAt) ? curr : latest)).updatedAt
    : null;

  return {
    totalResumes: total,
    templateDistribution: templateCounts,
    lastUpdated
  };
};
