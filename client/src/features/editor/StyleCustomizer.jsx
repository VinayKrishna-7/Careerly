import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveResumeSettings } from '../../store/slices/resumeSlice.js';
import { showToast } from '../../store/slices/uiSlice.js';
import {
  COLOR_PALETTES,
  FONT_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  NAME_FONT_SIZES,
  ROLE_FONT_SIZES,
  CONTACT_FONT_SIZES,
  LINKS_FONT_SIZES,
  SECTION_TITLE_FONT_SIZES,
  BODY_FONT_SIZES,
  getDefaultSettings
} from '../../utils/constants.js';
import {
  Palette,
  Type,
  Check,
  ShieldCheck,
  Heading,
  AlignLeft,
  User,
  Briefcase,
  Mail,
  Link as LinkIcon,
  Plus,
  Minus,
  RotateCcw,
  Sparkles
} from 'lucide-react';

const NumericFontSizePicker = ({
  icon: Icon,
  label,
  description,
  value,
  defaultValue = 12,
  presets,
  min = 8,
  max = 48,
  step = 0.5,
  onChange
}) => {
  const currentVal = value !== undefined && value !== null ? Number(value) : defaultValue;
  const isDefault = currentVal === defaultValue;

  const handleStep = (direction) => {
    const next = direction > 0 ? currentVal + step : currentVal - step;
    const clamped = Math.max(min, Math.min(max, Math.round(next * 10) / 10));
    onChange(clamped);
  };

  return (
    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          {Icon && <Icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
          <span>{label}</span>
        </label>
        <div className="flex items-center gap-1">
          {!isDefault && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className="px-1.5 py-0.5 mr-1 text-[10px] font-semibold rounded text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 bg-slate-100 hover:bg-brand-50 dark:bg-slate-800 dark:hover:bg-brand-950/40 flex items-center gap-0.5 transition-colors"
              title={`Reset to default (${defaultValue}px)`}
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={currentVal <= min}
            className="h-6 w-6 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-all"
            title="Decrease size (-)"
          >
            <Minus className="h-3 w-3" />
          </button>
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={currentVal}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val) && val > 0) {
                onChange(val);
              }
            }}
            className="w-12 text-center font-bold text-xs text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={currentVal >= max}
            className="h-6 w-6 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 flex items-center justify-center transition-all"
            title="Increase size (+)"
          >
            <Plus className="h-3 w-3" />
          </button>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 ml-0.5">px</span>
        </div>
      </div>
      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      <div className="flex flex-wrap gap-1 pt-0.5">
        {presets.map((size) => {
          const isSelected = currentVal === size;
          const isPresetDefault = size === defaultValue;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onChange(size)}
              className={`py-1 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                isSelected
                  ? 'border-brand-600 dark:border-brand-500 bg-brand-600 text-white shadow-sm font-bold'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {size}
              {isPresetDefault && !isSelected && (
                <span className="text-[9px] opacity-60 ml-0.5">•</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const BoldnessPicker = ({ label, value, defaultValue = '400', onChange }) => {
  const currentVal = String(value || defaultValue);

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{label}</span>
      <div className="flex items-center gap-1">
        {FONT_WEIGHT_OPTIONS.map((opt) => {
          const isSelected = currentVal === opt.value || currentVal === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-2 py-0.5 rounded text-[10.5px] border transition-all ${
                isSelected
                  ? 'border-brand-600 dark:border-brand-500 bg-brand-600 text-white font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {opt.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const StyleCustomizer = () => {
  const dispatch = useDispatch();
  const activeResume = useSelector((state) => state.resume.activeResume);
  const settings = activeResume?.settings || {};
  const activeTemplate = activeResume?.template || 'modern';

  const handleUpdate = (updates) => {
    dispatch(setActiveResumeSettings(updates));
  };

  const templateDefaults = getDefaultSettings(activeTemplate);

  const handleResetAllDefaults = () => {
    handleUpdate(templateDefaults);
    dispatch(
      showToast({
        message: `Restored perfect styling defaults for ${activeTemplate.toUpperCase()} template!`,
        type: 'success'
      })
    );
  };

  const handleResetColors = () => {
    handleUpdate({
      primaryColor: templateDefaults.primaryColor,
      secondaryColor: templateDefaults.secondaryColor,
      sectionTitleColor: templateDefaults.sectionTitleColor,
      textColor: templateDefaults.textColor
    });
    dispatch(showToast({ message: 'Restored default theme colors', type: 'info' }));
  };

  const handleResetSectionTitles = () => {
    handleUpdate({
      sectionTitleColor: templateDefaults.sectionTitleColor,
      sectionTitleFontWeight: templateDefaults.sectionTitleFontWeight,
      sectionTitleFontSize: templateDefaults.sectionTitleFontSize
    });
    dispatch(showToast({ message: 'Restored default section title styles', type: 'info' }));
  };

  const handleResetBodyAndDetails = () => {
    handleUpdate({
      textColor: templateDefaults.textColor,
      bodyFontWeight: templateDefaults.bodyFontWeight,
      roleFontWeight: templateDefaults.roleFontWeight,
      contactFontWeight: templateDefaults.contactFontWeight,
      linksFontWeight: templateDefaults.linksFontWeight,
      bodyFontSize: templateDefaults.bodyFontSize
    });
    dispatch(showToast({ message: 'Restored default body & detail styles', type: 'info' }));
  };

  const handleResetPersonalSizing = () => {
    handleUpdate({
      nameFontSize: templateDefaults.nameFontSize,
      roleFontSize: templateDefaults.roleFontSize,
      contactFontSize: templateDefaults.contactFontSize,
      linksFontSize: templateDefaults.linksFontSize
    });
    dispatch(showToast({ message: 'Restored default personal info sizes', type: 'info' }));
  };

  const sectionTitleColor = settings.sectionTitleColor || settings.primaryColor || templateDefaults.sectionTitleColor;
  const bodyTextColor = settings.textColor || templateDefaults.textColor;

  return (
    <div className="space-y-5">
      {/* HEADER WITH ATS BADGE & MASTER RESTORE DEFAULTS */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Design & Typography Customization</h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            ATS-Optimized
          </span>
        </div>

        {/* RESTORE PERFECT DEFAULTS CALLOUT BANNER */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-brand-50/80 to-blue-50/80 dark:from-brand-950/40 dark:to-blue-950/40 border border-brand-200/80 dark:border-brand-800/60 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-900 dark:text-brand-200">
              <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              <span>Restore Optimal Defaults</span>
            </div>
            <p className="text-[11px] text-brand-700/80 dark:text-brand-300/80">
              Instantly reset all colors, weights, and font sizes to perfect 1-page defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAllDefaults}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98]"
            title="Reset all settings to recommended defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* COLOR THEME PALETTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Professional Accent Colors</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetColors}
              className="text-[10.5px] font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 flex items-center gap-0.5 transition-colors"
              title="Reset theme colors to default"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Custom:</span>
            <input
              type="color"
              value={settings.primaryColor || templateDefaults.primaryColor}
              onChange={(e) => handleUpdate({ primaryColor: e.target.value })}
              className="h-6 w-8 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = settings.primaryColor?.toLowerCase() === palette.primary.toLowerCase();

            return (
              <button
                key={palette.name}
                type="button"
                onClick={() =>
                  handleUpdate({
                    primaryColor: palette.primary,
                    secondaryColor: palette.secondary
                  })
                }
                className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-brand-600 dark:border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 ring-1 ring-brand-500/20 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="relative">
                  <span
                    className="h-5 w-5 rounded-full inline-block shrink-0 shadow-subtle"
                    style={{ backgroundColor: palette.primary }}
                  />
                  {isSelected && (
                    <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />
                  )}
                </div>
                <span className="text-[11px] text-slate-700 dark:text-slate-300 truncate">{palette.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION TITLES: COLOR & BOLDNESS & FONT SIZE */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Heading className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Section Titles (All Headings Group)</span>
          </h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetSectionTitles}
              className="text-[10.5px] font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 flex items-center gap-0.5 transition-colors"
              title="Reset section titles styling to default"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Color:</span>
            <input
              type="color"
              value={sectionTitleColor}
              onChange={(e) => handleUpdate({ sectionTitleColor: e.target.value })}
              className="h-6 w-8 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5"
            />
          </div>
        </div>

        {/* Section Title Boldness */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
          <BoldnessPicker
            label="Section Titles Boldness"
            value={settings.sectionTitleFontWeight}
            defaultValue={templateDefaults.sectionTitleFontWeight}
            onChange={(val) => handleUpdate({ sectionTitleFontWeight: val })}
          />
        </div>

        {/* Section Titles Font Size with +/- */}
        <NumericFontSizePicker
          icon={Heading}
          label="Section Titles Font Size"
          description="Uniformly scales all 9 section titles across your resume."
          value={settings.sectionTitleFontSize}
          defaultValue={templateDefaults.sectionTitleFontSize}
          presets={SECTION_TITLE_FONT_SIZES}
          min={10}
          max={24}
          onChange={(size) => handleUpdate({ sectionTitleFontSize: size })}
        />
      </div>

      {/* BODY, ROLE, LINKS & DETAILS: COLOR & BOLDNESS */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <AlignLeft className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
            <span>Body, Role, Links & Contact Details</span>
          </h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetBodyAndDetails}
              className="text-[10.5px] font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 flex items-center gap-0.5 transition-colors"
              title="Reset body and details styling to default"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              <span>Reset</span>
            </button>
            <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700" />
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Color:</span>
            <input
              type="color"
              value={bodyTextColor}
              onChange={(e) => handleUpdate({ textColor: e.target.value })}
              className="h-6 w-8 cursor-pointer rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5"
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          This color is shared across body descriptions, role, links, and contact information.
        </p>

        {/* Boldness controls group */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 divide-y divide-slate-200/60 dark:divide-slate-800/60">
          <BoldnessPicker
            label="Body & Description Boldness"
            value={settings.bodyFontWeight}
            defaultValue={templateDefaults.bodyFontWeight}
            onChange={(val) => handleUpdate({ bodyFontWeight: val })}
          />
          <BoldnessPicker
            label="Professional Role Boldness"
            value={settings.roleFontWeight}
            defaultValue={templateDefaults.roleFontWeight}
            onChange={(val) => handleUpdate({ roleFontWeight: val })}
          />
          <BoldnessPicker
            label="Contact Info Boldness (Location, Email, Phone)"
            value={settings.contactFontWeight}
            defaultValue={templateDefaults.contactFontWeight}
            onChange={(val) => handleUpdate({ contactFontWeight: val })}
          />
          <BoldnessPicker
            label="All Links Boldness (Profiles & Projects)"
            value={settings.linksFontWeight}
            defaultValue={templateDefaults.linksFontWeight}
            onChange={(val) => handleUpdate({ linksFontWeight: val })}
          />
        </div>

        {/* Body Font Size with +/- */}
        <NumericFontSizePicker
          icon={AlignLeft}
          label="Body & Description Font Size"
          description="All summaries, descriptions, bullet points, skills, and details."
          value={settings.bodyFontSize}
          defaultValue={templateDefaults.bodyFontSize}
          presets={BODY_FONT_SIZES}
          min={8.5}
          max={18}
          onChange={(size) => handleUpdate({ bodyFontSize: size })}
        />
      </div>

      {/* PERSONAL INFO FONT SIZES WITH +/- */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between pb-1">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Personal Information Font Sizes
          </h4>
          <button
            type="button"
            onClick={handleResetPersonalSizing}
            className="text-[10.5px] font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 flex items-center gap-0.5 transition-colors"
            title="Reset personal information font sizes to default"
          >
            <RotateCcw className="h-2.5 w-2.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* 1. Name font size */}
        <NumericFontSizePicker
          icon={User}
          label="Candidate Full Name Font Size"
          description="Size of your main name heading."
          value={settings.nameFontSize}
          defaultValue={templateDefaults.nameFontSize}
          presets={NAME_FONT_SIZES}
          min={16}
          max={42}
          onChange={(size) => handleUpdate({ nameFontSize: size })}
        />

        {/* 2. Role font size */}
        <NumericFontSizePicker
          icon={Briefcase}
          label="Professional Role / Job Title Font Size"
          description="Size of your headline target role."
          value={settings.roleFontSize}
          defaultValue={templateDefaults.roleFontSize}
          presets={ROLE_FONT_SIZES}
          min={10}
          max={24}
          onChange={(size) => handleUpdate({ roleFontSize: size })}
        />

        {/* 3. Location, Email, Phone contact font size set */}
        <NumericFontSizePicker
          icon={Mail}
          label="Contact Details Font Size (Location, Email, Phone)"
          description="Controls font size for Location, Email address, and Phone number."
          value={settings.contactFontSize}
          defaultValue={templateDefaults.contactFontSize}
          presets={CONTACT_FONT_SIZES}
          min={8.5}
          max={16}
          onChange={(size) => handleUpdate({ contactFontSize: size })}
        />
      </div>

      {/* ALL LINKS IN ENTIRE RESUME */}
      <div className="space-y-1 pt-1">
        <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Links Font Size
        </h4>

        <NumericFontSizePicker
          icon={LinkIcon}
          label="All Resume Links Font Size"
          description="Uniformly controls font size for LinkedIn, GitHub, Portfolio, and Project URLs."
          value={settings.linksFontSize}
          defaultValue={templateDefaults.linksFontSize}
          presets={LINKS_FONT_SIZES}
          min={8.5}
          max={16}
          onChange={(size) => handleUpdate({ linksFontSize: size })}
        />
      </div>

      {/* FONT FAMILY */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Type className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
          <span>ATS-Friendly Font Family</span>
        </label>
        <div className="space-y-2">
          {FONT_OPTIONS.map((font) => {
            const currentFont = settings.fontFamily || templateDefaults.fontFamily || 'Times New Roman';
            const isSelected = currentFont === font.id;

            return (
              <button
                key={font.id}
                type="button"
                onClick={() => handleUpdate({ fontFamily: font.id })}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-brand-600 dark:border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-900 dark:text-brand-300 font-bold shadow-xs ring-1 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
                style={{ fontFamily: font.family }}
              >
                <span className="text-xs">{font.name}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* PAGE MARGINS */}
      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200">Page Margins</label>
        <select
          value={settings.pageMargin || templateDefaults.pageMargin}
          onChange={(e) => handleUpdate({ pageMargin: e.target.value })}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="compact">Tight Margins (Fit Maximum Content)</option>
          <option value="normal">Standard Margins (Balanced Corporate)</option>
          <option value="wide">Wide Margins (Clean Executive)</option>
        </select>
      </div>
    </div>
  );
};

export default StyleCustomizer;
