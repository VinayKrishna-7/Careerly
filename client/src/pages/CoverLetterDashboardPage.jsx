import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCoverLetters,
  createNewCoverLetter,
  deleteCoverLetter
} from '../store/slices/coverLetterSlice.js';
import { fetchResumes } from '../store/slices/resumeSlice.js';
import { coverLetterApi } from '../services/coverLetterApi.js';
import { showToast } from '../store/slices/uiSlice.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Textarea from '../components/ui/Textarea.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import Badge from '../components/ui/Badge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import {
  Plus,
  Mail,
  Edit3,
  Trash2,
  Download,
  Building,
  Sparkles,
  Search,
  FileText
} from 'lucide-react';
import { timeAgo } from '../utils/formatters.js';

export const CoverLetterDashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { coverLettersList, isLoadingList } = useSelector((state) => state.coverLetter);
  const { resumesList } = useSelector((state) => state.resume);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // New letter form states
  const [title, setTitle] = useState('Google Senior Frontend Engineer Cover Letter');
  const [companyName, setCompanyName] = useState('Google');
  const [jobTitle, setJobTitle] = useState('Senior Frontend Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchCoverLetters());
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    const action = await dispatch(
      createNewCoverLetter({
        title: title.trim(),
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
        resumeId: selectedResumeId || null
      })
    );
    setIsCreating(false);

    if (createNewCoverLetter.fulfilled.match(action)) {
      setIsCreateModalOpen(false);
      dispatch(showToast({ message: 'Cover letter generated & created!', type: 'success' }));
      navigate(`/cover-letters/editor/${action.payload._id}`);
    } else {
      dispatch(showToast({ message: action.payload || 'Failed to create cover letter', type: 'error' }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const action = await dispatch(deleteCoverLetter(deleteTarget._id));
    setIsDeleting(false);
    setDeleteTarget(null);

    if (deleteCoverLetter.fulfilled.match(action)) {
      dispatch(showToast({ message: 'Cover letter deleted', type: 'info' }));
    }
  };

  const handleDownloadPdf = async (letter, e) => {
    e?.stopPropagation();
    setDownloadingId(letter._id);
    try {
      await coverLetterApi.downloadPdf(letter._id, `${letter.title || 'CoverLetter'}.pdf`);
      dispatch(showToast({ message: 'Cover letter PDF downloaded!', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: 'Download failed: ' + err.message, type: 'error' }));
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredLetters = coverLettersList.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.title || '').toLowerCase().includes(q) ||
      (c.companyName || '').toLowerCase().includes(q) ||
      (c.jobTitle || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Mail className="h-7 w-7 text-brand-600 dark:text-brand-400" />
            <span>Targeted Cover Letters</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate and customize tailored cover letters optimized for specific job descriptions.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
          size="md"
          className="shadow-sm"
        >
          Create New Cover Letter
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by company, job title, or letter name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* Letters Grid */}
      {isLoadingList ? (
        <div className="py-20">
          <Spinner size="lg" message="Loading your cover letters..." />
        </div>
      ) : filteredLetters.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <Mail className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'No matching cover letters found' : 'No cover letters created yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate a tailored cover letter from your resume and target job description in seconds.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            size="sm"
            className="mt-2"
          >
            Create Your First Cover Letter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLetters.map((letter) => (
            <div
              key={letter._id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-floating transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="brand" size="xs">
                    {letter.template || 'Modern'}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    Updated {timeAgo(letter.updatedAt)}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug truncate">
                  {letter.title}
                </h3>

                <div className="mt-2 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {letter.companyName && (
                    <p className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                      <Building className="h-3.5 w-3.5 text-brand-600" />
                      <span>{letter.companyName}</span>
                    </p>
                  )}
                  {letter.jobTitle && <p>Position: {letter.jobTitle}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link to={`/cover-letters/editor/${letter._id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full text-xs" leftIcon={<Edit3 className="h-3.5 w-3.5" />}>
                    Edit Letter
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleDownloadPdf(letter, e)}
                  isLoading={downloadingId === letter._id}
                  title="Download PDF"
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(letter)}
                  className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COVER LETTER MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Job-Targeted Cover Letter"
        description="Auto-generate a tailored cover letter based on your resume and target job requirements"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Letter Title"
            required
            placeholder="e.g. Google Senior Software Engineer Letter"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Company Name"
              placeholder="e.g. Google, Stripe, Netflix"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              label="Target Job Position"
              placeholder="e.g. Senior Full Stack Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          {resumesList.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Link Existing Resume (Optional — auto-pulls contact info & top skills)
              </label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">None (Start from scratch)</option>
                {resumesList.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title} ({r.personalInfo?.fullName || 'Candidate'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Target Job Description (Optional for custom tailoring)</span>
            </label>
            <Textarea
              placeholder="Paste key qualifications or responsibilities from the job listing..."
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isCreating}>
              Generate & Open Editor
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Cover Letter?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete Letter"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default CoverLetterDashboardPage;
