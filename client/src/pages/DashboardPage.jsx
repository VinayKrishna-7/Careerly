import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResumes,
  createNewResume,
  deleteResume,
  duplicateResume,
  renameResume,
  fetchDashboardStats
} from '../store/slices/resumeSlice.js';
import { resumeApi } from '../services/resumeApi.js';
import { showToast } from '../store/slices/uiSlice.js';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Modal from '../components/ui/Modal.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import Badge from '../components/ui/Badge.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import AtsScoreModal from '../features/ats/AtsScoreModal.jsx';
import {
  Plus,
  Search,
  FileText,
  Copy,
  Trash2,
  Edit3,
  Download,
  Eye,
  Clock,
  Sparkles,
  Check,
  Target
} from 'lucide-react';
import { TEMPLATE_METADATA } from '../utils/constants.js';
import { timeAgo } from '../utils/formatters.js';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { resumesList, isLoadingList, stats } = useSelector((state) => state.resume);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateFilter, setSelectedTemplateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('Software Engineer Resume');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isCreating, setIsCreating] = useState(false);

  // Rename modal
  const [renameTarget, setRenameTarget] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ATS Modal Target
  const [atsTarget, setAtsTarget] = useState(null);

  // PDF downloading states
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    dispatch(fetchResumes({ search: searchQuery, template: selectedTemplateFilter, sortBy }));
    dispatch(fetchDashboardStats());
  }, [dispatch, searchQuery, selectedTemplateFilter, sortBy]);

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!newResumeTitle.trim()) return;

    setIsCreating(true);
    const action = await dispatch(
      createNewResume({
        title: newResumeTitle.trim(),
        template: selectedTemplate
      })
    );
    setIsCreating(false);

    if (createNewResume.fulfilled.match(action)) {
      setIsCreateModalOpen(false);
      dispatch(showToast({ message: 'Resume created successfully!', type: 'success' }));
      navigate(`/editor/${action.payload._id}`);
    } else {
      dispatch(showToast({ message: action.payload || 'Failed to create resume', type: 'error' }));
    }
  };

  const handleDuplicate = async (id, e) => {
    e?.stopPropagation();
    const action = await dispatch(duplicateResume(id));
    if (duplicateResume.fulfilled.match(action)) {
      dispatch(showToast({ message: 'Resume duplicated!', type: 'success' }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const action = await dispatch(deleteResume(deleteTarget._id));
    setIsDeleting(false);
    setDeleteTarget(null);

    if (deleteResume.fulfilled.match(action)) {
      dispatch(showToast({ message: 'Resume deleted', type: 'info' }));
      dispatch(fetchDashboardStats());
    }
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!renameTarget || !newTitle.trim()) return;

    const action = await dispatch(renameResume({ id: renameTarget._id, title: newTitle.trim() }));
    if (renameResume.fulfilled.match(action)) {
      dispatch(showToast({ message: 'Resume renamed', type: 'success' }));
      setRenameTarget(null);
    }
  };

  const handleDownloadPdf = async (resume, e) => {
    e?.stopPropagation();
    setDownloadingId(resume._id);
    try {
      await resumeApi.downloadPdf(resume._id, `${resume.title || 'Resume'}.pdf`);
      dispatch(showToast({ message: 'PDF downloaded successfully!', type: 'success' }));
    } catch (err) {
      dispatch(showToast({ message: 'Failed to generate PDF: ' + err.message, type: 'error' }));
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome & Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Welcome, {user?.name?.split(' ')[0] || 'Professional'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your resumes, customize styles, and export high-resolution PDFs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            size="md"
            className="shadow-sm"
          >
            Create New Resume
          </Button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Resumes</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{resumesList.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Available Templates</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{TEMPLATE_METADATA.length}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-card flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Last Modified</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {stats.lastUpdated ? timeAgo(stats.lastUpdated) : 'Just now'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search resumes by title or job position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Template Filter */}
          <select
            value={selectedTemplateFilter}
            onChange={(e) => setSelectedTemplateFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">All Templates</option>
            {TEMPLATE_METADATA.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="updatedAt">Recently Modified</option>
            <option value="createdAt">Date Created</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Resume Cards Grid */}
      {isLoadingList ? (
        <div className="py-20">
          <Spinner size="lg" message="Loading your resumes..." />
        </div>
      ) : resumesList.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <FileText className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery ? 'No matching resumes found' : 'No resumes created yet'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? 'Try adjusting your search keywords or clear filters.'
                : 'Start by choosing a professional template and filling in your details.'}
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="h-4 w-4" />}
            size="sm"
            className="mt-2"
          >
            Create Your First Resume
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumesList.map((resume) => {
            const templateInfo =
              TEMPLATE_METADATA.find((t) => t.id === resume.template) || TEMPLATE_METADATA[0];

            return (
              <div
                key={resume._id}
                className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card hover:shadow-floating transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Visual Header / Mini Preview Accent Banner */}
                <div
                  className="h-28 p-4 relative overflow-hidden flex flex-col justify-between"
                  style={{
                    backgroundColor: resume.settings?.primaryColor || templateInfo.previewColor,
                    opacity: 0.92
                  }}
                >
                  <div className="flex items-center justify-between text-white">
                    <Badge size="xs" className="bg-white/20 text-white border-white/30 backdrop-blur">
                      {templateInfo.name}
                    </Badge>
                    <span className="text-[11px] text-white/90 font-medium">
                      Updated {timeAgo(resume.updatedAt)}
                    </span>
                  </div>

                  <div className="text-white">
                    <p className="text-xs font-semibold text-white/80 truncate">
                      {resume.personalInfo?.jobTitle || 'Senior Software Engineer'}
                    </p>
                    <p className="text-[11px] text-white/70 truncate">
                      {resume.personalInfo?.fullName || 'Alex Morgan'}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                        {resume.title}
                      </h3>
                      <button
                        onClick={() => {
                          setRenameTarget(resume);
                          setNewTitle(resume.title);
                        }}
                        title="Rename"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                      <span>{resume.experience?.length || 0} Experiences</span> &bull;{' '}
                      <span>{resume.skills?.length || 0} Skills</span> &bull;{' '}
                      <span>{resume.projects?.length || 0} Projects</span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                    <Link to={`/editor/${resume._id}`} className="w-full">
                      <Button variant="primary" size="sm" className="w-full text-xs" leftIcon={<Edit3 className="h-3.5 w-3.5" />}>
                        Edit
                      </Button>
                    </Link>
                    <Link to={`/preview/${resume._id}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<Eye className="h-3.5 w-3.5" />}>
                        Preview
                      </Button>
                    </Link>
                  </div>

                  {/* Secondary Quick Action Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <button
                      onClick={() => setAtsTarget(resume)}
                      className="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
                      title="Analyze ATS match score"
                    >
                      <Target className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                      <span>ATS Score</span>
                    </button>

                    <button
                      onClick={(e) => handleDownloadPdf(resume, e)}
                      disabled={downloadingId === resume._id}
                      className="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{downloadingId === resume._id ? 'Exporting...' : 'PDF'}</span>
                    </button>

                    <button
                      onClick={(e) => handleDuplicate(resume._id, e)}
                      className="inline-flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      <span>Clone</span>
                    </button>

                    <button
                      onClick={() => setDeleteTarget(resume)}
                      className="inline-flex items-center gap-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE RESUME MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Resume"
        description="Choose a title and a starter layout template"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateResume} className="space-y-6">
          <Input
            label="Resume Title"
            required
            placeholder="e.g. Senior Frontend Engineer — Google 2026"
            value={newResumeTitle}
            onChange={(e) => setNewResumeTitle(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Select Starting Template
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {TEMPLATE_METADATA.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`cursor-pointer rounded-xl p-3.5 border transition-all flex flex-col justify-between ${
                    selectedTemplate === tmpl.id
                      ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 dark:border-brand-500 ring-2 ring-brand-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{tmpl.name}</span>
                    {selectedTemplate === tmpl.id && (
                      <div className="h-5 w-5 rounded-full bg-brand-600 text-white flex items-center justify-center">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{tmpl.description}</p>
                </div>
              ))}
            </div>
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
              Create & Open Editor
            </Button>
          </div>
        </form>
      </Modal>

      {/* RENAME MODAL */}
      <Modal
        isOpen={Boolean(renameTarget)}
        onClose={() => setRenameTarget(null)}
        title="Rename Resume"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <Input
            label="Resume Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setRenameTarget(null)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Title
            </Button>
          </div>
        </form>
      </Modal>

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Resume?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All filled sections will be permanently removed.`}
        confirmText="Yes, Delete Resume"
        isLoading={isDeleting}
      />

      {/* ATS SCORE MODAL */}
      {atsTarget && (
        <AtsScoreModal
          isOpen={Boolean(atsTarget)}
          onClose={() => setAtsTarget(null)}
          resumeId={atsTarget._id}
          resumeTitle={atsTarget.title}
        />
      )}
    </div>
  );
};

export default DashboardPage;
