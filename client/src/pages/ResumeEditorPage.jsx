import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchResumeById,
  saveResume,
  setActiveSection,
  clearActiveResume
} from '../store/slices/resumeSlice.js';
import { setActiveEditorTab } from '../store/slices/uiSlice.js';
import EditorHeader from '../features/editor/EditorHeader.jsx';
import LivePreviewPane from '../features/editor/LivePreviewPane.jsx';
import TemplateSelector from '../features/editor/TemplateSelector.jsx';
import StyleCustomizer from '../features/editor/StyleCustomizer.jsx';
import SectionReorderManager from '../features/editor/SectionReorderManager.jsx';

// Section Forms
import PersonalInfoForm from '../features/editor/forms/PersonalInfoForm.jsx';
import SummaryForm from '../features/editor/forms/SummaryForm.jsx';
import ExperienceForm from '../features/editor/forms/ExperienceForm.jsx';
import EducationForm from '../features/editor/forms/EducationForm.jsx';
import SkillsForm from '../features/editor/forms/SkillsForm.jsx';
import ProjectsForm from '../features/editor/forms/ProjectsForm.jsx';
import CertificationsForm from '../features/editor/forms/CertificationsForm.jsx';
import LanguagesForm from '../features/editor/forms/LanguagesForm.jsx';
import AchievementsForm from '../features/editor/forms/AchievementsForm.jsx';
import InterestsForm from '../features/editor/forms/InterestsForm.jsx';
import CustomSectionForm from '../features/editor/forms/CustomSectionForm.jsx';

import Spinner from '../components/ui/Spinner.jsx';
import {
  FileText,
  Palette,
  Layout,
  Sliders,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Languages,
  Trophy,
  Heart,
  Eye,
  Edit3,
  Sparkles,
  Plus
} from 'lucide-react';

const SECTIONS = [
  { id: 'personalInfo', label: 'Personal Info', icon: <User className="h-3.5 w-3.5" /> },
  { id: 'summary', label: 'Summary', icon: <FileText className="h-3.5 w-3.5" /> },
  { id: 'experience', label: 'Experience', icon: <Briefcase className="h-3.5 w-3.5" /> },
  { id: 'education', label: 'Education', icon: <GraduationCap className="h-3.5 w-3.5" /> },
  { id: 'skills', label: 'Skills', icon: <Wrench className="h-3.5 w-3.5" /> },
  { id: 'projects', label: 'Projects', icon: <FolderGit2 className="h-3.5 w-3.5" /> },
  { id: 'certifications', label: 'Certificates', icon: <Award className="h-3.5 w-3.5" /> },
  { id: 'languages', label: 'Languages', icon: <Languages className="h-3.5 w-3.5" /> },
  { id: 'achievements', label: 'Achievements', icon: <Trophy className="h-3.5 w-3.5" /> },
  { id: 'interests', label: 'Interests', icon: <Heart className="h-3.5 w-3.5" /> }
];

export const ResumeEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeResume, isLoadingActive, isDirty, activeSection } = useSelector(
    (state) => state.resume
  );
  const { activeEditorTab } = useSelector((state) => state.ui);

  // Mobile toggle for Form vs Preview
  const [mobileTab, setMobileTab] = useState('editor'); // 'editor' | 'preview'

  const debounceTimerRef = useRef(null);

  // Load Resume on mount
  useEffect(() => {
    if (id && (!activeResume || activeResume._id !== id)) {
      dispatch(fetchResumeById(id));
    }
  }, [id, activeResume?._id, dispatch]);

  // Debounced Autosave engine
  useEffect(() => {
    if (!activeResume || !isDirty) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      dispatch(saveResume({ id: activeResume._id, data: activeResume }));
    }, 1500);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [activeResume, isDirty, dispatch]);

  if (isLoadingActive || !activeResume) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Spinner size="lg" message="Loading resume editor..." />
      </div>
    );
  }

  const customSections = activeResume?.customSections || [];

  const dynamicSections = [
    ...SECTIONS,
    ...customSections.map((cs) => ({
      id: cs.id,
      label: activeResume?.sectionTitles?.[cs.id] || cs.title || 'Custom Section',
      icon: <Sparkles className="h-3.5 w-3.5 text-brand-500" />,
      isCustom: true
    }))
  ];

  const renderSectionForm = () => {
    if (activeSection?.startsWith('custom_') || customSections.some((s) => s.id === activeSection)) {
      return <CustomSectionForm sectionId={activeSection} />;
    }

    switch (activeSection) {
      case 'summary':
        return <SummaryForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'certifications':
        return <CertificationsForm />;
      case 'languages':
        return <LanguagesForm />;
      case 'achievements':
        return <AchievementsForm />;
      case 'interests':
        return <InterestsForm />;
      case 'personalInfo':
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors">
      {/* Editor Top Navigation & Action Controls */}
      <EditorHeader />

      {/* Mobile Toggle Bar (Editor / Live Preview) */}
      <div className="flex md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
            mobileTab === 'editor'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 bg-brand-50/30 dark:bg-brand-950/40'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" /> Editor
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview'
              ? 'text-brand-600 dark:text-brand-400 border-b-2 border-brand-600 bg-brand-50/30 dark:bg-brand-950/40'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Eye className="h-3.5 w-3.5" /> Live Preview
        </button>
      </div>

      {/* Split-Screen Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Navigation Tabs & Forms */}
        <div
          className={`w-full md:w-1/2 lg:w-5/12 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full ${
            mobileTab === 'preview' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Main Top Mode Tabs: Content, Templates, Styling, Sections */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-2 gap-1.5 shrink-0">
            {[
              { id: 'content', label: 'Content', icon: <FileText className="h-3.5 w-3.5" /> },
              { id: 'templates', label: 'Templates', icon: <Layout className="h-3.5 w-3.5" /> },
              { id: 'styling', label: 'Styling', icon: <Palette className="h-3.5 w-3.5" /> },
              { id: 'sections', label: 'Sections', icon: <Sliders className="h-3.5 w-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => dispatch(setActiveEditorTab(tab.id))}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeEditorTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow-subtle border border-slate-200/80 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Sub-navigation for Sections (Only visible on 'content' tab) */}
          {activeEditorTab === 'content' && (
            <div className="border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
              {dynamicSections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => dispatch(setActiveSection(sec.id))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-subtle'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {sec.icon}
                    <span>{sec.label}</span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => dispatch(setActiveEditorTab('sections'))}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-dashed border-brand-300 dark:border-brand-700 whitespace-nowrap transition-all shrink-0 ml-1"
                title="Add and organize sections"
              >
                <Plus className="h-3 w-3" />
                <span>+ Section</span>
              </button>
            </div>
          )}

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 text-slate-900 dark:text-slate-100">
            {activeEditorTab === 'content' && renderSectionForm()}
            {activeEditorTab === 'templates' && <TemplateSelector />}
            {activeEditorTab === 'styling' && <StyleCustomizer />}
            {activeEditorTab === 'sections' && <SectionReorderManager />}
          </div>
        </div>

        {/* Right Side: Live A4 Preview Pane */}
        <div
          className={`w-full md:w-1/2 lg:w-7/12 h-full ${
            mobileTab === 'editor' ? 'hidden md:block' : 'block'
          }`}
        >
          <LivePreviewPane />
        </div>
      </div>
    </div>
  );
};

export default ResumeEditorPage;
