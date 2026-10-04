import React from 'react';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';
import { FONT_OPTIONS } from '../utils/constants.js';

export const CoverLetterRenderer = ({ letter }) => {
  if (!letter) {
    return (
      <div className="a4-page shadow-floating flex items-center justify-center text-slate-400">
        No cover letter data to display.
      </div>
    );
  }

  const {
    senderInfo = {},
    recipientName = 'Hiring Manager',
    recipientTitle = '',
    companyName = '',
    companyAddress = '',
    letterDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    salutation = 'Dear Hiring Manager,',
    openingParagraph = '',
    bodyParagraphs = [],
    closingParagraph = '',
    signoff = 'Sincerely,',
    template = 'modern',
    settings = {}
  } = letter;

  const primaryColor = settings.primaryColor || '#2563eb';
  const secondaryColor = settings.secondaryColor || '#475569';
  const textColor = settings.textColor || '#1e293b';

  const fontConfig = FONT_OPTIONS.find((f) => f.id === settings.fontFamily) || FONT_OPTIONS[0];

  const fontSizes = {
    small: 'text-[12px] leading-relaxed',
    medium: 'text-[13px] leading-relaxed',
    large: 'text-[14px] leading-relaxed'
  };

  const pageMargins = {
    compact: 'p-8 sm:p-10',
    normal: 'p-10 sm:p-14',
    wide: 'p-12 sm:p-16'
  };

  const marginClass = pageMargins[settings.pageMargin] || pageMargins.normal;
  const fontClass = fontSizes[settings.fontSize] || fontSizes.medium;

  return (
    <div
      className={`a4-page shadow-floating transition-all bg-white text-slate-800 ${marginClass}`}
      style={{
        fontFamily: fontConfig.family,
        color: textColor
      }}
    >
      {/* HEADER BLOCK */}
      <div
        className={`mb-6 pb-4 ${
          template === 'modern'
            ? 'border-l-4 pl-4'
            : template === 'professional'
            ? 'border-b-2'
            : 'border-b border-slate-200'
        }`}
        style={{ borderColor: primaryColor }}
      >
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: primaryColor }}>
          {senderInfo.fullName || 'Your Name'}
        </h1>

        {senderInfo.location && (
          <p className="text-xs sm:text-sm font-medium mt-0.5" style={{ color: secondaryColor }}>
            {senderInfo.location}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
          {senderInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {senderInfo.email}
            </span>
          )}
          {senderInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {senderInfo.phone}
            </span>
          )}
          {senderInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-3 w-3" />
              {senderInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </span>
          )}
          {senderInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {senderInfo.website.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </div>

      {/* DATE & RECIPIENT BLOCK */}
      <div className="mb-6 text-xs space-y-3">
        <div className="font-semibold text-slate-600">{letterDate}</div>
        <div className="space-y-0.5 text-slate-700">
          {recipientName && <div className="font-bold text-slate-900">{recipientName}</div>}
          {recipientTitle && <div>{recipientTitle}</div>}
          {companyName && <div className="font-semibold text-slate-800">{companyName}</div>}
          {companyAddress && <div className="text-slate-500">{companyAddress}</div>}
        </div>
      </div>

      {/* SALUTATION */}
      <div className="mb-4 text-xs font-bold text-slate-900">{salutation}</div>

      {/* LETTER BODY */}
      <div className={`space-y-4 ${fontClass}`}>
        {openingParagraph && (
          <p className="text-justify text-slate-700 leading-relaxed">
            {openingParagraph}
          </p>
        )}

        {Array.isArray(bodyParagraphs) &&
          bodyParagraphs.map((para, index) => (
            <p key={index} className="text-justify text-slate-700 leading-relaxed">
              {para}
            </p>
          ))}

        {closingParagraph && (
          <p className="text-justify text-slate-700 leading-relaxed">
            {closingParagraph}
          </p>
        )}
      </div>

      {/* SIGN OFF */}
      <div className="mt-8 pt-2 space-y-6">
        <div className="text-xs text-slate-700">{signoff}</div>
        <div>
          <div className="font-bold text-sm" style={{ color: primaryColor }}>
            {senderInfo.fullName || 'Your Name'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterRenderer;
