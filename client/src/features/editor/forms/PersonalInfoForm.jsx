import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveResumeField, setActiveResumeSettings } from '../../../store/slices/resumeSlice.js';
import Input from '../../../components/ui/Input.jsx';
import { User, Mail, Phone, MapPin, Globe, Linkedin, Github, Sparkles, Link2, ExternalLink } from 'lucide-react';

export const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const activeResume = useSelector((state) => state.resume.activeResume) || {};
  const personalInfo = activeResume.personalInfo || {};
  const settings = activeResume.settings || {};
  const contactLinkStyle = settings.contactLinkStyle || 'name'; // 'name' | 'url'

  const handleChange = (field, value) => {
    dispatch(updateActiveResumeField({ path: `personalInfo.${field}`, value }));
  };

  const handleLinkStyleChange = (style) => {
    dispatch(setActiveResumeSettings({ contactLinkStyle: style }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Information</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Your core contact details shown at the top of your resume</p>
        </div>
      </div>

      {/* Profile Links Display Format Switcher */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Profile & Website Links Display Format in Resume</span>
          </label>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Choose whether LinkedIn, GitHub, and Portfolio URLs in the header display by name or clean web address.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => handleLinkStyleChange('name')}
            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
              contactLinkStyle === 'name'
                ? 'border-brand-600 dark:border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>By Link Name (e.g. Portfolio, LinkedIn, GitHub)</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </button>
          <button
            type="button"
            onClick={() => handleLinkStyleChange('url')}
            className={`p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
              contactLinkStyle === 'url'
                ? 'border-brand-600 dark:border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-200 font-bold'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <span>By URL (e.g. linkedin.com/in/alexmorgan, github.com/alexmorgan)</span>
            <ExternalLink className="h-3 w-3 opacity-60" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          required
          placeholder="e.g. Alex Morgan"
          value={personalInfo.fullName || ''}
          onChange={(e) => handleChange('fullName', e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
        />

        <Input
          label="Professional Job Title"
          placeholder="e.g. Senior Full Stack Engineer"
          value={personalInfo.jobTitle || ''}
          onChange={(e) => handleChange('jobTitle', e.target.value)}
          leftIcon={<Sparkles className="h-4 w-4 text-brand-500" />}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. alex.morgan@example.com"
          value={personalInfo.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <Input
          label="Phone Number"
          placeholder="e.g. +1 (555) 234-5678"
          value={personalInfo.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          leftIcon={<Phone className="h-4 w-4" />}
        />

        <Input
          label="Location (City, State / Country)"
          placeholder="e.g. San Francisco, CA"
          value={personalInfo.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          leftIcon={<MapPin className="h-4 w-4" />}
        />

        <Input
          label="Portfolio / Personal Website"
          placeholder="e.g. https://alexmorgan.dev"
          value={personalInfo.website || ''}
          onChange={(e) => handleChange('website', e.target.value)}
          leftIcon={<Globe className="h-4 w-4" />}
        />

        <Input
          label="LinkedIn Profile URL"
          placeholder="e.g. https://linkedin.com/in/alexmorgan"
          value={personalInfo.linkedin || ''}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          leftIcon={<Linkedin className="h-4 w-4" />}
        />

        <Input
          label="GitHub Profile URL"
          placeholder="e.g. https://github.com/alexmorgan"
          value={personalInfo.github || ''}
          onChange={(e) => handleChange('github', e.target.value)}
          leftIcon={<Github className="h-4 w-4" />}
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
